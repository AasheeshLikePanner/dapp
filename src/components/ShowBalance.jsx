import React, { useEffect } from 'react';
import { useBalance } from '../context/BalanceContext';
import { useWallet } from '@solana/wallet-adapter-react';

export default function ShowBalance() {
    const { balance, refreshBalance } = useBalance();
    const { publicKey } = useWallet();

    useEffect(() => {
        if (publicKey) {
            refreshBalance();
        }
    }, [publicKey, refreshBalance]);

    return (
        <div className='text-white text-center bg-[#2A2A2A] rounded-lg p-4 w-full'>
            <p className='text-sm text-gray-400 uppercase tracking-wider'>Balance</p>
            <h1 className='text-4xl font-bold text-gray-200'>{balance.toFixed(2)} <span className='text-2xl font-light text-gray-400'>SOL</span></h1>
        </div>
    );
}
