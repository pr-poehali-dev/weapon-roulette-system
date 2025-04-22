
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { WeaponData, ShopItem } from "./types";
import { toast } from "@/components/ui/use-toast";

interface InventoryProps {
  weapons: WeaponData[];
  items: ShopItem[];
  onUseItem: (item: ShopItem) => void;
}

const getRarityColor = (rarity: string): string => {
  switch (rarity) {
    case 'common': return 'bg-gray-400';
    case 'uncommon': return 'bg-green-500';
    case 'epic': return 'bg-purple-500';
    case 'legendary': return 'bg-yellow-500';
    case 'divine': return 'bg-blue-500';
    case 'titan': return 'bg-red-500';
    default: return 'bg-gray-400';
  }
};

const getRarityText = (rarity: string): string => {
  switch (rarity) {
    case 'common': return 'Обычное';
    case 'uncommon': return 'Необычное';
    case 'epic': return 'Эпическое';
    case 'legendary': return 'Легендарное';
    case 'divine': return 'Божественное';
    case 'titan': return 'Титан';
    default: return 'Неизвестно';
  }
};

const Inventory = ({ weapons, items, onUseItem }: InventoryProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'weapons' | 'items'>('weapons');
  
  const handleUseItem = (item: ShopItem) => {
    onUseItem(item);
    toast({
      title: "Предмет использован",
      description: `Вы использовали ${item.name}`
    });
  };
  
  return (
    <Card className="w-full max-w-sm bg-gray-800 border-gray-700 mt-4">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className="w-full bg-green-700 hover:bg-green-800" onClick={() => setIsOpen(true)}>
            Инвентарь
          </Button>
        </DialogTrigger>
        
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Инвентарь</DialogTitle>
          </DialogHeader>
          
          <div className="flex border-b border-gray-700 mb-4">
            <Button 
              variant={activeTab === 'weapons' ? 'default' : 'ghost'} 
              onClick={() => setActiveTab('weapons')}
              className={`rounded-none ${activeTab === 'weapons' ? 'bg-purple-700' : 'hover:bg-gray-700'}`}
            >
              Оружие ({weapons.length})
            </Button>
            <Button 
              variant={activeTab === 'items' ? 'default' : 'ghost'} 
              onClick={() => setActiveTab('items')}
              className={`rounded-none ${activeTab === 'items' ? 'bg-green-700' : 'hover:bg-gray-700'}`}
            >
              Предметы ({items.length})
            </Button>
          </div>
          
          {activeTab === 'weapons' && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {weapons.length > 0 ? (
                weapons.map((weapon) => (
                  <Card key={weapon.id} className="p-3 bg-gray-700 border-gray-600">
                    <div className={`mb-2 px-2 py-1 rounded text-xs font-bold text-white inline-block ${getRarityColor(weapon.rarity)}`}>
                      {getRarityText(weapon.rarity)}
                    </div>
                    <div className="w-full h-24 bg-gray-800 rounded-md mb-2 flex items-center justify-center">
                      <img src={weapon.image} alt={weapon.name} className="w-16 h-16 object-contain" />
                    </div>
                    <h4 className="font-bold text-sm">{weapon.name}</h4>
                    <p className="text-xs text-gray-300">Урон: {weapon.damage}</p>
                  </Card>
                ))
              ) : (
                <p className="text-gray-400 col-span-3 text-center py-8">У вас пока нет оружия</p>
              )}
            </div>
          )}
          
          {activeTab === 'items' && (
            <div className="grid gap-4">
              {items.length > 0 ? (
                items.map((item) => (
                  <Card key={item.id} className="p-4 bg-gray-700 border-gray-600">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-800 rounded-md flex items-center justify-center">
                        <img src={item.image} alt={item.name} className="w-8 h-8" />
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="font-bold">{item.name}</h4>
                        <p className="text-xs text-gray-300">{item.description}</p>
                      </div>
                      
                      <Button 
                        onClick={() => handleUseItem(item)}
                        variant="outline" 
                        className="bg-green-700 hover:bg-green-600"
                      >
                        Использовать
                      </Button>
                    </div>
                  </Card>
                ))
              ) : (
                <p className="text-gray-400 text-center py-8">У вас нет предметов</p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default Inventory;
