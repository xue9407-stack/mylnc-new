export interface RoleMedia {
  avatarUrl: string;
  portraitUrl: string;
}

export const ROLE_MEDIA_MAP: Record<string, RoleMedia> = {
  lujingchen: {
    avatarUrl: '/avatars/lujingchen.jpg',
    portraitUrl: '/avatars/lujingchen.jpg',
  },
  linmubai: {
    avatarUrl: '/avatars/linmubai.jpg',
    portraitUrl: '/avatars/linmubai.jpg',
  },
  gubeichen: {
    avatarUrl: '/avatars/gubeichen.jpg',
    portraitUrl: '/avatars/gubeichen.jpg',
  },
  guyebai: {
    avatarUrl: '/avatars/guyebai.jpg',
    portraitUrl: '/avatars/guyebai.jpg',
  },
  guyanchuan: {
    avatarUrl: '/avatars/guyanchuan.jpg',
    portraitUrl: '/avatars/guyanchuan.jpg',
  },
  linxiaorou: {
    avatarUrl: '/avatars/linxiaorou.jpg',
    portraitUrl: '/avatars/linxiaorou.jpg',
  },
  linxiaoman: {
    avatarUrl: '/avatars/linxiaoman.jpg',
    portraitUrl: '/avatars/linxiaoman.jpg',
  },
  shenqinghuan: {
    avatarUrl: '/avatars/shenqinghuan.jpg',
    portraitUrl: '/avatars/shenqinghuan.jpg',
  },
  tangtang: {
    avatarUrl: '/avatars/tangtang.jpg',
    portraitUrl: '/avatars/tangtang.jpg',
  },
  linzhixia: {
    avatarUrl: '/avatars/linzhixia.jpg',
    portraitUrl: '/avatars/linzhixia.jpg',
  },
  guwanqing: {
    avatarUrl: '/avatars/guwanqing.jpg',
    portraitUrl: '/avatars/guwanqing.jpg',
  },
};

// Preset virtual images for custom role creation
export const CREATOR_AVATAR_PRESETS = [
  {
    name: '冷峻霸总',
    avatarUrl: '/avatars/lujingchen.jpg',
    portraitUrl: '/avatars/lujingchen.jpg',
  },
  {
    name: '病娇女友',
    avatarUrl: '/avatars/linxiaorou.jpg',
    portraitUrl: '/avatars/linxiaorou.jpg',
  },
  {
    name: '温柔学长',
    avatarUrl: '/avatars/linmubai.jpg',
    portraitUrl: '/avatars/linmubai.jpg',
  },
  {
    name: '高冷御姐',
    avatarUrl: '/avatars/shenqinghuan.jpg',
    portraitUrl: '/avatars/shenqinghuan.jpg',
  },
  {
    name: '阳光邻家',
    avatarUrl: '/avatars/gubeichen.jpg',
    portraitUrl: '/avatars/gubeichen.jpg',
  },
  {
    name: '呆萌萝莉',
    avatarUrl: '/avatars/tangtang.jpg',
    portraitUrl: '/avatars/tangtang.jpg',
  },
  {
    name: '傲娇千金',
    avatarUrl: '/avatars/guwanqing.jpg',
    portraitUrl: '/avatars/guwanqing.jpg',
  },
  {
    name: '知性学姐',
    avatarUrl: '/avatars/linzhixia.jpg',
    portraitUrl: '/avatars/linzhixia.jpg',
  },
];
