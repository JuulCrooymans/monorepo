import { Layout } from "@components/Ui";

function Settings() {
  return (
    <div>
      <h2 className="text-xl border-b pb-2 mb-4 font-bold dark:border-border-dark border-border-light">
        Theme
      </h2>
    </div>
  );
}

Settings.getLayout = (page: React.ReactElement) => {
  return (
    <Layout>
      <Layout.Settings>{page}</Layout.Settings>
    </Layout>
  );
};

export default Settings;
