// src/lib/web3.js

import Web3 from 'web3';
import LandRegistryV2 from '../../../blockchain/build/contracts/LandRegistryV2.json';


export const getWeb3 = () => {
  if (window.ethereum) {
    return new Web3(window.ethereum);
  }
  throw new Error('MetaMask is not installed');
};

export const getLandRegistryContract = (web3) => {
  const networks = LandRegistryV2.networks;
  let address;
  if (window.ethereum && window.ethereum.networkVersion && networks[window.ethereum.networkVersion]) {
    address = networks[window.ethereum.networkVersion].address;
  } else {
    const networkId = Object.keys(networks)[0] || '5777';
    address = networks[networkId]?.address;
  }
  if (!address) throw new Error('Contract not deployed on this network');
  return new web3.eth.Contract(LandRegistryV2.abi, address);
};
