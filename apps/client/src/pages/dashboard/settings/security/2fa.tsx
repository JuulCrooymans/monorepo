import { useRouter } from "next/router";
import { useGetTotpQuery, useEnableTotpMutation } from "@graphql/queries";

import { Layout, Button } from "@components/Ui";
import { useEffect } from "react";

function Security() {
  const router = useRouter();
  const { data } = useGetTotpQuery(
    {},
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    }
  );
  const enabledTotp = useEnableTotpMutation();

  const enable2fa = async () => {
    try {
      if (!data.getTotp.secret) throw new Error("No secret");

      await enabledTotp.mutateAsync({
        secret: data.getTotp.secret,
      });

      router.push("/dashboard/settings/security");
    } catch (err) {
      // TODO: error handling
      console.log(err);
    }
  };

  return (
    <div className="flex flex-col w-full mt-8 space-y-8">
      <h2 className="text-center text-2xl font-bold">
        Two-factor authenticate
      </h2>
      <div className="flex justify-center">
        <div className="p-4 bg-dark-500 rounded-md">
          <div className="w-[166px] h-[166px]">
            {data && data.getTotp && (
              <img
                src={data.getTotp.qr}
                alt="Two-factor authentication QR-code"
              />
            )}
          </div>
        </div>
      </div>
      <Button onClick={enable2fa}>Enable</Button>
    </div>
  );
}

Security.getLayout = (page: React.ReactElement) => {
  return (
    <Layout>
      <Layout.Authenticate>{page}</Layout.Authenticate>
    </Layout>
  );
};

export default Security;
