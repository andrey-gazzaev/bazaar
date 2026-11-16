'use client';

import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { useSignIn } from '@/queries';
import { Button, Page, Panel, TextField } from '@/ui';
import styles from './sign-in.module.css';

/** Email and password form. */
export function SignIn() {
  const signIn = useSignIn();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    const nextEmail = email.trim();

    if (!nextEmail || !password) {
      setError('Введите email и пароль');
      return;
    }

    setError(null);

    try {
      await signIn.mutateAsync({ email: nextEmail, password });
      router.push('/');
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Не удалось войти');
    }
  }

  return (
    <Page>
      <Panel>
        <h1 className={styles.title}>Вход</h1>

        <p className="muted">Email и пароль от аккаунта на Базаре.</p>

        <form className={styles.form} onSubmit={(event) => void onSubmit(event)}>
          <label>
            <span className="sr">Email</span>
            <TextField
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Email"
              autoComplete="username"
              name="email"
              type="email"
            />
          </label>

          <label>
            <span className="sr">Пароль</span>
            <TextField
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Пароль"
              autoComplete="current-password"
              name="password"
              type="password"
            />
          </label>

          <Button type="submit" disabled={signIn.isPending}>
            {signIn.isPending ? 'Входим…' : 'Войти'}
          </Button>

          {error ? <p className="status">{error}</p> : null}

          <p className={styles.links}>
            <a href="/sign-up">Нет аккаунта? Регистрация</a>
          </p>
        </form>
      </Panel>
    </Page>
  );
}
