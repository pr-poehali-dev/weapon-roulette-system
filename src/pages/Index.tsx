
import { useState, useEffect } from "react";
import WeaponRoulette from "@/components/WeaponRoulette";
import ZombieTarget from "@/components/ZombieTarget";
import ClickCounter from "@/components/ClickCounter";
import { WeaponData } from "@/components/types";

const Index = () => {
  const [currentWeapon, setCurrentWeapon] = useState<WeaponData | null>(null);
  const [clickCount, setClickCount] = useState(0);
  
  const handleWeaponSelected = (weapon: WeaponData) => {
    setCurrentWeapon(weapon);
  };
  
  const handleZombieClick = () => {
    if (currentWeapon) {
      let clickValue = 1;
      
      // Расчет бонуса кликов на основе редкости оружия
      switch (currentWeapon.rarity) {
        case "common": clickValue = 1; break;
        case "uncommon": clickValue = 2; break;
        case "epic": clickValue = 5; break;
        case "legendary": clickValue = 10; break;
        case "divine": clickValue = 25; break;
        case "titan": clickValue = 50; break;
      }
      
      setClickCount(prev => prev + clickValue);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 p-4">
      <h1 className="text-4xl font-bold mb-8 text-purple-400">Зомби Кликер</h1>
      
      <div className="flex flex-col md:flex-row items-center justify-center gap-8 w-full max-w-6xl">
        <div className="w-full md:w-1/3 flex justify-center">
          <WeaponRoulette onWeaponSelected={handleWeaponSelected} />
        </div>
        
        <div className="w-full md:w-2/3 flex flex-col items-center">
          <ClickCounter count={clickCount} />
          <ZombieTarget onZombieClick={handleZombieClick} currentWeapon={currentWeapon} />
        </div>
      </div>
    </div>
  );
};

export default Index;
