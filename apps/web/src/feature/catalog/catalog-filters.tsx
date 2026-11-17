import { memo } from 'react';
import type { CatalogSort } from '@/models';
import { formatPrice } from '@/services';
import { Chip, Icon, Panel, SelectField, Slider, TextField } from '@/ui';
import styles from './catalog-filters.module.css';

/** Search, tag chips, sort, and the price ceiling. */
const CatalogFiltersComponent = function({
  query,
  onQuery,
  tags,
  tag,
  onTag,
  sort,
  onSort,
  max,
  price,
  onPrice,
}: {
  /** Text matched against listing names. Empty matches every name. */
  readonly query: string;

  /** Stores the next search text. */
  readonly onQuery: (query: string) => void;

  /** Tag names offered as chips. Empty when the shop has no tags. */
  readonly tags: readonly string[];

  /** Selected tag. Empty when every tag is included. */
  readonly tag: string;

  /** Stores the next tag. Empty clears the selection. */
  readonly onTag: (tag: string) => void;

  /** Current sort. */
  readonly sort: CatalogSort;

  /** Stores the next sort. */
  readonly onSort: (sort: CatalogSort) => void;

  /** Highest approved price, in whole rubles. Zero when the catalog is empty. */
  readonly max: number;

  /** Ceiling shown on the slider, in whole rubles. */
  readonly price: number;

  /** Stores the next ceiling. */
  readonly onPrice: (price: number) => void;
}) {
  return (
    <Panel className={styles.panel}>
      <h2 className={styles.title}>Фильтры</h2>

      <TextField
        value={query}
        placeholder="Найти вещь"
        onChange={(event) => onQuery(event.currentTarget.value)}
        adornment={<Icon name="search" />}
      />

      <div className={styles.chips}>
        <Chip selected={tag === ''} onClick={() => onTag('')}>
          Всё
        </Chip>
        {tags.map((name) => (
          <Chip key={name} selected={tag === name} onClick={() => onTag(name)}>
            {name}
          </Chip>
        ))}
      </div>

      <SelectField label="Сортировка" value={sort} onChange={(event) => onSort(event.target.value as CatalogSort)}>
        <option value="newest">Сначала новые</option>
        <option value="price_asc">Сначала дешевле</option>
        <option value="price_desc">Сначала дороже</option>
        <option value="name">По названию</option>
      </SelectField>

      <Slider
        label="Цена до"
        min={0}
        max={max}
        value={price}
        valueLabel={formatPrice(price)}
        onChange={onPrice}
      />
    </Panel>
  );
}

CatalogFiltersComponent.displayName = 'CatalogFilters';
export const CatalogFilters = memo(CatalogFiltersComponent);
