
// Follow Deno's ES modules approach
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing environment variables for Supabase connection");
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Fetch all existing cases
    const { data: cases, error: casesError } = await supabase
      .from('cases')
      .select('id, name, price, category');
      
    if (casesError) {
      throw casesError;
    }
    
    if (!cases || cases.length === 0) {
      return new Response(
        JSON.stringify({ success: false, message: "No cases found to add items to" }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      );
    }

    console.log(`Found ${cases.length} cases to add items to`);

    // Check if cases already have items
    const { data: existingItems, error: existingItemsError } = await supabase
      .from('case_items')
      .select('case_id, count(*)')
      .group('case_id');

    if (existingItemsError) {
      throw existingItemsError;
    }

    const casesWithItemCounts = new Map();
    existingItems?.forEach(item => {
      casesWithItemCounts.set(item.case_id, item.count);
    });

    // Define sample items for each category
    const premiumItems = [
      { name: "Rolex Cosmograph Daytona", value: 50000, odds: 0.0001, rarity: "legendary", multiplier: 250, image_url: "https://images.pexels.com/photos/9982457/pexels-photo-9982457.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" },
      { name: "Patek Philippe Nautilus", value: 120000, odds: 0.00005, rarity: "legendary", multiplier: 600, image_url: "https://images.pexels.com/photos/9981637/pexels-photo-9981637.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" },
      { name: "Audemars Piguet Royal Oak", value: 150000, odds: 0.00003, rarity: "legendary", multiplier: 750, image_url: "https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" },
      { name: "Richard Mille RM 11-03", value: 250000, odds: 0.00001, rarity: "legendary", multiplier: 1250, image_url: "https://images.pexels.com/photos/9981661/pexels-photo-9981661.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" },
      { name: "Ferrari 488 Pista", value: 400000, odds: 0.00001, rarity: "legendary", multiplier: 2000, image_url: "https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" },
      { name: "Lamborghini Huracán EVO", value: 300000, odds: 0.00002, rarity: "legendary", multiplier: 1500, image_url: "https://images.pexels.com/photos/3802508/pexels-photo-3802508.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" },
      { name: "Tiffany 5-Carat Diamond Ring", value: 80000, odds: 0.0001, rarity: "legendary", multiplier: 400, image_url: "https://images.pexels.com/photos/2735970/pexels-photo-2735970.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" },
      { name: "Bugatti Chiron", value: 800000, odds: 0.000005, rarity: "legendary", multiplier: 4000, image_url: "https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" }
    ];
    
    const highItems = [
      { name: "Rolex Submariner Watch", value: 10000, odds: 0.001, rarity: "epic", multiplier: 50, image_url: "https://images.pexels.com/photos/9982604/pexels-photo-9982604.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" },
      { name: "Pokemon Charizard Card (1st Ed.)", value: 10000, odds: 0.001, rarity: "epic", multiplier: 50, image_url: "https://images.pexels.com/photos/1294439/pexels-photo-1294439.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" },
      { name: "Vintage Rolex Daytona", value: 20000, odds: 0.0005, rarity: "epic", multiplier: 100, image_url: "https://images.pexels.com/photos/9981902/pexels-photo-9981902.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" },
      { name: "Cartier Love Bracelet", value: 6500, odds: 0.002, rarity: "epic", multiplier: 32.5, image_url: "https://images.pexels.com/photos/8112139/pexels-photo-8112139.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" },
      { name: "Omega Seamaster Watch", value: 5500, odds: 0.003, rarity: "epic", multiplier: 27.5, image_url: "https://images.pexels.com/photos/9982561/pexels-photo-9982561.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" },
      { name: "Diamond Stud Earrings", value: 2000, odds: 0.01, rarity: "rare", multiplier: 10, image_url: "https://images.pexels.com/photos/10912520/pexels-photo-10912520.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" },
      { name: "Peloton Bike+", value: 2500, odds: 0.008, rarity: "rare", multiplier: 12.5, image_url: "https://images.pexels.com/photos/2959233/pexels-photo-2959233.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" }
    ];
    
    const midItems = [
      { name: "Canada Goose Parka", value: 1200, odds: 0.02, rarity: "rare", multiplier: 6, image_url: "https://images.pexels.com/photos/6310924/pexels-photo-6310924.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" },
      { name: "LEGO Millennium Falcon Set", value: 850, odds: 0.04, rarity: "rare", multiplier: 4.25, image_url: "https://images.pexels.com/photos/1750187/pexels-photo-1750187.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" },
      { name: "TaylorMade Stealth Driver", value: 600, odds: 0.06, rarity: "rare", multiplier: 3, image_url: "https://images.pexels.com/photos/848618/pexels-photo-848618.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" },
      { name: "Burberry Trench Coat", value: 2200, odds: 0.01, rarity: "rare", multiplier: 11, image_url: "https://images.pexels.com/photos/7691269/pexels-photo-7691269.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" },
      { name: "Louis Vuitton Speedy Bag", value: 1500, odds: 0.015, rarity: "rare", multiplier: 7.5, image_url: "https://images.pexels.com/photos/5233271/pexels-photo-5233271.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" },
      { name: "DJI Mini 4 Pro Drone", value: 760, odds: 0.05, rarity: "uncommon", multiplier: 3.8, image_url: "https://images.pexels.com/photos/336232/pexels-photo-336232.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" },
      { name: "Apple iPhone 14", value: 800, odds: 0.04, rarity: "uncommon", multiplier: 4, image_url: "https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" },
      { name: "Samsung Galaxy S24", value: 850, odds: 0.04, rarity: "uncommon", multiplier: 4.25, image_url: "https://images.pexels.com/photos/9390250/pexels-photo-9390250.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" }
    ];
    
    const budgetItems = [
      { name: "PlayStation 5", value: 500, odds: 0.06, rarity: "uncommon", multiplier: 2.5, image_url: "https://images.pexels.com/photos/3945659/pexels-photo-3945659.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" },
      { name: "Xbox Series X", value: 500, odds: 0.06, rarity: "uncommon", multiplier: 2.5, image_url: "https://images.pexels.com/photos/2820884/pexels-photo-2820884.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" },
      { name: "Nintendo Switch OLED", value: 350, odds: 0.08, rarity: "uncommon", multiplier: 1.75, image_url: "https://images.pexels.com/photos/9072192/pexels-photo-9072192.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" },
      { name: "Apple AirPods Pro", value: 250, odds: 0.1, rarity: "uncommon", multiplier: 1.25, image_url: "https://images.pexels.com/photos/1591/technology-music-sound-things.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" },
      { name: "GoPro HERO12 Black", value: 400, odds: 0.07, rarity: "uncommon", multiplier: 2, image_url: "https://images.pexels.com/photos/1051371/pexels-photo-1051371.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" },
      { name: "Nike Air Jordan 1 Retro", value: 200, odds: 0.15, rarity: "common", multiplier: 1, image_url: "https://images.pexels.com/photos/4462781/pexels-photo-4462781.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" },
      { name: "Adidas Yeezy Boost 350", value: 250, odds: 0.12, rarity: "common", multiplier: 1.25, image_url: "https://images.pexels.com/photos/1478442/pexels-photo-1478442.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" },
      { name: "Bose QuietComfort Headphones", value: 330, odds: 0.09, rarity: "common", multiplier: 1.65, image_url: "https://images.pexels.com/photos/577769/pexels-photo-577769.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" },
      { name: "Dyson V15 Vacuum", value: 700, odds: 0.04, rarity: "uncommon", multiplier: 3.5, image_url: "https://images.pexels.com/photos/4108714/pexels-photo-4108714.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" },
      { name: "North Face Puffer Jacket", value: 250, odds: 0.12, rarity: "common", multiplier: 1.25, image_url: "https://images.pexels.com/photos/7149401/pexels-photo-7149401.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" }
    ];

    let totalItemsAdded = 0;
    const itemsAddedPerCase = {};

    // Add items to each case based on category
    for (const caseData of cases) {
      let itemsToAdd = [];
      const casePrice = caseData.price;
      const caseCategory = caseData.category;
      
      // Skip if case already has items
      const existingItemCount = casesWithItemCounts.get(caseData.id) || 0;
      if (existingItemCount > 0) {
        console.log(`Skipping case ${caseData.name} as it already has ${existingItemCount} items`);
        itemsAddedPerCase[caseData.id] = 0;
        continue;
      }
      
      // Select items based on case category and price
      if (caseCategory === 'premium' || casePrice >= 5000) {
        itemsToAdd = [...premiumItems, ...highItems.slice(0, 3)];
      } else if (caseCategory === 'high' || casePrice >= 500) {
        itemsToAdd = [...highItems, ...midItems.slice(0, 2), ...premiumItems.slice(0, 1)];
      } else if (caseCategory === 'mid' || casePrice >= 50) {
        itemsToAdd = [...midItems, ...budgetItems.slice(0, 2), ...highItems.slice(0, 1)];
      } else {
        itemsToAdd = [...budgetItems, ...midItems.slice(0, 1)];
      }
      
      // Prepare items for insertion with the case_id
      const preparedItems = itemsToAdd.map(item => ({
        ...item,
        case_id: caseData.id
      }));
      
      // Insert items
      const { data: insertedItems, error: insertError } = await supabase
        .from('case_items')
        .insert(preparedItems)
        .select();
        
      if (insertError) {
        console.error(`Error adding items to case ${caseData.name}:`, insertError);
        continue;
      }
      
      console.log(`Added ${insertedItems?.length || 0} items to case ${caseData.name}`);
      
      totalItemsAdded += insertedItems?.length || 0;
      itemsAddedPerCase[caseData.id] = insertedItems?.length || 0;
    }
    
    // Update best_drop for each case
    for (const caseData of cases) {
      if (itemsAddedPerCase[caseData.id] > 0) {
        // Get the highest value item for this case
        const { data: bestItems, error: bestItemError } = await supabase
          .from('case_items')
          .select('name, value')
          .eq('case_id', caseData.id)
          .order('value', { ascending: false })
          .limit(1);
          
        if (!bestItemError && bestItems && bestItems.length > 0) {
          // Update the case with the best item
          await supabase
            .from('cases')
            .update({ best_drop: bestItems[0].name })
            .eq('id', caseData.id);
            
          console.log(`Updated best_drop for case ${caseData.name} to ${bestItems[0].name}`);
        }
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: `Successfully added items to cases`,
        totalItemsAdded,
        itemsAddedPerCase
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    console.error("Error in seed-case-items function:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || "Unknown error occurred" 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
