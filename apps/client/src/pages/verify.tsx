import type { GetServerSideProps } from "next";
import { Layout } from "@components/Ui";
import axios from "axios";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const res = await axios.post(
    (process.env.NEXT_PUBLIC_GRAPHQL_URL as string) ||
      "https://api.enne.dev/graphql",
    {
      query: `mutation VerifyEmail($token: String!, $userId: String!) {
        verifyEmail(token: $token, userId: $userId)
      }`,
      variables: {
        token: ctx.query.token,
        userId: ctx.query.id,
      },
    }
  );

  return {
    props: {
      verified: res.data.data.verifyEmail,
    },
  };
};

function Verify({ verified }: { verified: boolean }) {
  return (
    <div className="mt-12">
      {verified ? (
        <>
          <h1 className="text-3xl font-bold text-center mb-2">Success!</h1>
          <p className="text-center text-white mb-8 sm:px-8">
            Your email has been verified
          </p>
        </>
      ) : (
        <h1 className="text-3xl font-bold text-center mb-2">
          Something went wrong
        </h1>
      )}
    </div>
  );
}

Verify.getLayout = (page: React.ReactElement) => {
  return (
    <Layout>
      <Layout.Authenticate>{page}</Layout.Authenticate>
    </Layout>
  );
};

export default Verify;
