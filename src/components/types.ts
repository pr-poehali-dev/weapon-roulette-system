
export type WeaponRarity = 'common' | 'uncommon' | 'epic' | 'legendary' | 'divine' | 'titan';

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
