import { useRouter } from "next/router";
import Link from "next/link";
import { useLogoutMutation } from "@graphql/queries";

function DashboardNavbar() {
  const router = useRouter();
  const logoutMutation = useLogoutMutation();

  const logout = async () => {
    try {
      await logoutMutation.mutateAsync({});
      router.reload();
    } catch (err) {
      // TODO: error handling
      console.log(err);
    }
  };

  return (
    <div className="h-12 w-full items-center flex px-4 justify-between ">
      <Link href="/dashboard">
        <a className="text-xl font-bold">Logo</a>
      </Link>
      <div className="flex space-x-6 items-center">
        <Link href="/dashboard/settings">
          <a>Settings</a>
        </Link>
        <div onClick={logout} className="cursor-pointer">
          Logout
        </div>
      </div>
    </div>
  );
}

export default DashboardNavbar;
