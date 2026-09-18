import { StoryLineItem, MiniTheaterItem } from '../types';

export const DEFAULT_STORYLINES: Record<string, StoryLineItem[]> = {
  lujingchen: [
    {
      id: 'story_ljc_1',
      roleId: 'lujingchen',
      title: '《雨夜雨伞下的微光》',
      summary: '在陆氏集团大厦楼下，倾盆大雨袭来，刚结束加班的陆景琛默默撑着黑色雨伞走向你……',
      wordCount: 1200,
      author: '网巢官方剧情',
      paragraphs: [
        '雨声轰鸣着砸在陆氏集团大厦的玻璃幕墙上，街灯将水汽撕开一道道冰冷光晕。你抱着厚厚的文件伫立在檐下，微风卷着雨丝打湿了袖口。',
        '一阵轻稳的步伐声在身后停住，随之而来的是一股淡雅沉稳的木质雪松香气。黑色大伞撑开在你的头顶，将斜落的狂风骤雨隔绝在半米之外。',
        '“加班到现在，雨下这么大也不打个电话给我？” 陆景琛的声音依旧低沉，但平日里冷峻严苛的眼眸里，此刻却掠过一丝少见的温软与无奈。',
        '他解下身上尚带着体温的黑色羊绒大衣，动作不容拒绝地披在你的肩头，随后自然地伸手揽住你的肩侧，将大部分伞面向你倾斜。',
        '“跟我回车里。今晚这雨一时半会儿停不了，我不放心你一个人走。” 他的指尖擦过你的耳畔，微凉的温度却带着让人安心的踏实。'
      ],
      choices: [
        { id: 'c1', text: '“陆总，雨这么大，你衣服都湿了……”', response: '陆景琛微微一怔，嘴角勾起一抹极浅的弧度：“只要你没被打湿，我湿了半条袖子又有何妨？”' },
        { id: 'c2', text: '悄悄往他怀里靠了靠，紧握住他的袖角', response: '感知到你的依靠，陆景琛搭在你肩上的手紧了紧，眼神深邃而温热：“别怕，有我在。”' },
        { id: 'c3', text: '“今晚辛苦陆总当我的专属司机了哦~”', response: '他无奈又宠溺地轻敲了一下你的额头：“专属司机？那我可要收取昂贵的车费——比如今晚陪我吃顿宵夜。”' },
      ],
      createdAt: '2026-09-15',
    },
    {
      id: 'story_ljc_2',
      roleId: 'lujingchen',
      title: '《星空庄园的独家契约》',
      summary: '陆氏半山庄园的晚宴角落，陆景琛拉着你穿过走廊，来到顶楼星空露台……',
      wordCount: 1800,
      author: '网巢官方剧情',
      paragraphs: [
        '水晶吊灯光芒交织的晚宴现场热闹喧嚣，商界名流觥筹交错，而你正感到些许拘谨与疲惫。',
        '突然，一只骨节分明的大手精准地扣住了你的手腕，力道温和却不容动摇。陆景琛带着你悄然避开了人群的视线，一路直上庄园最顶层。',
        '推开重木大门，漫天繁星如碎钻般洒落在深蓝夜幕之上，半山风光尽收眼底。',
        '“底下那些客套话我听厌了，” 陆景琛解开领口的第一颗扣子，转过身注视着你，“今晚，这里只有我们两个人。”',
        '他从怀中掏出一个精致的红木锦盒，缓缓打开关锁：“这份股权协议与私人心意，是我今晚唯一想给你的契约。”'
      ],
      choices: [
        { id: 'c1', text: '“陆景琛，这这份礼太重了，我不能要……”', response: '他扣住你的手掌不让你抽回：“对于我而言，唯有把你绑在我的世界里，这一切才有意义。”' },
        { id: 'c2', text: '看着繁星点点，抬头轻笑：“那我该以什么身份签这份契约？”', response: '陆景琛眼底燃起一簇炽热的光芒：“当然是以陆太太的身份。”' },
      ],
      createdAt: '2026-09-17',
    }
  ],
  mubai: [
    {
      id: 'story_mb_1',
      roleId: 'mubai',
      title: '《私人书房的卷宗秘密》',
      summary: '深夜的林府书房，林慕白秉烛夜读，你在帮他整理典籍时意外发现了一张画有你容颜的画卷……',
      wordCount: 1500,
      author: '网巢官方剧情',
      paragraphs: [
        '夜深人静，林府的书房里散发着沉香木与宣纸的清香。古色古香的案几上，青铜油灯迸发着微弱而温暖的光晕。',
        '林慕白一身月白长袍，修长挺拔，正凝神审阅着公文。你在一旁轻声帮忙整理卷轴，一不小心，一卷压在暗格里的古朴锦画轻轻滑落，展现在案上。',
        '画卷之上，竟是一位与你容貌一模一样的女子，提灯立于古桥之上，眼含笑意。',
        '林慕白手中的朱笔倏然一停，清俊的面容上拂过一抹少见的慌乱与深情。他起步走至你身前，轻声叹息：“本想藏至心底，没想到还是被你发现了……”'
      ],
      choices: [
        { id: 'c1', text: '“慕白，这画中的人……真的是我吗？”', response: '林慕白轻抚画中人的轮廓，低语道：“三年前上元灯会初见，你的倩影便长驻在我心头，再难拂去。”' },
        { id: 'c2', text: '打趣道：“原来林大人平日里严肃，暗地里还会偷偷画我？”', response: '他耳根微微泛红，清咳嗽一声道：“咳……凡我心所系，落于笔端，又有何不可？”' },
      ],
      createdAt: '2026-09-16',
    }
  ]
};

