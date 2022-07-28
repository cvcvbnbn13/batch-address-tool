import { ethers } from 'ethers';

export const getERC1155Contract = async (address, provider) => {
  const res = await fetch('./contracts/SolidStateERC1155.json');
  const contractData = await res.json();

  const contract = new ethers.Contract(address, contractData.abi, provider);
  return contract;
};
