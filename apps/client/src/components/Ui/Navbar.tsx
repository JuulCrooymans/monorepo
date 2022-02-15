import Link from "next/link";

function Navbar() {
  return (
    <div className="h-16 w-full items-center flex px-4 justify-between">
      <div className="text-2xl font-bold">Logo</div>
      <div className="flex space-x-6 items-center">
        <Link href={"/login"}>
          <a>Login</a>
        </Link>
        <Link href={"/sign-up"}>
          <a className="bg-primary py-2 px-6 text-white rounded-lg">Sign up</a>
        </Link>
      </div>
    </div>
  );
}

export default Navbar;
