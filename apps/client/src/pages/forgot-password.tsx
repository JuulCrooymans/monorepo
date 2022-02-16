import { useState } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useResetPasswordWithEmailMutation } from "@graphql/queries";

import { Layout, Button } from "@components/Ui";
import { Input } from "@components/Form";

function ForgotPassword() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit } = useForm();
  const resetPassword = useResetPasswordWithEmailMutation();

  const submit = async ({ email }) => {
    setLoading(true);
    try {
      await resetPassword.mutateAsync({ email });
      router.push("/check-email");
    } catch (err) {
      // TODO: error handling
      console.log(err);
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mt-12">
        <h1 className="text-3xl font-bold text-center mb-2">Reset password</h1>
        <p className="text-center text-gray-500 mb-8 sm:px-8">
          Enter your email to reset password
        </p>
      </div>
      <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-y-6">
        <Input
          label="Your email"
          register={register("email", { required: true })}
          type="email"
        />
        <Button loading={loading} type="submit">
          Reset password
        </Button>
      </form>
    </div>
  );
}

ForgotPassword.getLayout = (page: React.ReactElement) => (
  <Layout>
    <Layout.Authenticate>{page}</Layout.Authenticate>
  </Layout>
);

export default ForgotPassword;
