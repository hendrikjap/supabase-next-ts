import { useState } from 'react';
import type { NextPage, GetServerSideProps } from 'next';
import type { LogInTypes } from '@/libs/form-data';
import Link from 'next/link';
import { Text, Input, Button, Divider, Spacer, useToasts } from '@geist-ui/react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { MetaHead } from '@/libs/components/.';
import { supabase } from '@/supabase/.';

const Login: NextPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { register, handleSubmit, formState } = useForm<LogInTypes>();
  const [, setToast] = useToasts();

  const onSubmit: SubmitHandler<LogInTypes> = async ({ email, password }: LogInTypes) => {
    setLoading(true);
    const { error } = await supabase.auth.signIn({ email, password });
    if (error) {
      setToast({ text: error.message, type: 'error' });
      return setLoading(false);
    }
  };

  const withAuthProvider = async () => {
    const { error } = await supabase.auth.signIn({ provider: 'google' });
    if (error) return setToast({ text: error.message, type: 'error' });
  };

  return (
    <>
      <MetaHead title="Log In" />
      <div className="flex flex-row min-h-screen">
        <section className="w-98 p-12 box-border flex-shrink-0 sm:w-screen">
          <header>
            <Text h3>Supabase Next.js</Text>
            <Text type="success" span b>
              Hacktoberfest Hackathon 2021
            </Text>
          </header>
          <Spacer y={2} />
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3">
            <Text h4>Log in to your account</Text>
            <Input
              type="email"
              width="100%"
              status={formState.errors.email && 'error'}
              {...register('email', { required: true })}
              disabled={loading}
            >
              <Text small b>
                Email Address
              </Text>
            </Input>
            <Input.Password
              width="100%"
              status={formState.errors.password && 'error'}
              {...register('password', { required: true, min: 6 })}
              disabled={loading}
            >
              <Text small b>
                Password
              </Text>
            </Input.Password>
            <Button htmlType="submit" shadow type="success" loading={loading}>
              Log In
            </Button>
            <Divider y={2}>
              <Text small b>
                OR
              </Text>
            </Divider>
            <Button shadow type="secondary" onClick={withAuthProvider}>
              Log In With Google
            </Button>
          </form>
          <Spacer y={2} />
          <Text>
            Don&apos;t have an account?{' '}
            <Link href="/register">
              <a className="whitespace-nowrap">Sign Up</a>
            </Link>
          </Text>
        </section>
        <div className="canvas w-full flex-grow sm:hidden" />
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { user } = await supabase.auth.api.getUserByCookie(context.req);

  if (user) return { props: {}, redirect: { destination: '/u/overview', permanent: false } };

  return { props: {} };
};

export default Login;
