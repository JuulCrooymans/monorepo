import { Layout } from "@components/Ui";

function Settings() {
  return <div></div>;
}

Settings.getLayout = (page: React.ReactElement) => {
  return (
    <Layout>
      <Layout.Dashboard>{page}</Layout.Dashboard>
    </Layout>
  );
};

export default Settings;
