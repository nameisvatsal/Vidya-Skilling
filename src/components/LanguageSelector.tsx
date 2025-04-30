
import { useState } from "react";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

const languages = [
  { code: "en", name: "English" },
  { code: "hi", name: "हिंदी (Hindi)" },
  { code: "ta", name: "தமிழ் (Tamil)" },
  { code: "te", name: "తెలుగు (Telugu)" },
  { code: "kn", name: "ಕನ್ನಡ (Kannada)" },
  { code: "ml", name: "മലയാളം (Malayalam)" }
];

type LanguageSelectorProps = {
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
};

const LanguageSelector = ({
  currentLanguage = "en",
  onLanguageChange,
}: LanguageSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const handleLanguageSelect = (code: string) => {
    onLanguageChange(code);
    setIsOpen(false);
  };
  
  const currentLanguageName = languages.find(lang => lang.code === currentLanguage)?.name || "English";

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2">
          <Globe size={16} />
          <span>{currentLanguageName}</span>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-[200px] bg-white dark:bg-gray-800">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            className={`cursor-pointer ${language.code === currentLanguage ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
            onClick={() => handleLanguageSelect(language.code)}
          >
            {language.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
