import 'reflect-metadata';
import { createApp } from './create-app';

/** Starts the shop API. */
async function main(): Promise<void> {
  const app = await createApp();
  const port = Number(process.env.PORT ?? 3001);
  await app.listen(port);
}

void main();
