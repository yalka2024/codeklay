import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { BlockchainIntegration, defaultBlockchainConfig } from '@/lib/blockchain-integration';
import { CrossChainIntegration } from '@/lib/cross-chain-integration';
import { AdvancedDeFi } from '@/lib/advanced-defi';
import { EnterpriseSecurityService, defaultEnterpriseSecurityConfig } from '@/lib/enterprise-security';

// Initialize cross-chain services
const blockchain = new BlockchainIntegration(defaultBlockchainConfig);
const securityService = new EnterpriseSecurityService(defaultEnterpriseSecurityConfig);
const crossChain = new CrossChainIntegration(blockchain, securityService);
const advancedDeFi = new AdvancedDeFi(crossChain, securityService);

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
    
    // Log cross-chain operation for security audit
    if (user?.id) {
      await securityService.getAudit().logEvent({
        userId: user.id,
        action: 'cross_chain_operation',
        resource: 'cross-chain-api',
        ip: req.headers.get('x-forwarded-for') || req.ip || 'unknown',
        userAgent: req.headers.get('user-agent') || 'unknown',
        metadata: { action, hasData: !!data },
        severity: 'medium'
      });
    }

    let response: any;

    switch (action) {
      case 'add_network':
        const { name, chainId, networkType, rpcUrl, explorer, nativeCurrency, blockTime, gasLimit } = data;
        const network = await crossChain.addNetwork(
          name,
          chainId,
          networkType,
          rpcUrl,
          explorer,
          nativeCurrency,
          blockTime,
          gasLimit
        );
        response = {
          success: true,
          network,
          message: 'Network added successfully'
        };
        break;

      case 'create_bridge':
        const { bridgeName, sourceChain, targetChain, bridgeType, contracts, fees, limits, security } = data;
        const bridge = await crossChain.createBridge(
          bridgeName,
          sourceChain,
          targetChain,
          bridgeType,
          contracts,
          fees,
          limits,
          security
        );
        response = {
          success: true,
          bridge,
          message: 'Bridge created successfully'
        };
        break;

      case 'initiate_transfer':
        const { bridgeId, sender, recipient, amount, token } = data;
        const transaction = await crossChain.initiateCrossChainTransfer(
          bridgeId,
          sender,
          recipient,
          amount,
          token
        );
        response = {
          success: true,
          transaction,
          message: 'Cross-chain transfer initiated successfully'
        };
        break;

      case 'confirm_transaction':
        const { transactionId, validatorAddress, signature } = data;
        const confirmedTransaction = await crossChain.confirmCrossChainTransaction(
          transactionId,
          validatorAddress,
          signature
        );
        response = {
          success: true,
          transaction: confirmedTransaction,
          message: 'Transaction confirmed successfully'
        };
        break;

      case 'complete_transaction':
        const { transactionId: completeTxId } = data;
        const completedTransaction = await crossChain.completeCrossChainTransaction(completeTxId);
        response = {
          success: true,
          transaction: completedTransaction,
          message: 'Transaction completed successfully'
        };
        break;

      case 'add_validator':
        const { address, name, stake } = data;
        const validator = await crossChain.addValidator(address, name, stake);
        response = {
          success: true,
          validator,
          message: 'Validator added successfully'
        };
        break;

      case 'add_token':
        const { symbol, tokenName, chainId: tokenChainId, contractAddress, decimals, totalSupply, isWrapped, originalToken } = data;
        const token = await crossChain.addToken(
          symbol,
          tokenName,
          tokenChainId,
          contractAddress,
          decimals,
          totalSupply,
          isWrapped,
          originalToken
        );
        response = {
          success: true,
          token,
          message: 'Token added successfully'
        };
        break;

      case 'create_pool':
        const { poolName, chainId: poolChainId, tokenA, tokenB, fee } = data;
        const pool = await crossChain.createLiquidityPool(
          poolName,
          poolChainId,
          tokenA,
          tokenB,
          fee
        );
        response = {
          success: true,
          pool,
          message: 'Liquidity pool created successfully'
        };
        break;

      case 'create_farm':
        const { farmName, chainId: farmChainId, pool: farmPool, token, rewardToken, apy, lockPeriod, minStake, maxStake } = data;
        const farm = await crossChain.createYieldFarm(
          farmName,
          farmChainId,
          farmPool,
          token,
          rewardToken,
          apy,
          lockPeriod,
          minStake,
          maxStake
        );
        response = {
          success: true,
          farm,
          message: 'Yield farm created successfully'
        };
        break;

      case 'stake_in_farm':
        const { farmId, userAddress, stakeAmount } = data;
        const stakeResult = await crossChain.stakeInYieldFarm(farmId, userAddress, stakeAmount);
        response = {
          success: true,
          result: stakeResult,
          message: 'Staked in yield farm successfully'
        };
        break;

      case 'add_protocol':
        const { protocolName, protocolType, chainId: protocolChainId, address, version, tvl, volume24h, apy, risk } = data;
        const protocol = await advancedDeFi.addProtocol(
          protocolName,
          protocolType,
          protocolChainId,
          address,
          version,
          tvl,
          volume24h,
          apy,
          risk
        );
        response = {
          success: true,
          protocol,
          message: 'Protocol added successfully'
        };
        break;

      case 'create_strategy':
        const { strategyName, description, protocol, chainId: strategyChainId, tokens, strategy, risk, apy, tvl, minStake, maxStake, lockPeriod, fees } = data;
        const strategyResult = await advancedDeFi.createYieldStrategy(
          strategyName,
          description,
          protocol,
          strategyChainId,
          tokens,
          strategy,
          risk,
          apy,
          tvl,
          minStake,
          maxStake,
          lockPeriod,
          fees
        );
        response = {
          success: true,
          strategy: strategyResult,
          message: 'Yield strategy created successfully'
        };
        break;

      case 'provide_liquidity':
        const { user, pool, chainId: liquidityChainId, tokenA, tokenB, amountA, amountB } = data;
        const position = await advancedDeFi.provideLiquidity(
          user,
          pool,
          liquidityChainId,
          tokenA,
          tokenB,
          amountA,
          amountB
        );
        response = {
          success: true,
          position,
          message: 'Liquidity provided successfully'
        };
        break;

      case 'create_risk_management':
        const { riskStrategy, riskType, severity, probability, impact, mitigation } = data;
        const riskManagement = await advancedDeFi.createRiskManagement(
          riskStrategy,
          riskType,
          severity,
          probability,
          impact,
          mitigation
        );
        response = {
          success: true,
          riskManagement,
          message: 'Risk management created successfully'
        };
        break;

      case 'create_portfolio':
        const { portfolioUser, portfolioName, description, rebalanceFrequency } = data;
        const portfolio = await advancedDeFi.createPortfolio(
          portfolioUser,
          portfolioName,
          description,
          rebalanceFrequency
        );
        response = {
          success: true,
          portfolio,
          message: 'Portfolio created successfully'
        };
        break;

      case 'add_strategy_to_portfolio':
        const { portfolioId, strategyId, allocation } = data;
        const portfolioStrategy = await advancedDeFi.addStrategyToPortfolio(
          portfolioId,
          strategyId,
          allocation
        );
        response = {
          success: true,
          portfolioStrategy,
          message: 'Strategy added to portfolio successfully'
        };
        break;

      case 'execute_defi_transaction':
        const { defiUser, defiProtocol, chainId: defiChainId, type, tokenIn, tokenOut, amountIn, amountOut } = data;
        const defiTransaction = await advancedDeFi.executeDeFiTransaction(
          defiUser,
          defiProtocol,
          defiChainId,
          type,
          tokenIn,
          tokenOut,
          amountIn,
          amountOut
        );
        response = {
          success: true,
          transaction: defiTransaction,
          message: 'DeFi transaction executed successfully'
        };
        break;

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    // Log successful cross-chain operation
    if (user?.id) {
      await securityService.getAudit().logEvent({
        userId: user.id,
        action: 'cross_chain_operation_success',
        resource: 'cross-chain-api',
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
    console.error('Cross-Chain API Error:', error);
    
    // Log error for security audit
    const session = await getServerSession(authOptions);
    const user = session?.user as SessionUser;
    
    if (user?.id) {
      await securityService.getAudit().logEvent({
        userId: user.id,
        action: 'cross_chain_operation_error',
        resource: 'cross-chain-api',
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
      case 'networks':
        const networks = await crossChain.getNetworks();
        response = {
          success: true,
          networks,
          count: networks.length
        };
        break;

      case 'bridges':
        const bridges = await crossChain.getBridges();
        response = {
          success: true,
          bridges,
          count: bridges.length
        };
        break;

      case 'transactions':
        const { bridgeId } = searchParams;
        const transactions = await crossChain.getTransactions(bridgeId);
        response = {
          success: true,
          transactions,
          count: transactions.length
        };
        break;

      case 'validators':
        const validators = await crossChain.getValidators();
        response = {
          success: true,
          validators,
          count: validators.length
        };
        break;

      case 'tokens':
        const { chainId: tokenChainId } = searchParams;
        const tokens = await crossChain.getTokens(tokenChainId ? parseInt(tokenChainId) : undefined);
        response = {
          success: true,
          tokens,
          count: tokens.length
        };
        break;

      case 'pools':
        const { chainId: poolChainId } = searchParams;
        const pools = await crossChain.getPools(poolChainId ? parseInt(poolChainId) : undefined);
        response = {
          success: true,
          pools,
          count: pools.length
        };
        break;

      case 'farms':
        const { chainId: farmChainId } = searchParams;
        const farms = await crossChain.getFarms(farmChainId ? parseInt(farmChainId) : undefined);
        response = {
          success: true,
          farms,
          count: farms.length
        };
        break;

      case 'cross_chain_metrics':
        const crossChainMetrics = await crossChain.trackCrossChainMetrics();
        response = {
          success: true,
          metrics: crossChainMetrics
        };
        break;

      case 'protocols':
        const protocols = await advancedDeFi.getProtocols();
        response = {
          success: true,
          protocols,
          count: protocols.length
        };
        break;

      case 'strategies':
        const strategies = await advancedDeFi.getStrategies();
        response = {
          success: true,
          strategies,
          count: strategies.length
        };
        break;

      case 'positions':
        const { user: positionUser } = searchParams;
        const positions = await advancedDeFi.getPositions(positionUser);
        response = {
          success: true,
          positions,
          count: positions.length
        };
        break;

      case 'risk_management':
        const riskManagement = await advancedDeFi.getRiskManagement();
        response = {
          success: true,
          riskManagement,
          count: riskManagement.length
        };
        break;

      case 'portfolios':
        const { user: portfolioUser } = searchParams;
        const portfolios = await advancedDeFi.getPortfolios(portfolioUser);
        response = {
          success: true,
          portfolios,
          count: portfolios.length
        };
        break;

      case 'defi_transactions':
        const { user: defiUser } = searchParams;
        const defiTransactions = await advancedDeFi.getTransactions(defiUser);
        response = {
          success: true,
          transactions: defiTransactions,
          count: defiTransactions.length
        };
        break;

      case 'defi_metrics':
        const defiMetrics = await advancedDeFi.trackDeFiMetrics();
        response = {
          success: true,
          metrics: defiMetrics
        };
        break;

      case 'cross_chain_report':
        const crossChainReport = await crossChain.generateCrossChainReport();
        response = {
          success: true,
          report: crossChainReport
        };
        break;

      case 'defi_report':
        const defiReport = await advancedDeFi.generateDeFiReport();
        response = {
          success: true,
          report: defiReport
        };
        break;

      case 'network_details':
        const { networkId } = searchParams;
        if (!networkId) {
          return NextResponse.json({ error: 'Network ID required' }, { status: 400 });
        }
        const networkDetails = crossChain.getNetworkById(networkId);
        response = {
          success: true,
          network: networkDetails
        };
        break;

      case 'bridge_details':
        const { bridgeId } = searchParams;
        if (!bridgeId) {
          return NextResponse.json({ error: 'Bridge ID required' }, { status: 400 });
        }
        const bridgeDetails = crossChain.getBridgeById(bridgeId);
        response = {
          success: true,
          bridge: bridgeDetails
        };
        break;

      case 'transaction_details':
        const { transactionId } = searchParams;
        if (!transactionId) {
          return NextResponse.json({ error: 'Transaction ID required' }, { status: 400 });
        }
        const transactionDetails = crossChain.getTransactionById(transactionId);
        response = {
          success: true,
          transaction: transactionDetails
        };
        break;

      case 'protocol_details':
        const { protocolId } = searchParams;
        if (!protocolId) {
          return NextResponse.json({ error: 'Protocol ID required' }, { status: 400 });
        }
        const protocolDetails = advancedDeFi.getProtocolById(protocolId);
        response = {
          success: true,
          protocol: protocolDetails
        };
        break;

      case 'strategy_details':
        const { strategyId } = searchParams;
        if (!strategyId) {
          return NextResponse.json({ error: 'Strategy ID required' }, { status: 400 });
        }
        const strategyDetails = advancedDeFi.getStrategyById(strategyId);
        response = {
          success: true,
          strategy: strategyDetails
        };
        break;

      case 'portfolio_details':
        const { portfolioId } = searchParams;
        if (!portfolioId) {
          return NextResponse.json({ error: 'Portfolio ID required' }, { status: 400 });
        }
        const portfolioDetails = advancedDeFi.getPortfolioById(portfolioId);
        response = {
          success: true,
          portfolio: portfolioDetails
        };
        break;

      case 'network_status':
        const { networkId: statusNetworkId } = searchParams;
        if (!statusNetworkId) {
          return NextResponse.json({ error: 'Network ID required' }, { status: 400 });
        }
        const networkStatus = crossChain.isNetworkActive(statusNetworkId);
        response = {
          success: true,
          active: networkStatus
        };
        break;

      case 'bridge_status':
        const { bridgeId: statusBridgeId } = searchParams;
        if (!statusBridgeId) {
          return NextResponse.json({ error: 'Bridge ID required' }, { status: 400 });
        }
        const bridgeStatus = crossChain.isBridgeActive(statusBridgeId);
        response = {
          success: true,
          active: bridgeStatus
        };
        break;

      case 'protocol_status':
        const { protocolId: statusProtocolId } = searchParams;
        if (!statusProtocolId) {
          return NextResponse.json({ error: 'Protocol ID required' }, { status: 400 });
        }
        const protocolStatus = advancedDeFi.isProtocolActive(statusProtocolId);
        response = {
          success: true,
          active: protocolStatus
        };
        break;

      case 'strategy_status':
        const { strategyId: statusStrategyId } = searchParams;
        if (!statusStrategyId) {
          return NextResponse.json({ error: 'Strategy ID required' }, { status: 400 });
        }
        const strategyStatus = advancedDeFi.isStrategyActive(statusStrategyId);
        response = {
          success: true,
          active: strategyStatus
        };
        break;

      case 'portfolio_status':
        const { portfolioId: statusPortfolioId } = searchParams;
        if (!statusPortfolioId) {
          return NextResponse.json({ error: 'Portfolio ID required' }, { status: 400 });
        }
        const portfolioStatus = advancedDeFi.isPortfolioActive(statusPortfolioId);
        response = {
          success: true,
          active: portfolioStatus
        };
        break;

      case 'cross_chain_summary':
        const crossChainReportData = await crossChain.generateCrossChainReport();
        const defiReportData = await advancedDeFi.generateDeFiReport();
        
        const summary = {
          crossChain: {
            totalNetworks: crossChainReportData.totalNetworks,
            totalBridges: crossChainReportData.totalBridges,
            totalTransactions: crossChainReportData.totalTransactions,
            totalValidators: crossChainReportData.totalValidators
          },
          defi: {
            totalProtocols: defiReportData.totalProtocols,
            totalStrategies: defiReportData.totalStrategies,
            totalPositions: defiReportData.totalPositions,
            totalPortfolios: defiReportData.totalPortfolios
          },
          combined: {
            totalNetworks: crossChainReportData.totalNetworks,
            totalBridges: crossChainReportData.totalBridges,
            totalProtocols: defiReportData.totalProtocols,
            totalStrategies: defiReportData.totalStrategies,
            totalTransactions: crossChainReportData.totalTransactions,
            totalPortfolios: defiReportData.totalPortfolios
          }
        };
        
        response = {
          success: true,
          summary
        };
        break;

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    // Log successful cross-chain operation
    if (user?.id) {
      await securityService.getAudit().logEvent({
        userId: user.id,
        action: 'cross_chain_operation_success',
        resource: 'cross-chain-api',
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
    console.error('Cross-Chain API Error:', error);
    
    // Log error for security audit
    const session = await getServerSession(authOptions);
    const user = session?.user as SessionUser;
    
    if (user?.id) {
      await securityService.getAudit().logEvent({
        userId: user.id,
        action: 'cross_chain_operation_error',
        resource: 'cross-chain-api',
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