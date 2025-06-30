import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import React, { FC, useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { UnsafeBurnerWalletAdapter } from '@solana/wallet-adapter-wallets';
import {
  WalletModalProvider,
  WalletDisconnectButton,
  WalletMultiButton,
  WalletConnectButton
} from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';

// Default styles that can be overridden by your app
import '@solana/wallet-adapter-react-ui/styles.css';
import RequestAirdrop from './components/RequestAirdrop';
import ShowBalance from './components/ShowBalance';
import SendToken from './components/SendToken';
import SignMessage from './components/SignMessage';


import { BalanceProvider } from './context/BalanceContext';

const AppContent = () => {
  return (
    <div className="app-container">
      <div className="wallet-container">
        <div className='flex justify-end w-full'>
          <WalletMultiButton />
        </div>
        <RequestAirdrop />
        <ShowBalance />
        <SendToken />
        <SignMessage />
      </div>
    </div>
  );
}

function App() {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const wallets = useMemo(() => [new UnsafeBurnerWalletAdapter()], [network]);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <BalanceProvider>
            <AppContent />
          </BalanceProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App
