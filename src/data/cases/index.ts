import { budgetCases } from './budget';
import { premiumCases } from './premium';
import { midCases } from './mid';
import { highCases } from './high';
import { Case } from '../../types/case';

export const cases: Case[] = [
  ...budgetCases,
  ...premiumCases,
  ...midCases,
  ...highCases
].map(caseItem => ({
  ...caseItem,
  category: 
    caseItem.price < 50 ? 'budget' :
    caseItem.price < 500 ? 'mid' :
    caseItem.price < 5000 ? 'high' : 'premium'
}));

export default cases;