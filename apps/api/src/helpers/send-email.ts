import type { ReactNode as Rn } from "hono/jsx";
import { type CreateEmailResponse, type ErrorResponse, Resend } from "resend";
import { MagicLinkTemplate, OTPTemplate } from "tsuika-email-templates";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendMail(
  email: string,
  subject: string,
  react: Rn,
): Promise<CreateEmailResponse> {
  try {
    const response = await resend.emails.send({
      from: "Tsuika <onbording@tsuika.space>",
      to: email,
      subject,
      react,
    });

    if (response.error || !response.data?.id) {
      console.error("Failed to send email", response.error);
    }

    return response;
  } catch (error) {
    console.error("Failed to send email", error);
    return { data: null, error: error as ErrorResponse };
  }
}

interface SendOtpProps {
  email: string;
  otp: string;
  subject?: string;
  fallbackUrl: string;
}

export async function sendOTP(props: SendOtpProps) {
  const { email, otp, subject = "Confirm your email", fallbackUrl } = props;

  const react = OTPTemplate({
    otp,
    projectName: "Tsuika",
    heading: subject,
    fallbackUrl,
    description:
      "Please enter the following One-Time Password (OTP) for email. This OTP is" +
      " valid for about 1 hour; before that, you can't request a new one.",
    socialLinks: [
      { label: "GitHub", href: "https://github.com/ImRayy/tsuika" },
      { label: "E-Mail", href: "mailto:imrayy.wklem@aleeas.com" },
    ],
  });
  return await sendMail(email, subject, react);
}

interface SendEmailVerificationLinkProps {
  email: string;
  url: string;
  preview: string;
  subject?: string;
}

export async function sendEmailVerificationLink(
  props: SendEmailVerificationLinkProps,
) {
  const { email, url, preview, subject = "Verify your email" } = props;

  const react = MagicLinkTemplate({ preview, url });

  return await sendMail(email, subject, react);
}
