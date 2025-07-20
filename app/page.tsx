'use client';

import { ethers } from 'ethers';
import abiJson from '../abi/MyNFT.json';
import { useState } from 'react';
import lighthouse from '@lighthouse-web3/sdk';
import { env } from '../lib/env';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircleIcon, ExclamationTriangleIcon, CloudArrowUpIcon, WalletIcon } from '@heroicons/react/24/outline';

const CONTRACT_ADDRESS = env.NEXT_PUBLIC_CONTRACT_ADDRESS;
const LIGHTHOUSE_API_KEY = env.NEXT_PUBLIC_LIGHTHOUSE_API_KEY;

const HomePage = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('');
  const [minting, setMinting] = useState<boolean>(false);
  const [image, setImage] = useState<File | null>(null);
  const [nftName, setNftName] = useState('');
  const [nftDesc, setNftDesc] = useState('');

  const connectWallet = async () => {
    if (!window.ethereum) {
      setStatus('MetaMask is not installed');
      return;
    }
    try {
      const accounts = (await window.ethereum.request({ method: 'eth_requestAccounts' })) as
        | string[]
        | undefined;
      if (Array.isArray(accounts) && accounts.length > 0) {
        setAccount(accounts[0]);
        setStatus('Wallet connected');
      } else {
        setStatus('No accounts found');
      }
    } catch (error) {
      setStatus('Could not connect to wallet');
      console.error('Error connecting to wallet:', error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const mintNFT = async () => {
    if (!window.ethereum || !account) {
      setStatus('Please connect your wallet first');
      return;
    }
    if (!image) {
      setStatus('Please select an image');
      return;
    }
    if (!nftName) {
      setStatus('Please enter a name for your NFT');
      return;
    }
    setMinting(true);
    setStatus('Uploading image to Lighthouse...');
    try {
      const imageBuffer = await image.arrayBuffer();
      const imageFile = new File([imageBuffer], image.name, { type: image.type });
      const imageUploadRes = await lighthouse.upload([imageFile], LIGHTHOUSE_API_KEY);
      const imageCid = imageUploadRes.data.Hash;
      const imageUrl = `https://gateway.lighthouse.storage/ipfs/${imageCid}`;

      const metadata = {
        name: nftName,
        description: nftDesc,
        image: imageUrl,
      };
      const metadataBlob = new Blob([JSON.stringify(metadata)], { type: 'application/json' });
      const metadataFile = new File([metadataBlob], 'metadata.json');

      setStatus('Uploading metadata to Lighthouse...');
      const metadataUploadRes = await lighthouse.upload([metadataFile], LIGHTHOUSE_API_KEY);
      const metadataCid = metadataUploadRes.data.Hash;
      const metadataUrl = `https://gateway.lighthouse.storage/ipfs/${metadataCid}`;

      setStatus('Minting NFT on blockchain...');
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const abi = abiJson.abi;
      const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);
      const tx = await contract.mint(account, metadataUrl);
      setStatus('Transaction sent, waiting for confirmation...');
      await tx.wait();
      setStatus('NFT minted successfully!');
      
      // Reset form after successful mint
      setImage(null);
      setNftName('');
      setNftDesc('');
      
      // Clear file input
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
    } catch (error) {
      setStatus('Error minting NFT');
      console.error('Error minting NFT:', error);
    }
    setMinting(false);
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900'>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-100/20 to-transparent dark:via-indigo-900/20"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.1),transparent_50%)]"></div>
      </div>
      
      <div className='relative flex flex-col items-center justify-center min-h-screen p-8'>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className='text-center mb-12'
        >
          <h1 className='text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4'>
            NFT Mint Dashboard
          </h1>
          <p className='text-gray-600 dark:text-gray-300 text-lg'>
            Create and mint your unique NFTs with decentralized storage
          </p>
        </motion.div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className='bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8 w-full max-w-md'
        >
          {/* Wallet Connection */}
          <AnimatePresence mode="wait">
            {!account ? (
              <motion.div
                key="connect"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className='mb-8'
              >
                <motion.button
                  onClick={connectWallet}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className='w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300'
                >
                  <WalletIcon className="w-5 h-5" />
                  Connect MetaMask
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key="connected"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className='mb-8 p-4 bg-green-50 dark:bg-green-900/20 rounded-2xl border border-green-200 dark:border-green-800'
              >
                <div className='flex items-center gap-3'>
                  <CheckCircleIcon className="w-5 h-5 text-green-600" />
                  <div>
                    <p className='text-sm font-medium text-green-800 dark:text-green-200'>Wallet Connected</p>
                    <p className='text-xs text-green-600 dark:text-green-400 font-mono'>
                      {account.slice(0, 6)}...{account.slice(-4)}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form Fields */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className='space-y-6'
          >
            {/* Image Upload */}
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                Upload Image
              </label>
              <motion.div
                whileHover={{ scale: 1.01 }}
                className='relative'
              >
                <input
                  type='file'
                  accept='image/*'
                  onChange={handleImageChange}
                  disabled={minting}
                  className='w-full px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition-all duration-300'
                />
                {image && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className='mt-2 text-sm text-green-600 dark:text-green-400 flex items-center gap-1'
                  >
                    <CheckCircleIcon className="w-4 h-4" />
                    {image.name}
                  </motion.div>
                )}
              </motion.div>
            </div>

            {/* NFT Name */}
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                NFT Name
              </label>
              <motion.input
                whileFocus={{ scale: 1.01 }}
                type='text'
                placeholder='Enter NFT name'
                value={nftName}
                onChange={(e) => setNftName(e.target.value)}
                disabled={minting}
                className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-2xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300'
              />
            </div>

            {/* NFT Description */}
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                Description (Optional)
              </label>
              <motion.textarea
                whileFocus={{ scale: 1.01 }}
                placeholder='Enter NFT description'
                value={nftDesc}
                onChange={(e) => setNftDesc(e.target.value)}
                disabled={minting}
                rows={3}
                className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-2xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 resize-none'
              />
            </div>

            {/* Mint Button */}
            <motion.button
              onClick={mintNFT}
              disabled={!account || minting || !image || !nftName}
              whileHover={!minting && account && image && nftName ? { scale: 1.02 } : {}}
              whileTap={!minting && account && image && nftName ? { scale: 0.98 } : {}}
              className={`w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl font-semibold shadow-lg transition-all duration-300 ${
                !account || minting || !image || !nftName
                  ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:shadow-xl'
              }`}
            >
              {minting ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                  Minting...
                </>
              ) : (
                <>
                  <CloudArrowUpIcon className="w-5 h-5" />
                  Mint NFT
                </>
              )}
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Status Message */}
        <AnimatePresence>
          {status && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              transition={{ duration: 0.4 }}
              className={`mt-6 p-4 rounded-2xl max-w-md w-full text-center ${
                status.includes('Error') || status.includes('Could not')
                  ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
                  : status.includes('successfully')
                  ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800'
                  : 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
              }`}
            >
              <div className='flex items-center justify-center gap-2'>
                {status.includes('Error') || status.includes('Could not') ? (
                  <ExclamationTriangleIcon className="w-5 h-5" />
                ) : status.includes('successfully') ? (
                  <CheckCircleIcon className="w-5 h-5" />
                ) : (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
                  />
                )}
                <span className='font-medium'>{status}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default HomePage;