const BatchTransfer = artifacts.require('BatchTransfer');
const { ethers } = require('ethers');

contract('BatchTransfer', accounts => {
  let _contract = null;

  before(async () => {
    _contract = await BatchTransfer.deployed();
  });

  describe('BatchTransfer get approve', () => {
    const toolAddress = '0x17Ea691707e6AC3E1e0d9F0C5D3323416118Afe5';

    before(async () => {
      await _contract.setApproveForAll(toolAddress, true);
    });
    it('set approve to batchTransfer tool', async () => {
      const isApproved = await _contract.isApprovedForAll(toolAddress);
      assert.equal(isApproved, true, "the address didn't get the approve");
    });
  });
});
