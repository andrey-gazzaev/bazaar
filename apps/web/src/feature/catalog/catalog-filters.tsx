'use client';

import type { CatalogQuery, CatalogSort } from '@/models';
import { useCatalog } from '@/hooks';
import { useTags } from '@/queries';
import { formatPrice } from '@/services';
import { Chip, Icon, Panel, SelectField, Slider, TextField } from '@/ui';
import styles from './catalog-filters.module.css';
import { useCatalogAddress } from './use-catalog-address';
import { useDelayedPrice } from './use-delayed-price';

/** Search, tag chips, sort, and the price ceiling. */
export function CatalogFilters() {
  const { query, replace } = useCatalogAddress();
  const { ceiling, isLoading, error } = useCatalog(query);
  const tags = useTags();
  const { price, change } = useDelayedPrice(query.maxPrice ?? ceiling, (maxPrice) => {
    replace({ ...query, maxPrice, page: 1 });
  });

  if (isLoading || tags.isLoading || error) return null;

  const names = (tags.data ?? []).map((tag) => tag.name);

  function filter(patch: Partial<Omit<CatalogQuery, 'page'>>) {
    replace({ ...query, ...patch, page: 1 });
  }

  return (
    <Panel className={styles.panel}>
      <h2 className={styles.title}>Фильтры</h2>

      <TextField
        value={query.q}
        placeholder="Найти вещь"
        onChange={(event) => filter({ q: event.currentTarget.value })}
        adornment={<Icon name="search" />}
      />

      <div className={styles.chips}>
        <Chip selected={query.tag === ''} onClick={() => filter({ tag: '' })}>
          Всё
        </Chip>
        {names.map((name) => (
          <Chip key={name} selected={query.tag === name} onClick={() => filter({ tag: name })}>
            {name}
          </Chip>
        ))}
      </div>

      <SelectField
        label="Сортировка"
        value={query.sort}
        onChange={(event) => filter({ sort: event.target.value as CatalogSort })}
      >
        <option value="newest">Сначала новые</option>
        <option value="price_asc">Сначала дешевле</option>
        <option value="price_desc">Сначала дороже</option>
        <option value="name">По названию</option>
      </SelectField>

      <Slider
        label="Цена до"
        min={0}
        max={ceiling}
        value={price}
        valueLabel={formatPrice(price)}
        onChange={change}
      />
    </Panel>
  );
}
