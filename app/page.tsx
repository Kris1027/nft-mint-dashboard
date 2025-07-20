'use client';

import { ethers } from 'ethers';
import abiJson from '../abi/MyNFT.json';
import { useState } from 'react';
import lighthouse from '@lighthouse-web3/sdk';
import { env } from '../lib/env';

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
    } catch (error) {
      setStatus('Error minting NFT');
      console.error('Error minting NFT:', error);
    }
    setMinting(false);
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen p-8'>
      <h1 className='text-3xl font-bold mb-6'>Mint NFT Dashboard</h1>
      {!account ? (
        <button onClick={connectWallet} className='mb-6 px-6 py-2 bg-blue-600 text-white rounded'>
          Connect MetaMask
        </button>
      ) : (
        <div className='mb-4'>Connected: {account}</div>
      )}
      <input
        type='file'
        accept='image/*'
        onChange={handleImageChange}
        className='mb-4'
        disabled={minting}
      />
      <input
        type='text'
        placeholder='NFT Name'
        value={nftName}
        onChange={(e) => setNftName(e.target.value)}
        className='mb-2 px-2 py-1 border rounded w-64'
        disabled={minting}
      />
      <input
        type='text'
        placeholder='NFT Description (optional)'
        value={nftDesc}
        onChange={(e) => setNftDesc(e.target.value)}
        className='mb-4 px-2 py-1 border rounded w-64'
        disabled={minting}
      />
      <button
        onClick={mintNFT}
        disabled={!account || minting}
        className={`px-6 py-2 bg-green-600 text-white rounded ${minting ? 'opacity-50' : ''}`}
      >
        {minting ? 'Minting...' : 'Mint NFT'}
      </button>
      <div className='mt-4 text-gray-600'>{status}</div>
    </div>
  );
};

export default HomePage;
