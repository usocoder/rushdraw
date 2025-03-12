
// Follow Deno's ES modules approach
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log("Processing request to seed-case-items");
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log("Handling OPTIONS request");
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    
    if (!supabaseUrl || !supabaseKey) {
      console.error("Missing Supabase URL or key");
      throw new Error("Missing environment variables for Supabase connection");
    }
    
    console.log("Initializing Supabase client");
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // First, get all existing cases
    console.log("Fetching existing cases...");
    const { data: existingCases, error: casesError } = await supabase
      .from('cases')
      .select('id, name, price');
      
    if (casesError) {
      console.error("Error fetching existing cases:", casesError);
      throw casesError;
    }
    
    if (!existingCases || existingCases.length === 0) {
      console.error("No existing cases found");
      throw new Error("No cases found to add items to");
    }
    
    console.log(`Found ${existingCases.length} existing cases`);
    
    // Define sample items that will be added to each case
    const sampleItems = [
      // Electronics
      { name: "Apple iPhone 14", value: 800, odds: 0.05, rarity: "epic", image_url: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b" },
      { name: "Samsung Galaxy S24", value: 850, odds: 0.05, rarity: "epic", image_url: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b" },
      { name: "Sony PlayStation 5", value: 500, odds: 0.1, rarity: "rare", image_url: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b" },
      { name: "Nintendo Switch OLED", value: 350, odds: 0.2, rarity: "uncommon", image_url: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b" },
      { name: "Apple AirPods Pro", value: 250, odds: 0.25, rarity: "uncommon", image_url: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b" },
      
      // Fashion
      { name: "Gucci Leather Belt", value: 450, odds: 0.1, rarity: "rare", image_url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158" },
      { name: "Louis Vuitton Cap", value: 600, odds: 0.05, rarity: "epic", image_url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158" },
      { name: "Nike Air Jordan 1 Retro", value: 200, odds: 0.25, rarity: "uncommon", image_url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158" },
      { name: "Supreme Hoodie", value: 300, odds: 0.15, rarity: "rare", image_url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158" },
      { name: "Ray-Ban Aviator Sunglasses", value: 180, odds: 0.3, rarity: "common", image_url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158" },
      
      // Jewelry & Luxury
      { name: "Rolex Submariner Watch", value: 10000, odds: 0.01, rarity: "legendary", image_url: "https://images.unsplash.com/photo-1527576539890-dfa815648363" },
      { name: "Cartier Love Bracelet", value: 6500, odds: 0.02, rarity: "legendary", image_url: "https://images.unsplash.com/photo-1527576539890-dfa815648363" },
      { name: "Tiffany & Co. Silver Necklace", value: 300, odds: 0.25, rarity: "uncommon", image_url: "https://images.unsplash.com/photo-1527576539890-dfa815648363" },
      { name: "Gold Chain (14K, 20g)", value: 1000, odds: 0.1, rarity: "rare", image_url: "https://images.unsplash.com/photo-1527576539890-dfa815648363" },
      { name: "Diamond Stud Earrings (1 carat)", value: 2000, odds: 0.05, rarity: "epic", image_url: "https://images.unsplash.com/photo-1527576539890-dfa815648363" }
    ];
    
    console.log(`Adding ${sampleItems.length} items to each case...`);
    
    // Count of successfully added items
    let addedItemsCount = 0;
    
    // Add items to each case
    for (const caseItem of existingCases) {
      console.log(`Processing case: ${caseItem.name} (ID: ${caseItem.id})`);
      
      // Check if case already has items
      const { data: existingItems, error: itemsError } = await supabase
        .from('case_items')
        .select('id')
        .eq('case_id', caseItem.id)
        .limit(1);
        
      if (itemsError) {
        console.error(`Error checking existing items for case ${caseItem.name}:`, itemsError);
        continue; // Skip this case and proceed to the next one
      }
      
      if (existingItems && existingItems.length > 0) {
        console.log(`Case ${caseItem.name} already has items. Skipping...`);
        continue; // Skip this case if it already has items
      }
      
      for (const item of sampleItems) {
        // Calculate multiplier based on case price and item value
        const multiplier = parseFloat((item.value / caseItem.price).toFixed(2));
        
        const { data: insertedItem, error: insertError } = await supabase
          .from('case_items')
          .insert({
            name: item.name,
            value: item.value,
            odds: item.odds,
            multiplier: multiplier,
            rarity: item.rarity,
            image_url: item.image_url,
            case_id: caseItem.id
          })
          .select('id')
          .single();
          
        if (insertError) {
          console.error(`Error adding item ${item.name} to case ${caseItem.name}:`, insertError);
        } else {
          console.log(`Added item: ${item.name} to case: ${caseItem.name} with multiplier: ${multiplier} (ID: ${insertedItem.id})`);
          addedItemsCount++;
        }
      }
    }

    return new Response(
      JSON.stringify({ 
        message: "Successfully added items to existing cases", 
        itemsAdded: addedItemsCount,
        casesUpdated: existingCases.length
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error("Error seeding database:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Unknown error occurred" }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
