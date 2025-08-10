import { ethers } from 'ethers';
import { BlockchainIntegration, CodeNFT, NFTMetadata } from './blockchain-integration';

// NFT Code Marketplace System
export interface MarketplaceListing {
  id: string;
  nftId: string;
  seller: string;
  price: string;
  currency: 'ETH' | 'USDC' | 'USDT' | 'DAI';
  license: string;
  royaltyPercentage: number;
  isActive: boolean;
  createdAt: Date;
  expiresAt?: Date;
  metadata?: Record<string, any>;
}

export interface CodeLicense {
  id: string;
  name: string;
  description: string;
  terms: string;
  price: string;
  duration: number; // in days
  restrictions: string[];
  permissions: string[];
  isActive: boolean;
}

export interface RoyaltyDistribution {
  id: string;
  nftId: string;
  recipient: string;
  percentage: number;
  amount: string;
  currency: string;
  timestamp: Date;
  transactionHash: string;
}

export interface MarketplaceStats {
  totalListings: number;
  totalVolume: string;
  totalSales: number;
  averagePrice: string;
  topCategories: Array<{
    category: string;
    count: number;
    volume: string;
  }>;
  recentActivity: Array<{
    type: 'sale' | 'listing' | 'bid' | 'offer';
    nftId: string;
    price: string;
    timestamp: Date;
  }>;
}

export interface Bid {
  id: string;
  nftId: string;
  bidder: string;
  amount: string;
  currency: string;
  timestamp: Date;
  isActive: boolean;
  expiresAt: Date;
}

export interface Offer {
  id: string;
  nftId: string;
  offerer: string;
  amount: string;
  currency: string;
  message?: string;
  timestamp: Date;
  isActive: boolean;
  expiresAt: Date;
}

export class NFTMarketplace {
  private blockchain: BlockchainIntegration;
  private listings: Map<string, MarketplaceListing> = new Map();
  private bids: Map<string, Bid> = new Map();
  private offers: Map<string, Offer> = new Map();
  private royalties: Map<string, RoyaltyDistribution> = new Map();

  constructor(blockchain: BlockchainIntegration) {
    this.blockchain = blockchain;
  }

  async createListing(
    nftId: string,
    price: string,
    currency: 'ETH' | 'USDC' | 'USDT' | 'DAI' = 'ETH',
    license: string = 'MIT',
    royaltyPercentage: number = 2.5,
    duration?: number // in days
  ): Promise<MarketplaceListing> {
    if (!this.blockchain.isConnected()) {
      throw new Error('Wallet not connected');
    }

    const seller = await this.blockchain.getSigner()!.getAddress();
    const expiresAt = duration ? new Date(Date.now() + duration * 24 * 60 * 60 * 1000) : undefined;

    const listing: MarketplaceListing = {
      id: `listing_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      nftId,
      seller,
      price,
      currency,
      license,
      royaltyPercentage,
      isActive: true,
      createdAt: new Date(),
      expiresAt,
      metadata: {
        gasEstimate: await this.estimateGasForListing(price, currency),
        network: (await this.blockchain.getNetworkInfo()).name
      }
    };

    this.listings.set(listing.id, listing);
    return listing;
  }

  private async estimateGasForListing(price: string, currency: string): Promise<string> {
    // Simulate gas estimation for listing
    const baseGas = 65000;
    const currencyGas = currency === 'ETH' ? 0 : 45000; // ERC20 approval
    const totalGas = baseGas + currencyGas;
    
    return totalGas.toString();
  }

  async buyNFT(
    listingId: string,
    buyerAddress: string
  ): Promise<{ success: boolean; transactionHash?: string; royaltyPaid?: string }> {
    const listing = this.listings.get(listingId);
    if (!listing || !listing.isActive) {
      throw new Error('Listing not found or inactive');
    }

    if (!this.blockchain.isConnected()) {
      throw new Error('Wallet not connected');
    }

    // Simulate purchase transaction
    const transaction = {
      hash: `0x${Math.random().toString(16).substr(2, 64)}`,
      from: buyerAddress,
      to: listing.seller,
      value: listing.price,
      currency: listing.currency,
      gasUsed: '65000',
      gasPrice: '25000000000'
    };

    // Calculate and distribute royalties
    const royaltyAmount = this.calculateRoyalty(listing.price, listing.royaltyPercentage);
    const royaltyDistribution: RoyaltyDistribution = {
      id: `royalty_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      nftId: listing.nftId,
      recipient: listing.seller,
      percentage: listing.royaltyPercentage,
      amount: royaltyAmount,
      currency: listing.currency,
      timestamp: new Date(),
      transactionHash: transaction.hash
    };

    this.royalties.set(royaltyDistribution.id, royaltyDistribution);

    // Mark listing as sold
    listing.isActive = false;

    console.log(`NFT ${listing.nftId} sold for ${listing.price} ${listing.currency}`);
    
    return {
      success: true,
      transactionHash: transaction.hash,
      royaltyPaid: royaltyAmount
    };
  }

