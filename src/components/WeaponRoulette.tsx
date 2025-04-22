
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { WeaponData, WeaponPoolConfig, WeaponRarity } from "./types";

interface WeaponRouletteProps {
  onWeaponSelected: (weapon: WeaponData) => void;
}

const weaponPools: WeaponPoolConfig[] = [
  { rarity: 'common', count: 120, chance: 0.40, color: 'bg-gray-400' },
  { rarity: 'uncommon', count: 180, chance: 0.30, color: 'bg-green-500' },
  { rarity: 'epic', count: 100, chance: 0.15, color: 'bg-purple-500' },
  { rarity: 'legendary', count: 50, chance: 0.10, color: 'bg-yellow-500' },
  { rarity: 'divine', count: 30, chance: 0.04, color: 'bg-blue-500' },
  { rarity: 'titan', count: 20, chance: 0.01, color: 'bg-red-500' }
];

// Функция для генерации случайного оружия
const generateWeapons = (): WeaponData[] => {
  const weapons: WeaponData[] = [];
  let id = 1;
  
  weaponPools.forEach(pool => {
    const baseNames = ['Пистолет', 'Винтовка', 'Лук', 'Молот', 'Топор', 'Катана', 'Копьё'];
    const prefixes = ['Железный', 'Стальной', 'Древний', 'Мощный', 'Острый', 'Тяжёлый', 'Быстрый'];
    
    for (let i = 0; i < pool.count; i++) {
      const baseName = baseNames[Math.floor(Math.random() * baseNames.length)];
      const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
      const name = `${prefix} ${baseName} ${i+1}`;
      
      weapons.push({
        id: id++,
        name,
        rarity: pool.rarity,
        damage: getRarityMultiplier(pool.rarity) * (Math.floor(Math.random() * 10) + 1),
        image: '/placeholder.svg' // Заглушка для изображения
      });
    }
  });
  
  return weapons;
};

const getRarityMultiplier = (rarity: WeaponRarity): number => {
  switch (rarity) {
    case 'common': return 1;
    case 'uncommon': return 2;
    case 'epic': return 5;
    case 'legendary': return 10;
    case 'divine': return 25;
    case 'titan': return 50;
  }
};

const WeaponRoulette = ({ onWeaponSelected }: WeaponRouletteProps) => {
  const [weapons] = useState<WeaponData[]>(generateWeapons());
  const [currentWeapon, setCurrentWeapon] = useState<WeaponData | null>(null);
  const [spinning, setSpinning] = useState(false);
  
  // Функция для выбора оружия на основе вероятностей
  const spinRoulette = () => {
    if (spinning) return;
    
    setSpinning(true);
    
    // Имитация вращения рулетки
    let rotations = 0;
    const maxRotations = 20;
    const interval = setInterval(() => {
      const randomWeaponIndex = Math.floor(Math.random() * weapons.length);
      setCurrentWeapon(weapons[randomWeaponIndex]);
      
      rotations++;
      if (rotations >= maxRotations) {
        clearInterval(interval);
        
        // Финальный выбор оружия на основе вероятностей
        const randomValue = Math.random();
        let cumulativeChance = 0;
        
        for (const pool of weaponPools) {
          cumulativeChance += pool.chance;
          
          if (randomValue <= cumulativeChance) {
            // Выбираем случайное оружие указанной редкости
            const rarityWeapons = weapons.filter(w => w.rarity === pool.rarity);
            const selectedWeapon = rarityWeapons[Math.floor(Math.random() * rarityWeapons.length)];
            setCurrentWeapon(selectedWeapon);
            onWeaponSelected(selectedWeapon);
            break;
          }
        }
        
        setSpinning(false);
      }
    }, 100);
  };
  
  useEffect(() => {
    // Выбираем начальное оружие при первом рендере
    const initialWeapon = weapons.find(w => w.rarity === 'common');
    if (initialWeapon) {
      setCurrentWeapon(initialWeapon);
      onWeaponSelected(initialWeapon);
    }
  }, []);
  
  const getRarityColor = (rarity: WeaponRarity): string => {
    const pool = weaponPools.find(p => p.rarity === rarity);
    return pool?.color || 'bg-gray-400';
  };
  
  const getRarityText = (rarity: WeaponRarity): string => {
    switch (rarity) {
      case 'common': return 'Обычное';
      case 'uncommon': return 'Необычное';
      case 'epic': return 'Эпическое';
      case 'legendary': return 'Легендарное';
      case 'divine': return 'Божественное';
      case 'titan': return 'Титан';
    }
  };
  
  return (
    <Card className="w-full max-w-sm p-4 bg-gray-800 border-gray-700 shadow-xl">
      <div className="text-center mb-4">
        <h3 className="text-xl font-bold text-white">Ящик с оружием</h3>
      </div>
      
      <Separator className="my-2" />
      
      <div className="flex flex-col items-center p-4 bg-gray-900 rounded-md min-h-[250px]">
        {currentWeapon && (
          <div className="text-center">
            <div className={`inline-block p-1 mb-2 rounded ${getRarityColor(currentWeapon.rarity)}`}>
              <span className="text-xs font-bold text-white">{getRarityText(currentWeapon.rarity)}</span>
            </div>
            <div className="w-24 h-24 mx-auto mb-2 bg-gray-700 rounded-md flex items-center justify-center">
              <img src={currentWeapon.image} alt={currentWeapon.name} className="w-16 h-16 object-contain" />
            </div>
            <h4 className="text-lg font-bold text-white">{currentWeapon.name}</h4>
            <p className="text-sm text-gray-300">Урон: {currentWeapon.damage}</p>
          </div>
        )}
      </div>
      
      <Separator className="my-2" />
      
      <div className="flex justify-center mt-4">
        <Button 
          onClick={spinRoulette} 
          disabled={spinning}
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          {spinning ? "Вращается..." : "Крутить рулетку"}
        </Button>
      </div>
    </Card>
  );
};

export default WeaponRoulette;
