pragma solidity ^0.8.14;

import "@solidstate/contracts/token/ERC721/SolidStateERC721.sol";
import "@solidstate/contracts/token/ERC1155/SolidStateERC1155.sol";

interface ERC721Partial {
    function transferFrom(address from, address to, uint256 tokenId) external;
}

interface ERC1155Partial {
    function safeBatchTransferFrom(address from, address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data ) external;
}


contract BatchTransfer {

  function batchTransfer721(ERC721Partial tokenContract, address[] calldata recipient, uint256[] calldata tokenIds) external {
      for (uint256 index; index < tokenIds.length; index++) {
          tokenContract.transferFrom(msg.sender, recipient[index], tokenIds[index]);
      }
  }

  function batchTransfer1155(ERC1155Partial tokenContract, address[] memory recipient, uint256[][] memory tokenIds, uint256[][] memory amounts) external {
        require(recipient.length == tokenIds.length, 'length is different');

        require(amounts.length == tokenIds.length, 'length is different');

        for(uint256 i= 0; i< recipient.length; i++){
            uint256[] memory tokenid_arr = tokenIds[i];
            uint256[] memory amount_arr = amounts[i];

            require(tokenid_arr.length == amount_arr.length, 'length is different');
            
            tokenContract.safeBatchTransferFrom(msg.sender, recipient[i], tokenid_arr, amount_arr,"");
        }
    }
}