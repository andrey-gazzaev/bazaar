'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState, type FormEvent } from 'react';
import { useSessionContext } from '@/context';
import type { RegisterInput } from '@/models';
import { useSignUp } from '@/queries';
import { Button, Page, Panel, SelectField, TextField } from '@/ui';
import styles from './sign-up.module.css';

/** Registration for a client or a seller. */
export function SignUp() {
  const signUp = useSignUp();
  const session = useSessionContext();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<RegisterInput['role']>('CLIENT');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (session.user) router.replace('/');
  }, [session.user, router]);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    const nextName = name.trim();
    const nextEmail = email.trim();

    if (!nextName || !nextEmail || password.length < 8) {
      setError('Имя, email и пароль от 8 символов');
      return;
    }

    setError(null);

    try {
      await signUp.mutateAsync({ name: nextName, email: nextEmail, password, role });
      router.push('/');
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Не удалось зарегистрироваться');
    }
  }

  if (session.user) return null;

  return (
    <Page className={styles.column}>
      <Panel>
        <h1 className={styles.title}>Регистрация</h1>

        <p className="muted">Клиент покупает. Продавец выставляет товары.</p>

        <form className={styles.form} onSubmit={(event) => void onSubmit(event)}>
          <label>
            <span className="sr">Имя</span>
            <TextField value={name} onChange={(event) => setName(event.target.value)} placeholder="Имя" name="name" />
          </label>

          <label>
            <span className="sr">Email</span>
            <TextField
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Email"
              type="email"
              name="email"
            />
          </label>

          <label>
            <span className="sr">Пароль</span>
            <TextField
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Пароль"
              type="password"
              name="password"
            />
          </label>

          <label>
            <span className="sr">Роль</span>
            <SelectField value={role} onChange={(event) => setRole(event.target.value as RegisterInput['role'])}>
              <option value="CLIENT">Клиент</option>
              <option value="SELLER">Продавец</option>
            </SelectField>
          </label>

          <Button type="submit" disabled={signUp.isPending}>
            {signUp.isPending ? 'Создаём…' : 'Создать аккаунт'}
          </Button>

          {error ? <p className="status">{error}</p> : null}

          <p className={styles.links}>
            <a href="/sign-in">Уже есть аккаунт? Войти</a>
            {' · '}
            <a href="/">Каталог</a>
          </p>
        </form>
      </Panel>
    </Page>
  );
}
