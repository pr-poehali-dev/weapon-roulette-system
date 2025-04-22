
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { WeaponData } from "./types";

interface ZombieTargetProps {
  onZombieClick: () => void;
  currentWeapon: WeaponData | null;
}

const ZombieTarget = ({ onZombieClick, currentWeapon }: ZombieTargetProps) => {
  const [isAttacking, setIsAttacking] = useState(false);
  const [zombieHealth, setZombieHealth] = useState(100);
  const [zombieLevel, setZombieLevel] = useState(1);
  
  const handleClick = () => {
    if (!currentWeapon) return;
    
    setIsAttacking(true);
    onZombieClick();
    
    // Уменьшаем здоровье зомби
    const newHealth = Math.max(0, zombieHealth - (currentWeapon.damage || 1));
    setZombieHealth(newHealth);
    
    // Если зомби убит, увеличиваем уровень и сбрасываем здоровье
    if (newHealth === 0) {
      setTimeout(() => {
        setZombieLevel(prevLevel => prevLevel + 1);
        setZombieHealth(100 * (zombieLevel + 1)); // Увеличиваем здоровье с уровнем
      }, 500);
    }
    
    // Сбрасываем анимацию атаки
    setTimeout(() => {
      setIsAttacking(false);
    }, 150);
  };
  
  return (
    <div className="mt-8 w-full max-w-md">
      <Card className="p-4 bg-gray-800 border-gray-700 relative">
        <div className="mb-4 w-full bg-gray-700 h-4 rounded-full overflow-hidden">
          <div 
            className="h-full bg-red-600 transition-all duration-300" 
            style={{ width: `${(zombieHealth / (100 * zombieLevel)) * 100}%` }}
          />
        </div>
        
        <div className="absolute top-2 right-4 bg-red-700 text-white px-2 py-1 rounded text-xs">
          HP: {zombieHealth}
        </div>
        
        <div className="flex justify-center">
          <div 
            className={`w-64 h-64 bg-green-800 rounded-full flex items-center justify-center cursor-pointer transition-transform ${isAttacking ? 'scale-95' : 'hover:scale-105'}`}
            onClick={handleClick}
          >
            <div className="relative flex flex-col items-center">
              <span className="text-4xl">🧟</span>
              <span className="mt-2 text-white font-bold">Зомби Ур.{zombieLevel}</span>
              
              {currentWeapon && isAttacking && (
                <div className="absolute -top-8 text-2xl animate-fade-out">
                  -{currentWeapon.damage}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-4 text-center text-sm text-gray-300">
          {currentWeapon ? (
            <p>Нажимайте на зомби, чтобы атаковать с помощью: <span className="font-bold text-white">{currentWeapon.name}</span></p>
          ) : (
            <p>Выберите оружие из ящика, чтобы начать атаковать</p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ZombieTarget;
