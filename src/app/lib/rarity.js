export const getRarityColor = (rarity) => {
  switch (rarity.toLowerCase()) {
    case 'legendary':
      return 'border-yellow-500 text-yellow-500 shadow-yellow-900/20'; // Gold
    case 'epic':
      return 'border-purple-500 text-purple-500 shadow-purple-900/20'; // Purple
    case 'rare':
      return 'border-blue-500 text-blue-500 shadow-blue-900/20'; // Blue
    case 'uncommon':
      return 'border-green-600 text-green-600 shadow-green-900/20'; // Green
    default:
      return 'border-relic-charcoal text-gray-400'; // Common (Gray)
  }
};