import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html className="light" lang="en">
      <Head>
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-8MGDX8XKCN"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-8MGDX8XKCN');
            `,
          }}
        />
      </Head>
      <body className="bg-[--bg-color] dark:bg-gray-900">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
