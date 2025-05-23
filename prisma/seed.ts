import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 清除现有数据
  await prisma.usageHistory.deleteMany({});
  await prisma.favorite.deleteMany({});
  await prisma.recharge.deleteMany({});
  await prisma.user.deleteMany({});

  // 创建示例用户
  const user = await prisma.user.create({
    data: {
      name: '示例用户',
      email: 'example@rechargeme.app',
    },
  });

  // 创建示例休息方式
  const rechargeMethods = [
    {
      title: '4-7-8呼吸法',
      description: '通过调整呼吸节奏快速放松身心，适合焦虑或压力大的时刻',
      duration: 3,
      steps: [
        '找一个舒适的姿势坐下',
        '闭上眼睛，舌尖轻触上颚',
        '用鼻子吸气4秒',
        '屏住呼吸7秒',
        '用嘴呼气8秒发出"嘘"的声音',
        '重复4次循环'
      ],
      category: '呼吸法',
      tags: ['压力缓解', '睡前', '快速放松'],
      isPublic: true,
      creatorId: user.id
    },
    {
      title: '渐进式肌肉放松',
      description: '通过有意识地绷紧和放松不同肌肉群来缓解身体紧张',
      duration: 10,
      steps: [
        '找一个安静舒适的环境坐下或躺下',
        '从脚部开始，绷紧脚趾5秒，然后完全放松',
        '继续向上移动到小腿、大腿',
        '依次绷紧和放松腹部、胸部、手臂、肩膀和面部肌肉',
        '每个部位重复"绷紧-放松"的过程'
      ],
      category: '身体放松',
      tags: ['减轻疲劳', '睡前', '全身放松'],
      isPublic: true,
      creatorId: user.id
    },
    {
      title: '五感觉察',
      description: '通过有意识地感受五感来重新连接当下，适合走神或焦虑时使用',
      duration: 5,
      steps: [
        '找一个舒适的位置坐下',
        '列出你现在能看到的5样东西',
        '列出你现在能听到的4种声音',
        '列出你现在能触摸到的3种质感',
        '列出你现在能闻到的2种气味',
        '列出你现在能尝到的1种味道'
      ],
      category: '感官刺激',
      tags: ['专注力提升', '焦虑缓解', '冥想入门'],
      isPublic: true,
      creatorId: user.id
    },
    {
      title: '专注手指呼吸',
      description: '通过追踪手指的移动来调整呼吸，帮助集中注意力',
      duration: 3,
      steps: [
        '伸出左手，掌心朝向自己',
        '用右手食指沿左手拇指向上滑动时吸气',
        '沿拇指向下滑动时呼气',
        '继续在每个手指上重复这个过程',
        '完成五指循环后换手重复'
      ],
      category: '微冥想',
      tags: ['会议前', '快速充电', '专注力恢复'],
      isPublic: true,
      creatorId: user.id
    },
    {
      title: '快速思维转换',
      description: '通过简单的脑力游戏快速切换思维模式，适合工作疲劳时',
      duration: 2,
      steps: [
        '在纸上写下一个常见词语',
        '用这个词的最后一个字母开始写一个新词',
        '继续用新词的最后一个字母创建下一个词',
        '尝试在2分钟内创建尽可能多的词'
      ],
      category: '轻娱乐',
      tags: ['创意激发', '思维转换', '工作间歇'],
      isPublic: true,
      creatorId: user.id
    },
  ];

  for (const method of rechargeMethods) {
    await prisma.recharge.create({
      data: method,
    });
  }

  console.log('数据库种子数据已创建');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 