
import { Card } from "@/components/ui/card";
import { ResourceCounts } from "./types";
import { Separator } from "./ui/separator";

interface ResourceCounterProps {
  resources: ResourceCounts;
}

const ResourceCounter = ({ resources }: ResourceCounterProps) => {
  return (
    <Card className="w-full max-w-sm p-3 bg-gray-800 border-gray-700 mb-4">
      <h3 className="text-lg font-bold text-white mb-2">Ресурсы</h3>
      <Separator className="mb-2" />
      
      <div className="grid grid-cols-2 gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-800 rounded-full flex items-center justify-center">
            <span className="text-green-300">🧟</span>
          </div>
          <div>
            <p className="text-xs text-gray-400">Души зомби</p>
            <p className="text-sm font-bold text-white">{resources.zombieSouls}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-purple-900 rounded-full flex items-center justify-center">
            <span className="text-purple-300">👑</span>
          </div>
          <div>
            <p className="text-xs text-gray-400">Души боссов</p>
            <p className="text-sm font-bold text-white">{resources.bossSouls}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-red-900 rounded-full flex items-center justify-center">
            <span className="text-red-300">🧛</span>
          </div>
          <div>
            <p className="text-xs text-gray-400">Души вампиров</p>
            <p className="text-sm font-bold text-white">{resources.vampireSouls}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-900 rounded-full flex items-center justify-center">
            <span className="text-emerald-300">☘️</span>
          </div>
          <div>
            <p className="text-xs text-gray-400">Клеверы</p>
            <p className="text-sm font-bold text-white">{resources.clovers.x1} / {resources.clovers.x2}</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ResourceCounter;
