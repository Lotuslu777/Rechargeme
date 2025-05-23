'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function RechargeComplete({ rechargeDuration }: { rechargeDuration: number }) {
  const router = useRouter();
  const [rating, setRating] = useState<number | null>(null);

  const handleRating = (value: number) => {
    setRating(value);
    toast.success('感谢您的评价！');
  };

  return (
    <div className="mx-auto max-w-md py-12">
      <Card className="border-2 text-center">
        <CardHeader>
          <CardTitle className="text-2xl">
            <span className="mr-2 text-2xl">🎉</span> 你完成了这次充电！
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-lg text-muted-foreground">
            你刚刚完成了 {rechargeDuration} 分钟的休息，感觉如何？
          </p>

          {/* 评分 */}
          <div className="mt-4">
            <p className="mb-3 text-sm text-muted-foreground">这次充电体验如何？</p>
            <div className="flex justify-center space-x-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  onClick={() => handleRating(value)}
                  className={`h-10 w-10 rounded-full text-lg ${
                    rating === value
                      ? 'bg-primary text-white'
                      : 'bg-muted hover:bg-primary/20'
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>

          {/* 建议 */}
          <div className="rounded-lg bg-muted/50 p-4">
            <p className="text-sm text-muted-foreground">
              建议：1小时后再次休息，保持良好的能量水平
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center gap-4">
          <Button onClick={() => router.push('/')}>
            返回首页
          </Button>
          <Button variant="outline" onClick={() => router.push('/explore')}>
            浏览更多充电方式
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
} 