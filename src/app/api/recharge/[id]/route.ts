import { NextResponse } from 'next/server';

// 这个应该和主route.ts中的模拟数据保持一致
// 实际应用中应该使用共享的数据存储
const mockRecharges = [
  {
    id: '1',
    title: '4-7-8呼吸法',
    description: '通过调整呼吸节奏快速放松身心，适合焦虑或压力大的时刻',
    duration: 3,
    category: '呼吸法',
    imageUrl: null,
    audioUrl: null,
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
    audioUrl: null,
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
    audioUrl: null,
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

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const recharge = mockRecharges.find(r => r.id === params.id);

    if (!recharge) {
      return NextResponse.json(
        { error: 'Recharge method not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: recharge.id,
      title: recharge.title,
      description: recharge.description,
      duration: recharge.duration,
      steps: recharge.steps,
      category: recharge.category,
      imageUrl: recharge.imageUrl,
      audioUrl: recharge.audioUrl,
    });
  } catch (error) {
    console.error('Error fetching recharge details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recharge details' },
      { status: 500 }
    );
  }
} 