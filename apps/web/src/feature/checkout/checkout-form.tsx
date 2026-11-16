'use client';

import { useState, type FormEvent } from 'react';
import type { Shipping } from '@/models';
import type { CheckoutVm } from '@/view-models';
import { Button, Media, TextField } from '@/ui';
import styles from './checkout-form.module.css';

/** Delivery form and the total for one listing. */
export function CheckoutForm({
  checkout,
  pending,
  onSubmit,
}: {
  readonly checkout: CheckoutVm;
  readonly pending: boolean;
  readonly onSubmit: (shipping: Shipping) => Promise<void>;
}) {
  const [recipientName, setRecipientName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function submit(event: FormEvent) {
    event.preventDefault();
    const shipping = {
      recipientName: recipientName.trim(),
      phone: phone.trim(),
      address: address.trim(),
    };

    if (shipping.recipientName.length < 2 || shipping.phone.length < 5 || shipping.address.length < 5) {
      setError('Укажите получателя, телефон и адрес');
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
    <div className={styles.layout}>
      <div className={styles.summary}>
        <div className={styles.frame}>{checkout.image ? <Media src={checkout.image} alt="" /> : null}</div>
        <h2>{checkout.productName}</h2>
        <p className="muted">Итог</p>
        <p className={styles.total}>{checkout.totalLabel}</p>
      </div>

      <form className={styles.form} onSubmit={(event) => void submit(event)}>
        <label>
          <span className="sr">Кому</span>
          <TextField
            value={recipientName}
            onChange={(event) => setRecipientName(event.target.value)}
            placeholder="Кому доставить"
            name="recipient"
          />
        </label>

        <label>
          <span className="sr">Телефон</span>
          <TextField value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="Телефон" name="phone" />
        </label>

        <label>
          <span className="sr">Адрес</span>
          <TextField
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            placeholder="Адрес"
            name="address"
          />
        </label>

        <Button type="submit" disabled={pending}>
          {pending ? 'Оформляем…' : 'Оформить заказ'}
        </Button>

        {error ? <p className="status">{error}</p> : null}
      </form>
    </div>
  );
}
