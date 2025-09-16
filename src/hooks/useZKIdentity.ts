import { useState, useEffect } from 'react';
import { ZKIdentityManager, type ZKCredential, type ZKIdentity, type ZKCoPresenceProof } from '@/lib/zkIdentity';
import { useToast } from '@/hooks/use-toast';

export function useZKIdentity() {
  const [identity, setIdentity] = useState<ZKIdentity | null>(null);
  const [credentials, setCredentials] = useState<ZKCredential[]>([]);
  const [coPresenceProofs, setCoPresenceProofs] = useState<ZKCoPresenceProof[]>([]);
  const [isGeneratingProof, setIsGeneratingProof] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load identity, credentials, and co-presence proofs on mount
    const loadedIdentity = ZKIdentityManager.getOrCreateIdentity();
    const loadedCredentials = ZKIdentityManager.getStoredCredentials();
    const loadedCoPresenceProofs = ZKIdentityManager.getStoredCoPresenceProofs();
    
    setIdentity(loadedIdentity);
    setCredentials(loadedCredentials);
    setCoPresenceProofs(loadedCoPresenceProofs);
  }, []);

  const generateEventCredential = async (
    eventId: string,
    eventName: string,
    metadata?: ZKCredential['metadata']
  ) => {
    if (isGeneratingProof) return;

    setIsGeneratingProof(true);
    
    try {
      toast({
        title: "Generating ZK Proof",
        description: "Creating attendance credential for " + eventName,
      });

      const credential = await ZKIdentityManager.generateEventCredential(
        eventId,
        eventName,
        metadata
      );

      setCredentials(prev => [...prev, credential]);

      toast({
        title: "Credential Generated! 🎫",
        description: `Successfully created proof for ${eventName}`,
      });

      // Trigger confetti animation
      if (typeof window !== 'undefined') {
        import('canvas-confetti').then(confetti => {
          confetti.default({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B']
          });
        });
      }

      return credential;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Proof Generation Failed",
        description: "Failed to generate ZK credential. Please try again.",
      });
      throw error;
    } finally {
      setIsGeneratingProof(false);
    }
  };

  const verifyCredential = async (credential: ZKCredential) => {
    try {
      const isValid = await ZKIdentityManager.verifyCredential(credential);
      
      toast({
        title: isValid ? "Credential Valid ✅" : "Credential Invalid ❌",
        description: isValid 
          ? "The ZK proof is cryptographically valid" 
          : "The ZK proof verification failed",
      });

      return isValid;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Verification Failed",
        description: "Failed to verify credential. Please try again.",
      });
      return false;
    }
  };

  const generateCoPresenceProof = async (
    userIdA: string,
    userIdB: string,
    usernameA: string,
    usernameB: string,
    ephemeralNonce: string,
    location?: string
  ) => {
    if (isGeneratingProof) return;

    setIsGeneratingProof(true);
    
    try {
      toast({
        title: "Generating Co-Presence Proof",
        description: "Creating ZK proof of meeting...",
      });

      const proof = await ZKIdentityManager.generateCoPresenceProof(
        userIdA,
        userIdB,
        usernameA,
        usernameB,
        ephemeralNonce,
        location
      );

      setCoPresenceProofs(prev => [...prev, proof]);

      toast({
        title: "Co-Presence Proof Generated! 🤝",
        description: `Proof of co-presence with ${proof.userIdB.slice(0, 8)}... at ${proof.eventId.slice(0, 12)}...`,
      });

      // Trigger confetti animation
      if (typeof window !== 'undefined') {
        import('canvas-confetti').then(confetti => {
          confetti.default({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B']
          });
        });
      }

      return proof;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Proof Generation Failed",
        description: "Failed to generate co-presence proof. Please try again.",
      });
      throw error;
    } finally {
      setIsGeneratingProof(false);
    }
  };

  const exportCredentials = () => {
    try {
      const data = ZKIdentityManager.exportCredentials();
      
      // Create download link
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `zk-credentials-${Date.now()}.json`;
      link.click();
      URL.revokeObjectURL(url);

      toast({
        title: "Credentials Exported 📁",
        description: "Your ZK credentials have been exported successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Export Failed",
        description: "Failed to export credentials. Please try again.",
      });
    }
  };

  const getStats = () => {
    return ZKIdentityManager.getIdentityStats();
  };

  const clearAll = () => {
    ZKIdentityManager.clearAll();
    setIdentity(ZKIdentityManager.getOrCreateIdentity());
    setCredentials([]);
    setCoPresenceProofs([]);
    
    toast({
      title: "Data Cleared",
      description: "All ZK identity data has been cleared",
    });
  };

  return {
    identity,
    credentials,
    coPresenceProofs,
    isGeneratingProof,
    generateEventCredential,
    generateCoPresenceProof,
    verifyCredential,
    exportCredentials,
    getStats,
    clearAll
  };
}