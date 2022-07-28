import { ethers } from 'ethers';

export const getERC721Contract = async (address, provider) => {
  const res = await fetch('./contracts/SolidStateERC721.json');
  const contractData = await res.json();

  const contract = new ethers.Contract(address, contractData.abi, provider);
  return contract;
};
