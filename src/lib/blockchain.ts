import { ethers } from 'ethers';
import deploymentInfo from '@/contracts/deployment.json';

// Mock NFT metadata interface
interface NFTMetadata {
  tokenId: string;
  eventName: string;
  eventId: string;
  image: string;
  description: string;
  attributes: Array<{
    trait_type: string;
    value: string;
  }>;
}

export interface BlockchainProof {
  proofId: string;
  eventId: string;
  commitmentHash: string;
  submitter: string;
  timestamp: number;
  verified: boolean;
  txHash?: string;
}

export class BlockchainManager {
  private static contract: ethers.Contract | null = null;
  private static provider: ethers.BrowserProvider | null = null;
  private static signer: ethers.JsonRpcSigner | null = null;

  static async connectWallet(): Promise<boolean> {
    try {
      if (!window.ethereum) {
        throw new Error('MetaMask not detected. Please install MetaMask.');
      }

      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      // Create provider and signer
      this.provider = new ethers.BrowserProvider(window.ethereum);
      this.signer = await this.provider.getSigner();

      // Check if we're on the correct network
      const network = await this.provider.getNetwork();
      if (Number(network.chainId) !== deploymentInfo.chainId) {
        // Try to switch to the correct network
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: `0x${deploymentInfo.chainId.toString(16)}` }],
          });
        } catch (switchError: any) {
          // If the network is not added, add it
          if (switchError.code === 4902) {
            await this.addNetwork();
          } else {
            throw switchError;
          }
        }
      }

      // Create contract instance
      this.contract = new ethers.Contract(
        deploymentInfo.contractAddress,
        deploymentInfo.abi,
        this.signer
      );

      console.log('✅ Wallet connected successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to connect wallet:', error);
      return false;
    }
  }

  static async addNetwork(): Promise<void> {
    const networkParams = {
      chainId: `0x${deploymentInfo.chainId.toString(16)}`,
      chainName: deploymentInfo.network,
      nativeCurrency: {
        name: 'MATIC',
        symbol: 'MATIC',
        decimals: 18,
      },
      rpcUrls: ['https://rpc-mumbai.maticvigil.com'],
      blockExplorerUrls: [deploymentInfo.explorerUrl],
    };

    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [networkParams],
    });
  }

  static async isConnected(): Promise<boolean> {
    try {
      if (!window.ethereum) return false;
      
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      return accounts && accounts.length > 0;
    } catch {
      return false;
    }
  }

  static async getAddress(): Promise<string | null> {
    try {
      if (!this.signer) {
        await this.connectWallet();
      }
      return this.signer ? await this.signer.getAddress() : null;
    } catch {
      return null;
    }
  }

  static async submitProofToBlockchain(
    eventId: string,
    proofString: string
  ): Promise<{ proofId: string; txHash: string } | null> {
    try {
      if (!this.contract) {
        const connected = await this.connectWallet();
        if (!connected) throw new Error('Failed to connect to wallet');
      }

      console.log('📤 Submitting proof to blockchain...');
      console.log(`Event ID: ${eventId}`);
      console.log(`Proof String: ${proofString.slice(0, 20)}...`);

      // Submit proof to contract
      const tx = await this.contract!.submitProof(eventId, proofString);
      console.log(`🔄 Transaction submitted: ${tx.hash}`);

      // Wait for confirmation
      const receipt = await tx.wait();
      console.log('✅ Transaction confirmed!');

      // Extract proof ID from event logs
      const event = receipt.logs.find((log: any) => {
        try {
          const parsed = this.contract!.interface.parseLog(log);
          return parsed?.name === 'ProofSubmitted';
        } catch {
          return false;
        }
      });

      let proofId = '';
      if (event) {
        const parsed = this.contract!.interface.parseLog(event);
        proofId = parsed?.args?.proofId || '';
      }

      return {
        proofId,
        txHash: tx.hash
      };
    } catch (error) {
      console.error('❌ Failed to submit proof to blockchain:', error);
      return null;
    }
  }

  // Fetch user's NFT rewards
  static async getUserNFTs(userAddress: string): Promise<NFTMetadata[]> {
    try {
      // Mock NFT data - in reality this would query the NFT contract or indexing service
      const mockNFTs: NFTMetadata[] = [
        {
          tokenId: "1",
          eventName: "ETH Global London",
          eventId: "eth-global-london-2024",
          image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=400&fit=crop",
          description: "Commemorative NFT for ETH Global London attendance",
          attributes: [
            { trait_type: "Event Type", value: "Hackathon" },
            { trait_type: "Location", value: "London, UK" },
            { trait_type: "Year", value: "2024" }
          ]
        },
        {
          tokenId: "3",
          eventName: "Devcon 7",
          eventId: "devcon-7-bangkok",
          image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=400&fit=crop",
          description: "Exclusive NFT for Devcon 7 participants",
          attributes: [
            { trait_type: "Event Type", value: "Conference" },
            { trait_type: "Location", value: "Bangkok, Thailand" },
            { trait_type: "Year", value: "2024" }
          ]
        },
        {
          tokenId: "7",
          eventName: "ZK Circuit Design Workshop",
          eventId: "zk-workshop-2024",
          image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=400&fit=crop",
          description: "Achievement NFT for completing ZK circuit workshop",
          attributes: [
            { trait_type: "Event Type", value: "Workshop" },
            { trait_type: "Skill Level", value: "Advanced" },
            { trait_type: "Year", value: "2024" }
          ]
        }
      ];

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      return mockNFTs;
    } catch (error) {
      console.error('Failed to fetch user NFTs:', error);
      return [];
    }
  }

  // Get total number of NFTs minted by user
  static async getUserNFTCount(userAddress: string): Promise<number> {
    try {
      const nfts = await this.getUserNFTs(userAddress);
      return nfts.length;
    } catch (error) {
      console.error('Failed to get user NFT count:', error);
      return 0;
    }
  }

  static async getProofFromBlockchain(proofId: string): Promise<BlockchainProof | null> {
    try {
      if (!this.contract) {
        await this.connectWallet();
      }

      const result = await this.contract!.getProof(proofId);
      
      return {
        proofId,
        eventId: result[0],
        commitmentHash: result[1],
        submitter: result[2],
        timestamp: Number(result[3]),
        verified: result[4]
      };
    } catch (error) {
      console.error('❌ Failed to get proof from blockchain:', error);
      return null;
    }
  }

  static async getUserProofs(userAddress: string): Promise<string[]> {
    try {
      if (!this.contract) {
        await this.connectWallet();
      }

      return await this.contract!.getUserProofs(userAddress);
    } catch (error) {
      console.error('❌ Failed to get user proofs:', error);
      return [];
    }
  }

  static async getTotalProofs(): Promise<number> {
    try {
      if (!this.contract) {
        await this.connectWallet();
      }

      const total = await this.contract!.getTotalProofs();
      return Number(total);
    } catch (error) {
      console.error('❌ Failed to get total proofs:', error);
      return 0;
    }
  }

  static getExplorerUrl(txHash: string): string {
    return `${deploymentInfo.explorerUrl}/tx/${txHash}`;
  }

  static getContractUrl(): string {
    return `${deploymentInfo.explorerUrl}/address/${deploymentInfo.contractAddress}`;
  }
}

// Extend window type for TypeScript
declare global {
  interface Window {
    ethereum?: any;
  }
}