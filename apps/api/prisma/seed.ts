import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const users = [
  { email: 'admin@bazaar.dev', password: 'bazaar-admin', name: 'Админ', role: Role.ADMIN },
  { email: 'seller@bazaar.dev', password: 'bazaar-seller', name: 'Продавец', role: Role.SELLER },
  { email: 'client@bazaar.dev', password: 'bazaar-client', name: 'Клиент', role: Role.CLIENT },
] as const;

const tags = ['Одежда', 'Электроника', 'Дом'];

/** Creates the demo accounts and tags. Existing rows are left as they are. */
async function main(): Promise<void> {
  for (const user of users) {
    const passwordHash = await bcrypt.hash(user.password, 10);

    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        email: user.email,
        passwordHash,
        name: user.name,
        role: user.role,
      },
    });
  }

  for (const name of tags) {
    await prisma.tag.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error: unknown) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
