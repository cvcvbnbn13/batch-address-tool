import { ethers } from 'ethers';

export const getERC721Contract = async (address, provider) => {
  const res = await fetch('./contracts/ERC721Enumerable.json');
  const contractData = await res.json();

  const contract = new ethers.Contract(address, contractData.abi, provider);
  return contract;
};
