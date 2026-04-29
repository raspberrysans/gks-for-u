import type { Metadata } from "next";
import "./globals.css";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "gks for u. apply to the global korea scholarship with confidence.",
    template: "%s | gks for u",
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME }],
  keywords: [
    "Global Korea Scholarship",
    "GKS",
    "GKS-U",
    "Korea scholarship",
    "study in Korea",
    "NIIED",
    "Korean government scholarship",
    "international students Korea",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "gks for u. apply to the global korea scholarship with confidence.",
    description: SITE_DESCRIPTION,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "gks for u",
    description: SITE_DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

const themeInitScript = `
(function () {
  try {
    var saved = localStorage.getItem('gks-theme');
    var theme = saved === 'light' || saved === 'dark' ? saved : 'dark';
    document.documentElement.setAttribute('data-theme', theme);
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark" className="h-full antialiased">
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
