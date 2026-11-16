'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState, type FormEvent } from 'react';
import { useSessionContext } from '@/context';
import { useSignIn } from '@/queries';
import { Breadcrumb, Button, Page, Panel, TextField } from '@/ui';
import styles from './sign-in.module.css';

/** Email and password form. */
export function SignIn() {
  const signIn = useSignIn();
  const session = useSessionContext();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (session.user) router.replace('/');
  }, [session.user, router]);

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

  if (session.user) return null;

  return (
    <Page className={styles.column}>
      <Breadcrumb
        items={[
          { href: '/', label: 'Главная' },
          { label: 'Вход' },
        ]}
      />

      <Panel>
        <h1 className={styles.title}>Вход</h1>

        <p className="muted">Email и пароль</p>

        <form className={styles.form} onSubmit={(event) => void onSubmit(event)}>
          <TextField
            label="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email"
            autoComplete="username"
            name="email"
            type="email"
          />

          <TextField
            label="Пароль"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Пароль"
            autoComplete="current-password"
            name="password"
            type="password"
          />

          <Button className={styles.submit} type="submit" disabled={signIn.isPending}>
            {signIn.isPending ? 'Входим…' : 'Войти'}
          </Button>

          {error ? <p className="status">{error}</p> : null}

          <p className={styles.links}>
            <a href="/sign-up">Нет аккаунта? Регистрация</a>
            {' · '}
            <a href="/">Каталог</a>
          </p>
        </form>
      </Panel>
    </Page>
  );
}
