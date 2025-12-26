import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { apiPost } from "@/utils/endpoints/common";
import { encrypt } from "./encryption.service";
import { API_VERIFY_OTP } from "@/utils/api/APIConstant";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        otp: { label: "OTP", type: "text" },
      },
      async authorize(credentials) {
        console.log("Authorize called with:", credentials);

        if (!credentials?.email) throw new Error("email_required");
        if (!credentials?.otp) throw new Error("otp_required");

        const res = await apiPost({
          url: API_VERIFY_OTP,
          values: {
            email: credentials.email,
            otp: credentials.otp,
          },
        });

        console.log("Authorize API response:", res);

        if (!res?.success) {
          throw new Error(res?.message || "verification_failed");
        }

        if (!res.token) {
          console.log("OTP verified but token not returned");
          return { stage: "otp_verified", ...res };
        }

        const userData = {
          id: res.user._id,
          email: res.user.email,
          firstName: res.user.firstName,
          lastName: res.user.lastName,
          role: res.user.role,
          accessToken: res.token,
        };

        console.log("Authorize returning userData:", userData);
        return userData;
      },
    }),
  ],

  session: { strategy: "jwt" },

  pages: {
    signIn: "/",
    error: "/",
  },

  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async jwt({ token, user }: { token: any; user: any }) {
      console.log("JWT callback called. Token before:", token, "User:", user);

      if (user) {
        token.sub = user.id;
        token.user = user;
        token.accessToken = user.accessToken;
      }

      console.log("JWT callback returning token:", token);
      return token;
    },

    async session({ session, token }: { session: any; token: any }) {
      console.log(
        "Session callback called. Session before:",
        session,
        "Token:",
        token
      );

      if (token?.user) {
        session.user = token.user;
        session.isAuthenticated = true;
      } else {
        session.user = null;
        session.isAuthenticated = false;
      }

      if (token?.accessToken) {
        const sensitiveData = {
          token: token.accessToken,
          user: token.user,
          isAuthenticated: true,
        };

        try {
          session.encrypted = encrypt(JSON.stringify(sensitiveData));
          delete session.user;
          delete session.isAuthenticated;

          return session;
        } catch (err) {
          console.error("Failed to encrypt session data:", err);
        }
      }

      console.log("Session callback returning session:", session);
      return session;
    },
  },
};
