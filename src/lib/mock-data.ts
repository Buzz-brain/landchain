import { User, Land, Transaction, Report } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    email: 'john.landowner@example.com',
    role: 'landowner',
    name: 'John Smith',
    walletAddress: '0x742D35CC6131B3C0E5E2F2E3F8A9B2C4F5D6E7F8',
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    email: 'sarah.buyer@example.com',
    role: 'buyer',
    name: 'Sarah Johnson',
    walletAddress: '0x123A45B6C7D8E9F0A1B2C3D4E5F6G7H8I9J0K1L2',
    createdAt: '2024-01-20T14:30:00Z',
  },
  {
    id: '3',
    email: 'admin@landregistry.gov',
    role: 'administrator',
    name: 'Michael Admin',
    createdAt: '2024-01-10T09:00:00Z',
  },
  {
    id: '4',
    email: 'agent@landregistry.gov',
    role: 'government-agent',
    name: 'Emma Wilson',
    createdAt: '2024-01-12T11:15:00Z',
  },
];

export const mockLands: Land[] = [
  {
    id: '1',
    parcelId: 'LND-2024-001',
    title: 'Oakwood Estate Plot A',
    location: {
      address: '123 Oak Street, Springfield, IL 62701',
      coordinates: { lat: 39.7817, lng: -89.6501 },
    },
    size: 2.5,
    sizeUnit: 'acres',
    currentOwner: '1',
    previousOwners: [],
    registrationDate: '2024-01-15T10:00:00Z',
    documents: [
      {
        id: 'd1',
        name: 'Property Deed',
        type: 'deed',
        url: '/docs/deed-001.pdf',
        ipfsHash: 'QmYjtig7VJQ6XsnUjqqJvj7QaMcCAwtrgNdahSiFofrE7o',
        uploadedAt: '2024-01-15T10:00:00Z',
      },
    ],
    status: 'registered',
    blockchainHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    price: 125000,
    isForSale: false,
  },
  {
    id: '2',
    parcelId: 'LND-2024-002',
    title: 'Riverside Commercial Plot',
    location: {
      address: '456 River Avenue, Springfield, IL 62702',
      coordinates: { lat: 39.7901, lng: -89.6440 },
    },
    size: 1.8,
    sizeUnit: 'acres',
    currentOwner: '1',
    previousOwners: [],
    registrationDate: '2024-01-20T14:30:00Z',
    documents: [
      {
        id: 'd2',
        name: 'Commercial Property Deed',
        type: 'deed',
        url: '/docs/deed-002.pdf',
        ipfsHash: 'QmPjtig7VJQ6XsnUjqqJvj7QaMcCAwtrgNdahSiFofrE8p',
        uploadedAt: '2024-01-20T14:30:00Z',
      },
    ],
    status: 'registered',
    blockchainHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
    price: 250000,
    isForSale: true,
  },
];

export const mockTransactions: Transaction[] = [
  {
    id: 't1',
    type: 'registration',
    landId: '1',
    toAddress: '0x742D35CC6131B3C0E5E2F2E3F8A9B2C4F5D6E7F8',
    status: 'completed',
    timestamp: '2024-01-15T10:00:00Z',
    blockchainHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    gasUsed: 21000,
  },
  {
    id: 't2',
    type: 'registration',
    landId: '2',
    toAddress: '0x742D35CC6131B3C0E5E2F2E3F8A9B2C4F5D6E7F8',
    status: 'completed',
    timestamp: '2024-01-20T14:30:00Z',
    blockchainHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
    gasUsed: 22500,
  },
];

export const mockReports: Report[] = [
  {
    id: 'r1',
    type: 'ownership-distribution',
    title: 'Land Ownership Distribution Report',
    data: {
      totalLands: 150,
      bySize: { small: 45, medium: 78, large: 27 },
      byLocation: { urban: 89, suburban: 34, rural: 27 },
    },
    generatedAt: '2024-01-25T09:00:00Z',
    generatedBy: '3',
  },
];