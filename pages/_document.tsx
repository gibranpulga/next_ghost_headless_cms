import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html className="light" lang="en">
      <Head>
        {/* Google Analytics Script */}
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

        {/* Facebook Pixel Code */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '975476734235708');
              fbq('track', 'PageView');
            `,
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=975476734235708&ev=PageView&noscript=1"
          />
        </noscript>
      </Head>
      <body className="bg-[--bg-color] dark:bg-gray-900">
        <Main />
        <NextScript />
        {/* Adsterra Script */}
        <script
          async="async"
          data-cfasync="false"
          src="//pl23399282.highcpmgate.com/643b3c63fd89ef6f1128ebc2de3df8cf/invoke.js"
        ></script>
        <div id="container-643b3c63fd89ef6f1128ebc2de3df8cf"></div>
      </body>
    </Html>
  );
}
