import { ethers } from 'hardhat';

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log('Deploying contracts with account:', deployer.address);

  const MyNFT = await ethers.getContractFactory('MyNFT');
  const myNFT = await MyNFT.deploy();

  // ethers v6: wait for deployment
  await myNFT.waitForDeployment();

  // ethers v6: get address from .target
  const contractAddress: string = myNFT.target as string;
  console.log('MyNFT deployed to:', contractAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
