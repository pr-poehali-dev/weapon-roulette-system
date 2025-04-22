
import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { WeaponData, EnemyType } from "./types";

interface ZombieTargetProps {
  onZombieClick: (enemyType: EnemyType) => void;
  currentWeapon: WeaponData | null;
}

const ZombieTarget = ({ onZombieClick, currentWeapon }: ZombieTargetProps) => {
  const [isAttacking, setIsAttacking] = useState(false);
  const [zombieHealth, setZombieHealth] = useState(100);
  const [zombieMaxHealth, setZombieMaxHealth] = useState(100);
  const [zombieLevel, setZombieLevel] = useState(1);
  const [enemyType, setEnemyType] = useState<EnemyType>('zombie');
  const [damageDisplay, setDamageDisplay] = useState<{value: number; position: {x: number, y: number}}[]>([]);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const enemyRef = useRef<HTMLDivElement>(null);
  
  // Инициализируем аудио для клика
  useEffect(() => {
    audioRef.current = new Audio('/click.mp3'); // Предполагается, что файл звука размещен в /public
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);
  
  // Генерация типа врага
  useEffect(() => {
    if (zombieHealth === zombieMaxHealth) {
      const random = Math.random();
      
      if (random < 0.01) { // 1% шанс на клевер-зомби
        setEnemyType('clover');
        setZombieMaxHealth(50);
        setZombieHealth(50);
      } else if (random < 0.05) { // 4% шанс на вампира
        setEnemyType('vampire');
        setZombieMaxHealth(200 * zombieLevel);
        setZombieHealth(200 * zombieLevel);
      } else if (random < 0.15) { // 10% шанс на босса
        setEnemyType('boss');
        setZombieMaxHealth(500 * zombieLevel);
        setZombieHealth(500 * zombieLevel);
      } else {
        setEnemyType('zombie');
        setZombieMaxHealth(100 * zombieLevel);
        setZombieHealth(100 * zombieLevel);
      }
    }
  }, [zombieLevel, zombieHealth, zombieMaxHealth]);
  
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!currentWeapon) return;
    
    // Воспроизведение звука клика
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(err => console.error("Не удалось воспроизвести звук:", err));
    }
    
    setIsAttacking(true);
    
    // Расчет позиции для отображения урона
    const rect = enemyRef.current?.getBoundingClientRect();
    if (rect) {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Добавление нового отображения урона
      setDamageDisplay(prev => [
        ...prev, 
        { value: currentWeapon.damage, position: { x, y } }
      ]);
      
      // Удаление отображения урона через 1 секунду
      setTimeout(() => {
        setDamageDisplay(prev => prev.slice(1));
      }, 1000);
    }
    
    // Уменьшение здоровья врага
    const newHealth = Math.max(0, zombieHealth - (currentWeapon.damage || 1));
    setZombieHealth(newHealth);
    
    // Передаем информацию о клике
    onZombieClick(enemyType);
    
    // Если враг убит, увеличиваем уровень и генерируем нового
    if (newHealth === 0) {
      setTimeout(() => {
        if (enemyType !== 'boss') {
          setZombieLevel(prevLevel => prevLevel + 1);
        } else {
          setZombieLevel(prevLevel => prevLevel + 2); // Босс дает +2 уровня
        }
        
        // Новый враг будет сгенерирован в useEffect
      }, 500);
    }
    
    // Сбрасываем анимацию атаки
    setTimeout(() => {
      setIsAttacking(false);
    }, 150);
  };
  
  const getEnemyIcon = () => {
    switch (enemyType) {
      case 'zombie': return '🧟';
      case 'boss': return '🧟‍♂️';
      case 'vampire': return '🧛';
      case 'clover': return '☘️';
      default: return '🧟';
    }
  };
  
  const getEnemyColor = () => {
    switch (enemyType) {
      case 'zombie': return 'bg-green-800';
      case 'boss': return 'bg-purple-900';
      case 'vampire': return 'bg-red-900';
      case 'clover': return 'bg-emerald-800';
      default: return 'bg-green-800';
    }
  };
  
  const getEnemyName = () => {
    switch (enemyType) {
      case 'zombie': return 'Зомби';
      case 'boss': return 'БОСС';
      case 'vampire': return 'Вампир';
      case 'clover': return 'Клевер-Зомби';
      default: return 'Зомби';
    }
  };
  
  const getHealthBarColor = () => {
    const percentage = (zombieHealth / zombieMaxHealth) * 100;
    if (percentage < 25) return 'bg-red-600';
    if (percentage < 50) return 'bg-yellow-600';
    return 'bg-green-600';
  };
  
  return (
    <div className="mt-8 w-full max-w-md">
      <Card className="p-4 bg-gray-800 border-gray-700 relative">
        <div className="mb-4 w-full bg-gray-700 h-6 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-300 ${getHealthBarColor()}`} 
            style={{ width: `${(zombieHealth / zombieMaxHealth) * 100}%` }}
          />
        </div>
        
        <div className="absolute top-6 right-4 bg-gray-900 text-white px-3 py-1 rounded-full text-xs font-bold">
          {zombieHealth} / {zombieMaxHealth} HP
        </div>
        
        <div className="flex justify-center">
          <div 
            ref={enemyRef}
            className={`w-64 h-64 ${getEnemyColor()} rounded-full flex items-center justify-center cursor-pointer transition-transform relative overflow-hidden ${isAttacking ? 'scale-95' : 'hover:scale-105'}`}
            onClick={handleClick}
          >
            <div className="relative flex flex-col items-center">
              <span className="text-6xl mb-2 transition-transform duration-300 transform hover:scale-110">
                {getEnemyIcon()}
              </span>
              <span className={`mt-2 font-bold text-lg ${enemyType === 'boss' ? 'text-yellow-400' : 'text-white'}`}>
                {getEnemyName()} Ур.{zombieLevel}
              </span>
              
              {damageDisplay.map((display, index) => (
                <div 
                  key={index}
                  className="absolute text-2xl font-bold text-red-400 animate-fade-out"
                  style={{ 
                    left: `${display.position.x}px`, 
                    top: `${display.position.y - 20}px`,
                    textShadow: '0 0 3px black'
                  }}
                >
                  -{display.value}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-4 text-center text-sm text-gray-300">
          {currentWeapon ? (
            <p>Нажимайте на врага, чтобы атаковать с помощью: <span className="font-bold text-white">{currentWeapon.name}</span></p>
          ) : (
            <p>Выберите оружие из ящика, чтобы начать атаковать</p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ZombieTarget;
