
export type WeaponRarity = 'common' | 'uncommon' | 'epic' | 'legendary' | 'divine' | 'titan';
export type EnemyType = 'zombie' | 'boss' | 'vampire' | 'clover';

export interface WeaponData {
  id: number;
  name: string;
  rarity: WeaponRarity;
  damage: number;
  image: string;
}

export interface WeaponPoolConfig {
  rarity: WeaponRarity;
  count: number;
  chance: number;
  color: string;
}

export interface ResourceCounts {
  zombieSouls: number;
  bossSouls: number;
  vampireSouls: number;
  clovers: {
    x1: number;
    x2: number;
  };
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  cost: {
    type: 'zombieSouls' | 'bossSouls' | 'vampireSouls';
    amount: number;
  };
  effect: {
    type: 'luck' | 'damage';
    multiplier: number;
    duration: number; // в прокрутках или атаках
  };
  image: string;
}