  private calculateRoyalty(price: string, percentage: number): string {
    const priceNum = parseFloat(price);
    const royaltyAmount = (priceNum * percentage) / 100;
    return royaltyAmount.toFixed(6);
  }

  async placeBid(
    nftId: string,
    amount: string,
    currency: string = 'ETH',
    duration: number = 7 // days
  ): Promise<Bid> {
    if (!this.blockchain.isConnected()) {
      throw new Error('Wallet not connected');
    }

    const bidder = await this.blockchain.getSigner()!.getAddress();
    const expiresAt = new Date(Date.now() + duration * 24 * 60 * 60 * 1000);

    const bid: Bid = {
      id: `bid_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      nftId,
      bidder,
      amount,
      currency,
      timestamp: new Date(),
      isActive: true,
      expiresAt
    };

    this.bids.set(bid.id, bid);
    return bid;
  }

  async acceptBid(bidId: string): Promise<{ success: boolean; transactionHash?: string }> {
    const bid = this.bids.get(bidId);
    if (!bid || !bid.isActive) {
      throw new Error('Bid not found or inactive');
    }

    if (!this.blockchain.isConnected()) {
      throw new Error('Wallet not connected');
    }

    // Simulate bid acceptance transaction
    const transaction = {
      hash: `0x${Math.random().toString(16).substr(2, 64)}`,
      from: bid.bidder,
      to: await this.blockchain.getSigner()!.getAddress(),
      value: bid.amount,
      currency: bid.currency,
      gasUsed: '65000',
      gasPrice: '25000000000'
    };

    // Mark bid as accepted
    bid.isActive = false;

    console.log(`Bid ${bidId} accepted for ${bid.amount} ${bid.currency}`);
    
    return {
      success: true,
      transactionHash: transaction.hash
    };
  }

  async makeOffer(
    nftId: string,
    amount: string,
    currency: string = 'ETH',
    message?: string,
    duration: number = 3 // days
  ): Promise<Offer> {
    if (!this.blockchain.isConnected()) {
      throw new Error('Wallet not connected');
    }

    const offerer = await this.blockchain.getSigner()!.getAddress();
    const expiresAt = new Date(Date.now() + duration * 24 * 60 * 60 * 1000);

    const offer: Offer = {
      id: `offer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      nftId,
      offerer,
      amount,
      currency,
      message,
      timestamp: new Date(),
      isActive: true,
      expiresAt
    };

    this.offers.set(offer.id, offer);
    return offer;
  }

  async acceptOffer(offerId: string): Promise<{ success: boolean; transactionHash?: string }> {
    const offer = this.offers.get(offerId);
    if (!offer || !offer.isActive) {
      throw new Error('Offer not found or inactive');
    }

    if (!this.blockchain.isConnected()) {
      throw new Error('Wallet not connected');
    }

    // Simulate offer acceptance transaction
    const transaction = {
      hash: `0x${Math.random().toString(16).substr(2, 64)}`,
      from: offer.offerer,
      to: await this.blockchain.getSigner()!.getAddress(),
      value: offer.amount,
      currency: offer.currency,
      gasUsed: '65000',
      gasPrice: '25000000000'
    };

    // Mark offer as accepted
    offer.isActive = false;

    console.log(`Offer ${offerId} accepted for ${offer.amount} ${offer.currency}`);
    
    return {
      success: true,
      transactionHash: transaction.hash
    };
  }

  async getMarketplaceStats(): Promise<MarketplaceStats> {
    const listings = Array.from(this.listings.values());
    const activeListings = listings.filter(l => l.isActive);
    const totalVolume = activeListings.reduce((sum, listing) => sum + parseFloat(listing.price), 0);
    const averagePrice = activeListings.length > 0 ? (totalVolume / activeListings.length).toFixed(4) : '0';

    // Simulate category analysis
    const categories = ['Smart Contracts', 'DApps', 'Libraries', 'Tools', 'Templates'];
    const topCategories = categories.map(category => ({
      category,
      count: Math.floor(Math.random() * 50) + 1,
      volume: (Math.random() * 1000).toFixed(2)
    }));

    // Simulate recent activity
    const recentActivity = [
      {
        type: 'sale' as const,
        nftId: 'nft_123',
        price: '0.5',
        timestamp: new Date(Date.now() - 3600000)
      },
      {
        type: 'listing' as const,
        nftId: 'nft_456',
        price: '1.2',
        timestamp: new Date(Date.now() - 7200000)
      },
      {
        type: 'bid' as const,
        nftId: 'nft_789',
        price: '0.8',
        timestamp: new Date(Date.now() - 10800000)
      }
    ];

    return {
      totalListings: activeListings.length,
      totalVolume: totalVolume.toFixed(4),
      totalSales: Math.floor(Math.random() * 1000) + 100,
      averagePrice,
      topCategories,
      recentActivity
    };
  }

