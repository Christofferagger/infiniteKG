import '../styles/globals.css'
import '../styles/tailwind.css';
import Head from 'next/head';

function MyApp({ Component, pageProps }) {
  return (
    <div className='bg-white-custom min-h-screen w-full'>
      <Head>
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <Component {...pageProps} />
    </div>
    )
}

export default MyApp
