"use client";
import Footer from "./Footer";
import Header from "./Header";
import { ThemeProvider } from 'next-themes';
import type { SettingsResponse } from "@tryghost/content-api";

function BlogLayout({ setting, children }: { setting: SettingsResponse, children: React.ReactNode }) {
  console.log('blog layout', setting)

  return (
    <ThemeProvider attribute="class">
      <Header setting={setting} />
      {children}
      <Footer setting={setting} />
    </ThemeProvider>
  );
}

export default BlogLayout
