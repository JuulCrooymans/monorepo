import { Layout } from "@components/Ui";

function CheckEmail() {
  return (
    <div>
      <div className="mt-12">
        <h1 className="text-3xl font-bold text-center mb-2">
          Check your email
        </h1>
      </div>
    </div>
  );
}

CheckEmail.getLayout = (page: React.ReactElement) => (
  <Layout>
    <Layout.Authenticate>{page}</Layout.Authenticate>
  </Layout>
);

export default CheckEmail;
