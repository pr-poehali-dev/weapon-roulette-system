
import { useState, useEffect } from "react";
import ClickCounter from "@/components/ClickCounter";
import WeaponRoulette from "@/components/WeaponRoulette";
import ZombieTarget from "@/components/ZombieTarget";
import ResourceCounter from "@/components/ResourceCounter";
import Shop from "@/components/Shop";
import Inventory from "@/components/Inventory";
import { WeaponData, ResourceCounts, ShopItem, EnemyType } from "@/components/types";
import { toast } from "@/components/ui/use-toast";

const Index = () => {
  const [clickCount, setClickCount] = useState(0);
  const [currentWeapon, setCurrentWeapon] = useState<WeaponData | null>(null);
  const [ownedWeapons, setOwnedWeapons] = useState<WeaponData[]>([]);
  const [ownedItems, setOwnedItems] = useState<ShopItem[]>([]);
  const [activeItems, setActiveItems] = useState<ShopItem[]>([]);
  const [resources, setResources] = useState<ResourceCounts>({
    zombieSouls: 0,
    bossSouls: 0,
    vampireSouls: 0,
    clovers: {
      x1: 0,
      x2: 0
    }
  });
  
  const handleWeaponSelected = (weapon: WeaponData) => {
    setCurrentWeapon(weapon);
  };
  
  const handleCollectWeapon = (weapon: WeaponData) => {
    // Проверяем, не существует ли уже такое оружие с таким же ID
    if (!ownedWeapons.some(w => w.id === weapon.id)) {
      setOwnedWeapons(prev => [...prev, weapon]);
      toast({
        title: "Оружие добавлено",
        description: `${weapon.name} добавлено в ваш инвентарь`,
      });
    }
  };
  
  const handleZombieClick = (enemyType: EnemyType) => {
    if (!currentWeapon) return;
    
    // Увеличиваем счетчик кликов в зависимости от редкости оружия
    let multiplier = 1;
    switch (currentWeapon.rarity) {
      case 'uncommon': multiplier = 2; break;
      case 'epic': multiplier = 5; break;
      case 'legendary': multiplier = 10; break;
      case 'divine': multiplier = 25; break;
      case 'titan': multiplier = 50; break;
    }
    
    setClickCount(prev => prev + multiplier);
    
    // Проверяем, убит ли враг (это будет определяться в ZombieTarget, но здесь мы добавляем душу)
    if (currentWeapon.damage >= 0) { // просто чтобы имитировать убийство для демонстрации
      const chance = Math.random();
      
      // Шанс получения души зависит от типа врага
      if (chance < 0.2 || enemyType !== 'zombie') { // 20% для обычных зомби, всегда для специальных
        setResources(prev => {
          const newResources = { ...prev };
          
          switch (enemyType) {
            case 'zombie':
              newResources.zombieSouls += 1;
              break;
            case 'boss':
              newResources.bossSouls += 1;
              break;
            case 'vampire':
              newResources.vampireSouls += 1;
              break;
            case 'clover':
              // Клевер-зомби всегда дает клевер x2
              newResources.clovers.x2 += 1;
              toast({
                title: "Получен предмет!",
                description: "Клевер x2 добавлен в ваш инвентарь",
              });
              break;
          }
          
          return newResources;
        });
      }
    }
  };
  
  const handlePurchase = (item: ShopItem) => {
    const resourceType = item.cost.type;
    const currentAmount = resources[resourceType];
    
    if (currentAmount >= item.cost.amount) {
      // Вычитаем стоимость
      setResources(prev => {
        const newResources = { ...prev };
        newResources[resourceType] -= item.cost.amount;
        return newResources;
      });
      
      // Добавляем предмет в инвентарь
      const newItem = {
        ...item,
        id: `${item.id}-${Date.now()}` // Уникальный ID для каждого экземпляра
      };
      setOwnedItems(prev => [...prev, newItem]);
    }
  };
  
  const handleUseItem = (item: ShopItem) => {
    // Добавляем предмет в активные
    setActiveItems(prev => [...prev, item]);
    
    // Удаляем предмет из инвентаря
    setOwnedItems(prev => prev.filter(i => i.id !== item.id));
    
    // Если у предмета есть ограниченная длительность, удаляем его из активных через заданное время
    if (item.effect.duration > 0) {
      setTimeout(() => {
        setActiveItems(prev => prev.filter(i => i.id !== item.id));
        toast({
          title: "Действие предмета закончилось",
          description: `${item.name} больше не действует`,
        });
      }, item.effect.duration * 5000); // Например, 5 секунд на каждую единицу длительности
    }
  };
  
  useEffect(() => {
    // Загрузка сохраненного прогресса
    const savedClickCount = localStorage.getItem('clickCount');
    const savedResources = localStorage.getItem('resources');
    const savedWeapons = localStorage.getItem('ownedWeapons');
    const savedItems = localStorage.getItem('ownedItems');
    
    if (savedClickCount) setClickCount(parseInt(savedClickCount));
    if (savedResources) setResources(JSON.parse(savedResources));
    if (savedWeapons) setOwnedWeapons(JSON.parse(savedWeapons));
    if (savedItems) setOwnedItems(JSON.parse(savedItems));
  }, []);
  
  useEffect(() => {
    // Сохранение прогресса
    localStorage.setItem('clickCount', clickCount.toString());
    localStorage.setItem('resources', JSON.stringify(resources));
    localStorage.setItem('ownedWeapons', JSON.stringify(ownedWeapons));
    localStorage.setItem('ownedItems', JSON.stringify(ownedItems));
  }, [clickCount, resources, ownedWeapons, ownedItems]);
  
  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Zombie Clicker</h1>
        
        <div className="flex flex-col md:flex-row gap-6 justify-center items-start">
          {/* Левая колонка (рулетка и магазин) */}
          <div className="flex flex-col w-full md:w-auto">
            <ResourceCounter resources={resources} />
            <WeaponRoulette 
              onWeaponSelected={handleWeaponSelected} 
              onCollectWeapon={handleCollectWeapon}
              activeItems={activeItems}
            />
            <Shop resources={resources} onPurchase={handlePurchase} />
            <Inventory 
              weapons={ownedWeapons} 
              items={ownedItems} 
              onUseItem={handleUseItem} 
            />
          </div>
          
          {/* Правая колонка (зомби и счетчик) */}
          <div className="flex flex-col items-center w-full md:w-auto">
            <ClickCounter count={clickCount} />
            <ZombieTarget 
              onZombieClick={handleZombieClick} 
              currentWeapon={currentWeapon} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
