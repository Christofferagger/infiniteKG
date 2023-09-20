import '../styles/globals.css'
import '../styles/tailwind.css';

function MyApp({ Component, pageProps }) {
  return (
    <div className='bg-white-custom min-h-screen w-full'>
      <Component {...pageProps} />
    </div>
    )
}

export default MyApp
