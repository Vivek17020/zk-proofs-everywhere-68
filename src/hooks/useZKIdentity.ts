import { useState, useEffect } from 'react';
import { ZKIdentityManager, type ZKCredential, type ZKIdentity } from '@/lib/zkIdentity';
import { useToast } from '@/hooks/use-toast';

export function useZKIdentity() {
  const [identity, setIdentity] = useState<ZKIdentity | null>(null);
  const [credentials, setCredentials] = useState<ZKCredential[]>([]);
  const [isGeneratingProof, setIsGeneratingProof] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load identity and credentials on mount
    const loadedIdentity = ZKIdentityManager.getOrCreateIdentity();
    const loadedCredentials = ZKIdentityManager.getStoredCredentials();
    
    setIdentity(loadedIdentity);
    setCredentials(loadedCredentials);
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
    
    toast({
      title: "Data Cleared",
      description: "All ZK identity data has been cleared",
    });
  };

  return {
    identity,
    credentials,
    isGeneratingProof,
    generateEventCredential,
    verifyCredential,
    exportCredentials,
    getStats,
    clearAll
  };
}