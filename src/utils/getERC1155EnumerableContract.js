import { ethers } from 'ethers';

export const getERC1155EnumerableContract = async (address, provider) => {
  const res = await fetch('./contracts/ERC1155Enumerable.json');
  const contractData = await res.json();

  const contract = new ethers.Contract(address, contractData.abi, provider);
  return contract;
};
