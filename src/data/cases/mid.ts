import { Case } from '../../types/case';

export const midCases: Case[] = [
  {
    id: "3",
    name: "Future Drop",
    price: 50,
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e",
    bestDrop: "$500 Value",
    category: "mid",
    items: [
      {
        id: "1",
        name: "Small Future Prize",
        value: 5,
        odds: 0.4,
        multiplier: 0.1,
        rarity: "common",
        image: "https://images.unsplash.com/photo-1580519542036-c47de6196ba5"
      },
      {
        id: "2",
        name: "Medium Future Prize",
        value: 25,
        odds: 0.35,
        multiplier: 0.5,
        rarity: "uncommon",
        image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e"
      },
      {
        id: "3",
        name: "Large Future Prize",
        value: 100,
        odds: 0.15,
        multiplier: 2,
        rarity: "rare",
        image: "https://images.unsplash.com/photo-1579621970795-87facc2f976d"
      },
      {
        id: "4",
        name: "Mega Future Prize",
        value: 500,
        odds: 0.05,
        multiplier: 10,
        rarity: "legendary",
        image: "https://images.unsplash.com/photo-1579621970795-87facc2f976d"
      }
    ]
  }
];