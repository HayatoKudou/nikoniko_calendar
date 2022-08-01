import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: "547556783294-7tfsiscmgl4blq6l46cnp7uut02v6o1b.apps.googleusercontent.com",
      clientSecret: "GOCSPX-40T9aIlkv_GmoM7dSjamLR",
      // clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ? process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID : "",
      // clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET ? process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET : "",
    }),
  ],
  callbacks: {
    //jwtが作成・更新された時に呼ばれる
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    //セッションがチェックされた時に呼ばれる
    async session({ session, token, user }) {
      session.accessToken = token.accessToken;
      return session;
    },
  },
});
