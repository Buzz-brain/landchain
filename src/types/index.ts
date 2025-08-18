export interface User {
  id: string;
  email: string;
  role: 'landowner' | 'buyer' | 'administrator' | 'government-agent';
  name: string;
  walletAddress?: string;
  createdAt: string;
}

export interface Land {
  id: string;
  parcelId: string;
  title: string;
  location: {
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  size: number;
  sizeUnit: 'acres' | 'hectares' | 'sqft';
  currentOwner: string;
  previousOwners: string[];
  registrationDate: string;
  documents: Document[];
  status: 'registered' | 'pending' | 'transferred' | 'disputed';
  blockchainHash?: string;
  price?: number;
  isForSale: boolean;
}

export interface Document {
  id: string;
  name: string;
  type: 'deed' | 'survey' | 'certificate' | 'other';
  url: string;
  ipfsHash?: string;
  uploadedAt: string;
}

export interface Transaction {
  id: string;
  type: 'registration' | 'transfer' | 'verification';
  landId: string;
  fromAddress?: string;
  toAddress: string;
  amount?: number;
  status: 'pending' | 'completed' | 'failed';
  timestamp: string;
  blockchainHash?: string;
  gasUsed?: number;
}

export interface Report {
  id: string;
  type: 'ownership-distribution' | 'transaction-volume' | 'fraud-alerts';
  title: string;
  data: any;
  generatedAt: string;
  generatedBy: string;
}