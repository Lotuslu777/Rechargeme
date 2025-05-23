'use client';

import { useAtom } from 'jotai';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { recommendedMethodsAtom, userMoodAtom, activeRechargeAtom, RechargeMethod } from '@/lib/store';

export default function RecommendedMethods() {
  const router = useRouter();
  const [userMood] = useAtom(userMoodAtom);
  const [recommendedMethods] = useAtom(recommendedMethodsAtom);
  const [, setActiveRecharge] = useAtom(activeRechargeAtom);

  if (!userMood || recommendedMethods.length === 0) {
    return null;
  }

  const handleStartRecharge = (method: RechargeMethod) => {
    setActiveRecharge(method);
    router.push(`/recharge/${method.id}`);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-medium">为你推荐的充电方式</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {recommendedMethods.map((method) => (
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
              <div className="flex w-full items-center justify-between">
                <Button
                  onClick={() => handleStartRecharge(method)}
                  className="w-full"
                >
                  开始充电
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
      <div className="flex justify-center pt-4">
        <Link href="/explore" className="text-center text-sm text-muted-foreground hover:text-primary">
          查看更多充电方式 →
        </Link>
      </div>
    </div>
  );
} 