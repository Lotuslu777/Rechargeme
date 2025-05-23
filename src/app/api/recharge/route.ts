import { NextResponse } from 'next/server';
// import { getServerSession } from 'next-auth';
// import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// 模拟数据存储（实际应用中应该使用数据库）
const mockRecharges = [
  {
    id: '1',
    title: '4-7-8呼吸法',
    description: '通过调整呼吸节奏快速放松身心，适合焦虑或压力大的时刻',
    duration: 3,
    category: '呼吸法',
    imageUrl: null,
    steps: [
      '找一个舒适的姿势坐下',
      '闭上眼睛，舌尖轻触上颚',
      '用鼻子吸气4秒',
      '屏住呼吸7秒',
      '用嘴呼气8秒发出"嘘"的声音',
      '重复4次循环'
    ],
    tags: ['压力缓解', '睡前', '快速放松'],
    isPublic: true,
    creatorId: 'system',
  },
  {
    id: '2',
    title: '渐进式肌肉放松',
    description: '通过有意识地绷紧和放松不同肌肉群来缓解身体紧张',
    duration: 10,
    category: '身体放松',
    imageUrl: null,
    steps: [
      '找一个安静舒适的环境坐下或躺下',
      '从脚部开始，绷紧脚趾5秒，然后完全放松',
      '继续向上移动到小腿、大腿',
      '依次绷紧和放松腹部、胸部、手臂、肩膀和面部肌肉',
      '每个部位重复"绷紧-放松"的过程'
    ],
    tags: ['减轻疲劳', '睡前', '全身放松'],
    isPublic: true,
    creatorId: 'system',
  },
  {
    id: '3',
    title: '五感觉察',
    description: '通过有意识地感受五感来重新连接当下，适合走神或焦虑时使用',
    duration: 5,
    category: '感官刺激',
    imageUrl: null,
    steps: [
      '找一个舒适的位置坐下',
      '列出你现在能看到的5样东西',
      '列出你现在能听到的4种声音',
      '列出你现在能触摸到的3种质感',
      '列出你现在能闻到的2种气味',
      '列出你现在能尝到的1种味道'
    ],
    tags: ['专注力提升', '焦虑缓解', '冥想入门'],
    isPublic: true,
    creatorId: 'system',
  },
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    
    // 筛选数据
    let filteredRecharges = mockRecharges.filter(r => r.isPublic);
    
    if (category) {
      filteredRecharges = filteredRecharges.filter(r => r.category === category);
    }
    
    // 返回简化的数据格式
    const result = filteredRecharges.map(r => ({
      id: r.id,
      title: r.title,
      description: r.description,
      duration: r.duration,
      category: r.category,
      imageUrl: r.imageUrl,
    }));
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching recharge methods:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recharge methods' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    console.log('POST /api/recharge called');
    
    // 暂时跳过认证检查，直接使用默认用户
    // TODO: 修复session认证后恢复
    const mockUser = {
      email: 'demo@rechargeme.com',
      id: 'demo-user'
    };
    
    console.log('Using mock user for demo:', mockUser);

    const body = await request.json();
    console.log('Request body:', body);
    
    const { title, description, duration, category, steps, tags, isPublic } = body;

    // 验证必填字段
    if (!title) {
      console.log('Missing title');
      return NextResponse.json(
        { error: 'Missing title' },
        { status: 400 }
      );
    }
    
    if (!description) {
      console.log('Missing description');
      return NextResponse.json(
        { error: 'Missing description' },
        { status: 400 }
      );
    }
    
    if (!duration) {
      console.log('Missing duration');
      return NextResponse.json(
        { error: 'Missing duration' },
        { status: 400 }
      );
    }
    
    if (!category) {
      console.log('Missing category');
      return NextResponse.json(
        { error: 'Missing category' },
        { status: 400 }
      );
    }
    
    if (!steps || !Array.isArray(steps) || steps.length === 0) {
      console.log('Missing or invalid steps:', steps);
      return NextResponse.json(
        { error: 'Missing or invalid steps' },
        { status: 400 }
      );
    }

    // 创建新的休息方式（模拟数据库插入）
    const newRecharge = {
      id: Date.now().toString(),
      title,
      description,
      duration: parseInt(duration.toString()),
      category,
      steps: Array.isArray(steps) ? steps.filter(step => step && step.trim()) : [],
      tags: Array.isArray(tags) ? tags : (typeof tags === 'string' ? tags.split(',').map(tag => tag.trim()).filter(tag => tag) : []),
      isPublic: Boolean(isPublic),
      creatorId: mockUser.email,
      imageUrl: null,
    };

    console.log('Creating new recharge:', newRecharge);

    // 添加到模拟数据中
    mockRecharges.push(newRecharge);
    
    console.log('Successfully created recharge method');
    console.log('Total recharge methods now:', mockRecharges.length);
    
    return NextResponse.json(newRecharge, { status: 201 });
  } catch (error) {
    console.error('Error creating recharge method:', error);
    return NextResponse.json(
      { error: 'Failed to create recharge method: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
} 