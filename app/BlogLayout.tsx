"use client";
import Footer from "./Footer";
import Header from "./Header";
import { ThemeProvider } from 'next-themes';
import type { PostsOrPages, SettingsResponse } from "@tryghost/content-api";

function BlogLayout({ setting, children, pages }: { setting: SettingsResponse, children: React.ReactNode, pages: PostsOrPages }) {
  console.log("pages", pages);
  console.log("setting", setting);

  return (
    <ThemeProvider attribute="class">
      <Header settings={setting} />
      {children}
      <Footer settings={setting} pages={pages}/>
    </ThemeProvider>
  );
}

export default BlogLayout
