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
];

export default cases;