import { formatPrice } from '@/services';
import { Chip, Icon, Panel, Slider, TextField } from '@/ui';
import styles from './catalog-filters.module.css';

/** Search, tag chips, and the price ceiling. */
export function CatalogFilters({
  query,
  onQuery,
  tags,
  tag,
  onTag,
  max,
  price,
  onPrice,
}: {
  /** Text matched against listing names. Empty matches every name. */
  readonly query: string;

  /** Stores the next search text. */
  readonly onQuery: (query: string) => void;

  /** Tag names offered as chips. Empty when no listing has a tag. */
  readonly tags: readonly string[];

  /** Selected tag. Empty when every tag is included. */
  readonly tag: string;

  /** Stores the next tag. Empty clears the selection. */
  readonly onTag: (tag: string) => void;

  /** Highest listing price, in whole rubles. Zero when the catalog is empty. */
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
