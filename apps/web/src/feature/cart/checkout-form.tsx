'use client';

import { useState, type FormEvent } from 'react';
import type { Shipping } from '@/models';
import { Panel, SelectField, TextField } from '@/ui';
import type { CartVm } from '@/view-models';
import { OrderSummary } from './order-summary';
import styles from './checkout-form.module.css';

const CITIES = ['Москва', 'Санкт-Петербург', 'Казань'] as const;

function subscriberDigits(raw: string): string {
  let digits = raw.replace(/\D/g, '');

  if (digits.startsWith('7') || digits.startsWith('8')) {
    digits = digits.slice(1);
  }

  return digits.slice(0, 10);
}

function maskPhone(raw: string): string {
  const digits = subscriberDigits(raw);

  if (digits.length === 0) return '';

  const area = digits.slice(0, 3);
  const prefix = digits.slice(3, 6);
  const first = digits.slice(6, 8);
  const second = digits.slice(8, 10);
  let masked = `+7 (${area}`;

  if (digits.length < 3) return masked;

  masked += ')';

  if (prefix.length === 0) return masked;

  masked += ` ${prefix}`;

  if (first.length === 0) return masked;

  masked += `-${first}`;

  if (second.length === 0) return masked;

  return `${masked}-${second}`;
}

/** Address and the cart summary. */
export function CheckoutForm({
  cart,
  pending,
  onSubmit,
  onQuantity,
  onRemove,
}: {
  /** Lines and totals to confirm. */
  readonly cart: CartVm;

  /** True while checkout is in flight. */
  readonly pending: boolean;

  /** Stores the delivery details. */
  readonly onSubmit: (shipping: Shipping) => Promise<void>;

  /** Stores the next quantity of one line. */
  readonly onQuantity: (productId: string, quantity: number) => void;

  /** Drops one line. */
  readonly onRemove: (productId: string) => void;
}) {
  const [recipientName, setRecipientName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [street, setStreet] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function submit(event: FormEvent) {
    event.preventDefault();
    const recipient = recipientName.trim();
    const streetLine = street.trim();
    const shipping = {
      recipientName: recipient,
      phone,
      address: `${city}, ${streetLine}`,
    };

    if (recipient.length < 2 || subscriberDigits(phone).length !== 10 || city.length === 0 || streetLine.length < 5) {
      setError('Укажите имя, телефон, город и улицу');
      return;
    }

    setError(null);

    try {
      await onSubmit(shipping);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Не удалось оформить заказ');
    }
  }

  return (
    <form onSubmit={(event) => void submit(event)}>
      <div className={styles.layout}>
        <Panel className={styles.address}>
          <h2 className={styles.heading}>Адрес доставки</h2>

          <div className={styles.fields}>
            <TextField
              label="Имя"
              value={recipientName}
              onChange={(event) => setRecipientName(event.target.value)}
              name="recipient"
              autoComplete="name"
            />

            <TextField
              label="Телефон"
              value={phone}
              onChange={(event) => setPhone(maskPhone(event.target.value))}
              placeholder="+7 (___) ___-__-__"
              name="phone"
              inputMode="tel"
              autoComplete="tel"
            />

            <SelectField label="Город" name="city" value={city} onChange={(event) => setCity(event.target.value)}>
              <option value="" />
              {CITIES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </SelectField>

            <TextField
              label="Улица и дом"
              value={street}
              onChange={(event) => setStreet(event.target.value)}
              placeholder="Укажите улицу и номер дома"
              name="street"
              autoComplete="street-address"
            />
          </div>

          {error ? <p className="status">{error}</p> : null}
        </Panel>

        <OrderSummary cart={cart} pending={pending} onQuantity={onQuantity} onRemove={onRemove} />
      </div>
    </form>
  );
}
