import { mkdirSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { join } from 'node:path';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

const extensions: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
};

/** Saves up to eight listing pictures on disk. */
export const imageUpload = FilesInterceptor('images', 8, {
  storage: diskStorage({
    destination: (_request, _file, callback) => {
      const directory = process.env.UPLOAD_DIR || join(process.cwd(), 'uploads');
      mkdirSync(directory, { recursive: true });
      callback(null, directory);
    },
    filename: (_request, file, callback) => {
      callback(null, `${randomUUID()}${extensions[file.mimetype] ?? '.bin'}`);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});
