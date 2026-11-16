import { INestApplication } from '@nestjs/common';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { execSync } from 'node:child_process';
import { join } from 'node:path';
import { Client } from 'pg';
import request, { type Agent } from 'supertest';
import { createApp } from '../src/create-app';

const repoRoot = join(__dirname, '../../..');
const apiRoot = join(__dirname, '..');
const password = 'bazaar-pass';
const png = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
  'base64',
);

/** Integration coverage for auth, catalog, checkout, and admin edits. */
describe('marketplace', () => {
  let app: INestApplication;
  let prisma: PrismaClient;

  beforeAll(async () => {
    execSync('docker compose up -d --wait', { cwd: repoRoot, stdio: 'inherit' });
    await ensureTestDatabase();
    execSync('pnpm exec prisma db push --skip-generate --accept-data-loss', {
      cwd: apiRoot,
      env: { ...process.env, DATABASE_URL: process.env.DATABASE_URL },
      stdio: 'inherit',
    });

    app = await createApp({ silent: true });
    await app.init();
    prisma = new PrismaClient();
  });

  afterAll(async () => {
    await app.close();
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    await prisma.$executeRawUnsafe(
      'TRUNCATE TABLE "Order", "ProductTag", "ProductImage", "Product", "Tag", "User" RESTART IDENTITY CASCADE',
    );
  });

  it('registers a client, keeps the session, and clears it on logout', async () => {
    const guest = request.agent(app.getHttpServer());

    const created = await guest.post('/api/auth/register').send({
      email: 'New@Bazaar.dev',
      password,
      name: 'Новый',
      role: 'CLIENT',
    });

    expect(created.status).toBe(201);
    expect(created.body.user).toMatchObject({ email: 'new@bazaar.dev', name: 'Новый', role: 'CLIENT' });

    const session = await guest.get('/api/auth/session');
    expect(session.status).toBe(200);
    expect(session.body.user.email).toBe('new@bazaar.dev');

    await guest.post('/api/auth/logout').expect(200);

    const after = await guest.get('/api/auth/session');
    expect(after.body.user).toBeNull();
  });

  it('refuses a self-serve admin and a wrong password', async () => {
    await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({ email: 'hack@bazaar.dev', password, name: 'Хакер', role: 'ADMIN' })
      .expect(400);

    await insertUser('client@bazaar.dev', Role.CLIENT);
    await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: 'client@bazaar.dev', password: 'wrong-pass' })
      .expect(401);
  });

  it('lets a seller publish a listing and keeps everyone else from deleting it', async () => {
    const seller = await loginAs('seller@bazaar.dev', Role.SELLER, 'Продавец');
    const other = await loginAs('other@bazaar.dev', Role.SELLER, 'Другой');
    const client = await loginAs('client@bazaar.dev', Role.CLIENT, 'Клиент');
    const tag = await prisma.tag.create({ data: { name: 'Дом' } });

    const created = await seller
      .post('/api/products')
      .field('name', 'Льняная сумка')
      .field('description', 'На каждый день')
      .field('price', '2400')
      .field('tagIds', tag.id)
      .attach('images', png, 'bag.png');

    expect(created.status).toBe(201);
    expect(created.body.product).toMatchObject({
      name: 'Льняная сумка',
      price: 2400,
      sellerName: 'Продавец',
      tags: [{ id: tag.id, name: 'Дом' }],
    });
    expect(created.body.product.images[0]).toMatch(/^\/uploads\//);

    const listed = await request(app.getHttpServer()).get('/api/products').expect(200);
    expect(listed.body.products).toHaveLength(1);

    const productId = created.body.product.id as string;
    await other.delete(`/api/products/${productId}`).expect(403);
    await client.post('/api/products').field('name', 'Чужой').field('description', 'Нет').field('price', '10').expect(403);
    await seller.delete(`/api/products/${productId}`).expect(204);

    const after = await request(app.getHttpServer()).get('/api/products').expect(200);
    expect(after.body.products).toHaveLength(0);
  });

  it('stores a paid order at the listing price after delivery details', async () => {
    const seller = await loginAs('seller@bazaar.dev', Role.SELLER);
    const client = await loginAs('client@bazaar.dev', Role.CLIENT);
    const productId = await publish(seller, 2400);

    await client
      .post('/api/orders')
      .send({ productId, recipientName: 'Мария', phone: '123', address: 'дом' })
      .expect(400);

    const bought = await client.post('/api/orders').send({
      productId,
      recipientName: 'Мария Иванова',
      phone: '+79990001122',
      address: 'Казань, Баумана, 1',
    });

    expect(bought.status).toBe(201);
    expect(bought.body.order).toMatchObject({
      productId,
      price: 2400,
      productName: 'Льняная сумка',
      recipientName: 'Мария Иванова',
      address: 'Казань, Баумана, 1',
    });

    const stored = await prisma.order.findUniqueOrThrow({ where: { id: bought.body.order.id as string } });
    expect(stored.price).toBe(2400);
    expect(stored.status).toBe('PAID');

    await request(app.getHttpServer())
      .post('/api/orders')
      .send({
        productId,
        recipientName: 'Мария Иванова',
        phone: '+79990001122',
        address: 'Казань, Баумана, 1',
      })
      .expect(401);
  });

  it('gives an admin full edit of users and tags, and protects the last admin', async () => {
    const admin = await loginAs('admin@bazaar.dev', Role.ADMIN, 'Админ');
    const client = await loginAs('client@bazaar.dev', Role.CLIENT);

    await client.get('/api/users').expect(403);

    const created = await admin.post('/api/users').send({
      email: 'extra@bazaar.dev',
      password,
      name: 'Лишний',
      role: 'CLIENT',
    });

    expect(created.status).toBe(201);
    const userId = created.body.user.id as string;

    const updated = await admin.patch(`/api/users/${userId}`).send({ name: 'Нужный', role: 'SELLER' }).expect(200);
    expect(updated.body.user).toMatchObject({ name: 'Нужный', role: 'SELLER' });

    const session = await admin.get('/api/auth/session').expect(200);
    await admin.delete(`/api/users/${session.body.user.id as string}`).expect(400);
    await admin.patch(`/api/users/${session.body.user.id as string}`).send({ role: 'CLIENT' }).expect(400);
    await admin.delete(`/api/users/${userId}`).expect(204);

    const tag = await admin.post('/api/tags').send({ name: 'Книги' }).expect(201);
    const tagId = tag.body.tag.id as string;
    const renamed = await admin.patch(`/api/tags/${tagId}`).send({ name: 'Бумага' }).expect(200);
    expect(renamed.body.tag.name).toBe('Бумага');

    await admin.post('/api/tags').send({ name: 'Бумага' }).expect(409);
    await admin.delete(`/api/tags/${tagId}`).expect(204);

    const tags = await request(app.getHttpServer()).get('/api/tags').expect(200);
    expect(tags.body.tags).toEqual([]);
  });

  async function loginAs(email: string, role: Role, name = email): Promise<Agent> {
    await insertUser(email, role, name);
    const agent = request.agent(app.getHttpServer());
    await agent.post('/api/auth/login').send({ email, password }).expect(200);
    return agent;
  }

  async function insertUser(email: string, role: Role, name = email): Promise<void> {
    await prisma.user.create({
      data: {
        email,
        name,
        role,
        passwordHash: await bcrypt.hash(password, 10),
      },
    });
  }

  async function publish(seller: Agent, price: number): Promise<string> {
    const created = await seller
      .post('/api/products')
      .field('name', 'Льняная сумка')
      .field('description', 'На каждый день')
      .field('price', String(price))
      .attach('images', png, 'bag.png')
      .expect(201);

    return created.body.product.id as string;
  }
});

async function ensureTestDatabase(): Promise<void> {
  const client = new Client({
    host: 'localhost',
    port: 54329,
    user: 'bazaar',
    password: 'bazaar',
    database: 'bazaar',
  });

  await client.connect();
  const found = await client.query('SELECT 1 FROM pg_database WHERE datname = $1', ['bazaar_test']);

  if (found.rowCount === 0) await client.query('CREATE DATABASE bazaar_test');

  await client.end();
}
