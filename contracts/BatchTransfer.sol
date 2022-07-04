pragma solidity ^0.8.14;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

interface ERC721Partial {
    function transferFrom(address from, address to, uint256 tokenId) external;
}


contract BatchTransfer {
  mapping(address=> mapping(address=> bool)) private _operatorApproved;


  function batchTransfer(ERC721Partial tokenContract, address recipient, uint256[] calldata tokenIds) external {
    for (uint256 index; index < tokenIds.length; index++) {
        tokenContract.transferFrom(msg.sender, recipient, tokenIds[index]);
    }
  }
}