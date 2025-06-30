import { ed25519 } from '@noble/curves/ed25519';
import { useWallet } from '@solana/wallet-adapter-react';
import React, { useState } from 'react';

export default function SignMessage() {
    const { publicKey, signMessage } = useWallet();
    const [message, setMessage] = useState('');
    const [signature, setSignature] = useState('');
    const [feedback, setFeedback] = useState('');

    const handleSignMessage = async () => {
        if (!publicKey || !signMessage) {
            setFeedback('Wallet not connected.');
            setTimeout(() => setFeedback(''), 3000);
            return;
        }
        if (!message) {
            setFeedback('Please enter a message to sign.');
            setTimeout(() => setFeedback(''), 3000);
            return;
        }
        try {
            const encodedMessage = new TextEncoder().encode(message);
            const signedMessage = await signMessage(encodedMessage);
            const isVerified = ed25519.verify(signedMessage, encodedMessage, publicKey.toBytes());

            if (isVerified) {
                setSignature(Buffer.from(signedMessage).toString('hex'));
                setFeedback('Message signed successfully!');
            } else {
                setFeedback('Signature verification failed.');
            }
        } catch (error) {
            console.error('Error signing message:', error);
            setFeedback('Error signing message. See console.');
        }
        setTimeout(() => setFeedback(''), 5000);
    };

    const [copyFeedback, setCopyFeedback] = useState('');

    const handleCopy = () => {
        navigator.clipboard.writeText(signature).then(() => {
            setCopyFeedback('Copied!');
            setTimeout(() => setCopyFeedback(''), 2000);
        });
    };

    return (
        <div className="flex flex-col gap-4 w-full items-center mt-4 pt-4 border-t border-white/10">
            <input
                type="text"
                placeholder="Enter a message to sign"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="bg-[#2A2A2A] border border-[#3A3A3A] rounded-lg p-3 text-white w-full focus:outline-none focus:ring-2 focus:ring-[#007aff] transition-all"
                disabled={!publicKey}
            />
            <button
                onClick={handleSignMessage}
                className="bg-[#007aff] hover:bg-[#005bb5] text-white font-bold py-3 px-6 rounded-lg w-full transition-all disabled:opacity-50"
                disabled={!publicKey || !message}
            >
                Sign Message
            </button>
            {feedback && <p className="text-sm text-gray-400 mt-2">{feedback}</p>}
            {signature && (
                <div className="w-full mt-2 text-left">
                    <div className="flex justify-between items-center mb-1">
                        <p className="text-sm text-gray-500">Signature:</p>
                        <button onClick={handleCopy} className="text-xs bg-[#3A3A3A] hover:bg-[#4A4A4A] text-gray-300 px-2 py-1 rounded-md">{copyFeedback || 'Copy'}</button>
                    </div>
                    <div className="bg-[#2A2A2A] p-2 rounded-lg">
                        <code className="text-xs text-green-500 break-all">{signature}</code>
                    </div>
                </div>
            )}
        </div>
    );
}
