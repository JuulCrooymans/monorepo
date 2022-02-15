import { useState } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useVerifyTotpMutation } from "@graphql/queries";

import { Input } from "@components/Form";
import { Layout, Button } from "@components/Ui";

function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const verifyTotp = useVerifyTotpMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const submitLogin = async ({ code }) => {
    setLoading(true);
    try {
      await verifyTotp.mutateAsync({ code });
      router.push("/dashboard");
    } catch (err) {
      // TODO: error handling
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mt-12">
        <h1 className="text-3xl font-bold text-center mb-2">
          Two-factor Authentication
        </h1>
        <p className="text-center text-gray-500 mb-8 sm:px-8">
          Lorem ipsum dolor sit amet consectetur adipisicing nihil quisquam.
        </p>
      </div>
      <form
        onSubmit={handleSubmit(submitLogin)}
        className="flex flex-col space-y-4"
      >
        <Input
          label="Two-factor Authentication code"
          type="text"
          register={register("code", {
            required: "Enter a code",
          })}
          error={errors.code}
        />
        <Button loading={loading} type="submit">
          Login
        </Button>
      </form>
    </div>
  );
}

Login.getLayout = (page: React.ReactElement) => {
  return (
    <Layout>
      <Layout.Authenticate>{page}</Layout.Authenticate>
    </Layout>
  );
};

export default Login;
