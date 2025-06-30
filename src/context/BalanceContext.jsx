import React, { createContext, useContext, useState, useCallback } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

export const BalanceContext = createContext(null);

export const BalanceProvider = ({ children }) => {
    const [balance, setBalance] = useState(0);
    const { connection } = useConnection();
    const { publicKey } = useWallet();

    const refreshBalance = useCallback(async () => {
        if (!publicKey) {
            setBalance(0);
            return;
        }
        try {
            const bal = await connection.getBalance(publicKey);
            setBalance(bal / LAMPORTS_PER_SOL);
        } catch (error) {
            console.error("Error fetching balance:", error);
            setBalance(0);
        }
    }, [publicKey, connection]);

    return (
        <BalanceContext.Provider value={{ balance, refreshBalance }}>
            {children}
        </BalanceContext.Provider>
    );
};

export const useBalance = () => {
    const context = useContext(BalanceContext);
    if (!context) {
        throw new Error('useBalance must be used within a BalanceProvider');
    }
    return context;
};