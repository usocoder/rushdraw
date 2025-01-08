import { Case } from '../../types/case';

export const midCases: Case[] = [
  {
    id: 3,
    name: "Future Drop",
    price: 50,
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e",
    bestDrop: "$500 Value",
    category: "mid",
    items: [
      {
        id: 1,
        name: "Small Future Prize",
        value: 5,
        odds: 0.4,
        multiplier: 0.1,
        rarity: "common",
        image: "https://images.unsplash.com/photo-1580519542036-c47de6196ba5"
      },
      {
        id: 2,
        name: "Medium Future Prize",
        value: 25,
        odds: 0.35,
        multiplier: 0.5,
        rarity: "uncommon",
        image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e"
      },
      {
        id: 3,
        name: "Large Future Prize",
        value: 100,
        odds: 0.15,
        multiplier: 2,
        rarity: "rare",
        image: "https://images.unsplash.com/photo-1579621970795-87facc2f976d"
      },
      {
        id: 4,
        name: "Mega Future Prize",
        value: 500,
        odds: 0.05,
        multiplier: 10,
        rarity: "legendary",
        image: "https://images.unsplash.com/photo-1579621970795-87facc2f976d"
      }
    ]
  },
  {
    id: 4,
    name: "Developer's Dream",
    price: 500,
    image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
    bestDrop: "$5,000 Value",
    category: "high",
    items: [
      {
        id: 1,
        name: "Small Developer Prize",
        value: 50,
        odds: 0.4,
        multiplier: 0.1,
        rarity: "common",
        image: "https://images.unsplash.com/photo-1580519542036-c47de6196ba5"
      },
      {
        id: 2,
        name: "Medium Developer Prize",
        value: 250,
        odds: 0.35,
        multiplier: 0.5,
        rarity: "uncommon",
        image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e"
      },
      {
        id: 3,
        name: "Large Developer Prize",
        value: 1000,
        odds: 0.15,
        multiplier: 2,
        rarity: "rare",
        image: "https://images.unsplash.com/photo-1579621970795-87facc2f976d"
      },
      {
        id: 4,
        name: "Ultimate Developer Prize",
        value: 5000,
        odds: 0.05,
        multiplier: 5000,
        rarity: "legendary",
        image: "https://images.unsplash.com/photo-1579621970795-87facc2f976d"
      }
    ]
  }
];
