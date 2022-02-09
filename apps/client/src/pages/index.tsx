import { Layout } from "@components/Ui";

function Home() {
  return <div></div>;
}

Home.getLayout = (page: React.ReactElement) => {
  return (
    <Layout>
      <Layout.Web>{page}</Layout.Web>
    </Layout>
  );
};

export default Home;
