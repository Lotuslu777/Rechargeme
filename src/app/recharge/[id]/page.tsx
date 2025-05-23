'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAtom } from 'jotai';
import { activeRechargeAtom, timerRunningAtom, timerRemainingAtom } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import RechargeComplete from '@/components/recharge/RechargeComplete';

export default function RechargePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [activeRecharge, setActiveRecharge] = useAtom(activeRechargeAtom);
  const [timerRunning, setTimerRunning] = useAtom(timerRunningAtom);
  const [timerRemaining, setTimerRemaining] = useAtom(timerRemainingAtom);
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [rechargeComplete, setRechargeComplete] = useState(false);

  // 获取充电方式详情
  useEffect(() => {
    async function fetchRechargeDetails() {
      try {
        // 如果已经有活跃的充电方式，直接使用
        if (activeRecharge && activeRecharge.id === params.id) {
          setLoading(false);
          return;
        }

        // 否则从API获取详情
        const response = await fetch(`/api/recharge/${params.id}`);
        if (!response.ok) throw new Error('Failed to fetch recharge details');
        
        const data = await response.json();
        setActiveRecharge(data);
        setTimerRemaining(data.duration * 60); // 转换为秒
      } catch (error) {
        console.error('Error fetching recharge details:', error);
        toast.error('获取充电方式详情失败');
        router.push('/');
      } finally {
        setLoading(false);
      }
    }

    fetchRechargeDetails();
  }, [params.id, activeRecharge, setActiveRecharge, setTimerRemaining, router]);

  // 计时器逻辑
  useEffect(() => {
    if (!timerRunning || timerRemaining <= 0) return;

    const interval = setInterval(() => {
      setTimerRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setTimerRunning(false);
          setRechargeComplete(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timerRunning, timerRemaining, setTimerRemaining, setTimerRunning]);

  // 处理开始和暂停
  const toggleTimer = () => {
    setTimerRunning(!timerRunning);
  };

  // 重置计时器
  const resetTimer = () => {
    if (!activeRecharge) return;
    setTimerRunning(false);
    setTimerRemaining(activeRecharge.duration * 60);
    setCurrentStep(0);
  };

  // 下一步
  const nextStep = () => {
    if (!activeRecharge?.steps) return;
    if (currentStep < activeRecharge.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  // 上一步
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

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

  if (rechargeComplete) {
    return <RechargeComplete rechargeDuration={activeRecharge?.duration || 0} />;
  }

  if (!activeRecharge) {
    return (
      <div className="mt-10 text-center">
        <h1 className="text-2xl font-bold">充电方式不存在</h1>
        <Button className="mt-4" onClick={() => router.push('/')}>
          返回首页
        </Button>
      </div>
    );
  }

  // 格式化时间为 MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="mx-auto max-w-3xl py-8">
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="text-center text-2xl">{activeRecharge.title}</CardTitle>
          <p className="text-center text-muted-foreground">{activeRecharge.description}</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 计时器 */}
          <div className="flex flex-col items-center justify-center">
            <div className="text-5xl font-bold">{formatTime(timerRemaining)}</div>
            <p className="mt-2 text-muted-foreground">
              总时长: {activeRecharge.duration} 分钟
            </p>
          </div>

          {/* 步骤指导 */}
          {activeRecharge.steps && (
            <div className="rounded-lg bg-muted p-6">
              <h3 className="mb-4 text-lg font-medium">
                步骤 {currentStep + 1}/{activeRecharge.steps.length}
              </h3>
              <p className="text-lg">{activeRecharge.steps[currentStep]}</p>

              {/* 步骤导航 */}
              <div className="mt-6 flex justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                >
                  上一步
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={nextStep}
                  disabled={!activeRecharge.steps || currentStep === activeRecharge.steps.length - 1}
                >
                  下一步
                </Button>
              </div>
            </div>
          )}

          {/* 控制按钮 */}
          <div className="flex justify-center gap-4">
            <Button size="lg" onClick={toggleTimer}>
              {timerRunning ? '暂停' : '开始'}
            </Button>
            <Button variant="outline" size="lg" onClick={resetTimer}>
              重置
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="ghost" onClick={() => router.push('/')}>
            取消并返回首页
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
} 