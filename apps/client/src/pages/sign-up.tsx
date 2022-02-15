import { useRouter } from "next/router";
import Link from "next/link";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useSignUpMutation } from "@graphql/queries";

import { Input } from "@components/Form";
import { Layout, Button } from "@components/Ui";

function SignUp() {
  const router = useRouter();
  const signUp = useSignUpMutation();
  const [loading, setLoading] = useState(false);
  const password = useRef();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();
  password.current = watch("password", "");

  const submitSignUp = async ({ email, password }) => {
    setLoading(true);
    try {
      await signUp.mutateAsync({ email, password });
      router.push("/dashboard");
    } catch (err) {
      // TODO: error handling
      console.log(err);
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mt-12">
        <h1 className="text-3xl font-bold text-center mb-2">Sign up</h1>
        <p className="text-center text-gray-500 mb-8 sm:px-8">
          Lorem ipsum dolor sit amet consectetur adipisicing nihil quisquam.
        </p>
      </div>
      <form
        onSubmit={handleSubmit(submitSignUp)}
        className="flex flex-col space-y-4"
      >
        <Input
          label="E-mail"
          type="email"
          register={register("email", {
            required: "An email adress is required",
            pattern: {
              message: "Enter a valid email",
              value:
                /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/g,
            },
          })}
          error={errors.email}
        />
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
          Sign up
        </Button>
      </form>
      <div className="flex justify-center mt-4">
        <Link href="/login">
          <a>
            Already have an account? <strong>Login</strong>
          </a>
        </Link>
      </div>
    </div>
  );
}

SignUp.getLayout = (page: React.ReactElement) => {
  return (
    <Layout>
      <Layout.Authenticate>{page}</Layout.Authenticate>
    </Layout>
  );
};

export default SignUp;
