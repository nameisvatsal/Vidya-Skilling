
import { VidyaHub } from "@/integrations/supabase/schema";

export const mockHubs: VidyaHub[] = [
  {
    id: "1",
    name: "Heartland Learning Center",
    address: "156 Main Street, Farmville",
    location: "Rural Iowa",
    description: "A community hub providing digital literacy and vocational training for farming communities",
    contact_email: "heartland@vidyahubs.org",
    contact_phone: "515-555-7890",
    image_url: "https://images.unsplash.com/photo-1472396961693-142e6e269027",
    facilities: ["Computers", "Internet", "Library", "Study Room"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "2",
    name: "Mountain View Knowledge Hub",
    address: "78 Pine Valley Road",
    location: "Rural Montana",
    description: "High-altitude learning center serving remote mountain communities with satellite internet",
    contact_email: "mountainview@vidyahubs.org",
    contact_phone: "406-555-1234",
    image_url: "https://images.unsplash.com/photo-1485833077593-4278bba3f11f",
    facilities: ["Satellite Internet", "Solar Power", "Study Space", "Computer Lab"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "3",
    name: "Desert Oasis Learning Center",
    address: "45 Sunset Drive",
    location: "Rural Arizona",
    description: "Solar-powered educational hub for rural desert communities, focusing on local agricultural innovations",
    contact_email: "desertoasis@vidyahubs.org",
    contact_phone: "520-555-9876",
    image_url: "https://images.unsplash.com/photo-1493962853295-0fd70327578a",
    facilities: ["Solar Lab", "Computers", "Internet", "Workshop Space"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "4",
    name: "Bayou Knowledge Center",
    address: "123 Cypress Lane",
    location: "Rural Louisiana",
    description: "Community-focused learning hub providing education and job training for coastal communities",
    contact_email: "bayou@vidyahubs.org",
    contact_phone: "337-555-6543",
    image_url: "https://images.unsplash.com/photo-1465379944081-7f47de8d74ac",
    facilities: ["Internet Cafe", "Meeting Room", "Computer Lab", "Job Center"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "5",
    name: "Appalachian Learning Co-op",
    address: "67 Mountain View Road",
    location: "Rural West Virginia",
    description: "Community cooperative providing educational resources and internet access to rural mountain communities",
    contact_email: "appalachian@vidyahubs.org",
    contact_phone: "304-555-8765",
    image_url: "https://images.unsplash.com/photo-1466721591366-2d5fba72006d",
    facilities: ["High-Speed Internet", "Library", "Computer Lab", "Community Kitchen"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "6",
    name: "Great Plains Digital Center",
    address: "435 Prairie Road",
    location: "Rural Nebraska",
    description: "Digital literacy center serving farming communities across the Great Plains region",
    contact_email: "greatplains@vidyahubs.org",
    contact_phone: "308-555-4321",
    image_url: "https://images.unsplash.com/photo-1469041797191-50ace28483c3",
    facilities: ["Computer Lab", "High-Speed Internet", "Training Room", "Agriculture Tech Demo"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "7",
    name: "Delta Community Knowledge Hub",
    address: "89 River Road",
    location: "Rural Mississippi",
    description: "Educational center focused on providing digital skills and vocational training to delta communities",
    contact_email: "delta@vidyahubs.org",
    contact_phone: "662-555-9090",
    image_url: "https://images.unsplash.com/photo-1469041797191-50ace28483c3",
    facilities: ["Computer Lab", "Audio/Visual Room", "Community Space", "Job Training Center"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "8",
    name: "Northern Frontier Learning Center",
    address: "23 Wilderness Trail",
    location: "Rural Alaska",
    description: "Remote learning hub with satellite internet providing educational resources to isolated communities",
    contact_email: "frontier@vidyahubs.org",
    contact_phone: "907-555-3030",
    image_url: "https://images.unsplash.com/photo-1472396961693-142e6e269027",
    facilities: ["Satellite Internet", "Generator Power", "Computer Lab", "Community Space"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];
