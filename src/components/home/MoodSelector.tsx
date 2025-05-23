'use client';

import { useState } from 'react';
import { useAtom } from 'jotai';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { userMoodAtom, UserMoodType, recommendedMethodsAtom } from '@/lib/store';

export default function MoodSelector() {
  const [loading, setLoading] = useState(false);
  const [userMood, setUserMood] = useAtom(userMoodAtom);
  const [, setRecommendedMethods] = useAtom(recommendedMethodsAtom);

  const moodOptions: { id: UserMoodType; emoji: string; label: string }[] = [
    { id: '专注力', emoji: '⚡', label: '快速恢复专注力' },
    { id: '情绪', emoji: '🌿', label: '放松一下情绪' },
    { id: '充电', emoji: '🔋', label: '给大脑充电/切换状态' },
  ];

  const handleMoodSelect = async (mood: UserMoodType) => {
    setLoading(true);
    setUserMood(mood);

    try {
      // 在实际应用中，这里应该是一个API调用获取推荐
      // 在MVP阶段，我们模拟API调用
      const response = await fetch(`/api/recommend?mood=${mood}`);
      if (!response.ok) throw new Error('Failed to fetch recommendations');
      
      const data = await response.json();
      setRecommendedMethods(data);
    } catch (error) {
      console.error('Failed to get recommendations:', error);
      // 模拟一些推荐数据
      setRecommendedMethods([
        {
          id: '1',
          title: '4-7-8呼吸法',
          description: '通过调整呼吸节奏快速放松身心',
          duration: 3,
          category: '呼吸法',
        },
        {
          id: '2',
          title: '五感觉察',
          description: '通过有意识地感受五感来重新连接当下',
          duration: 5,
          category: '感官刺激',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mb-8">
      <CardContent className="pt-6">
        <h2 className="mb-4 text-center text-xl font-medium">
          你现在最需要哪种充电？
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {moodOptions.map((option) => (
            <Button
              key={option.id}
              variant={userMood === option.id ? 'default' : 'outline'}
              className="h-auto py-4 text-lg"
              disabled={loading}
              onClick={() => handleMoodSelect(option.id)}
            >
              <span className="mr-2 text-xl">{option.emoji}</span>
              {option.label}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 