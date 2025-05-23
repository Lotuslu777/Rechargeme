import { atom } from 'jotai';

// 用户状态相关原子
export type UserMoodType = '专注力' | '情绪' | '充电';

// 首页用户选择的当前状态
export const userMoodAtom = atom<UserMoodType | null>(null);

// 推荐休息方式列表
export type RechargeMethod = {
  id: string;
  title: string;
  description: string;
  duration: number;
  category: string;
  imageUrl?: string;
  steps?: string[];
};

export const recommendedMethodsAtom = atom<RechargeMethod[]>([]);

// 当前正在进行的休息方式
export const activeRechargeAtom = atom<RechargeMethod | null>(null);

// 休息计时器相关
export const timerRunningAtom = atom<boolean>(false);
export const timerRemainingAtom = atom<number>(0); 