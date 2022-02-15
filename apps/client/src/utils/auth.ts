import { NextRequest } from "next/server";

interface isAuthOptions {
  role?: ("admin" | "regular")[];
  projectAccess?: boolean;
  destination?: string;
}

/**
 *
 * @param {GetServerSidePropsContext} ctx
 * @returns {Promise} boolean
 */
export async function isAuth(
  req: NextRequest,
  options?: isAuthOptions
): Promise<boolean> {
  const res = await fetch(
    process.env.NEXT_PUBLIC_GRAPHQL_URL ||
      "https://unwritten-steel-production.up.railway.app/graphql",
    {
      method: "POST",
      headers: {
        cookie: req.headers.get("cookie"),
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        query: `
        query {
          me {
            id
          }
        }
      `,
        variables: {},
      }),
    }
  );

  const data = await res.json();

  if (data && data.me && data.me.id) {
    return true;
  }
  return false;
}
