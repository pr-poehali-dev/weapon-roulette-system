
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { WeaponData, WeaponPoolConfig, WeaponRarity, ShopItem } from "./types";

interface WeaponRouletteProps {
  onWeaponSelected: (weapon: WeaponData) => void;
  onCollectWeapon: (weapon: WeaponData) => void;
  activeItems: ShopItem[];
}

const weaponPools: WeaponPoolConfig[] = [
  { rarity: 'common', count: 120, chance: 0.42, color: 'bg-gray-400' },
  { rarity: 'uncommon', count: 180, chance: 0.31, color: 'bg-green-500' },
  { rarity: 'epic', count: 100, chance: 0.15, color: 'bg-purple-500' },
  { rarity: 'legendary', count: 50, chance: 0.08, color: 'bg-yellow-500' },
  { rarity: 'divine', count: 30, chance: 0.03, color: 'bg-blue-500' },
  { rarity: 'titan', count: 20, chance: 0.01, color: 'bg-red-500' }
];

// Функция для генерации случайного оружия
const generateWeapons = (): WeaponData[] => {
  const weapons: WeaponData[] = [];
  let id = 1;
  
  weaponPools.forEach(pool => {
    const baseNames = [
      'Пистолет', 'Винтовка', 'Лук', 'Молот', 'Топор', 
      'Катана', 'Копьё', 'Дробовик', 'Меч', 'Посох',
      'Нож', 'Пулемёт', 'Арбалет', 'Бластер', 'Базука'
    ];
    
    const prefixes = [
      'Железный', 'Стальной', 'Древний', 'Мощный', 'Острый', 
      'Тяжёлый', 'Быстрый', 'Проклятый', 'Священный', 'Механический',
      'Огненный', 'Ледяной', 'Ядовитый', 'Электрический', 'Звёздный'
    ];
    
    for (let i = 0; i < pool.count; i++) {
      const baseName = baseNames[Math.floor(Math.random() * baseNames.length)];
      const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
      const name = `${prefix} ${baseName} ${i+1}`;
      
      weapons.push({
        id: id++,
        name,
        rarity: pool.rarity,
        damage: getRarityMultiplier(pool.rarity) * (Math.floor(Math.random() * 10) + 1),
        image: '/placeholder.svg'
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

const WeaponRoulette = ({ onWeaponSelected, onCollectWeapon, activeItems }: WeaponRouletteProps) => {
  const [weapons] = useState<WeaponData[]>(generateWeapons());
  const [currentWeapon, setCurrentWeapon] = useState<WeaponData | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [showCollect, setShowCollect] = useState(false);
  const [spinResult, setSpinResult] = useState<WeaponData | null>(null);
  const [luckMultiplier, setLuckMultiplier] = useState(1);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Инициализация аудио
  useEffect(() => {
    audioRef.current = new Audio('/spin.mp3'); // Предполагается, что файл размещен в /public
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);
  
  // Применяем эффекты активных предметов
  useEffect(() => {
    let totalLuckMultiplier = 1;
    
    activeItems.forEach(item => {
      if (item.effect.type === 'luck') {
        totalLuckMultiplier *= item.effect.multiplier;
      }
    });
    
    setLuckMultiplier(totalLuckMultiplier);
  }, [activeItems]);
  
  // Функция для выбора оружия на основе вероятностей
  const spinRoulette = () => {
    if (spinning) return;
    
    // Воспроизведение звука вращения
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(err => console.error("Не удалось воспроизвести звук:", err));
    }
    
    setSpinning(true);
    setShowCollect(false);
    
    // Имитация вращения рулетки
    let rotations = 0;
    const maxRotations = 20;
    const interval = setInterval(() => {
      const randomWeaponIndex = Math.floor(Math.random() * weapons.length);
      setCurrentWeapon(weapons[randomWeaponIndex]);
      
      rotations++;
      if (rotations >= maxRotations) {
        clearInterval(interval);
        
        // Финальный выбор оружия на основе вероятностей с учетом множителя удачи
        const randomValue = Math.random();
        let adjustedPools = [...weaponPools];
        
        if (luckMultiplier > 1) {
          // Увеличиваем шансы на редкие предметы
          adjustedPools = adjustedPools.map(pool => {
            if (pool.rarity === 'common' || pool.rarity === 'uncommon') {
              return { ...pool, chance: pool.chance / luckMultiplier };
            } else {
              return { ...pool, chance: pool.chance * luckMultiplier };
            }
          });
          
          // Нормализуем вероятности
          const totalChance = adjustedPools.reduce((sum, pool) => sum + pool.chance, 0);
          adjustedPools = adjustedPools.map(pool => ({
            ...pool,
            chance: pool.chance / totalChance
          }));
        }
        
        let cumulativeChance = 0;
        let selectedRarity: WeaponRarity = 'common';
        
        for (const pool of adjustedPools) {
          cumulativeChance += pool.chance;
          
          if (randomValue <= cumulativeChance) {
            selectedRarity = pool.rarity;
            break;
          }
        }
        
        // Выбираем случайное оружие указанной редкости
        const rarityWeapons = weapons.filter(w => w.rarity === selectedRarity);
        const selectedWeapon = rarityWeapons[Math.floor(Math.random() * rarityWeapons.length)];
        
        setCurrentWeapon(selectedWeapon);
        setSpinResult(selectedWeapon);
        onWeaponSelected(selectedWeapon);
        setShowCollect(true);
        
        // Анимация для редких оружий
        if (selectedWeapon.rarity === 'legendary' || selectedWeapon.rarity === 'divine' || selectedWeapon.rarity === 'titan') {
          // Здесь можно добавить специальную анимацию для редких оружий
          // Например, изменить фон, добавить частицы, и т.д.
          document.body.classList.add('rare-weapon-animation');
          setTimeout(() => {
            document.body.classList.remove('rare-weapon-animation');
          }, 3000);
        }
        
        setSpinning(false);
      }
    }, 100);
  };
  
  const handleCollect = () => {
    if (spinResult) {
      onCollectWeapon(spinResult);
      setShowCollect(false);
    }
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
    <Card className={`w-full max-w-sm p-4 bg-gray-800 border-gray-700 shadow-xl 
      ${spinning ? 'animate-pulse' : ''} 
      ${currentWeapon?.rarity === 'legendary' ? 'border-yellow-500' : ''} 
      ${currentWeapon?.rarity === 'divine' ? 'border-blue-500' : ''} 
      ${currentWeapon?.rarity === 'titan' ? 'border-red-500' : ''}`}>
      <div className="text-center mb-4">
        <h3 className="text-xl font-bold text-white">Ящик с оружием</h3>
        {luckMultiplier > 1 && (
          <span className="text-xs bg-green-700 text-white px-2 py-1 rounded-full">
            Множитель удачи: x{luckMultiplier}
          </span>
        )}
      </div>
      
      <Separator className="my-2" />
      
      <div className={`flex flex-col items-center p-4 bg-gray-900 rounded-md min-h-[250px] relative 
        ${currentWeapon?.rarity === 'legendary' ? 'bg-yellow-900/20' : ''} 
        ${currentWeapon?.rarity === 'divine' ? 'bg-blue-900/20' : ''} 
        ${currentWeapon?.rarity === 'titan' ? 'bg-red-900/20' : ''}`}>
        {currentWeapon && (
          <div className="text-center">
            <div className={`inline-block p-1 mb-2 rounded ${getRarityColor(currentWeapon.rarity)}`}>
              <span className="text-xs font-bold text-white">{getRarityText(currentWeapon.rarity)}</span>
            </div>
            <div className={`w-32 h-32 mx-auto mb-2 rounded-md flex items-center justify-center
              ${currentWeapon.rarity === 'common' ? 'bg-gray-700' : ''}
              ${currentWeapon.rarity === 'uncommon' ? 'bg-green-900/50' : ''}
              ${currentWeapon.rarity === 'epic' ? 'bg-purple-900/50' : ''}
              ${currentWeapon.rarity === 'legendary' ? 'bg-yellow-900/50' : ''}
              ${currentWeapon.rarity === 'divine' ? 'bg-blue-900/50' : ''}
              ${currentWeapon.rarity === 'titan' ? 'bg-red-900/50' : ''}`}>
              <img src={currentWeapon.image} alt={currentWeapon.name} className={`w-24 h-24 object-contain ${spinning ? 'animate-spin-slow' : ''}`} />
            </div>
            <h4 className="text-lg font-bold text-white">{currentWeapon.name}</h4>
            <p className="text-sm text-gray-300">Урон: {currentWeapon.damage}</p>
          </div>
        )}
        
        {showCollect && (
          <Button 
            onClick={handleCollect}
            className="mt-4 bg-green-600 hover:bg-green-700 absolute bottom-4 right-4"
          >
            Добавить в инвентарь
          </Button>
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
