import { Inject, Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Role } from '@prisma/client';
import { Queue, Worker, type Job } from 'bullmq';
import nodemailer from 'nodemailer';
import { PrismaService } from '../prisma/prisma.service';

/** Listing facts a pending letter can carry. */
export type PendingSignal = {
  /** Listing id. */
  readonly productId: string;

  /** Title shown in the letter. */
  readonly name: string;

  /** Account id of the seller. */
  readonly sellerId: string;
};

type PendingJob = {
  readonly productId: string;
  readonly adminId: string;
  readonly name: string;
  readonly sellerId: string;
};

const queueName = 'pending-mail';

/** Letters that tell each admin a listing is newly pending. */
@Injectable()
export class PendingMail implements OnModuleInit, OnModuleDestroy {
  private queue: Queue<PendingJob> | null = null;

  private worker: Worker<PendingJob> | null = null;

  /** Reads admin accounts when a listing becomes pending. */
  public constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  /** Starts the mail queue when Redis is configured. */
  public async onModuleInit(): Promise<void> {
    const redisUrl = process.env.REDIS_URL;

    if (!redisUrl) return;

    const producerConnection = {
      url: redisUrl,
      maxRetriesPerRequest: 1,
      enableOfflineQueue: false,
      retryStrategy: () => null,
    };

    const workerConnection = { url: redisUrl, maxRetriesPerRequest: null };

    this.queue = new Queue<PendingJob>(queueName, { connection: producerConnection });
    this.worker = new Worker<PendingJob>(queueName, (job) => this.send(job), { connection: workerConnection });

    this.queue.on('error', ignoreBrokerError);
    this.worker.on('error', ignoreBrokerError);
  }

  /** Closes the mail queue when the application stops. */
  public async onModuleDestroy(): Promise<void> {
    await this.worker?.close();
    await this.queue?.close();
  }

  /** Asks each admin, by email, to review one listing. A mail failure stays off the saved product. */
  public async publish(signal: PendingSignal): Promise<void> {
    try {
      await this.enqueue(signal);
    } catch {
      // The listing is already saved.
    }
  }

  private async enqueue(signal: PendingSignal): Promise<void> {
    const queue = this.queue;

    if (!queue) return;

    const admins = await this.prisma.user.findMany({
      where: { role: Role.ADMIN },
      select: { id: true },
    });

    for (const admin of admins) {
      try {
        await place(queue, signal, admin.id);
      } catch {
        // One letter can fail without dropping the others or the saved listing.
      }
    }
  }

  private async send(job: Job<PendingJob>): Promise<void> {
    const admin = await this.prisma.user.findUnique({
      where: { id: job.data.adminId },
      select: { email: true },
    });

    if (!admin) return;

    const smtpUrl = process.env.SMTP_URL;

    if (!smtpUrl) throw new Error('SMTP_URL is not set');

    const transport = nodemailer.createTransport(smtpUrl);

    await transport.sendMail({
      from: 'Bazaar <bazaar@localhost>',
      to: admin.email,
      subject: 'Товар на модерации',
      text: `${job.data.productId}\n${job.data.name}\n${job.data.sellerId}`,
    });
  }
}

async function place(queue: Queue<PendingJob>, signal: PendingSignal, adminId: string): Promise<void> {
  const jobId = `pending:${signal.productId}:${adminId}`;
  const existing = await queue.getJob(jobId);

  if (existing) {
    const state = await existing.getState();

    if (state === 'waiting' || state === 'active' || state === 'delayed') return;

    if (state === 'failed') await existing.remove();
  }

  await queue.add(
    queueName,
    {
      productId: signal.productId,
      adminId,
      name: signal.name,
      sellerId: signal.sellerId,
    },
    {
      jobId,
      attempts: 8,
      backoff: { type: 'exponential', delay: 5000 },
      removeOnComplete: true,
      removeOnFail: false,
    },
  );
}

function ignoreBrokerError(_error: Error): void {}
