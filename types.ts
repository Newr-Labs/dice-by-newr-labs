
export enum ToolType {
  DICE = 'Dice',
  COIN = 'Coin',
  YES_NO = 'Yes/No',
  NUMBER = 'Number',
  WHEEL = 'Wheel',
  PICKER = 'Picker',
  COLOR = 'Color',
  TRUTH_DARE = 'Truth/Dare'
}

export type Language = 
  | 'en' | 'es' | 'fr' | 'de' | 'ru' | 'ja' | 'zh' | 'ar' | 'id';

export interface HistoryItem {
  id: string;
  tool: ToolType;
  result: string;
  timestamp: number;
}
