const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.foodoscope.com/v1';

export const fetchFoodNutrients = async (query) => {
    try {
        // In a real hackathon, we'd search for the food ID first, then get nutrients
        // For this demo, let's search by name
        const response = await fetch(`${BASE_URL}/recipedb/recipeByTitle?title=${encodeURIComponent(query)}`, {
            headers: { 'Authorization': `Bearer ${API_KEY}` }
        });
        const data = await response.json();
        return data[0]; // Return the first match
    } catch (error) {
        console.error("Error fetching nutrients:", error);
        return null;
    }
};

export const fetchFlavorMatch = async (foodPair) => {
    try {
        const response = await fetch(`${BASE_URL}/flavordb/food/by-alias?food_pair=${encodeURIComponent(foodPair)}`, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching flavor match:", error);
        return null;
    }
};

export const fetchReplacement = async (alias) => {
    try {
        const response = await fetch(`${BASE_URL}/flavordb/food/by-alias?alias=${encodeURIComponent(alias)}`, {
            headers: { 'Authorization': `Bearer ${API_KEY}` }
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching replacement:", error);
        return null;
    }
};

// Mock data for the "Explanations" as requested to make it "Hackathon-Winning"
export const NUTRIENT_EXPLANATIONS = {
    Iron: "Supports red blood cell formation, helps prevent fatigue & anemia, improves oxygen transport",
    Calcium: "Strengthens bones & teeth, supports muscle contraction",
    Protein: "Essential for muscle repair, hormone production, and immune function",
    VitaminC: "Boosts immunity, aids collagen production, and helps iron absorption",
    Potassium: "Regulates fluid balance, nerve signals, and muscle contractions",
    Sodium: "Maintains fluid balance, but excessive intake raises blood pressure",
    Fat: "Provides energy, supports cell growth, and protects organs",
    Fiber: "Aids digestion, helps control blood sugar, and supports heart health"
};

export const HEALTH_RULES = {
    diabetes: { limit: ['Carbs', 'Sugar'], recommend: ['Fiber', 'Protein'], warning: "High sugar/carbs can cause blood sugar spikes." },
    bp: { limit: ['Sodium'], recommend: ['Potassium'], warning: "High sodium intake is linked to high blood pressure." },
    kidney: { limit: ['Sodium', 'Potassium', 'Phosphorus'], warning: "Damaged kidneys may struggle to filter these nutrients." },
    iron: { recommend: ['Iron', 'VitaminC'], warning: "Low iron leads to fatigue and anemia." },
    cholesterol: { limit: ['Saturated Fat', 'Trans Fat'], recommend: ['Fiber'], warning: "High saturated fat increases LDL cholesterol levels." }
};
