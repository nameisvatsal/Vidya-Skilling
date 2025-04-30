
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Download, Share2, Shield, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

// Mock data
const certificates = [
  {
    id: "cert1",
    title: "Web Development Fundamentals",
    recipient: "John Doe",
    issueDate: "June 15, 2023",
    expiryDate: "No Expiry",
    credentialId: "VID-WD-2023-12345",
    blockchain: {
      verified: true,
      hash: "0x8a7b8d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5",
      timestamp: "2023-06-15T10:30:00Z",
    },
    issuer: {
      name: "Vidya Learning",
      logo: "https://placehold.co/200x200?text=Vidya",
      url: "https://vidya.org",
    },
    skills: [
      "HTML5",
      "CSS3",
      "JavaScript",
      "Responsive Design",
      "Web Development",
    ],
    image: "https://placehold.co/800x600?text=Certificate",
  },
];

const CertificateViewPage = () => {
  const { id } = useParams<{ id: string }>();
  const [certificate, setCertificate] = useState<any | null>(null);
  const [verifying, setVerifying] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Find certificate by id
    const foundCertificate = certificates.find((cert) => cert.id === id);
    if (foundCertificate) {
      setCertificate(foundCertificate);
    }
  }, [id]);

  const handleDownload = () => {
    toast({
      title: "Download Started",
      description: "Your certificate is being downloaded as a PDF",
    });
    // In a real app, this would trigger a PDF download
  };

  const handleShare = () => {
    const shareUrl = window.location.href;
    
    if (navigator.share) {
      navigator.share({
        title: `${certificate?.title} Certificate`,
        text: `Check out my certificate for ${certificate?.title}`,
        url: shareUrl,
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link Copied",
        description: "Certificate link copied to clipboard",
      });
    }
  };

  const handleVerify = () => {
    setVerifying(true);
    
    // Simulate blockchain verification
    setTimeout(() => {
      setVerifying(false);
      
      toast({
        title: "Certificate Verified",
        description: "This certificate is authentic and has been verified on the blockchain",
      });
    }, 2000);
  };

  if (!certificate) {
    return (
      <div className="page-container">
        <p>Certificate not found</p>
      </div>
    );
  }

  return (
    <div className="page-container pb-12">
      <div className="flex items-center gap-3 mb-6">
        <Link to="/credentials" className="text-vidya-primary hover:underline text-sm">
          &larr; Back to Credentials
        </Link>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="border rounded-lg overflow-hidden bg-white">
            <div className="bg-gradient-to-r from-vidya-primary to-vidya-dark p-6 text-white">
              <div className="flex justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{certificate.title}</h2>
                  <p>Certificate of Completion</p>
                </div>
                <div className="text-right">
                  <p className="text-sm opacity-80">Credential ID</p>
                  <p className="font-mono text-xs">{certificate.credentialId}</p>
                </div>
              </div>
            </div>
            
            <div className="p-8">
              <div className="mb-8 text-center">
                <p className="text-gray-500 mb-2">This certifies that</p>
                <h3 className="text-2xl font-serif mb-2">{certificate.recipient}</h3>
                <p className="text-gray-500">
                  has successfully completed the course
                  <br />
                  <span className="font-medium">{certificate.title}</span>
                </p>
              </div>
              
              <div className="border-t border-b py-4 mb-8 flex justify-center">
                <img 
                  src={certificate.image} 
                  alt="Certificate" 
                  className="max-h-60"
                />
              </div>
              
              <div className="flex justify-between text-sm">
                <div>
                  <p>
                    <span className="text-gray-500">Issue Date:</span>{" "}
                    <span className="font-medium">{certificate.issueDate}</span>
                  </p>
                  <p>
                    <span className="text-gray-500">Expiry:</span>{" "}
                    <span className="font-medium">{certificate.expiryDate}</span>
                  </p>
                </div>
                
                <div className="flex items-end flex-col">
                  <img 
                    src={certificate.issuer.logo} 
                    alt={certificate.issuer.name} 
                    className="h-10 mb-1"
                  />
                  <p className="text-xs">{certificate.issuer.name}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <Card className="mb-6">
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between">
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2" 
                  onClick={handleDownload}
                >
                  <Download size={16} />
                  Download PDF
                </Button>
                
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2"
                  onClick={handleShare}
                >
                  <Share2 size={16} />
                  Share
                </Button>
              </div>
              
              <Button 
                className="w-full bg-vidya-primary hover:bg-vidya-dark flex items-center gap-2 justify-center"
                onClick={handleVerify}
                disabled={verifying}
              >
                <Shield size={16} />
                {verifying ? "Verifying..." : "Verify Authenticity"}
              </Button>
            </CardContent>
          </Card>
          
          <Card className="mb-6">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-3">Blockchain Verification</h3>
              
              {certificate.blockchain.verified && (
                <div className="flex items-center gap-2 text-green-600 mb-3">
                  <CheckCircle size={18} />
                  <span className="font-medium">Verified on blockchain</span>
                </div>
              )}
              
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-500">Blockchain Hash</p>
                  <p className="font-mono text-xs break-all">
                    {certificate.blockchain.hash}
                  </p>
                </div>
                
                <div>
                  <p className="text-gray-500">Timestamp</p>
                  <p>{new Date(certificate.blockchain.timestamp).toLocaleString()}</p>
                </div>
              </div>
              
              <div className="mt-4">
                <Link
                  to="/credentials/verify"
                  className="text-vidya-primary hover:underline text-sm"
                >
                  Verify another certificate
                </Link>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-3">Skills Certified</h3>
              
              <div className="flex flex-wrap gap-2">
                {certificate.skills.map((skill: string) => (
                  <div 
                    key={skill} 
                    className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-xs"
                  >
                    {skill}
                  </div>
                ))}
              </div>
              
              <div className="mt-4 text-center">
                <Link
                  to="/progress"
                  className="text-vidya-primary hover:underline text-sm"
                >
                  View all your skills
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CertificateViewPage;
