
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Define all items that can be used across different cases
    const allItems = [
      // Electronics
      { name: "Apple iPhone 14", value: 800, odds: 0.05, rarity: "epic", image_url: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b" },
      { name: "Samsung Galaxy S24", value: 850, odds: 0.05, rarity: "epic", image_url: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b" },
      { name: "Sony PlayStation 5", value: 500, odds: 0.1, rarity: "rare", image_url: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b" },
      { name: "Xbox Series X", value: 500, odds: 0.1, rarity: "rare", image_url: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b" },
      { name: "Nintendo Switch OLED", value: 350, odds: 0.2, rarity: "uncommon", image_url: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b" },
      { name: "Apple AirPods Pro", value: 250, odds: 0.25, rarity: "uncommon", image_url: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b" },
      { name: "Samsung Galaxy Buds 2", value: 150, odds: 0.35, rarity: "common", image_url: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b" },
      { name: "Apple Watch Series 9", value: 400, odds: 0.15, rarity: "rare", image_url: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b" },
      { name: "Fitbit Charge 6", value: 160, odds: 0.3, rarity: "common", image_url: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b" },
      { name: "GoPro HERO12 Black", value: 400, odds: 0.15, rarity: "rare", image_url: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b" },
      
      // Fashion
      { name: "Gucci Leather Belt", value: 450, odds: 0.1, rarity: "rare", image_url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158" },
      { name: "Louis Vuitton Cap", value: 600, odds: 0.05, rarity: "epic", image_url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158" },
      { name: "Nike Air Jordan 1 Retro", value: 200, odds: 0.25, rarity: "uncommon", image_url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158" },
      { name: "Adidas Yeezy Boost 350", value: 250, odds: 0.2, rarity: "uncommon", image_url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158" },
      { name: "Canada Goose Parka", value: 1200, odds: 0.02, rarity: "legendary", image_url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158" },
      { name: "Ray-Ban Aviator Sunglasses", value: 180, odds: 0.3, rarity: "common", image_url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158" },
      { name: "Supreme Hoodie", value: 300, odds: 0.15, rarity: "rare", image_url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158" },
      { name: "The North Face Puffer Jacket", value: 250, odds: 0.2, rarity: "uncommon", image_url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158" },
      { name: "Levi's 501 Jeans", value: 80, odds: 0.5, rarity: "common", image_url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158" },
      { name: "Vans Old Skool Sneakers", value: 70, odds: 0.55, rarity: "common", image_url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158" },

      // Jewelry & Accessories
      { name: "Rolex Submariner Watch", value: 10000, odds: 0.01, rarity: "legendary", image_url: "https://images.unsplash.com/photo-1527576539890-dfa815648363" },
      { name: "Cartier Love Bracelet", value: 6500, odds: 0.02, rarity: "legendary", image_url: "https://images.unsplash.com/photo-1527576539890-dfa815648363" },
      { name: "Pandora Charm Bracelet", value: 100, odds: 0.5, rarity: "common", image_url: "https://images.unsplash.com/photo-1527576539890-dfa815648363" },
      { name: "Tiffany & Co. Silver Necklace", value: 300, odds: 0.25, rarity: "uncommon", image_url: "https://images.unsplash.com/photo-1527576539890-dfa815648363" },
      { name: "Gold Chain (14K, 20g)", value: 1000, odds: 0.1, rarity: "rare", image_url: "https://images.unsplash.com/photo-1527576539890-dfa815648363" },
      { name: "Diamond Stud Earrings (1 carat)", value: 2000, odds: 0.05, rarity: "epic", image_url: "https://images.unsplash.com/photo-1527576539890-dfa815648363" },
      { name: "Swarovski Crystal Ring", value: 150, odds: 0.4, rarity: "common", image_url: "https://images.unsplash.com/photo-1527576539890-dfa815648363" },
      { name: "Fossil Leather Wallet", value: 60, odds: 0.6, rarity: "common", image_url: "https://images.unsplash.com/photo-1527576539890-dfa815648363" },
      { name: "Oakley Sports Sunglasses", value: 140, odds: 0.45, rarity: "common", image_url: "https://images.unsplash.com/photo-1527576539890-dfa815648363" },
      { name: "Michael Kors Handbag", value: 350, odds: 0.2, rarity: "uncommon", image_url: "https://images.unsplash.com/photo-1527576539890-dfa815648363" },

      // Collectibles
      { name: "Signed Michael Jordan Basketball", value: 1500, odds: 0.08, rarity: "epic", image_url: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9" },
      { name: "Vintage Rolex Daytona (1970s)", value: 20000, odds: 0.005, rarity: "legendary", image_url: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9" },
      { name: "Limited Edition Funko Pop", value: 50, odds: 0.6, rarity: "common", image_url: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9" },
      { name: "Star Wars Lightsaber Replica", value: 200, odds: 0.3, rarity: "uncommon", image_url: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9" },
      { name: "Autographed Beatles Vinyl", value: 5000, odds: 0.03, rarity: "epic", image_url: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9" },
      { name: "Pokemon Charizard Card (1st Ed.)", value: 10000, odds: 0.01, rarity: "legendary", image_url: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9" },
      { name: "Marvel Avengers Poster (Signed)", value: 300, odds: 0.25, rarity: "uncommon", image_url: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9" },
      { name: "Vintage Coca-Cola Sign", value: 150, odds: 0.35, rarity: "common", image_url: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9" },
      { name: "LeBron James Rookie Card", value: 2500, odds: 0.05, rarity: "epic", image_url: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9" },
      { name: "Antique Pocket Watch", value: 400, odds: 0.2, rarity: "rare", image_url: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9" },

      // Home & Lifestyle
      { name: "Dyson V15 Vacuum", value: 700, odds: 0.1, rarity: "rare", image_url: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1" },
      { name: "Nespresso Vertuo Coffee Machine", value: 200, odds: 0.3, rarity: "uncommon", image_url: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1" },
      { name: "Instant Pot Duo 6Qt", value: 100, odds: 0.5, rarity: "common", image_url: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1" },
      { name: "Bose QuietComfort 45 Headphones", value: 330, odds: 0.25, rarity: "uncommon", image_url: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1" },
      { name: "Samsung 55\" QLED TV", value: 800, odds: 0.08, rarity: "epic", image_url: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1" },
      { name: "Philips Hue Smart Bulb Kit", value: 130, odds: 0.45, rarity: "common", image_url: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1" },
      { name: "Le Creuset Dutch Oven", value: 400, odds: 0.15, rarity: "rare", image_url: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1" },
      { name: "Yeti Tundra 45 Cooler", value: 300, odds: 0.2, rarity: "uncommon", image_url: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1" },
      { name: "Roomba i7 Robot Vacuum", value: 500, odds: 0.12, rarity: "rare", image_url: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1" },
      { name: "Sonos One Speaker", value: 220, odds: 0.3, rarity: "uncommon", image_url: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1" },

      // Sports & Outdoor
      { name: "TaylorMade Stealth Driver (Golf)", value: 600, odds: 0.12, rarity: "rare", image_url: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b" },
      { name: "Peloton Bike+", value: 2500, odds: 0.03, rarity: "legendary", image_url: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b" },
      { name: "Callaway Golf Club Set", value: 1000, odds: 0.07, rarity: "epic", image_url: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b" },
      { name: "Wilson NBA Basketball", value: 80, odds: 0.55, rarity: "common", image_url: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b" },
      { name: "Under Armour Duffel Bag", value: 50, odds: 0.65, rarity: "common", image_url: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b" },
      { name: "Garmin Edge 530 Bike Computer", value: 300, odds: 0.25, rarity: "uncommon", image_url: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b" },
      { name: "Osprey Hiking Backpack (40L)", value: 150, odds: 0.4, rarity: "common", image_url: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b" },
      { name: "Coleman Camping Tent (4-Person)", value: 120, odds: 0.45, rarity: "common", image_url: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b" },
      { name: "Burton Snowboard", value: 450, odds: 0.15, rarity: "rare", image_url: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b" },
      { name: "Fitbit Versa 4", value: 200, odds: 0.35, rarity: "uncommon", image_url: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b" },

      // Luxury Items
      { name: "Louis Vuitton Speedy 30 Bag", value: 1500, odds: 0.1, rarity: "epic", image_url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158" },
      { name: "Gucci GG Marmont Handbag", value: 2000, odds: 0.08, rarity: "epic", image_url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158" },
      { name: "Chanel Classic Flap Bag", value: 8000, odds: 0.02, rarity: "legendary", image_url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158" },
      { name: "Hermès Silk Scarf", value: 450, odds: 0.25, rarity: "rare", image_url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158" },
      { name: "Montblanc Fountain Pen", value: 700, odds: 0.18, rarity: "rare", image_url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158" },
      { name: "Omega Seamaster Watch", value: 5500, odds: 0.03, rarity: "legendary", image_url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158" },
      { name: "Prada Leather Jacket", value: 3000, odds: 0.06, rarity: "epic", image_url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158" },
      { name: "Versace Sunglasses", value: 300, odds: 0.3, rarity: "uncommon", image_url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158" },
      { name: "Burberry Trench Coat", value: 2200, odds: 0.07, rarity: "epic", image_url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158" },
      { name: "Balenciaga Triple S Sneakers", value: 1000, odds: 0.12, rarity: "rare", image_url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158" },

      // Miscellaneous
      { name: "DJI Mini 4 Pro Drone", value: 760, odds: 0.1, rarity: "epic", image_url: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9" },
      { name: "Lego Millennium Falcon Set", value: 850, odds: 0.08, rarity: "epic", image_url: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9" },
      { name: "Polaroid Camera (OneStep+)", value: 140, odds: 0.4, rarity: "uncommon", image_url: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9" },
      { name: "Razer BlackWidow Keyboard", value: 150, odds: 0.35, rarity: "uncommon", image_url: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9" },
      { name: "Logitech G Pro Wireless Mouse", value: 130, odds: 0.4, rarity: "uncommon", image_url: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9" },
      { name: "Oculus Quest 3 VR Headset", value: 500, odds: 0.15, rarity: "rare", image_url: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9" },
      { name: "Tamagotchi Original", value: 25, odds: 0.8, rarity: "common", image_url: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9" },
      { name: "JBL Flip 6 Speaker", value: 130, odds: 0.45, rarity: "common", image_url: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9" },
      { name: "Anker Power Bank (20,000mAh)", value: 60, odds: 0.7, rarity: "common", image_url: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9" },
      { name: "Hydro Flask Water Bottle (32oz)", value: 45, odds: 0.75, rarity: "common", image_url: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9" },

      // Food & Drink
      { name: "Johnnie Walker Blue Label Whisky", value: 250, odds: 0.25, rarity: "uncommon", image_url: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1" },
      { name: "Moët & Chandon Champagne", value: 60, odds: 0.6, rarity: "common", image_url: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1" },
      { name: "Godiva Chocolate Gift Box", value: 50, odds: 0.65, rarity: "common", image_url: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1" },
      { name: "Nespresso Capsule Set (50)", value: 40, odds: 0.7, rarity: "common", image_url: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1" },
      { name: "Starbucks Gift Card ($100)", value: 100, odds: 0.5, rarity: "common", image_url: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1" },
      { name: "Patron Tequila Silver", value: 50, odds: 0.65, rarity: "common", image_url: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1" },
      { name: "Lindt Truffle Assortment", value: 30, odds: 0.75, rarity: "common", image_url: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1" },
      { name: "Jack Daniel's Single Barrel", value: 70, odds: 0.6, rarity: "common", image_url: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1" },
      { name: "Wine Bottle (Penfolds Grange)", value: 900, odds: 0.05, rarity: "epic", image_url: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1" },
      { name: "Keurig Coffee Maker", value: 120, odds: 0.45, rarity: "common", image_url: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1" },

      // Personal Care
      { name: "Philips Sonicare Toothbrush", value: 200, odds: 0.3, rarity: "uncommon", image_url: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1" },
      { name: "Gillette Fusion Razor Set", value: 40, odds: 0.7, rarity: "common", image_url: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1" },
      { name: "Olay Regenerist Cream", value: 35, odds: 0.75, rarity: "common", image_url: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1" },
      { name: "Theragun Mini Massager", value: 200, odds: 0.3, rarity: "uncommon", image_url: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1" },
      { name: "Yankee Candle (Large)", value: 30, odds: 0.75, rarity: "common", image_url: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1" },
      { name: "L'Occitane Shea Butter Set", value: 60, odds: 0.6, rarity: "common", image_url: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1" },
      { name: "Foreo Luna 3 Facial Device", value: 220, odds: 0.25, rarity: "uncommon", image_url: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1" },
      { name: "Aromatherapy Diffuser", value: 40, odds: 0.7, rarity: "common", image_url: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1" },
      { name: "Fitbit Luxe Tracker", value: 150, odds: 0.4, rarity: "common", image_url: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1" },
      { name: "Bath & Body Works Gift Set", value: 25, odds: 0.8, rarity: "common", image_url: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1" }
    ];

    // Define cases with mixed items across categories
    const cases = [
      {
        name: "Tech Enthusiast",
        price: 350,
        image_url: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
        best_drop: "Apple iPhone 14",
        items: [
          allItems.find(item => item.name === "Apple iPhone 14")!,
          allItems.find(item => item.name === "Samsung Galaxy S24")!,
          allItems.find(item => item.name === "Sony PlayStation 5")!,
          allItems.find(item => item.name === "Apple AirPods Pro")!,
          allItems.find(item => item.name === "Samsung Galaxy Buds 2")!,
          allItems.find(item => item.name === "Nintendo Switch OLED")!,
          allItems.find(item => item.name === "GoPro HERO12 Black")!,
          allItems.find(item => item.name === "DJI Mini 4 Pro Drone")!,
          allItems.find(item => item.name === "Razer BlackWidow Keyboard")!,
          allItems.find(item => item.name === "Logitech G Pro Wireless Mouse")!
        ]
      },
      {
        name: "Luxury Collector",
        price: 1500,
        image_url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
        best_drop: "Rolex Submariner Watch",
        items: [
          allItems.find(item => item.name === "Rolex Submariner Watch")!,
          allItems.find(item => item.name === "Louis Vuitton Speedy 30 Bag")!,
          allItems.find(item => item.name === "Cartier Love Bracelet")!,
          allItems.find(item => item.name === "Vintage Rolex Daytona (1970s)")!,
          allItems.find(item => item.name === "Chanel Classic Flap Bag")!,
          allItems.find(item => item.name === "Canada Goose Parka")!,
          allItems.find(item => item.name === "Gucci Leather Belt")!,
          allItems.find(item => item.name === "Diamond Stud Earrings (1 carat)")!,
          allItems.find(item => item.name === "Omega Seamaster Watch")!,
          allItems.find(item => item.name === "Montblanc Fountain Pen")!
        ]
      },
      {
        name: "Sports Fanatic",
        price: 400,
        image_url: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
        best_drop: "Signed Michael Jordan Basketball",
        items: [
          allItems.find(item => item.name === "Signed Michael Jordan Basketball")!,
          allItems.find(item => item.name === "TaylorMade Stealth Driver (Golf)")!,
          allItems.find(item => item.name === "Peloton Bike+")!,
          allItems.find(item => item.name === "Wilson NBA Basketball")!,
          allItems.find(item => item.name === "LeBron James Rookie Card")!,
          allItems.find(item => item.name === "Under Armour Duffel Bag")!,
          allItems.find(item => item.name === "Nike Air Jordan 1 Retro")!,
          allItems.find(item => item.name === "Burton Snowboard")!,
          allItems.find(item => item.name === "Osprey Hiking Backpack (40L)")!,
          allItems.find(item => item.name === "Coleman Camping Tent (4-Person)")!
        ]
      },
      {
        name: "Collector's Dream",
        price: 1000,
        image_url: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9",
        best_drop: "Pokemon Charizard Card (1st Ed.)",
        items: [
          allItems.find(item => item.name === "Pokemon Charizard Card (1st Ed.)")!,
          allItems.find(item => item.name === "Autographed Beatles Vinyl")!,
          allItems.find(item => item.name === "Marvel Avengers Poster (Signed)")!,
          allItems.find(item => item.name === "Star Wars Lightsaber Replica")!,
          allItems.find(item => item.name === "Vintage Coca-Cola Sign")!,
          allItems.find(item => item.name === "Limited Edition Funko Pop")!,
          allItems.find(item => item.name === "Antique Pocket Watch")!,
          allItems.find(item => item.name === "Lego Millennium Falcon Set")!,
          allItems.find(item => item.name === "LeBron James Rookie Card")!,
          allItems.find(item => item.name === "Tamagotchi Original")!
        ]
      },
      {
        name: "Home Essentials",
        price: 250,
        image_url: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1",
        best_drop: "Dyson V15 Vacuum",
        items: [
          allItems.find(item => item.name === "Dyson V15 Vacuum")!,
          allItems.find(item => item.name === "Samsung 55\" QLED TV")!,
          allItems.find(item => item.name === "Roomba i7 Robot Vacuum")!,
          allItems.find(item => item.name === "Nespresso Vertuo Coffee Machine")!,
          allItems.find(item => item.name === "Le Creuset Dutch Oven")!,
          allItems.find(item => item.name === "Sonos One Speaker")!,
          allItems.find(item => item.name === "Bose QuietComfort 45 Headphones")!,
          allItems.find(item => item.name === "Philips Hue Smart Bulb Kit")!,
          allItems.find(item => item.name === "Instant Pot Duo 6Qt")!,
          allItems.find(item => item.name === "Keurig Coffee Maker")!
        ]
      },
      {
        name: "Fashion Forward",
        price: 300,
        image_url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
        best_drop: "Supreme Hoodie",
        items: [
          allItems.find(item => item.name === "Supreme Hoodie")!,
          allItems.find(item => item.name === "Adidas Yeezy Boost 350")!,
          allItems.find(item => item.name === "Louis Vuitton Cap")!,
          allItems.find(item => item.name === "The North Face Puffer Jacket")!,
          allItems.find(item => item.name === "Nike Air Jordan 1 Retro")!,
          allItems.find(item => item.name === "Ray-Ban Aviator Sunglasses")!,
          allItems.find(item => item.name === "Levi's 501 Jeans")!,
          allItems.find(item => item.name === "Vans Old Skool Sneakers")!,
          allItems.find(item => item.name === "Michael Kors Handbag")!,
          allItems.find(item => item.name === "Versace Sunglasses")!
        ]
      },
      {
        name: "Accessory Box",
        price: 200,
        image_url: "https://images.unsplash.com/photo-1527576539890-dfa815648363",
        best_drop: "Tiffany & Co. Silver Necklace",
        items: [
          allItems.find(item => item.name === "Tiffany & Co. Silver Necklace")!,
          allItems.find(item => item.name === "Pandora Charm Bracelet")!,
          allItems.find(item => item.name === "Swarovski Crystal Ring")!,
          allItems.find(item => item.name === "Fossil Leather Wallet")!,
          allItems.find(item => item.name === "Oakley Sports Sunglasses")!,
          allItems.find(item => item.name === "Ray-Ban Aviator Sunglasses")!,
          allItems.find(item => item.name === "Gold Chain (14K, 20g)")!,
          allItems.find(item => item.name === "Fitbit Luxe Tracker")!,
          allItems.find(item => item.name === "Apple Watch Series 9")!,
          allItems.find(item => item.name === "Hermès Silk Scarf")!
        ]
      },
      {
        name: "Lifestyle Pack",
        price: 100,
        image_url: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1",
        best_drop: "Johnnie Walker Blue Label Whisky",
        items: [
          allItems.find(item => item.name === "Johnnie Walker Blue Label Whisky")!,
          allItems.find(item => item.name === "Moët & Chandon Champagne")!,
          allItems.find(item => item.name === "Godiva Chocolate Gift Box")!,
          allItems.find(item => item.name === "L'Occitane Shea Butter Set")!,
          allItems.find(item => item.name === "Philips Sonicare Toothbrush")!,
          allItems.find(item => item.name === "Theragun Mini Massager")!,
          allItems.find(item => item.name === "Yankee Candle (Large)")!,
          allItems.find(item => item.name === "JBL Flip 6 Speaker")!,
          allItems.find(item => item.name === "Hydro Flask Water Bottle (32oz)")!,
          allItems.find(item => item.name === "Anker Power Bank (20,000mAh)")!
        ]
      }
    ];

    // Create cases and items
    for (const caseItem of cases) {
      // Insert the case
      const { data: caseData, error: caseError } = await supabase
        .from('cases')
        .insert({
          name: caseItem.name,
          price: caseItem.price,
          image_url: caseItem.image_url,
          best_drop: caseItem.best_drop,
          category: caseItem.price < 50 ? 'budget' : 
                  caseItem.price < 500 ? 'mid' : 
                  caseItem.price < 5000 ? 'high' : 'premium'
        })
        .select('id')
        .single();
      
      if (caseError) {
        console.error(`Error creating case ${caseItem.name}:`, caseError);
        continue;
      }
      
      // Insert items with calculated multipliers
      for (const item of caseItem.items) {
        const multiplier = parseFloat((item.value / caseItem.price).toFixed(2));
        
        await supabase
          .from('case_items')
          .insert({
            name: item.name,
            value: item.value,
            odds: item.odds,
            multiplier: multiplier,
            rarity: item.rarity,
            image_url: item.image_url,
            case_id: caseData.id
          });
      }
    }

    return new Response(
      JSON.stringify({ 
        message: "Successfully added mixed cases and items to database", 
        casesAdded: cases.length 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error("Error seeding database:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
