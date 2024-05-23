"use client";
import Footer from "../app/Footer";
import Header from "../app/Header";
import { ThemeProvider } from 'next-themes';
import type { Settings } from "@tryghost/content-api";

function BlogLayout({ setting, children }: { setting: Settings, children: React.ReactNode }) {
  console.log('blog layout', setting)

  return (
    <ThemeProvider attribute="class">
      <Header setting={setting} />
      {children}
      <Footer setting={setting} />
    </ThemeProvider>
  );
}

export default BlogLayout;
