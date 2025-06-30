import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import React, { useState } from 'react';
import { LAMPORTS_PER_SOL, SystemProgram, Transaction, PublicKey } from '@solana/web3.js';
import { useBalance } from '../context/BalanceContext';

export default function SendToken() {
    const [amount, setAmount] = useState('');
    const [toPublicKey, setToPublicKey] = useState('');
    const [isSending, setIsSending] = useState(false);

    const { connection } = useConnection();
    const wallet = useWallet();
    const { refreshBalance } = useBalance();

    const sendToken = async () => {
        if (!wallet.publicKey || !toPublicKey || !amount) return;

        let recipientPublicKey;
        try {
            recipientPublicKey = new PublicKey(toPublicKey);
        } catch (error) {
            alert('Invalid recipient address.');
            return;
        }

        setIsSending(true);
        try {
            const transaction = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: wallet.publicKey,
                    toPubkey: recipientPublicKey,
                    lamports: parseFloat(amount) * LAMPORTS_PER_SOL,
                })
            );

            const signature = await wallet.sendTransaction(transaction, connection);
            await connection.confirmTransaction(signature, 'processed');

            alert(`Successfully sent ${amount} SOL!`);
            setAmount('');
            setToPublicKey('');
            refreshBalance(); // Refresh balance after successful send
        } catch (error) {
            console.error("Transaction failed:", error);
            alert('Transaction failed. See console for details.');
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="flex flex-col gap-4 w-full items-center mt-4 pt-4 border-t border-white/10">
            <input
                type="text"
                placeholder="Recipient's Address"
                value={toPublicKey}
                onChange={e => setToPublicKey(e.target.value)}
                className="bg-[#2A2A2A] border border-[#3A3A3A] rounded-lg p-3 text-white w-full focus:outline-none focus:ring-2 focus:ring-[#5856d6] transition-all"
                disabled={!wallet.publicKey || isSending}
            />
            <input
                type="number"
                placeholder="Amount in SOL"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="bg-[#2A2A2A] border border-[#3A3A3A] rounded-lg p-3 text-white w-full focus:outline-none focus:ring-2 focus:ring-[#5856d6] transition-all"
                disabled={!wallet.publicKey || isSending}
            />
            <button
                onClick={sendToken}
                className="bg-[#5856d6] hover:bg-[#4c4ac8] text-white font-bold py-3 px-6 rounded-lg w-full transition-all disabled:opacity-50"
                disabled={!wallet.publicKey || isSending || !toPublicKey || !amount}
            >
                {isSending ? 'Sending...' : 'Send SOL'}
            </button>
        </div>
    );
}
