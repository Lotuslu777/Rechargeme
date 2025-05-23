import MoodSelector from '@/components/home/MoodSelector';
import RecommendedMethods from '@/components/home/RecommendedMethods';

export default function Home() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center py-8">
      <div className="w-full max-w-2xl">
        <div className="mb-12 text-center">
          <h1 className="mb-3 text-4xl font-bold">RechargeMe</h1>
          <p className="text-xl text-muted-foreground">
            你的专属大脑充电器，快速恢复精力、放松情绪、重启专注
          </p>
        </div>
        
        <MoodSelector />
        <RecommendedMethods />
      </div>
    </div>
  );
}
