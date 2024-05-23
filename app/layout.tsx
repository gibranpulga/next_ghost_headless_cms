import "./globals.css";
import BlogLayout from './BlogLayout';
import type { SettingsResponse } from "@tryghost/content-api";

interface RootLayoutProps {
  children: React.ReactNode;
  settings: SettingsResponse;
}

export default function RootLayout({ children, settings }: RootLayoutProps): JSX.Element {
  return (
    <BlogLayout setting={settings}>
      {children}
    </BlogLayout>
  );
}
