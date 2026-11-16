'use client';

import { useRouter } from 'next/navigation';
import { useSessionContext } from '@/context';
import type { NewProduct } from '@/models';
import { useCreateProduct, useTags } from '@/queries';
import { Page, Panel } from '@/ui';
import { ProductFields } from './product-fields';

/** Seller form that publishes a listing. */
export function ProductForm() {
  const session = useSessionContext();
  const tags = useTags();
  const createProduct = useCreateProduct();
  const router = useRouter();

  async function onSubmit(input: NewProduct) {
    const product = await createProduct.mutateAsync(input);
    router.push(`/products/${product.id}`);
  }

  if (session.isLoading) return <Page><p className="muted">Загрузка…</p></Page>;

  if (session.user?.role !== 'SELLER') {
    return (
      <Page>
        <Panel>
          <h1>Новый товар</h1>
          <p className="muted">Добавлять товары может продавец.</p>
        </Panel>
      </Page>
    );
  }

  return (
    <Page>
      <Panel>
        <h1>Новый товар</h1>

        <ProductFields tags={tags.data ?? []} pending={createProduct.isPending} onSubmit={onSubmit} />
      </Panel>
    </Page>
  );
}
