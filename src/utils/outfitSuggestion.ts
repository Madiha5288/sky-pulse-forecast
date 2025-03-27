
// Functions for generating outfit suggestions

// Generate outfit suggestions based on weather conditions
export const getOutfitSuggestion = (
  temperature: number,
  condition: string,
  windSpeed: number
): { clothing: string[]; accessories: string[]; advice: string } => {
  const clothing: string[] = [];
  const accessories: string[] = [];
  let advice = "";

  // Temperature-based clothing
  if (temperature <= 0) {
    clothing.push("Heavy winter coat", "Thermal underwear", "Sweater", "Winter pants");
    accessories.push("Warm hat", "Insulated gloves", "Thick scarf", "Warm boots");
    advice = "Layer up! It's freezing outside.";
  } else if (temperature <= 10) {
    clothing.push("Winter coat", "Sweater", "Long-sleeve shirt", "Jeans or warm pants");
    accessories.push("Light gloves", "Beanie or hat");
    advice = "It's quite cold, dress warmly.";
  } else if (temperature <= 20) {
    clothing.push("Light jacket or hoodie", "Long-sleeve shirt", "Jeans or pants");
    if (temperature < 15) {
      accessories.push("Light scarf");
    }
    advice = "Cool weather, a light jacket should be sufficient.";
  } else if (temperature <= 25) {
    clothing.push("T-shirt", "Light pants or jeans");
    advice = "Pleasant temperature, dress comfortably.";
  } else {
    clothing.push("T-shirt", "Shorts or light pants");
    accessories.push("Sunglasses", "Hat");
    advice = "Hot weather, dress light and stay hydrated!";
  }

  // Condition-based adjustments
  if (condition.includes("rain")) {
    clothing.push("Waterproof jacket");
    accessories.push("Umbrella");
    advice += " Don't forget rain protection!";
  } else if (condition.includes("thunderstorm")) {
    clothing.push("Waterproof jacket");
    accessories.push("Umbrella");
    advice += " Severe weather expected. Consider staying indoors if possible.";
  } else if (condition.includes("snow")) {
    clothing.push("Waterproof boots");
    accessories.push("Warm socks");
    advice += " Watch out for slippery surfaces.";
  } else if (condition.includes("clear") && temperature > 20) {
    accessories.push("Sunscreen");
    advice += " Apply sunscreen to protect your skin.";
  }

  // Wind-based adjustments
  if (windSpeed > 20) {
    accessories.push("Windbreaker");
    advice += " It's windy outside, secure loose clothing.";
  }

  return { clothing, accessories, advice };
};
