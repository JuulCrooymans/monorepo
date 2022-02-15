import { useForm } from "react-hook-form";

import { Layout, Button } from "@components/Ui";
import { Input } from "@components/Form";

function ForgotPassword() {
  const { register, handleSubmit } = useForm();

  const submit = ({ email }) => {};

  return (
    <div>
      <div className="mt-12">
        <h1 className="text-3xl font-bold text-center mb-2">Reset password</h1>
        <p className="text-center text-gray-500 mb-8 sm:px-8">
          Enter your email to reset password
        </p>
      </div>
      <form className="flex flex-col gap-y-6">
        <Input
          label="Your email"
          register={register("email", { required: true })}
        />
        <Button>Reset password</Button>
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
