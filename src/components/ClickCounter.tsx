
import { Card } from "@/components/ui/card";

interface ClickCounterProps {
  count: number;
}

const ClickCounter = ({ count }: ClickCounterProps) => {
  return (
    <Card className="w-full max-w-md p-4 bg-gray-800 border-gray-700 mb-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-white">Счетчик кликов</h3>
        <div className="bg-purple-900 text-white px-4 py-2 rounded-md font-mono text-2xl">
          {count.toLocaleString()}
        </div>
      </div>
    </Card>
  );
};

export default ClickCounter;
