import { betterAuth, type CookieOptions } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { emailOTP, twoFactor, username } from "better-auth/plugins";
import { RESERVED_USERNAMES, trustedOrigins } from "@/constants";
import { throwError } from "@/errors/handlers";
import { sendEmailVerificationLink, sendOTP } from "@/helpers/send-email";
import { db } from "../db";
import {
  account,
  session,
  twoFactor as twoFactorSchema,
  user,
  verification,
} from "../db/schema/auth.schema";

const isEmailVerification = process.env.ENABLE_EMAIL_VERIFICATION === "true";

const cookieOpts: CookieOptions = {
  httpOnly: true,
  domain: `.${process.env.DOMAIN}`,
  sameSite: "None",
  secure: true,
};

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      users: user,
      sessions: session,
      accounts: account,
      verifications: verification,
      twoFactors: twoFactorSchema,
    },
    usePlural: true,
  }),
  databaseHooks: {
    user: {
      create: {
        before: async (user, _ctx) => {
          return { data: { ...user, emailVerified: !isEmailVerification } };
        },
      },
    },
  },

  trustedOrigins,
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
  advanced: {
    cookies: {
      session_token: {
        attributes: cookieOpts,
      },
      session_data: {
        attributes: cookieOpts,
      },
    },
  },
  user: {
    changeEmail: {
      enabled: true,
      sendChangeEmailVerification: async ({ user, url }) => {
        await sendEmailVerificationLink({
          preview: "Request to Change Your Email Address",
          subject: "Email Change Request",
          email: user.email,
          url,
        });
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: isEmailVerification,
    password: {
      hash: async (password) => {
        return await Bun.password.hash(password, {
          algorithm: "argon2id",
          memoryCost: 12288,
          timeCost: 3,
        });
      },
      verify: async ({ password, hash }) => {
        return await Bun.password.verify(password, hash);
      },
    },
  },
  emailVerification: {
    sendOnSignUp: isEmailVerification,
    autoSignInAfterVerification: true,
    expiresIn: 3600,
  },
  plugins: [
    twoFactor(),
    username({
      usernameValidator: (username) => {
        return !RESERVED_USERNAMES.includes(username);
      },
    }),
    emailOTP({
      sendVerificationOnSignUp: isEmailVerification,
      allowedAttempts: 5,
      async sendVerificationOTP({ email, otp, type }) {
        const verification = await db.query.verification.findFirst({
          where: ({ identifier }, { eq }) =>
            eq(identifier, `email-verification-otp-${email}`),
          columns: {
            id: true,
          },
        });

        if (!verification?.id) {
          throwError(
            "INTERNAL_ERROR",
            "Failed to generate verification otp",
            "auth.get",
          );
        }

        if (type === "email-verification") {
          const fallbackUrl =
            `${process.env.CORS_ORIGIN}/email-verification` +
            `?token=${verification.id}`;

          await sendOTP({ email, otp, fallbackUrl });
        }
      },
    }),
  ],
});
