import { PrismaClient, ReviewStatus, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { mkdir, writeFile } from 'node:fs/promises';
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
  color: string;
}[] = [
  {
    id: 'seed-linen-shirt',
    name: 'Льняная рубашка',
    description: 'Свободный крой из плотного льна, пуговицы из перламутра.',
    price: 3490,
    tags: ['Одежда'],
    color: '#e7d7c1',
  },
  {
    id: 'seed-wool-sweater',
    name: 'Шерстяной свитер',
    description: 'Тёплый свитер с круглым воротом, шерсть мериноса.',
    price: 5900,
    tags: ['Одежда'],
    color: '#cbb9a6',
  },
  {
    id: 'seed-cotton-trousers',
    name: 'Хлопковые брюки',
    description: 'Прямые брюки из плотного хлопка, пояс на пуговице.',
    price: 4200,
    tags: ['Одежда'],
    color: '#d5ddd4',
  },
  {
    id: 'seed-leather-belt',
    name: 'Кожаный ремень',
    description: 'Ремень из гладкой кожи, пряжка матового металла.',
    price: 1890,
    tags: ['Одежда'],
    color: '#c4a484',
  },
  {
    id: 'seed-striped-dress',
    name: 'Платье в полоску',
    description: 'Летнее платье до колена, хлопок, тонкие полоски.',
    price: 6700,
    tags: ['Одежда'],
    color: '#f2d6d3',
  },
  {
    id: 'seed-everyday-sneakers',
    name: 'Кеды на каждый день',
    description: 'Холщовый верх, резиновая подошва, шнуровка.',
    price: 5400,
    tags: ['Одежда'],
    color: '#d9dde3',
  },
  {
    id: 'seed-cashmere-scarf',
    name: 'Кашемировый шарф',
    description: 'Длинный шарф, мягкий кашемир, без бахромы.',
    price: 3200,
    tags: ['Одежда'],
    color: '#e4d5c7',
  },
  {
    id: 'seed-wireless-headphones',
    name: 'Беспроводные наушники',
    description: 'Накладные наушники, до 30 часов без подзарядки, складные.',
    price: 7990,
    tags: ['Электроника'],
    color: '#d7e3ea',
  },
  {
    id: 'seed-usb-lamp',
    name: 'Лампа с USB-зарядкой',
    description: 'Настольная лампа с тёплым светом и разъёмом USB.',
    price: 2490,
    tags: ['Электроника', 'Дом'],
    color: '#f3e6c4',
  },
  {
    id: 'seed-portable-speaker',
    name: 'Портативная колонка',
    description: 'Компактная колонка с защитой от брызг, играет до 12 часов.',
    price: 4590,
    tags: ['Электроника'],
    color: '#d5e2d8',
  },
  {
    id: 'seed-charger-65w',
    name: 'Зарядка на 65 Вт',
    description: 'Сетевое зарядное устройство с кабелем USB-C.',
    price: 1990,
    tags: ['Электроника'],
    color: '#e6e2f2',
  },
  {
    id: 'seed-mechanical-keyboard',
    name: 'Механическая клавиатура',
    description: 'Компактная раскладка и переключатели с кликом.',
    price: 8900,
    tags: ['Электроника'],
    color: '#e8e4df',
  },
  {
    id: 'seed-webcam',
    name: 'Веб-камера Full HD',
    description: 'Камера 1080p с крышкой на объектив.',
    price: 3690,
    tags: ['Электроника'],
    color: '#d9e4ef',
  },
  {
    id: 'seed-power-bank',
    name: 'Внешний аккумулятор',
    description: 'Ёмкость 10 000 мА·ч, два порта USB.',
    price: 2790,
    tags: ['Электроника'],
    color: '#efe3d4',
  },
  {
    id: 'seed-ceramic-mug',
    name: 'Керамическая кружка',
    description: 'Объём 350 мл, глазурь, можно мыть в посудомойке.',
    price: 890,
    tags: ['Дом'],
    color: '#f0d9c8',
  },
  {
    id: 'seed-bedding-set',
    name: 'Постельное бельё',
    description: 'Хлопковый комплект: простыня, пододеяльник и две наволочки.',
    price: 6400,
    tags: ['Дом'],
    color: '#e7eef2',
  },
  {
    id: 'seed-towel-set',
    name: 'Набор полотенец',
    description: 'Два банных и два лицевых полотенца из хлопка.',
    price: 2100,
    tags: ['Дом'],
    color: '#f6efe6',
  },
  {
    id: 'seed-glass-vase',
    name: 'Стеклянная ваза',
    description: 'Прозрачное стекло, высота 22 см.',
    price: 1750,
    tags: ['Дом'],
    color: '#dce8e4',
  },
  {
    id: 'seed-wool-blanket',
    name: 'Шерстяной плед',
    description: 'Плед 140×200 см из шерсти, без декора.',
    price: 4800,
    tags: ['Дом'],
    color: '#e5d8cc',
  },
  {
    id: 'seed-cutting-board',
    name: 'Разделочная доска',
    description: 'Доска из дуба с желобком для сока.',
    price: 1290,
    tags: ['Дом'],
    color: '#eadcc8',
  },
];

/** Creates the demo accounts, tags, and listings. Existing rows are left as they are. */
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

  await mkdir(directory, { recursive: true });

  for (const [index, product] of products.entries()) {
    const filename = `${product.id}.svg`;

    await writeFile(join(directory, filename), coverSvg(product.color));
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
        images: { create: [{ url: `/uploads/${filename}`, sort: 0 }] },
        tags: { create: product.tags.map((name) => ({ tagId: requiredTagId(tagIdByName, name) })) },
      },
    });
  }
}

function coverSvg(color: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800"><rect width="800" height="800" fill="#f4efe8"/><rect x="96" y="96" width="608" height="608" rx="28" fill="${color}"/></svg>`;
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
