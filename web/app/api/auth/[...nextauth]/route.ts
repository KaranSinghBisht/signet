import NextAuth from "next-auth";
import TwitterProvider from "next-auth/providers/twitter";

const handler = NextAuth({
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID!,
      clientSecret: process.env.TWITTER_CLIENT_SECRET!,
      version: "2.0",
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        const p = profile as { username?: string; profile_image_url?: string; name?: string };
        token.twitterHandle = p.username;
        token.twitterName = p.name;
        token.twitterAvatar = p.profile_image_url?.replace("_normal", "_400x400");
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        twitterHandle: token.twitterHandle as string | undefined,
        twitterName: token.twitterName as string | undefined,
        twitterAvatar: token.twitterAvatar as string | undefined,
      };
    },
  },
});

export { handler as GET, handler as POST };
