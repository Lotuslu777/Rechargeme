'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RechargeMethod } from '@/lib/store';
import Link from 'next/link';

export default function ExplorePage() {
  const router = useRouter();
  const [rechargeMethods, setRechargeMethods] = useState<RechargeMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // 获取所有休息方式
  useEffect(() => {
    async function fetchRechargeMethods() {
      try {
        const response = await fetch('/api/recharge');
        if (!response.ok) throw new Error('Failed to fetch recharge methods');
        
        const data = await response.json();
        setRechargeMethods(data);
      } catch (error) {
        console.error('Error fetching recharge methods:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchRechargeMethods();
  }, []);

  // 分类列表
  const categories = [
    { id: '呼吸法', name: '呼吸法', emoji: '🌬️' },
    { id: '身体放松', name: '身体放松', emoji: '💆' },
    { id: '感官刺激', name: '感官刺激', emoji: '👁️' },
    { id: '微冥想', name: '微冥想', emoji: '🧘' },
    { id: '轻娱乐', name: '轻娱乐', emoji: '🎮' },
  ];

  // 按分类筛选
  const filteredMethods = activeCategory
    ? rechargeMethods.filter((method) => method.category === activeCategory)
    : rechargeMethods;

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p>加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold">休息方式库</h1>
        <p className="text-muted-foreground">
          探索适合你的休息方式，找到专属于你的充电方式
        </p>
      </div>

      {/* 分类筛选 */}
      <div className="mb-8">
        <div className="mb-2 text-sm text-muted-foreground">按类别浏览：</div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={activeCategory === null ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveCategory(null)}
          >
            全部
          </Button>
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveCategory(category.id)}
            >
              <span className="mr-1">{category.emoji}</span> {category.name}
            </Button>
          ))}
        </div>
      </div>

      {/* 休息方式列表 */}
      {filteredMethods.length === 0 ? (
        <div className="mt-8 text-center text-muted-foreground">
          没有找到相关的休息方式
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredMethods.map((method) => (
            <Card key={method.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{method.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{method.description}</p>
                <div className="mt-2 flex items-center text-sm">
                  <span className="mr-4 flex items-center text-muted-foreground">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="mr-1 h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {method.duration} 分钟
                  </span>
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                    {method.category}
                  </span>
                </div>
              </CardContent>
              <CardFooter className="border-t bg-muted/50 px-6 py-3">
                <Button
                  className="w-full"
                  onClick={() => router.push(`/recharge/${method.id}`)}
                >
                  开始充电
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* 添加自定义休息方式 */}
      <div className="mt-12 flex justify-center">
        <Link href="/create">
          <Button>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mr-2 h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            添加新的休息方式
          </Button>
        </Link>
      </div>
    </div>
  );
} 