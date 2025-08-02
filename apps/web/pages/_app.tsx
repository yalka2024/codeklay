import type { AppProps } from 'next/app';
import { AuthProvider } from '../contexts/AuthContext';
import { Web3Provider } from '../contexts/Web3Context';
import { CollaborationProvider } from '../contexts/CollaborationContext';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Web3Provider>
        <CollaborationProvider>
          <Component {...pageProps} />
        </CollaborationProvider>
      </Web3Provider>
    </AuthProvider>
  );
} 