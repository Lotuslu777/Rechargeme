'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('请输入邮箱');
      return;
    }

    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password: 'dummy', // MVP阶段使用简单认证
        redirect: false,
      });

      if (result?.error) {
        toast.error('登录失败');
      } else {
        toast.success('登录成功！');
        router.push('/');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('登录失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center py-8">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-2xl">登录 RechargeMe</CardTitle>
            <p className="text-center text-muted-foreground">
              输入您的邮箱即可登录（MVP版本）
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">邮箱</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                />
              </div>
              
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? '登录中...' : '登录'}
              </Button>
            </form>
            
            <div className="mt-4 text-center text-sm text-muted-foreground">
              <p>这是MVP版本，只需要输入邮箱即可登录</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 