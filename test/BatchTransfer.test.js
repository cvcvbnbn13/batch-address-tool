const BatchTransfer = artifacts.require('BatchTransfer');
const { ethers } = require('ethers');

contract('BatchTransfer', accounts => {
  let _contract = null;

  before(async () => {
    _contract = await BatchTransfer.deployed();
  });

  describe('BatchTransfer get approve', () => {
    const toolAddress = '0x5465f902f1F45640b85d82C343357301E16Cc031';

    before(async () => {
      await _contract.setApproveForAll(toolAddress, true);
    });
    it('set approve to batchTransfer tool', async () => {
      const isApproved = await _contract.isApprovedForAll(toolAddress);
      assert.equal(isApproved, true, "the address didn't get the approve");
    });
  });
});
