'use client';

import { memo, useState, type FormEvent } from 'react';
import type { NewProduct, Tag } from '@/models';
import { Button, TextArea, TextField } from '@/ui';
import styles from './listing-fields.module.css';

/** Fields for a listing: name, description, price, stock, tags, and pictures. */
const ListingFieldsComponent = function({
  tags,
  pending,
  requireImages,
  submitLabel,
  initial,
  onSubmit,
}: {
  /** Tags the seller can attach. Empty when the shop has none. */
  readonly tags: readonly Tag[];

  /** True while the save is in flight. */
  readonly pending: boolean;

  /** True when a picture is required. An edit can keep the current pictures. */
  readonly requireImages: boolean;

  /** Label of the submit control. */
  readonly submitLabel: string;

  /** Values already stored. Absent when the form starts empty. */
  readonly initial?: {
    readonly name: string;
    readonly description: string;
    readonly price: number;
    readonly stock: number;
    readonly tagIds: readonly string[];
  };

  /** Stores the listing. */
  readonly onSubmit: (input: NewProduct) => Promise<void>;
}) {
  const [name, setName] = useState(initial?.name ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [price, setPrice] = useState(initial ? String(initial.price) : '');
  const [stock, setStock] = useState(initial ? String(initial.stock) : '');
  const [tagIds, setTagIds] = useState<readonly string[]>(initial?.tagIds ?? []);
  const [images, setImages] = useState<readonly File[]>([]);
  const [error, setError] = useState<string | null>(null);

  function toggleTag(id: string) {
    setTagIds((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    const nextName = name.trim();
    const nextDescription = description.trim();
    const nextPrice = Number(price);
    const nextStock = Number(stock.trim());
    const priceOk = Number.isInteger(nextPrice) && nextPrice >= 1;
    const stockOk = stock.trim() !== '' && Number.isInteger(nextStock) && nextStock >= 0;

    if (nextName.length < 2 || !nextDescription || !priceOk || !stockOk) {
      setError('Название, описание, целая цена больше нуля и количество от нуля');
      return;
    }

    if (requireImages && images.length === 0) {
      setError('Добавьте хотя бы одну картинку');
      return;
    }

    setError(null);

    try {
      await onSubmit({
        name: nextName,
        description: nextDescription,
        price: nextPrice,
        stock: nextStock,
        tagIds,
        images,
      });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Не удалось сохранить товар');
    }
  }

  return (
    <form className={styles.form} onSubmit={(event) => void submit(event)}>
      <label>
        <span className="sr">Название</span>
        <TextField value={name} onChange={(event) => setName(event.target.value)} placeholder="Название" name="name" />
      </label>

      <label>
        <span className="sr">Описание</span>
        <TextArea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Описание"
          name="description"
        />
      </label>

      <label>
        <span className="sr">Цена в рублях</span>
        <TextField
          value={price}
          onChange={(event) => setPrice(event.target.value)}
          placeholder="Цена, ₽"
          name="price"
          inputMode="numeric"
        />
      </label>

      <label>
        <span className="sr">Количество</span>
        <TextField
          value={stock}
          onChange={(event) => setStock(event.target.value)}
          placeholder="Количество"
          name="stock"
          inputMode="numeric"
        />
      </label>

      {tags.length > 0 ? (
        <div className={styles.tags}>
          {tags.map((tag) => (
            <label key={tag.id}>
              <input type="checkbox" checked={tagIds.includes(tag.id)} onChange={() => toggleTag(tag.id)} /> {tag.name}
            </label>
          ))}
        </div>
      ) : null}

      <label className={styles.file}>
        Картинки
        <input
          type="file"
          name="images"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={(event) => setImages([...(event.target.files ?? [])])}
        />
      </label>

      <Button type="submit" disabled={pending}>
        {pending ? 'Сохраняем…' : submitLabel}
      </Button>

      {error ? <p className="status">{error}</p> : null}
    </form>
  );
}

ListingFieldsComponent.displayName = 'ListingFields';
export const ListingFields = memo(ListingFieldsComponent);
