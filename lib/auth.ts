import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prismaClient } from "./db";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async signIn(params) {
      if (!params.user.email) {
        return false;
      }
      try {
        const user = await prismaClient.user.create({
          data: {
            email: params.user.email,
            name: params.user.name,
            image: params.user.image,
            provider: "GOOGLE",
          },
        });
        console.log(user);
      } catch (e) {
        console.error(e);
      }
      return true;
    },
  },
};

export default NextAuth(authOptions);
