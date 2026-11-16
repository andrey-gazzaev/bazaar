'use client';

import { useState, type FormEvent } from 'react';
import type { NewProduct, Tag } from '@/models';
import { Button, TextArea, TextField } from '@/ui';
import styles from './product-fields.module.css';

const empty = {
  name: '',
  description: '',
  price: '',
  tagIds: [] as string[],
  images: [] as File[],
};

/** Fields for a new listing: name, description, price, tags, and pictures. */
export function ProductFields({
  tags,
  pending,
  onSubmit,
}: {
  readonly tags: readonly Tag[];
  readonly pending: boolean;
  readonly onSubmit: (input: NewProduct) => Promise<void>;
}) {
  const [name, setName] = useState(empty.name);
  const [description, setDescription] = useState(empty.description);
  const [price, setPrice] = useState(empty.price);
  const [tagIds, setTagIds] = useState<readonly string[]>(empty.tagIds);
  const [images, setImages] = useState<readonly File[]>(empty.images);
  const [error, setError] = useState<string | null>(null);

  function toggleTag(id: string) {
    setTagIds((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    const nextName = name.trim();
    const nextDescription = description.trim();
    const nextPrice = Number(price);

    if (nextName.length < 2 || !nextDescription || !Number.isInteger(nextPrice) || nextPrice < 1) {
      setError('Название, описание и целая цена больше нуля');
      return;
    }

    if (images.length === 0) {
      setError('Добавьте хотя бы одну картинку');
      return;
    }

    setError(null);

    try {
      await onSubmit({
        name: nextName,
        description: nextDescription,
        price: nextPrice,
        tagIds,
        images,
      });
      setName('');
      setDescription('');
      setPrice('');
      setTagIds([]);
      setImages([]);
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

      {tags.length > 0 ? (
        <div className={styles.tags}>
          {tags.map((tag) => (
            <label key={tag.id}>
              <input
                type="checkbox"
                checked={tagIds.includes(tag.id)}
                onChange={() => toggleTag(tag.id)}
              />{' '}
              {tag.name}
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
        {pending ? 'Сохраняем…' : 'Добавить товар'}
      </Button>

      {error ? <p className="status">{error}</p> : null}
    </form>
  );
}
