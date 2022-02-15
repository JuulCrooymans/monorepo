import Link from "next/link";
import { useRouter } from "next/router";
import { useMeQuery } from "@graphql/queries";
import cn from "classnames";

interface Routes {
  name: string;
  route: string;
}

function SettingsSidebar() {
  const { data, isLoading } = useMeQuery();
  const { pathname } = useRouter();
  const routes: Routes[] = [
    { name: "General", route: "/dashboard/settings" },
    { name: "Profile", route: "/dashboard/settings/profile" },
    { name: "Billing", route: "/dashboard/settings/billing" },
    { name: "Security", route: "/dashboard/settings/security" },
  ];

  return (
    <div className="flex justify-end">
      <div className="w-full flex flex-col">
        {isLoading ? (
          <div className="pl-2 mb-5 flex flex-col">
            <div className="bg-gray-100 dark:bg-dark-500 animate-pulse h-6 rounded-md w-64 mb-2"></div>
            <div className="bg-gray-100 dark:bg-dark-500 animate-pulse h-4 rounded w-32"></div>
          </div>
        ) : (
          <div className="pl-2 mb-6 flex flex-col">
            <span className="h-6 font-semibold truncate">{data.me.email}</span>
            <span className="text-sm dark:text-text-dark-200 text-text-200 h-4">
              Hobby
            </span>
          </div>
        )}
        {routes.map((r) => (
          <Link key={r.route} href={r.route}>
            <a
              className={cn(
                "p-2 rounded-md mb-1 text-sm",
                r.route === pathname ? "dark:bg-dark-500 bg-gray-100" : ""
              )}
            >
              {r.name}
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default SettingsSidebar;
