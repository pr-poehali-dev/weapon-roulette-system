
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ResourceCounts, ShopItem } from "./types";
import { Separator } from "./ui/separator";
import { toast } from "@/components/ui/use-toast";

interface ShopProps {
  resources: ResourceCounts;
  onPurchase: (item: ShopItem) => void;
}

const shopItems: ShopItem[] = [
  {
    id: "clover-x1",
    name: "Клевер x1",
    description: "Повышает удачу в 10 раз на одну прокрутку рулетки",
    cost: {
      type: "zombieSouls",
      amount: 20
    },
    effect: {
      type: "luck",
      multiplier: 10,
      duration: 1
    },
    image: "/placeholder.svg"
  },
  {
    id: "clover-x2",
    name: "Клевер x2",
    description: "Повышает удачу в 20 раз на одну прокрутку рулетки",
    cost: {
      type: "zombieSouls",
      amount: 50
    },
    effect: {
      type: "luck",
      multiplier: 20,
      duration: 1
    },
    image: "/placeholder.svg"
  },
  {
    id: "potion-x2",
    name: "Зелье удачи x2",
    description: "Повышает удачу в 2 раза на 5 прокруток рулетки",
    cost: {
      type: "zombieSouls",
      amount: 30
    },
    effect: {
      type: "luck",
      multiplier: 2,
      duration: 5
    },
    image: "/placeholder.svg"
  }
];

const Shop = ({ resources, onPurchase }: ShopProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const handlePurchase = (item: ShopItem) => {
    const resourceType = item.cost.type;
    const currentAmount = resources[resourceType];
    
    if (currentAmount >= item.cost.amount) {
      onPurchase(item);
      toast({
        title: "Покупка успешна!",
        description: `Вы приобрели ${item.name}`,
      });
    } else {
      toast({
        title: "Недостаточно ресурсов",
        description: `Вам нужно еще ${item.cost.amount - currentAmount} ${getResourceName(resourceType)}`,
        variant: "destructive"
      });
    }
  };
  
  const getResourceName = (type: string) => {
    switch (type) {
      case "zombieSouls": return "душ зомби";
      case "bossSouls": return "душ боссов";
      case "vampireSouls": return "душ вампиров";
      default: return "ресурсов";
    }
  };
  
  return (
    <Card className="w-full max-w-sm bg-gray-800 border-gray-700 mt-4">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className="w-full bg-purple-700 hover:bg-purple-800" onClick={() => setIsOpen(true)}>
            Открыть магазин
          </Button>
        </DialogTrigger>
        
        <DialogContent className="bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Магазин удачи</DialogTitle>
          </DialogHeader>
          
          <Separator className="my-2" />
          
          <div className="grid gap-4 py-4">
            {shopItems.map((item) => (
              <Card key={item.id} className="p-4 bg-gray-700 border-gray-600 hover:bg-gray-650 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-800 rounded-md flex items-center justify-center">
                    <img src={item.image} alt={item.name} className="w-8 h-8" />
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="font-bold">{item.name}</h4>
                    <p className="text-xs text-gray-300">{item.description}</p>
                  </div>
                  
                  <Button 
                    onClick={() => handlePurchase(item)}
                    variant="outline" 
                    className="bg-purple-900 hover:bg-purple-800 border-purple-700"
                  >
                    <span className="mr-1">{item.cost.amount}</span>
                    <span className="text-xs">
                      {item.cost.type === "zombieSouls" && "🧟"}
                      {item.cost.type === "bossSouls" && "👑"}
                      {item.cost.type === "vampireSouls" && "🧛"}
                    </span>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default Shop;
