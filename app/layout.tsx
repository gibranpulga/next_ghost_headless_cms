import "./globals.css";
import BlogLayout from './BlogLayout';
import type { PostsOrPages, SettingsResponse } from "@tryghost/content-api";

interface RootLayoutProps {
  children: React.ReactNode;
  settings: SettingsResponse;
  pages: PostsOrPages;
}

export default function RootLayout({ children, settings, pages }: RootLayoutProps): JSX.Element {

  return (
    <BlogLayout setting={settings} pages={pages}>
      {children}
    </BlogLayout>
  );
}
