// TypeScript declaration for window.ethereum
interface EthereumProvider {
  isMetaMask?: boolean;
  request?: (...args: any[]) => Promise<any>;
  networkVersion?: string;
  selectedAddress?: string;
  on?: (...args: any[]) => void;
}

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}
export {};
