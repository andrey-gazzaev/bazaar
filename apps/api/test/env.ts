import 'reflect-metadata';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

process.env.DATABASE_URL = 'postgresql://bazaar:bazaar@localhost:54329/bazaar_test?schema=public';
process.env.JWT_SECRET = 'test-only-secret';
process.env.UPLOAD_DIR = join(tmpdir(), 'bazaar-test-uploads');
