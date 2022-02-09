import { Layout } from "@components/Ui";

function Dashboard() {
  return <div></div>;
}

Dashboard.getLayout = (page: React.ReactElement) => {
  return (
    <Layout>
      <Layout.Dashboard>{page}</Layout.Dashboard>
    </Layout>
  );
};

export default Dashboard;
