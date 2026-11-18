import { PrismaClient, ReviewStatus, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { copyFile, mkdir, rm } from 'node:fs/promises';
import { join } from 'node:path';

const prisma = new PrismaClient();

const users = [
  { email: 'admin@bazaar.dev', password: 'bazaar-admin', name: 'Админ', role: Role.ADMIN },
  { email: 'seller@bazaar.dev', password: 'bazaar-seller', name: 'Продавец', role: Role.SELLER },
  { email: 'client@bazaar.dev', password: 'bazaar-client', name: 'Клиент', role: Role.CLIENT },
] as const;

const tags = ['Одежда', 'Электроника', 'Дом'] as const;

type TagName = (typeof tags)[number];

/** Demo listings owned by the seller account. */
const products: readonly {
  id: string;
  name: string;
  description: string;
  price: number;
  tags: readonly TagName[];
}[] = [
  {
    id: 'seed-linen-shirt',
    name: 'Льняная рубашка',
    description: 'Свободный крой из плотного льна, пуговицы из перламутра.',
    price: 3490,
    tags: ['Одежда'],
  },
  {
    id: 'seed-wool-sweater',
    name: 'Шерстяной свитер',
    description: 'Тёплый свитер с круглым воротом, шерсть мериноса.',
    price: 5900,
    tags: ['Одежда'],
  },
  {
    id: 'seed-cotton-trousers',
    name: 'Хлопковые брюки',
    description: 'Прямые брюки из плотного хлопка, пояс на пуговице.',
    price: 4200,
    tags: ['Одежда'],
  },
  {
    id: 'seed-leather-belt',
    name: 'Кожаный ремень',
    description: 'Ремень из гладкой кожи, пряжка матового металла.',
    price: 1890,
    tags: ['Одежда'],
  },
  {
    id: 'seed-striped-dress',
    name: 'Платье в полоску',
    description: 'Летнее платье до колена, хлопок, тонкие полоски.',
    price: 6700,
    tags: ['Одежда'],
  },
  {
    id: 'seed-everyday-sneakers',
    name: 'Кеды на каждый день',
    description: 'Холщовый верх, резиновая подошва, шнуровка.',
    price: 5400,
    tags: ['Одежда'],
  },
  {
    id: 'seed-cashmere-scarf',
    name: 'Кашемировый шарф',
    description: 'Длинный шарф, мягкий кашемир, без бахромы.',
    price: 3200,
    tags: ['Одежда'],
  },
  {
    id: 'seed-wireless-headphones',
    name: 'Беспроводные наушники',
    description: 'Накладные наушники, до 30 часов без подзарядки, складные.',
    price: 7990,
    tags: ['Электроника'],
  },
  {
    id: 'seed-usb-lamp',
    name: 'Лампа с USB-зарядкой',
    description: 'Настольная лампа с тёплым светом и разъёмом USB.',
    price: 2490,
    tags: ['Электроника', 'Дом'],
  },
  {
    id: 'seed-portable-speaker',
    name: 'Портативная колонка',
    description: 'Компактная колонка с защитой от брызг, играет до 12 часов.',
    price: 4590,
    tags: ['Электроника'],
  },
  {
    id: 'seed-charger-65w',
    name: 'Зарядка на 65 Вт',
    description: 'Сетевое зарядное устройство с кабелем USB-C.',
    price: 1990,
    tags: ['Электроника'],
  },
  {
    id: 'seed-mechanical-keyboard',
    name: 'Механическая клавиатура',
    description: 'Компактная раскладка и переключатели с кликом.',
    price: 8900,
    tags: ['Электроника'],
  },
  {
    id: 'seed-webcam',
    name: 'Веб-камера Full HD',
    description: 'Камера 1080p с крышкой на объектив.',
    price: 3690,
    tags: ['Электроника'],
  },
  {
    id: 'seed-power-bank',
    name: 'Внешний аккумулятор',
    description: 'Ёмкость 10 000 мА·ч, два порта USB.',
    price: 2790,
    tags: ['Электроника'],
  },
  {
    id: 'seed-ceramic-mug',
    name: 'Керамическая кружка',
    description: 'Объём 350 мл, глазурь, можно мыть в посудомойке.',
    price: 890,
    tags: ['Дом'],
  },
  {
    id: 'seed-bedding-set',
    name: 'Постельное бельё',
    description: 'Хлопковый комплект: простыня, пододеяльник и две наволочки.',
    price: 6400,
    tags: ['Дом'],
  },
  {
    id: 'seed-towel-set',
    name: 'Набор полотенец',
    description: 'Два банных и два лицевых полотенца из хлопка.',
    price: 2100,
    tags: ['Дом'],
  },
  {
    id: 'seed-glass-vase',
    name: 'Стеклянная ваза',
    description: 'Прозрачное стекло, высота 22 см.',
    price: 1750,
    tags: ['Дом'],
  },
  {
    id: 'seed-wool-blanket',
    name: 'Шерстяной плед',
    description: 'Плед 140×200 см из шерсти, без декора.',
    price: 4800,
    tags: ['Дом'],
  },
  {
    id: 'seed-cutting-board',
    name: 'Разделочная доска',
    description: 'Доска из дуба с желобком для сока.',
    price: 1290,
    tags: ['Дом'],
  },
];

/** Creates the demo accounts, tags, and listings. Listing text that already exists stays. Seed photos are replaced. */
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

  const seller = await prisma.user.findUniqueOrThrow({ where: { email: 'seller@bazaar.dev' } });
  const savedTags = await prisma.tag.findMany({ where: { name: { in: [...tags] } } });
  const tagIdByName = new Map(savedTags.map((tag) => [tag.name, tag.id]));
  const directory = process.env.UPLOAD_DIR || join(process.cwd(), 'uploads');
  const photoDirectory = join(process.cwd(), 'prisma', 'seed-photos');

  await mkdir(directory, { recursive: true });

  for (const [index, product] of products.entries()) {
    const photos = await copySeedPhotos(photoDirectory, directory, product.id);

    await prisma.product.upsert({
      where: { id: product.id },
      update: {},
      create: {
        id: product.id,
        sellerId: seller.id,
        name: product.name,
        description: product.description,
        price: product.price,
        stock: 5,
        status: ReviewStatus.APPROVED,
        createdAt: new Date(Date.UTC(2026, 10, 16, 12, 0, products.length - index)),
        tags: { create: product.tags.map((name) => ({ tagId: requiredTagId(tagIdByName, name) })) },
      },
    });

    await prisma.productImage.deleteMany({ where: { productId: product.id } });
    await prisma.productImage.createMany({
      data: photos.map((filename, sort) => ({
        productId: product.id,
        url: `/uploads/${filename}`,
        sort,
      })),
    });
  }
}

async function copySeedPhotos(
  sourceDirectory: string,
  uploadDirectory: string,
  productId: string,
): Promise<readonly string[]> {
  const filenames = [1, 2, 3].map((index) => `${productId}-${index}.jpg`);

  for (const filename of filenames) {
    await copyFile(join(sourceDirectory, filename), join(uploadDirectory, filename));
  }

  await rm(join(uploadDirectory, `${productId}.svg`), { force: true });

  return filenames;
}

function requiredTagId(tagIdByName: ReadonlyMap<string, string>, name: string): string {
  const id = tagIdByName.get(name);

  if (!id) throw new Error(`Missing tag ${name}`);

  return id;
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
