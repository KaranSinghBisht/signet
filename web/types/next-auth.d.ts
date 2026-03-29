import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    twitterHandle?: string;
    twitterName?: string;
    twitterAvatar?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    twitterHandle?: string;
    twitterName?: string;
    twitterAvatar?: string;
  }
}
