'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RechargeMethod } from '@/lib/store';
import Link from 'next/link';

export default function ProfilePage() {
  const { status } = useSession();
  const router = useRouter();
  const [recentlyUsed, setRecentlyUsed] = useState<RechargeMethod[]>([]);
  const [favorites, setFavorites] = useState<RechargeMethod[]>([]);
  const [totalDuration, setTotalDuration] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 检查用户是否登录
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    // 获取用户数据
    if (status === 'authenticated') {
      async function fetchUserData() {
        try {
          // 获取最近使用的充电方式
          const recentResponse = await fetch('/api/user/history');
          if (recentResponse.ok) {
            const recentData = await recentResponse.json();
            setRecentlyUsed(recentData);
          }

          // 获取收藏的充电方式
          const favoritesResponse = await fetch('/api/user/favorites');
          if (favoritesResponse.ok) {
            const favoritesData = await favoritesResponse.json();
            setFavorites(favoritesData);
          }

          // 获取总充电时长
          const statsResponse = await fetch('/api/user/stats');
          if (statsResponse.ok) {
            const statsData = await statsResponse.json();
            setTotalDuration(statsData.totalDuration || 0);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        } finally {
          setLoading(false);
        }
      }

      fetchUserData();
    }
  }, [status, router]);

  // MVP阶段模拟数据
  useEffect(() => {
    if (status === 'authenticated' && loading) {
      // 模拟最近使用的充电方式
      setRecentlyUsed([
        {
          id: '1',
          title: '4-7-8呼吸法',
          description: '通过调整呼吸节奏快速放松身心',
          duration: 3,
          category: '呼吸法',
        },
        {
          id: '3',
          title: '五感觉察',
          description: '通过有意识地感受五感来重新连接当下',
          duration: 5,
          category: '感官刺激',
        },
      ]);

      // 模拟收藏的充电方式
      setFavorites([
        {
          id: '4',
          title: '专注手指呼吸',
          description: '通过追踪手指的移动来调整呼吸，帮助集中注意力',
          duration: 3,
          category: '微冥想',
        },
      ]);

      // 模拟总充电时长
      setTotalDuration(43);
      setLoading(false);
    }
  }, [status, loading]);

  if (status === 'loading' || loading) {
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
        <h1 className="mb-2 text-3xl font-bold">我的充电</h1>
        <p className="text-muted-foreground">
          查看你的充电记录和收藏
        </p>
      </div>

      {/* 用户统计 */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>充电统计</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-lg bg-muted p-4 text-center">
              <div className="text-3xl font-bold">{totalDuration}</div>
              <div className="text-sm text-muted-foreground">累计充电分钟</div>
            </div>
            <div className="rounded-lg bg-muted p-4 text-center">
              <div className="text-3xl font-bold">{recentlyUsed.length}</div>
              <div className="text-sm text-muted-foreground">最近使用方式</div>
            </div>
            <div className="rounded-lg bg-muted p-4 text-center">
              <div className="text-3xl font-bold">{favorites.length}</div>
              <div className="text-sm text-muted-foreground">已收藏方式</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 最近使用的充电方式 */}
      <h2 className="mb-4 text-xl font-medium">最近使用</h2>
      {recentlyUsed.length === 0 ? (
        <p className="mb-8 text-center text-muted-foreground">
          还没有使用过任何充电方式
        </p>
      ) : (
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recentlyUsed.map((method) => (
            <Card key={method.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{method.title}</CardTitle>
              </CardHeader>
              <CardContent className="pb-6">
                <p className="mb-2 text-muted-foreground">{method.description}</p>
                <div className="flex items-center text-sm">
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
              <div className="border-t p-4">
                <Button
                  className="w-full"
                  onClick={() => router.push(`/recharge/${method.id}`)}
                >
                  再次充电
                </Button>
              </div>
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
            添加自定义充电方式
          </Button>
        </Link>
      </div>
    </div>
  );
} 