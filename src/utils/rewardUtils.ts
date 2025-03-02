
// Utility functions for handling rewards

/**
 * Calculate the maximum reward value based on user level
 * @param level The user's current level
 * @returns Maximum reward value in dollars
 */
export const getMaxRewardValue = (level: number): number => {
  if (level >= 90) return 80000;
  if (level >= 70) return 70000;
  if (level >= 50) return 50000;
  if (level >= 30) return 30000;
  if (level >= 10) return 10000;
  return 1000;
};

/**
 * Get the display name for the reward tier based on level
 * @param level The user's current level
 * @returns A string representation of the reward tier
 */
export const getRewardTier = (level: number): string => {
  if (level >= 90) return "Legendary";
  if (level >= 70) return "Epic";
  if (level >= 50) return "Rare";
  if (level >= 30) return "Uncommon";
  return "Common";
};

/**
 * Get the CSS class for styling the reward tier based on level
 * @param level The user's current level
 * @returns CSS class string for styling the reward tier
 */
export const getRewardTierClass = (level: number): string => {
  if (level >= 90) return "text-amber-500 font-bold"; // Legendary
  if (level >= 70) return "text-purple-500 font-bold"; // Epic
  if (level >= 50) return "text-blue-500 font-bold"; // Rare
  if (level >= 30) return "text-green-500 font-bold"; // Uncommon
  return "text-gray-300 font-bold"; // Common
};

/**
 * Format the reward value as a currency string
 * @param value The value to format
 * @returns A formatted currency string
 */
export const formatRewardValue = (value: number): string => {
  return `$${value.toLocaleString()}`;
};
