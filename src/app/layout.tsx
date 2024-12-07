import type { Metadata } from "next";

import "./globals.css";
import { AuthProvider } from "@/components/authProvider";
import {Toaster} from '@/components/ui/toaster'


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      
      <AuthProvider>
      <body>
        {children}
        <Toaster/>
      </body>
      </AuthProvider>
    </html>
  );
}
