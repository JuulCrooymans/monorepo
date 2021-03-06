import { useForm } from "react-hook-form";
import { useRef } from "react";
import {
  useSessionsQuery,
  useDeleteSessionMutation,
  useMeQuery,
  useDisableTotpMutation,
  useResetPasswordMutation,
} from "@graphql/queries";
import dayjs from "dayjs";
import toast from "react-hot-toast";

import { Layout, Button } from "@components/Ui";
import { Input } from "@components/Form";

function Security() {
  const {
    register: registerResetPassword,
    handleSubmit: handleResetPassword,
    formState: { errors: resetPasswordErrors },
    watch,
  } = useForm();
  const {
    data: sessionsData,
    refetch: refetchSessions,
    isLoading: sessionsLoading,
  } = useSessionsQuery();
  const { data: meData, refetch: refetchMe } = useMeQuery();
  const deleteSessionMutation = useDeleteSessionMutation();
  const disableTotpMutation = useDisableTotpMutation();
  const resetPassword = useResetPasswordMutation();
  const password = useRef();
  password.current = watch("newPassword", "");

  const submitNewPassword = async ({ oldPassword, newPassword }) => {
    toast.promise(resetPassword.mutateAsync({ oldPassword, newPassword }), {
      loading: "Loading",
      success: "Password has been reset",
      error: "Something went wrong",
    });
  };

  const deleteSession = async (id: string) => {
    try {
      await deleteSessionMutation.mutateAsync({ id });
      await refetchSessions();
    } catch (err) {
      // TODO: error handling
      console.log(err);
    }
  };

  const disableTotp = async () => {
    try {
      await disableTotpMutation.mutateAsync({});
      await refetchMe();
    } catch (err) {
      // TODO: error handling
      console.log(err);
    }
  };

  return (
    <div className="flex flex-col space-y-12 w-full">
      <div>
        <h2 className="text-xl border-b dark:border-border-dark border-border-light pb-2 mb-4 font-bold">
          Change password
        </h2>
        <form
          className="flex flex-col space-y-4 lg:w-1/2 w-full"
          onSubmit={handleResetPassword(submitNewPassword)}
        >
          <Input
            label="Current password"
            register={registerResetPassword("oldPassword", {
              required: true,
            })}
            type="password"
          />
          <Input
            label="Password"
            type="password"
            register={registerResetPassword("newPassword", {
              required: "A password is required",
              minLength: {
                message: "Your password must contain 8 characters",
                value: 8,
              },
            })}
            error={resetPasswordErrors.newPassword}
          />
          <Input
            label="Repeat password"
            type="password"
            register={registerResetPassword("repeatPassword", {
              required: "A password is required",
              validate: (value) =>
                value === password.current || "Password doesn't match",
            })}
            className="mb-4"
            error={resetPasswordErrors.repeatPassword}
          />
          <Button type="submit">Change password</Button>
        </form>
      </div>
      <div>
        <h2 className="text-xl border-b dark:border-border-dark border-border-light pb-2 mb-4 font-bold">
          Two-factor authentication
        </h2>
        <div className="flex justify-between items-center">
          <div className="">Authenticator app</div>
          <div>
            {meData && meData.me && meData.me.enabledTotp ? (
              <Button
                onClick={disableTotp}
                secondary
                className="px-4 text-danger"
                small
              >
                Disable
              </Button>
            ) : (
              <Button
                href="/dashboard/settings/security/2fa"
                className="px-4"
                small
              >
                Enable
              </Button>
            )}
          </div>
        </div>
      </div>
      <div>
        <h2 className="text-xl border-b dark:border-border-dark border-border-light pb-2 font-bold">
          Sessions
        </h2>
        {sessionsLoading && !sessionsData && (
          <>
            <div className="py-4 border-b last:border-b-0 dark:border-border-dark border-border-light flex justify-between items-center">
              <div className="w-full h-8 bg-dark-500 animate-pulse rounded-md"></div>
            </div>
            <div className="py-4 border-b last:border-b-0 dark:border-border-dark border-border-light flex justify-between items-center">
              <div className="w-full h-8 bg-dark-500 animate-pulse rounded-md"></div>
            </div>
            <div className="py-4 border-b last:border-b-0 dark:border-border-dark border-border-light flex justify-between items-center">
              <div className="w-full h-8 bg-dark-500 animate-pulse rounded-md"></div>
            </div>
          </>
        )}
        {sessionsData &&
          sessionsData.sessions &&
          sessionsData.sessions.map((s) => (
            <div
              key={s.id}
              className="py-4 border-b last:border-b-0 dark:border-border-dark border-border-light flex justify-between items-center"
            >
              <div>
                {s.ip} &bull; {dayjs(s.createdAt).format("DD MMM")}
              </div>
              <div>
                <Button
                  onClick={() => deleteSession(s.id)}
                  secondary
                  className="px-4 text-danger"
                  small
                >
                  Delete session
                </Button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

Security.getLayout = (page: React.ReactElement) => {
  return (
    <Layout>
      <Layout.Settings>{page}</Layout.Settings>
    </Layout>
  );
};

export default Security;
