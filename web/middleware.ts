import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "signet.app";
const SAFE_SUBDOMAIN_RE = /^[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$|^[a-z0-9]$/i;

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || "";

  // Skip on localhost (use path-based routing instead)
  if (hostname.includes("localhost") || hostname.includes("127.0.0.1")) {
    return NextResponse.next();
  }

  // e.g. austingriffith.signet.app → subdomain = "austingriffith"
  const subdomain = hostname.replace(`.${ROOT_DOMAIN}`, "");
  const isSubdomain = subdomain !== hostname && subdomain !== "www" && subdomain !== "";

  if (isSubdomain) {
    // Reject subdomains containing path-traversal or unsafe characters
    if (!SAFE_SUBDOMAIN_RE.test(subdomain)) {
      return new NextResponse("Invalid subdomain", { status: 400 });
    }

    const url = request.nextUrl.clone();
    url.pathname = `/a/${subdomain}${url.pathname === "/" ? "" : url.pathname}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon\\.ico).*)"],
};