  async searchListings(
    query: string,
    category?: string,
    priceRange?: { min: string; max: string },
    license?: string
  ): Promise<MarketplaceListing[]> {
    const listings = Array.from(this.listings.values()).filter(l => l.isActive);

    return listings.filter(listing => {
      // Filter by query (simplified)
      if (query && !listing.nftId.includes(query)) {
        return false;
      }

      // Filter by price range
      if (priceRange) {
        const price = parseFloat(listing.price);
        if (price < parseFloat(priceRange.min) || price > parseFloat(priceRange.max)) {
          return false;
        }
      }

      // Filter by license
      if (license && listing.license !== license) {
        return false;
      }

      return true;
    });
  }

  async getListingDetails(listingId: string): Promise<MarketplaceListing | null> {
    return this.listings.get(listingId) || null;
  }

  async getBidsForNFT(nftId: string): Promise<Bid[]> {
    return Array.from(this.bids.values()).filter(bid => 
      bid.nftId === nftId && bid.isActive
    );
  }

  async getOffersForNFT(nftId: string): Promise<Offer[]> {
    return Array.from(this.offers.values()).filter(offer => 
      offer.nftId === nftId && offer.isActive
    );
  }

  async getRoyaltyHistory(nftId: string): Promise<RoyaltyDistribution[]> {
    return Array.from(this.royalties.values()).filter(royalty => 
      royalty.nftId === nftId
    );
  }

  async cancelListing(listingId: string): Promise<boolean> {
    const listing = this.listings.get(listingId);
    if (!listing) {
      return false;
    }

    listing.isActive = false;
    return true;
  }

  async cancelBid(bidId: string): Promise<boolean> {
    const bid = this.bids.get(bidId);
    if (!bid) {
      return false;
    }

    bid.isActive = false;
    return true;
  }

  async cancelOffer(offerId: string): Promise<boolean> {
    const offer = this.offers.get(offerId);
    if (!offer) {
      return false;
    }

    offer.isActive = false;
    return true;
  }

  async getAvailableLicenses(): Promise<CodeLicense[]> {
    return [
      {
        id: 'mit',
        name: 'MIT License',
        description: 'A permissive license that allows commercial use',
        terms: 'MIT License terms...',
        price: '0',
        duration: 365,
        restrictions: [],
        permissions: ['commercial_use', 'modification', 'distribution', 'private_use'],
        isActive: true
      },
      {
        id: 'gpl',
        name: 'GPL v3',
        description: 'A copyleft license that requires source code sharing',
        terms: 'GPL v3 terms...',
        price: '0',
        duration: 365,
        restrictions: ['must_share_source'],
        permissions: ['commercial_use', 'modification', 'distribution'],
        isActive: true
      },
      {
        id: 'apache',
        name: 'Apache 2.0',
        description: 'A permissive license with patent protection',
        terms: 'Apache 2.0 terms...',
        price: '0',
        duration: 365,
        restrictions: [],
        permissions: ['commercial_use', 'modification', 'distribution', 'patent_use'],
        isActive: true
      },
      {
        id: 'commercial',
        name: 'Commercial License',
        description: 'A commercial license for business use',
        terms: 'Commercial license terms...',
        price: '100',
        duration: 365,
        restrictions: ['no_resale', 'attribution_required'],
        permissions: ['commercial_use', 'modification'],
        isActive: true
      }
    ];
  }

  async validateCodeOwnership(nftId: string, userAddress: string): Promise<boolean> {
    // In a real implementation, this would check the blockchain
    // For now, we'll simulate ownership validation
    const listings = Array.from(this.listings.values());
    const userListing = listings.find(l => l.nftId === nftId && l.seller === userAddress);
    return !!userListing;
  }

  async getTransactionHistory(userAddress: string): Promise<Array<{
    type: 'purchase' | 'sale' | 'bid' | 'offer';
    nftId: string;
    amount: string;
    currency: string;
    timestamp: Date;
    transactionHash: string;
  }>> {
    // Simulate transaction history
    return [
      {
        type: 'purchase',
        nftId: 'nft_123',
        amount: '0.5',
        currency: 'ETH',
        timestamp: new Date(Date.now() - 86400000),
        transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`
      },
      {
        type: 'sale',
        nftId: 'nft_456',
        amount: '1.2',
        currency: 'ETH',
        timestamp: new Date(Date.now() - 172800000),
        transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`
      }
    ];
  }

  // Public methods for external access
  getListings(): MarketplaceListing[] {
    return Array.from(this.listings.values());
  }

  getBids(): Bid[] {
    return Array.from(this.bids.values());
  }

  getOffers(): Offer[] {
    return Array.from(this.offers.values());
  }

  getRoyalties(): RoyaltyDistribution[] {
    return Array.from(this.royalties.values());
  }

  isConnected(): boolean {
    return this.blockchain.isConnected();
  }
} 