
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

/**
 * Get the color class for a level display
 * @param level The user's current level
 * @returns CSS class string for styling the level display
 */
export const getLevelColor = (level: number): string => {
  if (level >= 90) return "text-amber-500"; // Legendary
  if (level >= 70) return "text-purple-500"; // Epic
  if (level >= 50) return "text-blue-500"; // Rare
  if (level >= 30) return "text-green-500"; // Uncommon
  return "text-gray-300"; // Common
};

/**
 * Calculate the reward success chance based on user level
 * Ensures at least 80% success rate overall
 * @param level The user's current level
 * @returns A number between 0 and 1 representing success probability
 */
export const getRewardSuccessChance = (level: number): number => {
  // Base success rate of 80%
  let baseRate = 0.8;
  
  // Higher levels get better chances
  if (level >= 90) return Math.min(1, baseRate + 0.15); // 95% chance
  if (level >= 70) return Math.min(1, baseRate + 0.12); // 92% chance
  if (level >= 50) return Math.min(1, baseRate + 0.1); // 90% chance
  if (level >= 30) return Math.min(1, baseRate + 0.05); // 85% chance
  if (level >= 10) return baseRate; // 80% chance
  
  // Even lowest levels get at least 75% chance
  return Math.max(0.75, baseRate - 0.05);
};

/**
 * Calculate the reward amount based on user level with increased chances
 * @param level The user's current level
 * @returns A reward amount within the appropriate range for the level
 */
export const calculateRewardAmount = (level: number): number => {
  const maxReward = getMaxRewardValue(level);
  
  // Minimum reward is between 50-70% of max reward, increasing with level
  const minPercentage = Math.min(0.7, 0.5 + (level / 300));
  
  // Calculate a random amount between min percentage and 100% of max reward
  return Math.floor(Math.random() * (maxReward - (maxReward * minPercentage))) + (maxReward * minPercentage);
};
