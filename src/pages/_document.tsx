import { Html, Head, Main, NextScript } from 'next/document'
import * as React from 'react';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="shortcut icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
        <meta name="emotion-insertion-point" content="" />
      </Head>
      <body>
      <Main />
      <NextScript />
      </body>
    </Html>
  )
}