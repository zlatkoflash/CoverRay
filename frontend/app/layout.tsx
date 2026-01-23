import type { Metadata } from "next";
import {
  // Geist, Geist_Mono,
  DM_Sans,
  Fraunces,
} from "next/font/google";
// import "./globals.css";
// import "./../assets/css/Style-DESKTOP-ALL-SCREENS-FINAL.css";
// import "./../assets/css/Style-Edits.scss";
import './../assets/css.js.template/Style.template.css';
import './../assets/css.js.template/Style.template.edits.scss';
import StoreProvider from "@/Providers/StoreProvider";
import ModalSignIn from "@/components/Modals/Auth/ModalSignIn";
import ModalSignUp from "@/components/Modals/Auth/ModalSignUp";
import AuthWatcher from "@/components/auth/AuthWatcher";
import ModalCardPayment from "@/components/Modals/Shop/ModalCardPayment";
import ModalCardPaymentStripeElementsWrap from "@/components/Modals/Shop/ModalCardPaymentStripeElementsWrap";
import ModalOrderSuccess from "@/components/Modals/Shop/ModalOrderSuccess";

/*const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});*/



const fontFraunces = Fraunces({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-fraunces',
});

const fontDM_Sans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-dm-sans',
});

export const metadata: Metadata = {
  title: "YourCover",
  description: "YourCover Generated Graphics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  console.log("layout.tsx");

  return (
    <html lang="en">
      <body
        className={`${fontFraunces.variable} ${fontDM_Sans.variable} antialiased`}
      >
        <StoreProvider>

          <AuthWatcher />

          {children}

          <ModalSignIn />
          <ModalSignUp />
          <ModalCardPaymentStripeElementsWrap />
          <ModalOrderSuccess />

        </StoreProvider>
      </body>
    </html>
  );
}
