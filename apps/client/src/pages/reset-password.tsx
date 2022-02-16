import { useState, useRef } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useResetPasswordWithTokenMutation } from "@graphql/queries";

import { Layout, Button } from "@components/Ui";
import { Input } from "@components/Form";

function ResetPassword() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();
  const resetPassword = useResetPasswordWithTokenMutation();
  const password = useRef();
  password.current = watch("password", "");

  const submit = async ({ password }) => {
    setLoading(true);
    try {
      if (router.query.id && router.query.token) {
        await resetPassword.mutateAsync({
          password,
          userId: router.query.id as string,
          token: router.query.token as string,
        });
        router.push("/login");
      } else {
        setLoading(false);
      }
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
      <form
        className="flex flex-col space-y-4 w-full"
        onSubmit={handleSubmit(submit)}
      >
        <Input
          label="Password"
          type="password"
          register={register("password", {
            required: "A password is required",
            minLength: {
              message: "Your password must contain 8 characters",
              value: 8,
            },
          })}
          error={errors.password}
        />
        <Input
          label="Repeat password"
          type="password"
          register={register("repeatPassword", {
            required: "A password is required",
            validate: (value) =>
              value === password.current || "Password doesn't match",
          })}
          className="mb-4"
          error={errors.repeatPassword}
        />
        <Button loading={loading} type="submit">
          Change password
        </Button>
      </form>
    </div>
  );
}

ResetPassword.getLayout = (page: React.ReactElement) => (
  <Layout>
    <Layout.Authenticate>{page}</Layout.Authenticate>
  </Layout>
);

export default ResetPassword;
