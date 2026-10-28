import type { Metadata, Viewport } from "next";
import { Atkinson_Hyperlegible_Next, Literata } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

// Literata nos títulos (cara de livro), Atkinson Hyperlegible no texto (feita para leitura fácil).
const literata = Literata({
  variable: "--font-literata",
  subsets: ["latin"],
});

const text = Atkinson_Hyperlegible_Next({
  variable: "--font-text",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: "LessonList",
  description: "Organize o homeschool da sua família: cronograma, livros, matérias e histórico escolar.",
};

export const viewport: Viewport = {
  themeColor: "#2c5a46",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${literata.variable} ${text.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
