import "./globals.css";
import BlogLayout from './BlogLayout'
import { getNavigation } from "../app/ghost-client"
import { use } from "react"
import type { Settings } from "@tryghost/content-api"

// UpdateSettings interface definition
interface UpdateSettings extends Settings {
  accent_color?: string;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}): JSX.Element {
  console.log('layout')

  // Fetch settings data
  const settings: UpdateSettings = use(getNavigation());

  console.log('settings', settings);

  return (
    <html className='light' lang="en">
      <body className={`bg-[--bg-color] dark:bg-gray-900`}>
        <BlogLayout setting={settings}>
          {children}
        </BlogLayout>
      </body>
    </html>
  );
}
