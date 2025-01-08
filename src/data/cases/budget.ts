import { Case } from '../../types/case';

export const budgetCases: Case[] = [
  {
    id: 1,
    name: "Starter Case",
    price: 1,
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
    bestDrop: "$5,000 Value",
    category: "budget",
    items: [
      {
        id: 1,
        name: "Small Cash Prize",
        value: 0.1,
        odds: 0.45,
        multiplier: 0.1,
        rarity: "common",
        image: "https://images.unsplash.com/photo-1580519542036-c47de6196ba5"
      },
      {
        id: 2,
        name: "Medium Cash Prize",
        value: 2.5,
        odds: 0.35,
        multiplier: 2.5,
        rarity: "uncommon",
        image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e"
      },
      {
        id: 3,
        name: "Large Cash Prize",
        value: 50,
        odds: 0.195,
        multiplier: 50,
        rarity: "rare",
        image: "https://images.unsplash.com/photo-1579621970795-87facc2f976d"
      },
      {
        id: 4,
        name: "Jackpot Prize",
        value: 5000,
        odds: 0.005,
        multiplier: 5000,
        rarity: "legendary",
        image: "https://images.unsplash.com/photo-1579621970795-87facc2f976d"
      }
    ]
  },
  {
    id: 11,
    name: "Budget Gaming",
    price: 25,
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e",
    bestDrop: "$250 Value",
    category: "budget",
    items: [
      {
        id: 1,
        name: "Budget Cash Prize",
        value: 2.5,
        odds: 0.4,
        multiplier: 0.1,
        rarity: "common",
        image: "https://images.unsplash.com/photo-1580519542036-c47de6196ba5"
      },
      {
        id: 2,
        name: "Budget Premium Prize",
        value: 12.5,
        odds: 0.35,
        multiplier: 0.5,
        rarity: "common",
        image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e"
      },
      {
        id: 3,
        name: "Budget Large Prize",
        value: 50,
        odds: 0.15,
        multiplier: 2,
        rarity: "uncommon",
        image: "https://images.unsplash.com/photo-1579621970795-87facc2f976d"
      },
      {
        id: 4,
        name: "Budget Jackpot Prize",
        value: 250,
        odds: 0.05,
        multiplier: 10,
        rarity: "legendary",
        image: "https://images.unsplash.com/photo-1579621970795-87facc2f976d"
      }
    ]
  },
  {
    id: 16,
    name: "Student Budget",
    price: 5,
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
    bestDrop: "$50 Value",
    category: "budget",
    items: [
      {
        id: 1,
        name: "Student Cash Prize",
        value: 0.5,
        odds: 0.45,
        multiplier: 0.1,
        rarity: "common",
        image: "https://images.unsplash.com/photo-1580519542036-c47de6196ba5"
      },
      {
        id: 2,
        name: "Student Premium Prize",
        value: 2.5,
        odds: 0.35,
        multiplier: 0.5,
        rarity: "common",
        image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e"
      },
      {
        id: 3,
        name: "Student Large Prize",
        value: 10,
        odds: 0.15,
        multiplier: 2,
        rarity: "uncommon",
        image: "https://images.unsplash.com/photo-1579621970795-87facc2f976d"
      },
      {
        id: 4,
        name: "Student Jackpot Prize",
        value: 50,
        odds: 0.05,
        multiplier: 10,
        rarity: "legendary",
        image: "https://images.unsplash.com/photo-1579621970795-87facc2f976d"
      }
    ]
  },
  {
    id: 17,
    name: "Casual Gamer",
    price: 30,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    bestDrop: "$300 Value",
    category: "budget",
    items: [
      {
        id: 1,
        name: "Casual Cash Prize",
        value: 3,
        odds: 0.4,
        multiplier: 0.1,
        rarity: "common",
        image: "https://images.unsplash.com/photo-1580519542036-c47de6196ba5"
      },
      {
        id: 2,
        name: "Casual Premium Prize",
        value: 15,
        odds: 0.35,
        multiplier: 0.5,
        rarity: "uncommon",
        image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e"
      },
      {
        id: 3,
        name: "Casual Large Prize",
        value: 60,
        odds: 0.15,
        multiplier: 2,
        rarity: "rare",
        image: "https://images.unsplash.com/photo-1579621970795-87facc2f976d"
      },
      {
        id: 4,
        name: "Casual Jackpot Prize",
        value: 300,
        odds: 0.05,
        multiplier: 10,
        rarity: "legendary",
        image: "https://images.unsplash.com/photo-1579621970795-87facc2f976d"
      }
    ]
  },
  {
    id: 18,
    name: "Weekend Warrior",
    price: 75,
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e",
    bestDrop: "$750 Value",
    category: "mid",
    items: [
      {
        id: 1,
        name: "Weekend Cash Prize",
        value: 7.5,
        odds: 0.4,
        multiplier: 0.1,
        rarity: "common",
        image: "https://images.unsplash.com/photo-1580519542036-c47de6196ba5"
      },
      {
        id: 2,
        name: "Weekend Premium Prize",
        value: 37.5,
        odds: 0.35,
        multiplier: 0.5,
        rarity: "uncommon",
        image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e"
      },
      {
        id: 3,
        name: "Weekend Large Prize",
        value: 150,
        odds: 0.15,
        multiplier: 2,
        rarity: "rare",
        image: "https://images.unsplash.com/photo-1579621970795-87facc2f976d"
      },
      {
        id: 4,
        name: "Weekend Jackpot Prize",
        value: 750,
        odds: 0.05,
        multiplier: 10,
        rarity: "legendary",
        image: "https://images.unsplash.com/photo-1579621970795-87facc2f976d"
      }
    ]
  }
];
