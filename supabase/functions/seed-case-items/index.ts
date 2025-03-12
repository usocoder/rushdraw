
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
    
    // This could be a payload in the request body, but for simplicity let's define it here
    const categories = [
      {
        name: "Electronics",
        price: 350,
        image_url: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
        best_drop: "iPhone 14",
        items: [
          { name: "Apple iPhone 14", value: 800, odds: 0.05, rarity: "epic", image_url: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b" },
          { name: "Samsung Galaxy S24", value: 850, odds: 0.05, rarity: "epic", image_url: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b" },
          { name: "Sony PlayStation 5", value: 500, odds: 0.1, rarity: "rare", image_url: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b" },
          { name: "Xbox Series X", value: 500, odds: 0.1, rarity: "rare", image_url: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b" },
          { name: "Nintendo Switch OLED", value: 350, odds: 0.2, rarity: "uncommon", image_url: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b" },
          { name: "Apple AirPods Pro", value: 250, odds: 0.25, rarity: "uncommon", image_url: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b" },
          { name: "Samsung Galaxy Buds 2", value: 150, odds: 0.35, rarity: "common", image_url: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b" },
          { name: "Apple Watch Series 9", value: 400, odds: 0.15, rarity: "rare", image_url: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b" },
          { name: "Fitbit Charge 6", value: 160, odds: 0.3, rarity: "common", image_url: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b" },
          { name: "GoPro HERO12 Black", value: 400, odds: 0.15, rarity: "rare", image_url: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b" }
        ]
      },
      {
        name: "Fashion & Apparel",
        price: 250,
        image_url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
        best_drop: "Canada Goose Parka",
        items: [
          { name: "Gucci Leather Belt", value: 450, odds: 0.1, rarity: "rare", image_url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158" },
          { name: "Louis Vuitton Cap", value: 600, odds: 0.05, rarity: "epic", image_url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158" },
          { name: "Nike Air Jordan 1 Retro", value: 200, odds: 0.25, rarity: "uncommon", image_url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158" },
          { name: "Adidas Yeezy Boost 350", value: 250, odds: 0.2, rarity: "uncommon", image_url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158" },
          { name: "Canada Goose Parka", value: 1200, odds: 0.02, rarity: "legendary", image_url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158" },
          { name: "Ray-Ban Aviator Sunglasses", value: 180, odds: 0.3, rarity: "common", image_url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158" },
          { name: "Supreme Hoodie", value: 300, odds: 0.15, rarity: "rare", image_url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158" },
          { name: "The North Face Puffer Jacket", value: 250, odds: 0.2, rarity: "uncommon", image_url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158" },
          { name: "Levi's 501 Jeans", value: 80, odds: 0.5, rarity: "common", image_url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158" },
          { name: "Vans Old Skool Sneakers", value: 70, odds: 0.55, rarity: "common", image_url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158" }
        ]
      },
      {
        name: "Jewelry & Accessories",
        price: 950,
        image_url: "https://images.unsplash.com/photo-1527576539890-dfa815648363",
        best_drop: "Rolex Submariner Watch",
        items: [
          { name: "Rolex Submariner Watch", value: 10000, odds: 0.01, rarity: "legendary", image_url: "https://images.unsplash.com/photo-1527576539890-dfa815648363" },
          { name: "Cartier Love Bracelet", value: 6500, odds: 0.02, rarity: "legendary", image_url: "https://images.unsplash.com/photo-1527576539890-dfa815648363" },
          { name: "Pandora Charm Bracelet", value: 100, odds: 0.5, rarity: "common", image_url: "https://images.unsplash.com/photo-1527576539890-dfa815648363" },
          { name: "Tiffany & Co. Silver Necklace", value: 300, odds: 0.25, rarity: "uncommon", image_url: "https://images.unsplash.com/photo-1527576539890-dfa815648363" },
          { name: "Gold Chain (14K, 20g)", value: 1000, odds: 0.1, rarity: "rare", image_url: "https://images.unsplash.com/photo-1527576539890-dfa815648363" },
          { name: "Diamond Stud Earrings (1 carat)", value: 2000, odds: 0.05, rarity: "epic", image_url: "https://images.unsplash.com/photo-1527576539890-dfa815648363" },
          { name: "Swarovski Crystal Ring", value: 150, odds: 0.4, rarity: "common", image_url: "https://images.unsplash.com/photo-1527576539890-dfa815648363" },
          { name: "Fossil Leather Wallet", value: 60, odds: 0.6, rarity: "common", image_url: "https://images.unsplash.com/photo-1527576539890-dfa815648363" },
          { name: "Oakley Sports Sunglasses", value: 140, odds: 0.45, rarity: "common", image_url: "https://images.unsplash.com/photo-1527576539890-dfa815648363" },
          { name: "Michael Kors Handbag", value: 350, odds: 0.2, rarity: "uncommon", image_url: "https://images.unsplash.com/photo-1527576539890-dfa815648363" }
        ]
      },
      {
        name: "Collectibles & Memorabilia",
        price: 2000,
        image_url: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9",
        best_drop: "Vintage Rolex Daytona",
        items: [
          { name: "Signed Michael Jordan Basketball", value: 1500, odds: 0.08, rarity: "epic", image_url: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9" },
          { name: "Vintage Rolex Daytona (1970s)", value: 20000, odds: 0.005, rarity: "legendary", image_url: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9" },
          { name: "Limited Edition Funko Pop", value: 50, odds: 0.6, rarity: "common", image_url: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9" },
          { name: "Star Wars Lightsaber Replica", value: 200, odds: 0.3, rarity: "uncommon", image_url: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9" },
          { name: "Autographed Beatles Vinyl", value: 5000, odds: 0.03, rarity: "epic", image_url: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9" },
          { name: "Pokemon Charizard Card (1st Ed.)", value: 10000, odds: 0.01, rarity: "legendary", image_url: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9" },
          { name: "Marvel Avengers Poster (Signed)", value: 300, odds: 0.25, rarity: "uncommon", image_url: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9" },
          { name: "Vintage Coca-Cola Sign", value: 150, odds: 0.35, rarity: "common", image_url: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9" },
          { name: "LeBron James Rookie Card", value: 2500, odds: 0.05, rarity: "epic", image_url: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9" },
          { name: "Antique Pocket Watch", value: 400, odds: 0.2, rarity: "rare", image_url: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9" }
        ]
      },
      {
        name: "Home & Lifestyle",
        price: 300,
        image_url: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1",
        best_drop: "Samsung 55\" QLED TV",
        items: [
          { name: "Dyson V15 Vacuum", value: 700, odds: 0.1, rarity: "rare", image_url: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1" },
          { name: "Nespresso Vertuo Coffee Machine", value: 200, odds: 0.3, rarity: "uncommon", image_url: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1" },
          { name: "Instant Pot Duo 6Qt", value: 100, odds: 0.5, rarity: "common", image_url: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1" },
          { name: "Bose QuietComfort 45 Headphones", value: 330, odds: 0.25, rarity: "uncommon", image_url: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1" },
          { name: "Samsung 55\" QLED TV", value: 800, odds: 0.08, rarity: "epic", image_url: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1" },
          { name: "Philips Hue Smart Bulb Kit", value: 130, odds: 0.45, rarity: "common", image_url: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1" },
          { name: "Le Creuset Dutch Oven", value: 400, odds: 0.15, rarity: "rare", image_url: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1" },
          { name: "Yeti Tundra 45 Cooler", value: 300, odds: 0.2, rarity: "uncommon", image_url: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1" },
          { name: "Roomba i7 Robot Vacuum", value: 500, odds: 0.12, rarity: "rare", image_url: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1" },
          { name: "Sonos One Speaker", value: 220, odds: 0.3, rarity: "uncommon", image_url: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1" }
        ]
      },
      {
        name: "Sports & Outdoor",
        price: 400,
        image_url: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
        best_drop: "Peloton Bike+",
        items: [
          { name: "TaylorMade Stealth Driver (Golf)", value: 600, odds: 0.12, rarity: "rare", image_url: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b" },
          { name: "Peloton Bike+", value: 2500, odds: 0.03, rarity: "legendary", image_url: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b" },
          { name: "Callaway Golf Club Set", value: 1000, odds: 0.07, rarity: "epic", image_url: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b" },
          { name: "Wilson NBA Basketball", value: 80, odds: 0.55, rarity: "common", image_url: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b" },
          { name: "Under Armour Duffel Bag", value: 50, odds: 0.65, rarity: "common", image_url: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b" },
          { name: "Garmin Edge 530 Bike Computer", value: 300, odds: 0.25, rarity: "uncommon", image_url: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b" },
          { name: "Osprey Hiking Backpack (40L)", value: 150, odds: 0.4, rarity: "common", image_url: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b" },
          { name: "Coleman Camping Tent (4-Person)", value: 120, odds: 0.45, rarity: "common", image_url: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b" },
          { name: "Burton Snowboard", value: 450, odds: 0.15, rarity: "rare", image_url: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b" },
          { name: "Fitbit Versa 4", value: 200, odds: 0.35, rarity: "uncommon", image_url: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b" }
        ]
      },
      {
        name: "Luxury & High-End",
        price: 2500,
        image_url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
        best_drop: "Chanel Classic Flap Bag",
        items: [
          { name: "Louis Vuitton Speedy 30 Bag", value: 1500, odds: 0.1, rarity: "epic", image_url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158" },
          { name: "Gucci GG Marmont Handbag", value: 2000, odds: 0.08, rarity: "epic", image_url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158" },
          { name: "Chanel Classic Flap Bag", value: 8000, odds: 0.02, rarity: "legendary", image_url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158" },
          { name: "Hermès Silk Scarf", value: 450, odds: 0.25, rarity: "rare", image_url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158" },
          { name: "Montblanc Fountain Pen", value: 700, odds: 0.18, rarity: "rare", image_url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158" },
          { name: "Omega Seamaster Watch", value: 5500, odds: 0.03, rarity: "legendary", image_url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158" },
          { name: "Prada Leather Jacket", value: 3000, odds: 0.06, rarity: "epic", image_url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158" },
          { name: "Versace Sunglasses", value: 300, odds: 0.3, rarity: "uncommon", image_url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158" },
          { name: "Burberry Trench Coat", value: 2200, odds: 0.07, rarity: "epic", image_url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158" },
          { name: "Balenciaga Triple S Sneakers", value: 1000, odds: 0.12, rarity: "rare", image_url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158" }
        ]
      },
      {
        name: "Miscellaneous & Fun",
        price: 200,
        image_url: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9",
        best_drop: "DJI Mini 4 Pro Drone",
        items: [
          { name: "DJI Mini 4 Pro Drone", value: 760, odds: 0.1, rarity: "epic", image_url: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9" },
          { name: "Lego Millennium Falcon Set", value: 850, odds: 0.08, rarity: "epic", image_url: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9" },
          { name: "Polaroid Camera (OneStep+)", value: 140, odds: 0.4, rarity: "uncommon", image_url: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9" },
          { name: "Razer BlackWidow Keyboard", value: 150, odds: 0.35, rarity: "uncommon", image_url: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9" },
          { name: "Logitech G Pro Wireless Mouse", value: 130, odds: 0.4, rarity: "uncommon", image_url: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9" },
          { name: "Oculus Quest 3 VR Headset", value: 500, odds: 0.15, rarity: "rare", image_url: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9" },
          { name: "Tamagotchi Original", value: 25, odds: 0.8, rarity: "common", image_url: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9" },
          { name: "JBL Flip 6 Speaker", value: 130, odds: 0.45, rarity: "uncommon", image_url: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9" },
          { name: "Anker Power Bank (20,000mAh)", value: 60, odds: 0.7, rarity: "common", image_url: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9" },
          { name: "Hydro Flask Water Bottle (32oz)", value: 45, odds: 0.75, rarity: "common", image_url: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9" }
        ]
      },
    ];

    // Create cases and items
    for (const category of categories) {
      // Insert the case
      const { data: caseData, error: caseError } = await supabase
        .from('cases')
        .insert({
          name: category.name,
          price: category.price,
          image_url: category.image_url,
          best_drop: category.best_drop,
          category: category.price < 50 ? 'budget' : 
                  category.price < 500 ? 'mid' : 
                  category.price < 5000 ? 'high' : 'premium'
        })
        .select('id')
        .single();
      
      if (caseError) {
        console.error(`Error creating case ${category.name}:`, caseError);
        continue;
      }
      
      // Insert items with calculated multipliers
      for (const item of category.items) {
        const multiplier = parseFloat((item.value / category.price).toFixed(2));
        
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
        message: "Successfully added all items to database", 
        categoriesAdded: categories.length 
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
