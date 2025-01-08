import { Case } from '../types/case';

export const cases: Case[] = [
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
    id: 2,
    name: "Premium Tech",
    price: 12000,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    bestDrop: "$240,000 Value",
    category: "premium",
    items: [
      {
        id: 1,
        name: "Basic Tech Bundle",
        value: 1200,
        odds: 0.45,
        multiplier: 0.1,
        rarity: "common",
        image: "https://images.unsplash.com/photo-1580519542036-c47de6196ba5"
      },
      {
        id: 2,
        name: "Premium Tech Package",
        value: 18000,
        odds: 0.35,
        multiplier: 1.5,
        rarity: "uncommon",
        image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e"
      },
      {
        id: 3,
        name: "Ultimate Tech Setup",
        value: 36000,
        odds: 0.195,
        multiplier: 3,
        rarity: "rare",
        image: "https://images.unsplash.com/photo-1579621970795-87facc2f976d"
      },
      {
        id: 4,
        name: "Legendary Tech Collection",
        value: 240000,
        odds: 0.005,
        multiplier: 20,
        rarity: "legendary",
        image: "https://images.unsplash.com/photo-1579621970795-87facc2f976d"
      }
    ]
  },
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
        multiplier: 10,
        rarity: "legendary",
        image: "https://images.unsplash.com/photo-1579621970795-87facc2f976d"
      }
    ]
  },
  {
    id: 5,
    name: "WGTV Exclusive",
    price: 8500,
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
    bestDrop: "$170,000 Value",
    category: "premium",
    items: [
      {
        id: 1,
        name: "Exclusive Cash Prize",
        value: 1000,
        odds: 0.4,
        multiplier: 0.1,
        rarity: "common",
        image: "https://images.unsplash.com/photo-1580519542036-c47de6196ba5"
      },
      {
        id: 2,
        name: "Premium Exclusive Prize",
        value: 5000,
        odds: 0.35,
        multiplier: 1.5,
        rarity: "uncommon",
        image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e"
      },
      {
        id: 3,
        name: "Ultimate Exclusive Prize",
        value: 20000,
        odds: 0.195,
        multiplier: 3,
        rarity: "rare",
        image: "https://images.unsplash.com/photo-1579621970795-87facc2f976d"
      },
      {
        id: 4,
        name: "Legendary Exclusive Prize",
        value: 100000,
        odds: 0.005,
        multiplier: 20,
        rarity: "legendary",
        image: "https://images.unsplash.com/photo-1579621970795-87facc2f976d"
      }
    ]
  },
  {
    id: 6,
    name: "ZOID Special",
    price: 7800,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    bestDrop: "$156,000 Value",
    category: "premium",
    items: [
      {
        id: 1,
        name: "ZOID Cash Prize",
        value: 800,
        odds: 0.4,
        multiplier: 0.1,
        rarity: "common",
        image: "https://images.unsplash.com/photo-1580519542036-c47de6196ba5"
      },
      {
        id: 2,
        name: "ZOID Premium Prize",
        value: 4000,
        odds: 0.35,
        multiplier: 1.5,
        rarity: "uncommon",
        image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e"
      },
      {
        id: 3,
        name: "ZOID Ultimate Prize",
        value: 16000,
        odds: 0.195,
        multiplier: 3,
        rarity: "rare",
        image: "https://images.unsplash.com/photo-1579621970795-87facc2f976d"
      },
      {
        id: 4,
        name: "ZOID Legendary Prize",
        value: 80000,
        odds: 0.005,
        multiplier: 20,
        rarity: "legendary",
        image: "https://images.unsplash.com/photo-1579621970795-87facc2f976d"
      }
    ]
  },
  {
    id: 7,
    name: "XPOSED Mystery",
    price: 9000,
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e",
    bestDrop: "$180,000 Value",
    category: "premium",
    items: [
      {
        id: 1,
        name: "XPOSED Cash Prize",
        value: 900,
        odds: 0.4,
        multiplier: 0.1,
        rarity: "common",
        image: "https://images.unsplash.com/photo-1580519542036-c47de6196ba5"
      },
      {
        id: 2,
        name: "XPOSED Premium Prize",
        value: 4500,
        odds: 0.35,
        multiplier: 1.5,
        rarity: "uncommon",
        image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e"
      },
      {
        id: 3,
        name: "XPOSED Ultimate Prize",
        value: 18000,
        odds: 0.195,
        multiplier: 3,
        rarity: "rare",
        image: "https://images.unsplash.com/photo-1579621970795-87facc2f976d"
      },
      {
        id: 4,
        name: "XPOSED Legendary Prize",
        value: 90000,
        odds: 0.005,
        multiplier: 20,
        rarity: "legendary",
        image: "https://images.unsplash.com/photo-1579621970795-87facc2f976d"
      }
    ]
  },
  {
    id: 8,
    name: "YASSUO Challenge",
    price: 8000,
    image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
    bestDrop: "$160,000 Value",
    category: "premium",
    items: [
      {
        id: 1,
        name: "YASSUO Cash Prize",
        value: 800,
        odds: 0.4,
        multiplier: 0.1,
        rarity: "common",
        image: "https://images.unsplash.com/photo-1580519542036-c47de6196ba5"
      },
      {
        id: 2,
        name: "YASSUO Premium Prize",
        value: 4000,
        odds: 0.35,
        multiplier: 1.5,
        rarity: "uncommon",
        image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e"
      },
      {
        id: 3,
        name: "YASSUO Ultimate Prize",
        value: 16000,
        odds: 0.195,
        multiplier: 3,
        rarity: "rare",
        image: "https://images.unsplash.com/photo-1579621970795-87facc2f976d"
      },
      {
        id: 4,
        name: "YASSUO Legendary Prize",
        value: 80000,
        odds: 0.005,
        multiplier: 20,
        rarity: "legendary",
        image: "https://images.unsplash.com/photo-1579621970795-87facc2f976d"
      }
    ]
  },
  {
    id: 9,
    name: "Mr BEAST Mega",
    price: 11000,
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
    bestDrop: "$220,000 Value",
    category: "premium",
    items: [
      {
        id: 1,
        name: "Mr BEAST Cash Prize",
        value: 1100,
        odds: 0.4,
        multiplier: 0.1,
        rarity: "common",
        image: "https://images.unsplash.com/photo-1580519542036-c47de6196ba5"
      },
      {
        id: 2,
        name: "Mr BEAST Premium Prize",
        value: 5500,
        odds: 0.35,
        multiplier: 1.5,
        rarity: "uncommon",
        image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e"
      },
      {
        id: 3,
        name: "Mr BEAST Ultimate Prize",
        value: 22000,
        odds: 0.195,
        multiplier: 3,
        rarity: "rare",
        image: "https://images.unsplash.com/photo-1579621970795-87facc2f976d"
      },
      {
        id: 4,
        name: "Mr BEAST Legendary Prize",
        value: 110000,
        odds: 0.005,
        multiplier: 20,
        rarity: "legendary",
        image: "https://images.unsplash.com/photo-1579621970795-87facc2f976d"
      }
    ]
  },
  {
    id: 10,
    name: "WWE Legends",
    price: 7500,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    bestDrop: "$150,000 Value",
    category: "premium",
    items: [
      {
        id: 1,
        name: "WWE Cash Prize",
        value: 750,
        odds: 0.4,
        multiplier: 0.1,
        rarity: "common",
        image: "https://images.unsplash.com/photo-1580519542036-c47de6196ba5"
      },
      {
        id: 2,
        name: "WWE Premium Prize",
        value: 3750,
        odds: 0.35,
        multiplier: 1.5,
        rarity: "uncommon",
        image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e"
      },
      {
        id: 3,
        name: "WWE Ultimate Prize",
        value: 15000,
        odds: 0.195,
        multiplier: 3,
        rarity: "rare",
        image: "https://images.unsplash.com/photo-1579621970795-87facc2f976d"
      },
      {
        id: 4,
        name: "WWE Legendary Prize",
        value: 75000,
        odds: 0.005,
        multiplier: 20,
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
    id: 12,
    name: "Tech Essentials",
    price: 100,
    image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
    bestDrop: "$1,000 Value",
    category: "mid",
    items: [
      {
        id: 1,
        name: "Tech Cash Prize",
        value: 10,
        odds: 0.4,
        multiplier: 0.1,
        rarity: "common",
        image: "https://images.unsplash.com/photo-1580519542036-c47de6196ba5"
      },
      {
        id: 2,
        name: "Tech Premium Prize",
        value: 50,
        odds: 0.35,
        multiplier: 0.5,
        rarity: "uncommon",
        image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e"
      },
      {
        id: 3,
        name: "Tech Large Prize",
        value: 200,
        odds: 0.15,
        multiplier: 2,
        rarity: "rare",
        image: "https://images.unsplash.com/photo-1579621970795-87facc2f976d"
      },
      {
        id: 4,
        name: "Tech Jackpot Prize",
        value: 1000,
        odds: 0.05,
        multiplier: 10,
        rarity: "legendary",
        image: "https://images.unsplash.com/photo-1579621970795-87facc2f976d"
      }
    ]
  },
  {
    id: 13,
    name: "Streamer's Choice",
    price: 750,
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
    bestDrop: "$7,500 Value",
    category: "high",
    items: [
      {
        id: 1,
        name: "Streamer Cash Prize",
        value: 75,
        odds: 0.4,
        multiplier: 0.1,
        rarity: "common",
        image: "https://images.unsplash.com/photo-1580519542036-c47de6196ba5"
      },
      {
        id: 2,
        name: "Streamer Premium Prize",
        value: 375,
        odds: 0.35,
        multiplier: 0.5,
        rarity: "uncommon",
        image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e"
      },
      {
        id: 3,
        name: "Streamer Large Prize",
        value: 1500,
        odds: 0.15,
        multiplier: 2,
        rarity: "rare",
        image: "https://images.unsplash.com/photo-1579621970795-87facc2f976d"
      },
      {
        id: 4,
        name: "Streamer Jackpot Prize",
        value: 7500,
        odds: 0.05,
        multiplier: 10,
        rarity: "legendary",
        image: "https://images.unsplash.com/photo-1579621970795-87facc2f976d"
      }
    ]
  },
  {
    id: 14,
    name: "Content Creator",
    price: 6000,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    bestDrop: "$120,000 Value",
    category: "premium",
    items: [
      {
        id: 1,
        name: "Creator Cash Prize",
        value: 600,
        odds: 0.4,
        multiplier: 0.1,
        rarity: "common",
        image: "https://images.unsplash.com/photo-1580519542036-c47de6196ba5"
      },
      {
        id: 2,
        name: "Creator Premium Prize",
        value: 3000,
        odds: 0.35,
        multiplier: 1.5,
        rarity: "uncommon",
        image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e"
      },
      {
        id: 3,
        name: "Creator Ultimate Prize",
        value: 12000,
        odds: 0.195,
        multiplier: 3,
        rarity: "rare",
        image: "https://images.unsplash.com/photo-1579621970795-87facc2f976d"
      },
      {
        id: 4,
        name: "Creator Legendary Prize",
        value: 60000,
        odds: 0.005,
        multiplier: 20,
        rarity: "legendary",
        image: "https://images.unsplash.com/photo-1579621970795-87facc2f976d"
      }
    ]
  },
  {
    id: 15,
    name: "Pro Gamer",
    price: 8000,
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e",
    bestDrop: "$160,000 Value",
    category: "premium",
    items: [
      {
        id: 1,
        name: "Pro Cash Prize",
        value: 800,
        odds: 0.4,
        multiplier: 0.1,
        rarity: "common",
        image: "https://images.unsplash.com/photo-1580519542036-c47de6196ba5"
      },
      {
        id: 2,
        name: "Pro Premium Prize",
        value: 4000,
        odds: 0.35,
        multiplier: 1.5,
        rarity: "uncommon",
        image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e"
      },
      {
        id: 3,
        name: "Pro Ultimate Prize",
        value: 16000,
        odds: 0.195,
        multiplier: 3,
        rarity: "rare",
        image: "https://images.unsplash.com/photo-1579621970795-87facc2f976d"
      },
      {
        id: 4,
        name: "Pro Legendary Prize",
        value: 80000,
        odds: 0.005,
        multiplier: 20,
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
  },
  {
    id: 19,
    name: "Enthusiast Pack",
    price: 150,
    image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
    bestDrop: "$1,500 Value",
    category: "mid",
    items: [
      {
        id: 1,
        name: "Enthusiast Cash Prize",
        value: 15,
        odds: 0.4,
        multiplier: 0.1,
        rarity: "common",
        image: "https://images.unsplash.com/photo-1580519542036-c47de6196ba5"
      },
      {
        id: 2,
        name: "Enthusiast Premium Prize",
        value: 75,
        odds: 0.35,
        multiplier: 0.5,
        rarity: "uncommon",
        image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e"
      },
      {
        id: 3,
        name: "Enthusiast Large Prize",
        value: 300,
        odds: 0.15,
        multiplier: 2,
        rarity: "rare",
        image: "https://images.unsplash.com/photo-1579621970795-87facc2f976d"
      },
      {
        id: 4,
        name: "Enthusiast Jackpot Prize",
        value: 1500,
        odds: 0.05,
        multiplier: 10,
        rarity: "legendary",
        image: "https://images.unsplash.com/photo-1579621970795-87facc2f976d"
      }
    ]
  },
  {
    id: 20,
    name: "Pro Setup",
    price: 300,
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
    bestDrop: "$3,000 Value",
    category: "high",
    items: [
      {
        id: 1,
        name: "Pro Setup Cash Prize",
        value: 30,
        odds: 0.4,
        multiplier: 0.1,
        rarity: "common",
        image: "https://images.unsplash.com/photo-1580519542036-c47de6196ba5"
      },
      {
        id: 2,
        name: "Pro Setup Premium Prize",
        value: 150,
        odds: 0.35,
        multiplier: 0.5,
        rarity: "uncommon",
        image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e"
      },
      {
        id: 3,
        name: "Pro Setup Large Prize",
        value: 600,
        odds: 0.15,
        multiplier: 2,
        rarity: "rare",
        image: "https://images.unsplash.com/photo-1579621970795-87facc2f976d"
      },
      {
        id: 4,
        name: "Pro Setup Jackpot Prize",
        value: 3000,
        odds: 0.05,
        multiplier: 10,
        rarity: "legendary",
        image: "https://images.unsplash.com/photo-1579621970795-87facc2f976d"
      }
    ]
  },
  {
    id: 21,
    name: "Elite Gaming",
    price: 600,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    bestDrop: "$6,000 Value",
    category: "high",
    items: [
      {
        id: 1,
        name: "Elite Cash Prize",
        value: 60,
        odds: 0.4,
        multiplier: 0.1,
        rarity: "common",
        image: "https://images.unsplash.com/photo-1580519542036-c47de6196ba5"
      },
      {
        id: 2,
        name: "Elite Premium Prize",
        value: 300,
        odds: 0.35,
        multiplier: 0.5,
        rarity: "uncommon",
        image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e"
      },
      {
        id: 3,
        name: "Elite Large Prize",
        value: 1200,
        odds: 0.15,
        multiplier: 2,
        rarity: "rare",
        image: "https://images.unsplash.com/photo-1579621970795-87facc2f976d"
      },
      {
        id: 4,
        name: "Elite Jackpot Prize",
        value: 6000,
        odds: 0.05,
        multiplier: 10,
        rarity: "legendary",
        image: "https://images.unsplash.com/photo-1579621970795-87facc2f976d"
      }
    ]
  },
  {
    id: 22,
    name: "NINJA Special",
    price: 8200,
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e",
    bestDrop: "$164,000 Value",
    category: "premium",
    items: [
      {
        id: 1,
        name: "NINJA Cash Prize",
        value: 820,
        odds: 0.4,
        multiplier: 0.1,
        rarity: "common",
        image: "https://images.unsplash.com/photo-1580519542036-c47de6196ba5"
      },
      {
        id: 2,
        name: "NINJA Premium Prize",
        value: 4100,
        odds: 0.35,
        multiplier: 1.5,
        rarity: "uncommon",
        image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e"
      },
      {
        id: 3,
        name: "NINJA Ultimate Prize",
        value: 16400,
        odds: 0.195,
        multiplier: 3,
        rarity: "rare",
        image: "https://images.unsplash.com/photo-1579621970795-87facc2f976d"
      },
      {
        id: 4,
        name: "NINJA Legendary Prize",
        value: 82000,
        odds: 0.005,
        multiplier: 20,
        rarity: "legendary",
        image: "https://images.unsplash.com/photo-1579621970795-87facc2f976d"
      }
    ]
  },
  {
    id: 23,
    name: "POKIMANE Select",
    price: 7900,
    image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
    bestDrop: "$158,000 Value",
    category: "premium",
    items: [
      {
        id: 1,
        name: "POKIMANE Cash Prize",
        value: 790,
        odds: 0.4,
        multiplier: 0.1,
        rarity: "common",
        image: "https://images.unsplash.com/photo-1580519542036-c47de6196ba5"
      },
      {
        id: 2,
        name: "POKIMANE Premium Prize",
        value: 3950,
        odds: 0.35,
        multiplier: 1.5,
        rarity: "uncommon",
        image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e"
      },
      {
        id: 3,
        name: "POKIMANE Ultimate Prize",
        value: 15800,
        odds: 0.195,
        multiplier: 3,
        rarity: "rare",
        image: "https://images.unsplash.com/photo-1579621970795-87facc2f976d"
      },
      {
        id: 4,
        name: "POKIMANE Legendary Prize",
        value: 79000,
        odds: 0.005,
        multiplier: 20,
        rarity: "legendary",
        image: "https://images.unsplash.com/photo-1579621970795-87facc2f976d"
      }
    ]
  },
  {
    id: 24,
    name: "SHROUD Elite",
    price: 8800,
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
    bestDrop: "$176,000 Value",
    category: "premium",
    items: [
      {
        id: 1,
        name: "SHROUD Cash Prize",
        value: 880,
        odds: 0.4,
        multiplier: 0.1,
        rarity: "common",
        image: "https://images.unsplash.com/photo-1580519542036-c47de6196ba5"
      },
      {
        id: 2,
        name: "SHROUD Premium Prize",
        value: 4400,
        odds: 0.35,
        multiplier: 1.5,
        rarity: "uncommon",
        image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e"
      },
      {
        id: 3,
        name: "SHROUD Ultimate Prize",
        value: 17600,
        odds: 0.195,
        multiplier: 3,
        rarity: "rare",
        image: "https://images.unsplash.com/photo-1579621970795-87facc2f976d"
      },
      {
        id: 4,
        name: "SHROUD Legendary Prize",
        value: 88000,
        odds: 0.005,
        multiplier: 20,
        rarity: "legendary",
        image: "https://images.unsplash.com/photo-1579621970795-87facc2f976d"
      }
    ]
  },
  {
    id: 25,
    name: "TFUE Legend",
    price: 8300,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    bestDrop: "$166,000 Value",
    category: "premium",
    items: [
      {
        id: 1,
        name: "TFUE Cash Prize",
        value: 830,
        odds: 0.4,
        multiplier: 0.1,
        rarity: "common",
        image: "https://images.unsplash.com/photo-1580519542036-c47de6196ba5"
      },
      {
        id: 2,
        name: "TFUE Premium Prize",
        value: 4150,
        odds: 0.35,
        multiplier: 1.5,
        rarity: "uncommon",
        image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e"
      },
      {
        id: 3,
        name: "TFUE Ultimate Prize",
        value: 16600,
        odds: 0.195,
        multiplier: 3,
        rarity: "rare",
        image: "https://images.unsplash.com/photo-1579621970795-87facc2f976d"
      },
      {
        id: 4,
        name: "TFUE Legendary Prize",
        value: 83000,
        odds: 0.005,
        multiplier: 20,
        rarity: "legendary",
        image: "https://images.unsplash.com/photo-1579621970795-87facc2f976d"
      }
    ]
  },
  {
    id: 26,
    name: "ASMONGOLD Gold",
    price: 8100,
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e",
    bestDrop: "$162,000 Value",
    category: "premium",
    items: [
      {
        id: 1,
        name: "ASMONGOLD Cash Prize",
        value: 810,
        odds: 0.4,
        multiplier: 0.1,
        rarity: "common",
        image: "https://images.unsplash.com/photo-1580519542036-c47de6196ba5"
      },
      {
        id: 2,
        name: "ASMONGOLD Premium Prize",
        value: 4050,
        odds: 0.35,
        multiplier: 1.5,
        rarity: "uncommon",
        image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e"
      },
      {
        id: 3,
        name: "ASMONGOLD Ultimate Prize",
        value: 16200,
        odds: 0.195,
        multiplier: 3,
        rarity: "rare",
        image: "https://images.unsplash.com/photo-1579621970795-87facc2f976d"
      },
      {
        id: 4,
        name: "ASMONGOLD Legendary Prize",
        value: 81000,
        odds: 0.005,
        multiplier: 20,
        rarity: "legendary",
        image: "https://images.unsplash.com/photo-1579621970795-87facc2f976d"
      }
    ]
  },
  {
    id: 27,
    name: "SUMMIT1G Peak",
    price: 8600,
    image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
    bestDrop: "$172,000 Value",
    category: "premium",
    items: [
      {
        id: 1,
        name: "SUMMIT1G Cash Prize",
        value: 860,
        odds: 0.4,
        multiplier: 0.1,
        rarity: "common",
        image: "https://images.unsplash.com/photo-1580519542036-c47de6196ba5"
      },
      {
        id: 2,
        name: "SUMMIT1G Premium Prize",
        value: 4300,
        odds: 0.35,
        multiplier: 1.5,
        rarity: "uncommon",
        image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e"
      },
      {
        id: 3,
        name: "SUMMIT1G Ultimate Prize",
        value: 17200,
        odds: 0.195,
        multiplier: 3,
        rarity: "rare",
        image: "https://images.unsplash.com/photo-1579621970795-87facc2f976d"
      },
      {
        id: 4,
        name: "SUMMIT1G Legendary Prize",
        value: 86000,
        odds: 0.005,
        multiplier: 20,
        rarity: "legendary",
        image: "https://images.unsplash.com/photo-1579621970795-87facc2f976d"
      }
    ]
  },
  {
    id: 28,
    name: "TIMTHETATMAN Time",
    price: 8400,
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
    bestDrop: "$168,000 Value",
    category: "premium",
    items: [
      {
        id: 1,
        name: "TIMTHETATMAN Cash Prize",
        value: 840,
        odds: 0.4,
        multiplier: 0.1,
        rarity: "common",
        image: "https://images.unsplash.com/photo-1580519542036-c47de6196ba5"
      },
      {
        id: 2,
        name: "TIMTHETATMAN Premium Prize",
        value: 4200,
        odds: 0.35,
        multiplier: 1.5,
        rarity: "uncommon",
        image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e"
      },
      {
        id: 3,
        name: "TIMTHETATMAN Ultimate Prize",
        value: 16800,
        odds: 0.195,
        multiplier: 3,
        rarity: "rare",
        image: "https://images.unsplash.com/photo-1579621970795-87facc2f976d"
      },
      {
        id: 4,
        name: "TIMTHETATMAN Legendary Prize",
        value: 84000,
        odds: 0.005,
        multiplier: 20,
        rarity: "legendary",
        image: "https://images.unsplash.com/photo-1579621970795-87facc2f976d"
      }
    ]
  },
  {
    id: 29,
    name: "NICKMERCS Power",
    price: 8700,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    bestDrop: "$174,000 Value",
    category: "premium",
    items: [
      {
        id: 1,
        name: "NICKMERCS Cash Prize",
        value: 870,
        odds: 0.4,
        multiplier: 0.1,
        rarity: "common",
        image: "https://images.unsplash.com/photo-1580519542036-c47de6196ba5"
      },
      {
        id: 2,
        name: "NICKMERCS Premium Prize",
        value: 4350,
        odds: 0.35,
        multiplier: 1.5,
        rarity: "uncommon",
        image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e"
      },
      {
        id: 3,
        name: "NICKMERCS Ultimate Prize",
        value: 17400,
        odds: 0.195,
        multiplier: 3,
        rarity: "rare",
        image: "https://images.unsplash.com/photo-1579621970795-87facc2f976d"
      },
      {
        id: 4,
        name: "NICKMERCS Legendary Prize",
        value: 87000,
        odds: 0.005,
        multiplier: 20,
        rarity: "legendary",
        image: "https://images.unsplash.com/photo-1579621970795-87facc2f976d"
      }
    ]
  },
  {
    id: 30,
    name: "DRLUPO Ultra",
    price: 8900,
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e",
    bestDrop: "$178,000 Value",
    category: "premium",
    items: [
      {
        id: 1,
        name: "DRLUPO Cash Prize",
        value: 890,
        odds: 0.4,
        multiplier: 0.1,
        rarity: "common",
        image: "https://images.unsplash.com/photo-1580519542036-c47de6196ba5"
      },
      {
        id: 2,
        name: "DRLUPO Premium Prize",
        value: 4450,
        odds: 0.35,
        multiplier: 1.5,
        rarity: "uncommon",
        image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e"
      },
      {
        id: 3,
        name: "DRLUPO Ultimate Prize",
        value: 17800,
        odds: 0.195,
        multiplier: 3,
        rarity: "rare",
        image: "https://images.unsplash.com/photo-1579621970795-87facc2f976d"
      },
      {
        id: 4,
        name: "DRLUPO Legendary Prize",
        value: 89000,
        odds: 0.005,
        multiplier: 20,
        rarity: "legendary",
        image: "https://images.unsplash.com/photo-1579621970795-87facc2f976d"
      }
    ]
  }
];
