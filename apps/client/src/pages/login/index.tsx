import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useLoginMutation } from "@graphql/queries";

import { Input } from "@components/Form";
import { Layout, Button } from "@components/Ui";

function Login() {
  const login = useLoginMutation();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const submitLogin = async ({ email, password }) => {
    setLoading(true);
    try {
      const user = await login.mutateAsync({ email, password });

      if (user.login.enabledTotp) {
        return router.push("/login/2fa");
      }

      if (user) {
        return router.push("/dashboard");
      }
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
        <h1 className="text-3xl font-bold text-center mb-2">Login</h1>
        <p className="text-center text-gray-500 mb-8 sm:px-8">
          Lorem ipsum dolor sit amet consectetur adipisicing nihil quisquam.
        </p>
      </div>
      <form
        onSubmit={handleSubmit(submitLogin)}
        className="flex flex-col space-y-4"
      >
        <Input
          label="E-mail"
          type="email"
          register={register("email", {
            required: "An email adress is required",
          })}
          error={errors.email}
        />
        <Input
          label="Password"
          type="password"
          register={register("password", {
            required: "A password is required",
          })}
          className="mb-4"
          error={errors.password}
        />
        <Button loading={loading} type="submit">
          Login
        </Button>
      </form>
      <div className="flex flex-col items-center mt-6 gap-4">
        <Link href="/sign-up">
          <a>
            No account? <strong>Sign up</strong>
          </a>
        </Link>
        <Link href="/forgot-password">
          <a>
            <strong>Forgot password?</strong>
          </a>
        </Link>
      </div>
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
