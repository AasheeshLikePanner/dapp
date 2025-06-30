import React, { useState } from 'react'
import { useWallet, useConnection } from '@solana/wallet-adapter-react'
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useBalance } from '../context/BalanceContext';

export default function RequestAirdrop() {
    const [amount, setAmount] = useState(0);
    const [loading, setLoading] = useState(false);

    const wallet = useWallet();
    const { connection } = useConnection();
    const { refreshBalance } = useBalance();

    const handleAirdrop = async () => {
        if (!wallet.publicKey) {
            console.log("Wallet not connected.");
            return;
        }
        setLoading(true);
        try {
            const publicKey = wallet.publicKey;
            const signature = await connection.requestAirdrop(publicKey, amount * LAMPORTS_PER_SOL);
            await connection.confirmTransaction(signature, 'confirmed');
            console.log('Airdrop requested. Transaction signature:', signature);
            alert('Airdrop successful!');
            // refreshBalance(); 
        } catch (error) {
            console.error("Airdrop failed:", error);
            alert(`Airdrop failed: ${error.message}`);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='flex flex-col gap-4 w-full items-center'>
            <input 
                type="number" 
                placeholder='Amount in SOL' 
                onChange={e => setAmount(parseFloat(e.target.value))} 
                className='bg-[#2A2A2A] border border-[#3A3A3A] rounded-lg p-3 text-white w-full focus:outline-none focus:ring-2 focus:ring-[#5856d6] transition-all'
                disabled={loading}
            />
            <button 
                onClick={handleAirdrop} 
                className='bg-[#5856d6] hover:bg-[#4c4ac8] text-white font-bold py-3 px-6 rounded-lg w-full transition-all disabled:opacity-50'
                disabled={!wallet.publicKey || loading}
            >
                {loading ? 'Requesting...' : 'Request Airdrop'}
            </button>
            {wallet.publicKey && 
                <p className='text-xs text-gray-500 mt-2'>Connected: {wallet.publicKey?.toBase58()}</p>
            }
        </div>
    )
}