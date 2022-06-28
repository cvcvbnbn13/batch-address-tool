const keys = require('./keys.json');

const HDWalletProvider = require('@truffle/hdwallet-provider');
//
// const fs = require('fs');
// const mnemonic = fs.readFileSync(".secret").toString().trim();

module.exports = {
  networks: {
    // Useful for testing. The `development` name is special - truffle uses it by default
    // if it's defined here and no other network is specified at the command line.
    // You should run a client (like ganache, geth, or parity) in a separate terminal
    // tab if you use this network and you must also set the `host`, `port` and `network_id`
    // options below to some value.
    //
    development: {
      host: '127.0.0.1',
      port: 7545,
      network_id: '*',
    },
    rinkeby: {
      provider: () =>
        new HDWalletProvider(keys.PRIVATE_KEY, keys.INFURA_RINKEBY_URL),
      network_id: 4, // rinkeby's id
      gas: 5500000, // rinkeby has a lower block limit than mainnet
    },
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: '0.8.14',
    },
  },

  api_keys: {
    etherscan: 'DXK9A1NQ576IKV6WNM3GVKAR9R44PMKBP3',
  },
  plugins: ['truffle-plugin-verify'],
};
