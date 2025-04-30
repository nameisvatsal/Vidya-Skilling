
import { useState } from "react";
import { Search, Shield, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

// Mock verification data
const verifiedCredential = {
  id: "VID-WD-2023-12345",
  title: "Web Development Fundamentals",
  recipient: "John Doe",
  issueDate: "June 15, 2023",
  issuer: "Vidya Learning",
  verified: true,
  blockchain: {
    hash: "0x8a7b8d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5",
    timestamp: "2023-06-15T10:30:00Z",
  },
};

const CredentialVerifyPage = () => {
  const [credentialId, setCredentialId] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<any | null>(null);
  const [error, setError] = useState("");

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!credentialId.trim()) {
      setError("Please enter a credential ID");
      return;
    }
    
    setIsVerifying(true);
    setError("");
    
    // Reset any previous verification
    setVerificationResult(null);
    
    // Simulate API verification
    setTimeout(() =>  {
      setIsVerifying(false);
      
      if (credentialId === "VID-WD-2023-12345") {
        setVerificationResult(verifiedCredential);
      } else {
        setError("No credential found with this ID. Please check and try again.");
      }
    }, 2000);
  };

  return (
    <div className="page-container pb-12">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-vidya-light rounded-full mb-4">
            <Shield className="h-8 w-8 text-vidya-primary" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Verify Credentials</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Verify the authenticity of certificates and credentials issued by Vidya
          </p>
        </div>
        
        <Card className="mb-8">
          <CardContent className="p-6">
            <form onSubmit={handleVerify} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Enter Credential ID
                </label>
                <Input
                  placeholder="e.g., VID-WD-2023-12345"
                  value={credentialId}
                  onChange={(e) => setCredentialId(e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">
                  You can find the credential ID on the certificate or in the credential URL
                </p>
              </div>
              
              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-md flex items-center gap-2">
                  <AlertCircle size={16} />
                  <p>{error}</p>
                </div>
              )}
              
              <Button 
                type="submit" 
                className="w-full bg-vidya-primary hover:bg-vidya-dark"
                disabled={isVerifying}
              >
                {isVerifying ? "Verifying..." : "Verify Credential"}
              </Button>
            </form>
          </CardContent>
        </Card>
        
        {verificationResult && (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
                <h2 className="text-xl font-semibold">Credential Verified</h2>
              </div>
              
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900 p-4 rounded-md mb-6">
                <p className="text-green-700 dark:text-green-400 text-sm">
                  This credential has been verified as authentic and has not been tampered with.
                </p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Credential Title</h3>
                  <p className="font-medium">{verificationResult.title}</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Recipient</h3>
                    <p>{verificationResult.recipient}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Issue Date</h3>
                    <p>{verificationResult.issueDate}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Issuer</h3>
                    <p>{verificationResult.issuer}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Credential ID</h3>
                    <p className="font-mono text-sm">{verificationResult.id}</p>
                  </div>
                </div>
                
                <div className="pt-4 border-t mt-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Blockchain Verification</h3>
                  
                  <div className="space-y-2">
                    <div>
                      <h4 className="text-xs text-gray-500">Transaction Hash</h4>
                      <p className="font-mono text-xs break-all">
                        {verificationResult.blockchain.hash}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="text-xs text-gray-500">Timestamp</h4>
                      <p className="text-sm">
                        {new Date(verificationResult.blockchain.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        <div className="mt-8">
          <h3 className="font-medium mb-2">How to verify a credential</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li>Enter the Credential ID found on the certificate</li>
            <li>Click "Verify Credential"</li>
            <li>The system will check the blockchain for authenticity</li>
            <li>You'll see the verification result and credential details</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default CredentialVerifyPage;
