import type { Metadata } from "next";
import { Inter, Fraunces, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from '@/components/layout/SmoothScroll';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import IntroAnimation from '@/components/layout/IntroAnimation';
import { ThemeProvider } from '@/components/ThemeProvider';
import BookingModal from '@/components/ui/BookingModal';
import { Toaster } from 'sonner';

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-sans",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-mono",
});

const fraunces = Fraunces({ 
  subsets: ["latin"],
  variable: "--font-serif",
  axes: ["opsz", "SOFT", "WONK"],
});

export const metadata: Metadata = {
  title: "Mr & Mrs Optical | Premium Eyewear",
  description: "Medical precision meets modern luxury.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable} ${ibmPlexMono.variable}`} suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen flex flex-col antialiased text-foreground bg-background`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <SmoothScroll>
            <IntroAnimation />
            <Navbar />
            <main className="min-h-screen">
              {children}
            </main>
            <Footer />
            <BookingModal />
            <Toaster position="bottom-center" />
          </SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  );
}
