
import { motion } from "framer-motion";
import { CaseItem } from "@/types/case";
import { Trophy, Sparkles } from "lucide-react";

interface WinningResultProps {
  item: CaseItem;
  casePrice: number;
  isFreePlay?: boolean;
  hasRushDraw?: boolean;
}

export const WinningResult = ({ item, casePrice, isFreePlay = false, hasRushDraw = false }: WinningResultProps) => {
  // Calculate multiplier if it's null by using the item value and case price
  const effectiveMultiplier = item.multiplier || 
    (item.value && casePrice > 0 ? item.value / casePrice : 1);
  
  // Calculate the win amount
  const winAmount = casePrice * effectiveMultiplier;

  // Animation variants for smoother transitions
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15,
        mass: 1
      }
    }
  };

  const textVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: -45 },
    visible: { 
      scale: 1, 
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: 0.4
      }
    }
  };

  return (
    <motion.div
      className="mt-6 text-center"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div 
        className="flex items-center justify-center mb-4"
        variants={itemVariants}
      >
        <div className="relative">
          <motion.div
            className="relative"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300, damping: 10 }}
          >
            <img 
              src={item.image}
              alt={item.name}
              className={`w-48 h-48 object-contain rounded-lg ${
                hasRushDraw && item.rarity === 'legendary' 
                  ? 'ring-4 ring-yellow-500 ring-opacity-50 shadow-lg' 
                  : ''
              }`}
            />
            {hasRushDraw && item.rarity === 'legendary' && (
              <motion.div 
                className="absolute inset-0 rounded-lg"
                animate={{ 
                  boxShadow: ['0 0 10px rgba(234, 179, 8, 0.5)', '0 0 20px rgba(234, 179, 8, 0.3)', '0 0 10px rgba(234, 179, 8, 0.5)']
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  ease: "easeInOut" 
                }}
              />
            )}
          </motion.div>
          
          {!isFreePlay && (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={iconVariants}
              className="absolute -top-2 -right-2"
            >
              {hasRushDraw && item.rarity === 'legendary' ? (
                <motion.div
                  animate={{ 
                    rotate: [0, 5, 0, -5, 0],
                    scale: [1, 1.1, 1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Sparkles className="w-8 h-8 text-yellow-500" />
                </motion.div>
              ) : (
                <Trophy className="w-8 h-8 text-yellow-500" />
              )}
            </motion.div>
          )}
        </div>
      </motion.div>
      
      <motion.div variants={textVariants}>
        <h3 className="text-xl font-bold mb-2">
          {isFreePlay ? "You could have won: " : "You won: "}{item.name}!
          {hasRushDraw && item.rarity === 'legendary' && (
            <motion.span 
              className="ml-2 text-yellow-500 inline-block"
              animate={{ 
                scale: [1, 1.05, 1],
                opacity: [1, 0.8, 1]
              }}
              transition={{ 
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut" 
              }}
            >
              (Rush Draw!)
            </motion.span>
          )}
        </h3>
        
        <motion.p 
          className="text-lg text-primary"
          variants={textVariants}
        >
          Value: ${Math.round(winAmount)} ({Math.floor(effectiveMultiplier)}x)
        </motion.p>
        
        {isFreePlay && (
          <motion.p 
            className="mt-2 text-muted-foreground"
            variants={textVariants}
          >
            This was just a simulation. Try opening the case for real to win!
          </motion.p>
        )}
      </motion.div>
    </motion.div>
  );
};
