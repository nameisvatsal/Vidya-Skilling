
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import VoiceInput from "@/components/VoiceInput";
import { useAuth } from "@/contexts/AuthContext";

const educationLevels = [
  "High School",
  "Higher Secondary",
  "Diploma",
  "Undergraduate",
  "Graduate",
  "Postgraduate",
  "Other"
];

const languages = ["English", "Hindi", "Tamil", "Telugu", "Kannada", "Malayalam"];

const UserProfileSetupPage = () => {
  const { user, updateUserProfile } = useAuth();
  const [formData, setFormData] = useState({
    fullName: user?.name || "",
    location: "",
    education: "",
    preferredLanguage: "",
    interests: "",
    phone: "",
    goals: "",
  });
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { name: string; value: string }
  ) => {
    const { name, value } = "target" in e ? e.target : e;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleVoiceInput = (text: string) => {
    setFormData((prev) => ({ ...prev, goals: text }));
  };

  const handleNext = () => {
    if (step === 1) {
      if (!formData.fullName || !formData.location || !formData.education) {
        toast({
          title: "Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!formData.preferredLanguage || !formData.interests) {
        toast({
          title: "Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }
      setStep(3);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Save to local storage for demo purposes
      localStorage.setItem("vidya_user_profile", JSON.stringify(formData));
      
      // Update user context with profile completed flag
      updateUserProfile({ 
        name: formData.fullName,
        profileCompleted: true
      });
      
      toast({
        title: "Success",
        description: "Profile setup completed",
      });
      
      navigate("/");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 px-4 py-8">
      <div className="w-full max-w-lg">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-vidya-primary">Vidya</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Setup your learning profile</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Profile Setup</CardTitle>
            <CardDescription>
              Step {step} of 3: {step === 1 ? "Basic Information" : step === 2 ? "Preferences" : "Goals"}
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent>
              {step === 1 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="fullName" className="text-sm font-medium">
                      Full Name*
                    </label>
                    <Input
                      id="fullName"
                      name="fullName"
                      placeholder="Your full name"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="location" className="text-sm font-medium">
                      Location*
                    </label>
                    <Input
                      id="location"
                      name="location"
                      placeholder="City, State"
                      value={formData.location}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="education" className="text-sm font-medium">
                      Education Level*
                    </label>
                    <Select 
                      value={formData.education} 
                      onValueChange={(value) => handleSelectChange("education", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select education level" />
                      </SelectTrigger>
                      <SelectContent>
                        {educationLevels.map((level) => (
                          <SelectItem key={level} value={level}>
                            {level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium">
                      Phone Number (Optional)
                    </label>
                    <Input
                      id="phone"
                      name="phone"
                      placeholder="Your phone number"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              )}
              
              {step === 2 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="preferredLanguage" className="text-sm font-medium">
                      Preferred Learning Language*
                    </label>
                    <Select 
                      value={formData.preferredLanguage} 
                      onValueChange={(value) => handleSelectChange("preferredLanguage", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select preferred language" />
                      </SelectTrigger>
                      <SelectContent>
                        {languages.map((language) => (
                          <SelectItem key={language} value={language}>
                            {language}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="interests" className="text-sm font-medium">
                      Skills Interested In*
                    </label>
                    <Input
                      id="interests"
                      name="interests"
                      placeholder="e.g., Web Development, Digital Marketing"
                      value={formData.interests}
                      onChange={handleChange}
                      required
                    />
                    <p className="text-xs text-gray-500">
                      Enter skills you want to learn, separated by commas
                    </p>
                  </div>
                </div>
              )}
              
              {step === 3 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="goals" className="text-sm font-medium">
                      Your Learning Goals
                    </label>
                    <Input
                      id="goals"
                      name="goals"
                      placeholder="What do you hope to achieve?"
                      value={formData.goals}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Or tell us your goals using your voice
                    </label>
                    <VoiceInput 
                      onTextCapture={handleVoiceInput} 
                      placeholder="Click the microphone to speak about your goals"
                    />
                  </div>
                </div>
              )}
            </CardContent>
            
            <CardFooter className="flex justify-between">
              {step > 1 && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleBack}
                >
                  Back
                </Button>
              )}
              
              {step < 3 ? (
                <Button 
                  type="button" 
                  className="bg-vidya-primary hover:bg-vidya-dark"
                  onClick={handleNext}
                  disabled={isLoading}
                >
                  Next
                </Button>
              ) : (
                <Button 
                  type="submit" 
                  className="bg-vidya-primary hover:bg-vidya-dark"
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Complete Setup"}
                </Button>
              )}
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default UserProfileSetupPage;
