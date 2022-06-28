pragma solidity ^0.8.14;

interface ERC721Partial {
    function transferFrom(address from, address to, uint256 tokenId) external;
}


contract BatchTransfer{
  address public owner = msg.sender;
  mapping(address=> mapping(address=> bool)) private _operatorApproved;

  modifier onlyOwner() {
    require(
      msg.sender == owner,
      "This function is restricted to the contract's owner"
    );
    _;
  }

  function batchTransfer(ERC721Partial tokenContract, address recipient, uint256[] calldata tokenIds) external {
      for (uint256 index; index < tokenIds.length; index++) {
          tokenContract.transferFrom(owner, recipient, tokenIds[index]);
      }
  }

  function setApproveForAll(address operator, bool approve) external {
    require(owner != operator);
    _operatorApproved[owner][operator] = approve;
  }

  function isApprovedForAll(address operator) external view returns(bool) {
    return _operatorApproved[owner][operator];
  }
}