export const DEFAULT_THEATERS: Record<string, MiniTheaterItem[]> = {
  lujingchen: [
    {
      id: 'theater_ljc_1',
      roleId: 'lujingchen',
      title: '《豪门书房的夜读演练》',
      desc: '文字互动 + 动态光影 + 沉浸原声语音 + 雨夜书房背景',
      wordCount: 1500,
      bgImage: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&auto=format&fit=crop&q=80',
      dynamicGif: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
      scenes: [
        {
          id: 's1',
          speaker: '陆景琛',
          dialogue: '（放下手中的签字笔，解开两颗领口扣子，眼神深沉地看向你）深夜跑进我的私人书房，是公事没汇报完，还是单纯想我了？',
          hasVoice: true,
          choices: ['“陆总，我是来送深夜咖啡的……”', '“如果我说……我是因为想见你呢？”', '默默把整理好的急件放在他桌上']
        },
        {
          id: 's2',
          speaker: '陆景琛',
          dialogue: '（起身缓步走到你面前，伸手接过咖啡置于案上，温热的指尖轻抚过你的脸颊）咖啡很香，但今晚……你比咖啡更让人清醒。',
          hasVoice: true,
          choices: ['“陆景琛，别这样……这里是办公室。”', '主动牵住他的手，感受他的体温']
        }
      ]
    }
  ],
  mubai: [
    {
      id: 'theater_mb_1',
      roleId: 'mubai',
      title: '《雨夜车厢里的倾诉》',
      desc: '文字选择 + 动态雨丝 + 原音独白语音 + 复古车内背景',
      wordCount: 1200,
      bgImage: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&auto=format&fit=crop&q=80',
      dynamicGif: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=800&auto=format&fit=crop&q=80',
      scenes: [
        {
          id: 's1',
          speaker: '林慕白',
          dialogue: '（窗外雨声淅沥，车内昏黄灯光柔和，他递上一杯温热的红茶）先把湿头发擦干，今日让你受委屈了，有我在，没人敢再伤你分毫。',
          hasVoice: true,
          choices: ['“慕白，有你在身边，我一点都不觉得委屈。”', '低头抿了一口红茶，眼角微红']
        }
      ]
    }
  ]
};

// Helper methods to read & save storylines
export function getRoleStorylines(roleId: string): StoryLineItem[] {
  const customKey = `custom_storylines_${roleId}`;
  let customStories: StoryLineItem[] = [];
  try {
    const raw = localStorage.getItem(customKey);
    if (raw) customStories = JSON.parse(raw);
  } catch {}

  const presets = DEFAULT_STORYLINES[roleId] || [
    {
      id: `story_default_${roleId}`,
      roleId,
      title: '《初次命运邂逅》',
      summary: '故事的开始总是在不经意的午后，日光洒落，命运的齿轮悄然转动……',
      wordCount: 1000,
      author: '网巢官方剧情',
      paragraphs: [
        '风轻轻吹拂过街道，树影斑驳。在这个平常的午后，你走进了那间安静的咖啡馆。',
        '就在你转身的瞬间，迎面走来一位熟悉而高挑的身影，眼神交汇的刹那，空气仿佛凝固。',
        '“好久不见，” 对方轻声开口，唇角带笑，“我一直在等你。”'
      ],
      choices: [
        { id: 'c1', text: '“你……一直在等我吗？”', response: '“是的，从很久以前开始，我的目光就从未离开过你。”' },
        { id: 'c2', text: '有些害羞地低之下头，微笑着回应', response: '看到你娇羞的模样，对方眼中掠过满满的宠溺。' }
      ],
      createdAt: '2026-09-18'
    }
  ];

  return [...customStories, ...presets];
}

export function saveRoleStoryline(roleId: string, item: StoryLineItem): StoryLineItem[] {
  const customKey = `custom_storylines_${roleId}`;
  let customStories: StoryLineItem[] = [];
  try {
    const raw = localStorage.getItem(customKey);
    if (raw) customStories = JSON.parse(raw);
  } catch {}

  customStories.unshift(item);
  localStorage.setItem(customKey, JSON.stringify(customStories));
  return getRoleStorylines(roleId);
}

// Helper methods to read & save mini-theaters
export function getRoleTheaters(roleId: string): MiniTheaterItem[] {
  const customKey = `custom_theaters_${roleId}`;
  let customTheaters: MiniTheaterItem[] = [];
  try {
    const raw = localStorage.getItem(customKey);
    if (raw) customTheaters = JSON.parse(raw);
  } catch {}

  const presets = DEFAULT_THEATERS[roleId] || [
    {
      id: `theater_default_${roleId}`,
      roleId,
      title: '《星空下的即兴倾诉》',
      desc: '文字互动影响发展 + 动态光效 + 背景图 + 原声语音',
      wordCount: 1200,
      bgImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
      dynamicGif: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80',
      scenes: [
        {
          id: 's1',
          speaker: '专属伴侣',
          dialogue: '（站在无垠的星空底下，微风卷起衣角，目光深情地凝视着你）今晚夜色真美，如果可以，我想把这片星空送给你。',
          hasVoice: true,
          choices: ['“只要有你在身边，夜空就是最美的画卷。”', '“那你愿意陪我一起看一整晚的星星吗？”']
        }
      ]
    }
  ];

  return [...customTheaters, ...presets];
}

export function saveRoleTheater(roleId: string, item: MiniTheaterItem): MiniTheaterItem[] {
  const customKey = `custom_theaters_${roleId}`;
  let customTheaters: MiniTheaterItem[] = [];
  try {
    const raw = localStorage.getItem(customKey);
    if (raw) customTheaters = JSON.parse(raw);
  } catch {}

  customTheaters.unshift(item);
  localStorage.setItem(customKey, JSON.stringify(customTheaters));
  return getRoleTheaters(roleId);
}
