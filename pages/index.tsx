import type { NextPage, GetServerSideProps } from 'next';
import { MetaHead } from '@/libs/components/.';
import { supabase } from '@/supabase/.';

const Home: NextPage = () => {
  return (
    <>
      <MetaHead title="Supabase Next.js Starter" />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { user } = await supabase.auth.api.getUserByCookie(context.req);

  if (user) return { props: {}, redirect: { destination: '/u/overview', permanent: false } };

  return { props: {}, redirect: { destination: '/login', permanent: false } };
};

export default Home;
