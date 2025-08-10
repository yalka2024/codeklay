import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { BlockchainIntegration, defaultBlockchainConfig } from '@/lib/blockchain-integration';
import { NFTMarketplace } from '@/lib/nft-marketplace';
import { EnterpriseSecurityService, defaultEnterpriseSecurityConfig } from '@/lib/enterprise-security';

// Initialize blockchain services
const blockchain = new BlockchainIntegration(defaultBlockchainConfig);
const marketplace = new NFTMarketplace(blockchain);
const securityService = new EnterpriseSecurityService(defaultEnterpriseSecurityConfig);

type SessionUser = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  id?: string;
  role?: string;
  subscription_tier?: string;
};

export async function POST(req: NextRequest) {
  try {
    const { action, data } = await req.json();
    
    // Get user session for security audit
    const session = await getServerSession(authOptions);
    const user = session?.user as SessionUser;
    
    // Log blockchain operation for security audit
    if (user?.id) {
      await securityService.getAudit().logEvent({
        userId: user.id,
        action: 'blockchain_operation',
        resource: 'blockchain-api',
        ip: req.headers.get('x-forwarded-for') || req.ip || 'unknown',
        userAgent: req.headers.get('user-agent') || 'unknown',
        metadata: { action, hasData: !!data },
        severity: 'medium'
      });
    }

    let response: any;

    switch (action) {
      case 'connect_wallet':
        const connection = await blockchain.connectWallet();
        response = {
          success: true,
          connection,
          message: 'Wallet connected successfully'
        };
        break;

      case 'deploy_contract':
        const { name, sourceCode, constructorArgs } = data;
        const contract = await blockchain.deploySmartContract(name, sourceCode, constructorArgs);
        response = {
          success: true,
          contract,
          message: 'Smart contract deployed successfully'
        };
        break;

      case 'verify_contract':
        const { contractAddress, sourceCode: verifySourceCode } = data;
        const verified = await blockchain.verifyContract(contractAddress, verifySourceCode);
        response = {
          success: true,
          verified,
          message: verified ? 'Contract verified successfully' : 'Contract verification failed'
        };
        break;

      case 'create_nft':
        const { codeHash, metadata, license } = data;
        const nft = await blockchain.createCodeNFT(codeHash, metadata, license);
        response = {
          success: true,
          nft,
          message: 'Code NFT created successfully'
        };
        break;

      case 'list_nft':
        const { nftId, price, currency, license: listingLicense, royaltyPercentage, duration } = data;
        const listing = await marketplace.createListing(nftId, price, currency, listingLicense, royaltyPercentage, duration);
        response = {
          success: true,
          listing,
          message: 'NFT listed for sale successfully'
        };
        break;

      case 'buy_nft':
        const { listingId, buyerAddress } = data;
        const purchase = await marketplace.buyNFT(listingId, buyerAddress);
        response = {
          success: true,
          purchase,
          message: 'NFT purchased successfully'
        };
        break;

      case 'place_bid':
        const { nftId: bidNftId, amount, currency: bidCurrency, duration: bidDuration } = data;
        const bid = await marketplace.placeBid(bidNftId, amount, bidCurrency, bidDuration);
        response = {
          success: true,
          bid,
          message: 'Bid placed successfully'
        };
        break;

      case 'accept_bid':
        const { bidId } = data;
        const bidAcceptance = await marketplace.acceptBid(bidId);
        response = {
          success: true,
          bidAcceptance,
          message: 'Bid accepted successfully'
        };
        break;

      case 'make_offer':
        const { nftId: offerNftId, amount: offerAmount, currency: offerCurrency, message, duration: offerDuration } = data;
        const offer = await marketplace.makeOffer(offerNftId, offerAmount, offerCurrency, message, offerDuration);
        response = {
          success: true,
          offer,
          message: 'Offer made successfully'
        };
        break;

      case 'accept_offer':
        const { offerId } = data;
        const offerAcceptance = await marketplace.acceptOffer(offerId);
        response = {
          success: true,
          offerAcceptance,
          message: 'Offer accepted successfully'
        };
        break;

      case 'stake_tokens':
        const { tokenAddress, amount, stakingContract } = data;
        const staking = await blockchain.stakeTokens(tokenAddress, amount, stakingContract);
        response = {
          success: true,
          staking,
          message: 'Tokens staked successfully'
        };
        break;

      case 'participate_governance':
        const { proposalId, support, governanceContract } = data;
        const governance = await blockchain.participateInGovernance(proposalId, support, governanceContract);
        response = {
          success: true,
          governance,
          message: 'Governance participation recorded'
        };
        break;

      case 'switch_network':
        const { chainId } = data;
        const networkSwitch = await blockchain.switchNetwork(chainId);
        response = {
          success: true,
          networkSwitch,
          message: networkSwitch ? 'Network switched successfully' : 'Network switch failed'
        };
        break;

      case 'add_network':
        const network = data;
        const networkAddition = await blockchain.addNetwork(network);
        response = {
          success: true,
          networkAddition,
          message: networkAddition ? 'Network added successfully' : 'Network addition failed'
        };
        break;

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    // Log successful blockchain operation
    if (user?.id) {
      await securityService.getAudit().logEvent({
        userId: user.id,
        action: 'blockchain_operation_success',
        resource: 'blockchain-api',
        ip: req.headers.get('x-forwarded-for') || req.ip || 'unknown',
        userAgent: req.headers.get('user-agent') || 'unknown',
        metadata: { 
          action, 
          success: response.success 
        },
        severity: 'low'
      });
    }

    return NextResponse.json(response);

  } catch (error) {
    console.error('Blockchain API Error:', error);
    
    // Log error for security audit
    const session = await getServerSession(authOptions);
    const user = session?.user as SessionUser;
    
    if (user?.id) {
      await securityService.getAudit().logEvent({
        userId: user.id,
        action: 'blockchain_operation_error',
        resource: 'blockchain-api',
        ip: req.headers.get('x-forwarded-for') || req.ip || 'unknown',
        userAgent: req.headers.get('user-agent') || 'unknown',
        metadata: { 
          error: error instanceof Error ? error.message : 'Unknown error',
          action: req.body?.action
        },
        severity: 'high'
      });
    }
    
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action');
    
    // Get user session for security audit
    const session = await getServerSession(authOptions);
    const user = session?.user as SessionUser;
    
    let response: any;

    switch (action) {
      case 'connection_status':
        response = {
          success: true,
          connected: blockchain.isConnected(),
          network: blockchain.isConnected() ? await blockchain.getNetworkInfo() : null
        };
        break;

      case 'balance':
        const { address } = searchParams;
        if (!address) {
          return NextResponse.json({ error: 'Address parameter required' }, { status: 400 });
        }
        const balance = await blockchain.getBalance(address);
        response = {
          success: true,
          balance,
          address
        };
        break;

      case 'token_balance':
        const { tokenAddress, userAddress } = searchParams;
        if (!tokenAddress || !userAddress) {
          return NextResponse.json({ error: 'Token address and user address required' }, { status: 400 });
        }
        const tokenBalance = await blockchain.getTokenBalance(tokenAddress, userAddress);
        response = {
          success: true,
          tokenBalance,
          tokenAddress,
          userAddress
        };
        break;

      case 'defi_protocols':
        const protocols = await blockchain.getDeFiProtocols();
        response = {
          success: true,
          protocols,
          message: `Found ${protocols.length} DeFi protocols`
        };
        break;

      case 'staking_rewards':
        const { stakingContract, userAddress: stakingUserAddress } = searchParams;
        if (!stakingContract || !stakingUserAddress) {
          return NextResponse.json({ error: 'Staking contract and user address required' }, { status: 400 });
        }
        const rewards = await blockchain.getStakingRewards(stakingContract, stakingUserAddress);
        response = {
          success: true,
          rewards
        };
        break;

      case 'gas_estimate':
        const { to, data, value } = searchParams;
        if (!to || !data) {
          return NextResponse.json({ error: 'To address and data required' }, { status: 400 });
        }
        const gasEstimate = await blockchain.getGasEstimate(to, data, value);
        response = {
          success: true,
          gasEstimate
        };
        break;

      case 'transaction_history':
        const { address: txAddress } = searchParams;
        if (!txAddress) {
          return NextResponse.json({ error: 'Address parameter required' }, { status: 400 });
        }
        const transactions = await blockchain.getTransactionHistory(txAddress);
        response = {
          success: true,
          transactions,
          address: txAddress
        };
        break;

      case 'network_info':
        const networkInfo = await blockchain.getNetworkInfo();
        response = {
          success: true,
          networkInfo
        };
        break;

      case 'marketplace_stats':
        const stats = await marketplace.getMarketplaceStats();
        response = {
          success: true,
          stats
        };
        break;

      case 'search_listings':
        const { query, category, minPrice, maxPrice, license } = searchParams;
        const priceRange = minPrice && maxPrice ? { min: minPrice, max: maxPrice } : undefined;
        const listings = await marketplace.searchListings(query || '', category || undefined, priceRange, license || undefined);
        response = {
          success: true,
          listings,
          count: listings.length
        };
        break;

      case 'listing_details':
        const { listingId } = searchParams;
        if (!listingId) {
          return NextResponse.json({ error: 'Listing ID required' }, { status: 400 });
        }
        const listing = await marketplace.getListingDetails(listingId);
        response = {
          success: true,
          listing
        };
        break;

      case 'nft_bids':
        const { nftId: bidsNftId } = searchParams;
        if (!bidsNftId) {
          return NextResponse.json({ error: 'NFT ID required' }, { status: 400 });
        }
        const bids = await marketplace.getBidsForNFT(bidsNftId);
        response = {
          success: true,
          bids,
          nftId: bidsNftId
        };
        break;

      case 'nft_offers':
        const { nftId: offersNftId } = searchParams;
        if (!offersNftId) {
          return NextResponse.json({ error: 'NFT ID required' }, { status: 400 });
        }
        const offers = await marketplace.getOffersForNFT(offersNftId);
        response = {
          success: true,
          offers,
          nftId: offersNftId
        };
        break;

      case 'royalty_history':
        const { nftId: royaltyNftId } = searchParams;
        if (!royaltyNftId) {
          return NextResponse.json({ error: 'NFT ID required' }, { status: 400 });
        }
        const royalties = await marketplace.getRoyaltyHistory(royaltyNftId);
        response = {
          success: true,
          royalties,
          nftId: royaltyNftId
        };
        break;

      case 'available_licenses':
        const licenses = await marketplace.getAvailableLicenses();
        response = {
          success: true,
          licenses
        };
        break;

      case 'validate_ownership':
        const { nftId: ownershipNftId, userAddress: ownershipUserAddress } = searchParams;
        if (!ownershipNftId || !ownershipUserAddress) {
          return NextResponse.json({ error: 'NFT ID and user address required' }, { status: 400 });
        }
        const isOwner = await marketplace.validateCodeOwnership(ownershipNftId, ownershipUserAddress);
        response = {
          success: true,
          isOwner,
          nftId: ownershipNftId,
          userAddress: ownershipUserAddress
        };
        break;

      case 'transaction_history':
        const { userAddress: historyUserAddress } = searchParams;
        if (!historyUserAddress) {
          return NextResponse.json({ error: 'User address required' }, { status: 400 });
        }
        const userHistory = await marketplace.getTransactionHistory(historyUserAddress);
        response = {
          success: true,
          history: userHistory,
          userAddress: historyUserAddress
        };
        break;

      case 'blockchain_config':
        const config = blockchain.getConfig();
        response = {
          success: true,
          config
        };
        break;

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    // Log successful blockchain operation
    if (user?.id) {
      await securityService.getAudit().logEvent({
        userId: user.id,
        action: 'blockchain_operation_success',
        resource: 'blockchain-api',
        ip: req.headers.get('x-forwarded-for') || req.ip || 'unknown',
        userAgent: req.headers.get('user-agent') || 'unknown',
        metadata: { 
          action, 
          success: response.success 
        },
        severity: 'low'
      });
    }

    return NextResponse.json(response);

  } catch (error) {
    console.error('Blockchain API Error:', error);
    
    // Log error for security audit
    const session = await getServerSession(authOptions);
    const user = session?.user as SessionUser;
    
    if (user?.id) {
      await securityService.getAudit().logEvent({
        userId: user.id,
        action: 'blockchain_operation_error',
        resource: 'blockchain-api',
        ip: req.headers.get('x-forwarded-for') || req.ip || 'unknown',
        userAgent: req.headers.get('user-agent') || 'unknown',
        metadata: { 
          error: error instanceof Error ? error.message : 'Unknown error',
          action: req.url
        },
        severity: 'high'
      });
    }
    
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 