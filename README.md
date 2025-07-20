# NFT Mint Dashboard

A simple dashboard to mint NFTs with image upload, using Lighthouse.storage for decentralized storage and a custom ERC721 smart contract.

---

## Features

- Connect MetaMask wallet
- Upload an image and mint it as an NFT
- Stores image and metadata on Lighthouse (IPFS/Filecoin)
- Mints NFT with metadata URI on your deployed contract

---

## Prerequisites

- Node.js (v16+ recommended)
- MetaMask extension in your browser
- Lighthouse account and API key ([get one here](https://files.lighthouse.storage/login))
- (Optional) Hardhat for local contract deployment

---

## Getting Started

### 1. Clone the repository

```sh
git clone <git@github.com:Kris1027/nft-mint-dashboard.git>
cd nft-mint-dashboard
```

### 2. Install dependencies

```sh
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourDeployedContractAddress
NEXT_PUBLIC_LIGHTHOUSE_API_KEY=your_lighthouse_api_key
```

- Replace `0xYourDeployedContractAddress` with your deployed contract address (see below).
- Replace `your_lighthouse_api_key` with your Lighthouse API key.

#### Environment Variable Validation

This project includes automatic environment variable validation to ensure all required variables are properly configured:

- **Contract Address**: Must be a valid Ethereum address (42 characters starting with 0x)
- **Lighthouse API Key**: Must be at least 10 characters long

### 4. Deploy the Smart Contract (Local/Testnet)

If you want to deploy your own contract:

```sh
cd smart-contracts
npx hardhat compile
npx hardhat run scripts/deploy.ts --network localhost
```

- The deployed contract address will be printed in the terminal. Copy it to your `.env.local`.

### 5. Update the ABI

After deploying or changing the contract, copy the ABI to the frontend:

```sh
cp smart-contracts/artifacts/contracts/MyNFT.sol/MyNFT.json abi/MyNFT.json
```

### 6. Run the App

```sh
npm run dev
```

- Open [http://localhost:3000](http://localhost:3000) in your browser.

If you encounter environment validation errors, the app will display a helpful error page with instructions on how to fix the configuration.

---

## Usage

1. Connect your MetaMask wallet.
2. Upload an image, enter a name and (optional) description.
3. Click "Mint NFT".
4. Wait for the transaction to confirm. Your NFT is minted with metadata stored on Lighthouse!

---

## Notes

- Only the admin (deployer) can mint by default (see contract logic).
- Make sure your wallet is on the same network as your contract.
- For production, deploy the contract to a public testnet or mainnet and update the contract address.

---

## Troubleshooting

### Environment Variable Issues

- **Missing API key or contract address:** Check your `.env.local` file and run `npm run validate-env` to verify.
- **Invalid contract address:** Ensure the address is exactly 42 characters and starts with `0x`.
- **Invalid Lighthouse API key:** Verify your API key from the Lighthouse dashboard.

### Other Issues

- **ABI errors:** Make sure you copied the latest ABI after contract changes.
- **Lighthouse upload errors:** Ensure your API key is valid and you have enough storage quota.
- **Environment validation errors:** The app will show a detailed error page with instructions if environment variables are missing or invalid.

### Available Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server

---

## License

MIT
