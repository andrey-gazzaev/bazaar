import { memo } from 'react';
import styles from './slider.module.css';

/** Numeric range. The caller supplies the printed value. */
const SliderComponent = function({
  label,
  min,
  max,
  value,
  valueLabel,
  onChange,
}: {
  /** Name of the range, shown beside the track. */
  readonly label: string;

  /** Lowest value the track accepts. */
  readonly min: number;

  /** Highest value the track accepts. */
  readonly max: number;

  /** Current position on the track. */
  readonly value: number;

  /** Printed form of the current value. */
  readonly valueLabel: string;

  /** Called with the next number when the track moves. */
  readonly onChange: (value: number) => void;
}) {
  return (
    <label className={styles.slider}>
      <span className={styles.label}>{label}</span>
      <input
        className={styles.range}
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(event) => onChange(Number(event.currentTarget.value))}
      />
      <span className={styles.value}>{valueLabel}</span>
    </label>
  );
}

SliderComponent.displayName = 'Slider';
export const Slider = memo(SliderComponent);
