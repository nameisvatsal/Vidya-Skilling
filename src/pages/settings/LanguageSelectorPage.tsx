
import { useState } from "react";
import { Check, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

const languages = [
  { code: "en", name: "English", flag: "🇺🇸", native: "English" },
  { code: "hi", name: "Hindi", flag: "🇮🇳", native: "हिंदी" },
  { code: "ta", name: "Tamil", flag: "🇮🇳", native: "தமிழ்" },
  { code: "te", name: "Telugu", flag: "🇮🇳", native: "తెలుగు" },
  { code: "kn", name: "Kannada", flag: "🇮🇳", native: "ಕನ್ನಡ" },
  { code: "ml", name: "Malayalam", flag: "🇮🇳", native: "മലയാളം" },
  { code: "bn", name: "Bengali", flag: "🇮🇳", native: "বাংলা" },
  { code: "gu", name: "Gujarati", flag: "🇮🇳", native: "ગુજરાતી" },
  { code: "mr", name: "Marathi", flag: "🇮🇳", native: "मराठी" },
  { code: "pa", name: "Punjabi", flag: "🇮🇳", native: "ਪੰਜਾਬੀ" },
];

const LanguageSelectorPage = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [downloading, setDownloading] = useState<string | null>(null);
  const [downloadedLanguages, setDownloadedLanguages] = useState<string[]>(["en"]);
  
  const handleLanguageSelect = (code: string) => {
    setSelectedLanguage(code);
    
    toast({
      title: "Language Changed",
      description: `Language has been changed to ${
        languages.find((lang) => lang.code === code)?.name
      }`,
    });
  };
  
  const handleDownloadLanguage = (code: string) => {
    if (downloadedLanguages.includes(code)) {
      return;
    }
    
    setDownloading(code);
    
    // Simulate download
    setTimeout(() => {
      setDownloadedLanguages([...downloadedLanguages, code]);
      setDownloading(null);
      
      toast({
        title: "Language Downloaded",
        description: `${
          languages.find((lang) => lang.code === code)?.name
        } has been downloaded for offline use`,
      });
    }, 2000);
  };

  return (
    <div className="page-container">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-vidya-light rounded-full">
            <Globe className="text-vidya-primary h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Language Settings</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Choose your preferred language for the platform
            </p>
          </div>
        </div>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Select Interface Language</CardTitle>
            <CardDescription>
              This will change the language of buttons, menus, and system messages
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {languages.map((language) => (
                <div
                  key={language.code}
                  className={`
                    p-3 border rounded-lg cursor-pointer flex items-center justify-between
                    ${selectedLanguage === language.code ? 'bg-vidya-light border-vidya-primary' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}
                  `}
                  onClick={() => handleLanguageSelect(language.code)}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{language.flag}</span>
                    <div>
                      <p className="font-medium">{language.name}</p>
                      <p className="text-sm text-gray-500">{language.native}</p>
                    </div>
                  </div>
                  
                  {selectedLanguage === language.code && (
                    <Check className="text-vidya-primary h-5 w-5" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Offline Language Packs</CardTitle>
            <CardDescription>
              Download languages for offline use
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-4">
              {languages.slice(0, 6).map((language) => (
                <div
                  key={language.code}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{language.flag}</span>
                    <p>{language.name}</p>
                  </div>
                  
                  {downloadedLanguages.includes(language.code) ? (
                    <div className="flex items-center text-green-600 gap-1 text-sm">
                      <Check size={16} />
                      <span>Downloaded</span>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={downloading === language.code}
                      onClick={() => handleDownloadLanguage(language.code)}
                    >
                      {downloading === language.code ? "Downloading..." : "Download"}
                    </Button>
                  )}
                </div>
              ))}
            </div>
            
            <div className="mt-6 text-sm text-gray-600 dark:text-gray-400">
              <p>
                Downloaded languages will be available when you're offline.
                Each language pack is approximately 5-10MB.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LanguageSelectorPage;
