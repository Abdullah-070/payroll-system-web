import '../styles/globals.css';
import Footer from '../components/Footer';

export default function App({ Component, pageProps }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <main style={{ flex: 1, paddingBottom: '80px' }}>
        <Component {...pageProps} />
      </main>
      <Footer />
    </div>
  );
}
