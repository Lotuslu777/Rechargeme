'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

export default function CreateRechargePage() {
  const router = useRouter();
  const { status } = useSession();
  const [loading, setLoading] = useState(false);
  
  // 表单数据
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '',
    category: '',
    steps: [''],
    tags: '',
    isPublic: false,
  });

  // 检查登录状态
  if (status === 'loading') {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p>加载中...</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }

  // 分类选项
  const categories = [
    '呼吸法',
    '身体放松',
    '感官刺激',
    '微冥想',
    '轻娱乐',
  ];

  // 添加步骤
  const addStep = () => {
    setFormData(prev => ({
      ...prev,
      steps: [...prev.steps, '']
    }));
  };

  // 删除步骤
  const removeStep = (index: number) => {
    if (formData.steps.length > 1) {
      setFormData(prev => ({
        ...prev,
        steps: prev.steps.filter((_, i) => i !== index)
      }));
    }
  };

  // 更新步骤内容
  const updateStep = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      steps: prev.steps.map((step, i) => i === index ? value : step)
    }));
  };

  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 验证表单
    if (!formData.title || !formData.description || !formData.duration || !formData.category) {
      toast.error('请填写所有必填字段');
      return;
    }

    if (formData.steps.some(step => !step.trim())) {
      toast.error('请填写所有步骤内容');
      return;
    }

    setLoading(true);

    try {
      const requestData = {
        title: formData.title,
        description: formData.description,
        duration: parseInt(formData.duration),
        category: formData.category,
        steps: formData.steps.filter(step => step.trim()),
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        isPublic: formData.isPublic,
      };

      console.log('Submitting data:', requestData);

      const response = await fetch('/api/recharge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const responseData = await response.json();
      console.log('Response:', response.status, responseData);

      if (!response.ok) {
        throw new Error(responseData.error || `HTTP ${response.status}`);
      }

      toast.success('休息方式创建成功！');
      router.push('/explore');
    } catch (error) {
      console.error('Error creating recharge method:', error);
      toast.error(error instanceof Error ? error.message : '创建失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold">添加新的休息方式</h1>
          <p className="text-muted-foreground">
            创建属于你的专属充电方式
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>基本信息</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 名称 */}
              <div className="space-y-2">
                <Label htmlFor="title">名称 *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="例如：深度放松呼吸法"
                  required
                />
              </div>

              {/* 描述 */}
              <div className="space-y-2">
                <Label htmlFor="description">描述 *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="简要描述这个休息方式的作用和适用场景"
                  required
                />
              </div>

              {/* 时长和分类 */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="duration">时长（分钟）*</Label>
                  <Input
                    id="duration"
                    type="number"
                    min="1"
                    max="60"
                    value={formData.duration}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                    placeholder="5"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">分类 *</Label>
                  <Select onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择分类" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* 步骤 */}
              <div className="space-y-2">
                <Label>操作步骤 *</Label>
                {formData.steps.map((step, index) => (
                  <div key={index} className="flex gap-2">
                    <div className="flex-1">
                      <Textarea
                        value={step}
                        onChange={(e) => updateStep(index, e.target.value)}
                        placeholder={`步骤 ${index + 1}`}
                        rows={2}
                      />
                    </div>
                    {formData.steps.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeStep(index)}
                      >
                        删除
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addStep}
                  className="w-full"
                >
                  + 添加步骤
                </Button>
              </div>

              {/* 标签 */}
              <div className="space-y-2">
                <Label htmlFor="tags">标签（可选）</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                  placeholder="用逗号分隔，例如：睡前,压力缓解,快速放松"
                />
                <p className="text-sm text-muted-foreground">
                  多个标签请用逗号分隔
                </p>
              </div>

              {/* 是否公开 */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={formData.isPublic}
                  onChange={(e) => setFormData(prev => ({ ...prev, isPublic: e.target.checked }))}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="isPublic">
                  公开分享给社区（其他用户可以使用这个休息方式）
                </Label>
              </div>

              {/* 提交按钮 */}
              <div className="flex gap-4 pt-4">
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? '创建中...' : '创建休息方式'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => router.back()}
                  className="flex-1"
                >
                  取消
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 