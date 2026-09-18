import imgLuJingchen from '../assets/images/anime_whitehair_ceo_1789720004085.jpg';
import imgLinMubai from '../assets/images/anime_senpai_linmubai_1789543321721.jpg';
import imgGuBeichen from '../assets/images/anime_boy_gubeichen_1789543336014.jpg';
import imgGuYebai from '../assets/images/anime_yandere_guyebai_1789543346961.jpg';
import imgGuYanchuan from '../assets/images/anime_boss_guyanchuan_1789543357754.jpg';
import imgLinXiaorou from '../assets/images/anime_girl_linxiaorou_1789543369626.jpg';
import imgLinXiaoman from '../assets/images/anime_girl_linxiaoman_1789543386018.jpg';
import imgShenQinghuan from '../assets/images/anime_queen_shenqinghuan_1789543399995.jpg';
import imgTangtang from '../assets/images/anime_loli_tangtang_1789543411584.jpg';
import imgLinZhixia from '../assets/images/anime_senpai_linzhixia_1789543423461.jpg';
import imgGuWanqing from '../assets/images/anime_tsundere_guwanqing_1789543435056.jpg';

export interface RoleMedia {
  avatarUrl: string;
  portraitUrl: string;
}

export const ROLE_MEDIA_MAP: Record<string, RoleMedia> = {
  lujingchen: {
    avatarUrl: imgLuJingchen,
    portraitUrl: imgLuJingchen,
  },
  linmubai: {
    avatarUrl: imgLinMubai,
    portraitUrl: imgLinMubai,
  },
  gubeichen: {
    avatarUrl: imgGuBeichen,
    portraitUrl: imgGuBeichen,
  },
  guyebai: {
    avatarUrl: imgGuYebai,
    portraitUrl: imgGuYebai,
  },
  guyanchuan: {
    avatarUrl: imgGuYanchuan,
    portraitUrl: imgGuYanchuan,
  },
  linxiaorou: {
    avatarUrl: imgLinXiaorou,
    portraitUrl: imgLinXiaorou,
  },
  linxiaoman: {
    avatarUrl: imgLinXiaoman,
    portraitUrl: imgLinXiaoman,
  },
  shenqinghuan: {
    avatarUrl: imgShenQinghuan,
    portraitUrl: imgShenQinghuan,
  },
  tangtang: {
    avatarUrl: imgTangtang,
    portraitUrl: imgTangtang,
  },
  linzhixia: {
    avatarUrl: imgLinZhixia,
    portraitUrl: imgLinZhixia,
  },
  guwanqing: {
    avatarUrl: imgGuWanqing,
    portraitUrl: imgGuWanqing,
  },
};

// Preset virtual images for custom role creation
export const CREATOR_AVATAR_PRESETS = [
  {
    name: '冷峻霸总',
    avatarUrl: imgLuJingchen,
    portraitUrl: imgLuJingchen,
  },
  {
    name: '病娇女友',
    avatarUrl: imgLinXiaorou,
    portraitUrl: imgLinXiaorou,
  },
  {
    name: '温柔学长',
    avatarUrl: imgLinMubai,
    portraitUrl: imgLinMubai,
  },
  {
    name: '高冷御姐',
    avatarUrl: imgShenQinghuan,
    portraitUrl: imgShenQinghuan,
  },
  {
    name: '阳光邻家',
    avatarUrl: imgGuBeichen,
    portraitUrl: imgGuBeichen,
  },
  {
    name: '呆萌萝莉',
    avatarUrl: imgTangtang,
    portraitUrl: imgTangtang,
  },
  {
    name: '傲娇千金',
    avatarUrl: imgGuWanqing,
    portraitUrl: imgGuWanqing,
  },
  {
    name: '知性学姐',
    avatarUrl: imgLinZhixia,
    portraitUrl: imgLinZhixia,
  },
];
