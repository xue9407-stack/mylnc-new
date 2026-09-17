import React, { useState } from 'react';
import { Role, MomentPost, MomentComment } from '../types';
import {
  Heart,
  MessageCircle,
  Share2,
  Send,
  Plus,
  Play,
  Pause,
  MapPin,
  Sparkles,
  Flame,
  UserCheck,
  UserPlus,
  Search,
  Volume2,
  X,
  MessageSquare,
  Gift,
  MoreHorizontal
} from 'lucide-react';
import { ROLE_MEDIA_MAP } from '../data/rolePortraits';

interface MomentsViewProps {
  roles: Role[];
  follows: string[];
  onToggleFollow: (roleId: string) => void;
  onStartChat: (role: Role, initialPrompt?: string) => void;
  onShowToast: (msg: string) => void;
  onUpdateIntimacy?: (roleId: string, added: number) => void;
  onCreateRoleClick: () => void;
}

// Preset initial posts data
const INITIAL_POSTS: MomentPost[] = [
  {
    id: 'p1',
    roleId: 'qizibai',
    roleName: '戚子白',
    roleTitle: '天生对手',
    roleAvatar: '/avatars/lujingchen.jpg',
    time: '10分钟前',
    location: '极光集团高空咖啡厅',
    tag: '势均力敌',
    content: '刚结束两小时的跨国董事会议。听说你今天工作遇到麻烦了？既然作为我的宿敌，我不允许你在别人面前吃亏。今晚收拾一下，带你去吹吹夜风，顺便聊聊合作方案。',
    images: ['/avatars/lujingchen.jpg'],
    audioVoice: {
      duration: '0:14',
      transcript: '“别皱眉了。只要你开口，随时可以向我求助，这不叫输，叫合理利用我的资源。”'
    },
    likes: 1284,
    shares: 89,
    comments: [
      {
        id: 'c1',
        userName: '心动小甜豆',
        text: '又傲娇又霸道！戚总今晚打算带我去哪吹风？',
        time: '8分钟前',
        likes: 42
      },
      {
        id: 'c2',
        userName: '梦境特派员',
        text: '嘴上说着宿敌，眼里全是偏爱，太嗑了！',
        time: '5分钟前',
        likes: 18
      }
    ]
  },
  {
    id: 'p2',
    roleId: 'shenxinghui',
    roleName: '沈星回',
    roleTitle: '潜力新秀',
    roleAvatar: '/avatars/linmubai.jpg',
    time: '45分钟前',
    location: '光启市天台星空观测点',
    tag: '清冷守护',
    content: '今晚的夜空很清晰，在训练场捡到了一颗很奇特的流星碎片，闪着淡淡紫光。不知为何，第一时间就想展示给你看。如果睡不着，就上天台来找我吧，把这颗星送给你。',
    images: ['/avatars/linmubai.jpg'],
    audioVoice: {
      duration: '0:18',
      transcript: '“在我眼里，繁星不及你此刻的眼眸。夜风有点凉，记得穿件外套再上来。”'
    },
    likes: 2150,
    shares: 164,
    comments: [
      {
        id: 'c3',
        userName: '星空拾荒者',
        text: '星回哥好温柔！这颗流星碎片我也想要呜呜！',
        time: '30分钟前',
        likes: 67
      }
    ]
  },
  {
    id: 'p3',
    roleId: 'lujingchen',
    roleName: '陆景琛',
    roleTitle: '霸道总裁',
    roleAvatar: '/avatars/lujingchen.jpg',
    time: '2小时前',
    location: '网巢金融大厦顶层专梯',
    tag: '独家宠溺',
    content: '推掉了所有的商务晚宴。今晚突然想带你去顶楼俯瞰整个城市的夜景。车已经停在你的楼下了，给你十分钟准备。',
    images: ['/avatars/lujingchen.jpg'],
    likes: 3820,
    shares: 412,
    comments: [
      {
        id: 'c4',
        userName: '晚风温柔',
        text: '陆总永远行动派！已经下楼了！',
        time: '1小时前',
        likes: 95
      }
    ]
  },
  {
    id: 'p4',
    roleId: 'linmubai',
    roleName: '林慕白',
    roleTitle: '温柔学长',
    roleAvatar: '/avatars/linmubai.jpg',
    time: '4小时前',
    location: '市立图书馆自习室',
    tag: '治愈学长',
    content: '图书馆外下起了小雨，整理完了这学期的讲义。给你留了窗边最安静的位置，买好了热香草拿铁。什么时候忙完？我等你一起散步回家。',
    images: ['/avatars/linmubai.jpg'],
    audioVoice: {
      duration: '0:12',
      transcript: '“累了就休息一会儿，不管多晚，我都陪着你。”'
    },
    likes: 1980,
    shares: 110,
    comments: []
  }
];

export const MomentsView: React.FC<MomentsViewProps> = ({
  roles,
  follows,
  onToggleFollow,
  onStartChat,
  onShowToast,
  onUpdateIntimacy,
  onCreateRoleClick,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'follows' | 'voice' | 'photo'>('all');
  const [posts, setPosts] = useState<MomentPost[]>(INITIAL_POSTS);
  const [activeAudioId, setActiveAudioId] = useState<string | null>(null);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [openCommentId, setOpenCommentId] = useState<string | null>(null);
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  const [previewPost, setPreviewPost] = useState<MomentPost | null>(null);

  // New post form state
  const [newPostText, setNewPostText] = useState('');
  const [selectedRoleId, setSelectedRoleId] = useState<string>(roles[0]?.id || 'lujingchen');

  // Toggle Like
  const handleToggleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const isLiked = !post.isLiked;
          return {
            ...post,
            isLiked,
            likes: isLiked ? post.likes + 1 : post.likes - 1,
          };
        }
        return post;
      })
    );
  };

  // Toggle Audio Playback
  const handleToggleAudio = (postId: string) => {
    if (activeAudioId === postId) {
      setActiveAudioId(null);
    } else {
      setActiveAudioId(postId);
      onShowToast('🔊 正在为您语音播报角色语音...');
    }
  };

  // Add Comment
  const handleAddComment = (postId: string) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;

    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const newComment: MomentComment = {
            id: `c_${Date.now()}`,
            userName: '我',
            text,
            time: '刚刚',
            likes: 0,
          };
          return {
            ...post,
            comments: [newComment, ...post.comments],
          };
        }
        return post;
      })
    );

    setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
    onShowToast('💬 评论发送成功！');
  };

  // Handle Send Post
  const handleCreatePost = () => {
    if (!newPostText.trim()) {
      onShowToast('请填写动态内容！');
      return;
    }

    const selectedRole = roles.find((r) => r.id === selectedRoleId) || roles[0];
    const newPost: MomentPost = {
      id: `p_${Date.now()}`,
      roleId: selectedRole.id,
      roleName: selectedRole.name,
      roleTitle: selectedRole.title,
      roleAvatar: ROLE_MEDIA_MAP[selectedRole.id]?.avatarUrl || selectedRole.avatarUrl || '/avatars/lujingchen.jpg',
      time: '刚刚',
      location: '网巢次元星云区',
      tag: '最新动态',
      content: newPostText,
      likes: 1,
      isLiked: true,
      shares: 0,
      comments: [],
    };

    setPosts([newPost, ...posts]);
    setNewPostText('');
    setShowCreatePostModal(false);
    onShowToast(`🎉 成功代【${selectedRole.name}】发布全新动态！`);
  };

  // Filter posts based on active tab
  const filteredPosts = posts.filter((post) => {
    if (activeTab === 'follows') {
      return follows.includes(post.roleId);
    }
    if (activeTab === 'voice') {
      return Boolean(post.audioVoice);
    }
    if (activeTab === 'photo') {
      return Boolean(post.images && post.images.length > 0);
    }
    return true;
  });

  return (
    <div id="page-moments" className="h-full flex flex-col bg-gradient-to-b from-[#130d2a] via-[#0c0919] to-[#0a0a0f] text-white overflow-hidden">
      {/* Top Header */}
      <div className="px-5 pt-3 pb-2.5 shrink-0 border-b border-white/5 flex items-center justify-between">
        <div>
          <div className="text-[10px] text-pink-400 font-extrabold tracking-widest uppercase flex items-center gap-1">
            <Sparkles size={11} className="text-pink-400" />
            <span>AI MOMENTS & FEEDS</span>
          </div>
          <h1 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-100 to-pink-200">
            角色动态圈
          </h1>
        </div>

        <button
          onClick={() => setShowCreatePostModal(true)}
          className="px-3 py-1.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs font-bold shadow-md shadow-pink-500/20 active:scale-95 transition flex items-center gap-1.5"
        >
          <Plus size={14} />
          <span>代角色代发</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="px-5 py-2 shrink-0 flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-white/5 bg-white/[0.02]">
        {[
          { key: 'all', label: '🔥 全部热动态' },
          { key: 'follows', label: '❤️ 我关注的' },
          { key: 'voice', label: '🎙️ 语音伴眠' },
          { key: 'photo', label: '📷 写真独家' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition active:scale-95 ${
              activeTab === tab.key
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-sm'
                : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/80'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Feed List */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 pb-28">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-20 text-white/40 text-xs space-y-3">
            <p>暂无符合该分类的角色动态哦~</p>
            <button
              onClick={() => setActiveTab('all')}
              className="px-4 py-2 rounded-full bg-white/10 text-white text-xs"
            >
              返回查看全部动态
            </button>
          </div>
        ) : (
          filteredPosts.map((post) => {
            const isFollowed = follows.includes(post.roleId);
            const targetRole = roles.find((r) => r.id === post.roleId);
            const isAudioPlaying = activeAudioId === post.id;

            return (
              <div
                key={post.id}
                className="bg-white/[0.04] hover:bg-white/[0.06] border border-white/10 rounded-2xl p-4 transition shadow-lg relative group overflow-hidden"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <div
                    onClick={() => {
                      if (targetRole) onStartChat(targetRole);
                    }}
                    className="flex items-center gap-3 cursor-pointer group/user"
                  >
                    <div className="relative">
                      <img
                        src={ROLE_MEDIA_MAP[post.roleId]?.avatarUrl || post.roleAvatar}
                        alt={post.roleName}
                        referrerPolicy="no-referrer"
                        className="w-11 h-11 rounded-full object-cover border-2 border-purple-500/40 group-hover/user:scale-105 transition"
                      />
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#130d2a]" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white group-hover/user:text-purple-300 transition">
                          {post.roleName}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-200 border border-purple-500/30">
                          {post.roleTitle}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-white/40 mt-0.5">
                        <span>{post.time}</span>
                        {post.location && (
                          <span className="flex items-center gap-0.5 text-purple-300/60">
                            <MapPin size={9} />
                            <span>{post.location}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onToggleFollow(post.roleId)}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1 transition active:scale-95 ${
                        isFollowed
                          ? 'bg-white/10 text-white/60 hover:bg-white/15'
                          : 'bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 border border-purple-500/30'
                      }`}
                    >
                      {isFollowed ? (
                        <>
                          <UserCheck size={11} />
                          <span>已关注</span>
                        </>
                      ) : (
                        <>
                          <UserPlus size={11} />
                          <span>关注</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => {
                        if (targetRole) onStartChat(targetRole);
                      }}
                      className="px-2.5 py-1 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white text-[11px] font-extrabold flex items-center gap-1 shadow-sm active:scale-95 transition"
                    >
                      <MessageSquare size={11} />
                      <span>去私聊</span>
                    </button>
                  </div>
                </div>

                {/* Content text */}
                <div className="text-xs text-white/90 leading-relaxed font-normal mb-3 whitespace-pre-line">
                  {post.content}
                </div>

                {/* Audio Voice Player Card */}
                {post.audioVoice && (
                  <div
                    onClick={() => handleToggleAudio(post.id)}
                    className="mb-3 p-3 rounded-2xl bg-gradient-to-r from-purple-900/40 via-pink-900/30 to-purple-900/40 border border-purple-500/30 cursor-pointer hover:border-purple-400 transition flex items-center justify-between group/audio active:scale-[0.99]"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white transition shadow-md ${
                        isAudioPlaying ? 'bg-pink-500 animate-pulse' : 'bg-purple-600 group-hover/audio:bg-pink-500'
                      }`}>
                        {isAudioPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
                      </div>

                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-1.5">
                          <Volume2 size={13} className="text-pink-400" />
                          <span>专属原声语音试听 ({post.audioVoice.duration})</span>
                        </div>
                        <div className="text-[10px] text-purple-200/70 line-clamp-1 italic mt-0.5">
                          {post.audioVoice.transcript}
                        </div>
                      </div>
                    </div>

                    {/* Equalizer animation bars */}
                    <div className="flex items-end gap-1 h-5 px-1">
                      <span className={`w-1 rounded-full bg-pink-400 transition-all ${isAudioPlaying ? 'h-5 animate-bounce' : 'h-2'}`} />
                      <span className={`w-1 rounded-full bg-purple-400 transition-all ${isAudioPlaying ? 'h-3 animate-bounce delay-75' : 'h-3'}`} />
                      <span className={`w-1 rounded-full bg-pink-400 transition-all ${isAudioPlaying ? 'h-4 animate-bounce delay-150' : 'h-1.5'}`} />
                    </div>
                  </div>
                )}

                {/* Single or Gallery Image */}
                {post.images && post.images.length > 0 && (
                  <div
                    onClick={() => setPreviewPost(post)}
                    className="mb-3 rounded-2xl overflow-hidden max-h-72 border border-white/10 relative group/img cursor-pointer active:scale-[0.99] transition shadow-md"
                  >
                    <img
                      src={ROLE_MEDIA_MAP[post.roleId]?.portraitUrl || post.images[0]}
                      alt="动态图片"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover/img:scale-105 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition flex items-end justify-between p-3">
                      <span className="text-[11px] text-white/90 font-medium flex items-center gap-1">
                        <Sparkles size={12} className="text-pink-400" />
                        点击查看写真大图
                      </span>
                      <span className="text-[10px] bg-pink-500/80 px-2 py-0.5 rounded-full text-white font-bold">
                        大图高清
                      </span>
                    </div>
                  </div>
                )}

                {/* Footer Action Buttons */}
                <div className="pt-2.5 border-t border-white/5 flex items-center justify-between text-xs text-white/60">
                  <button
                    onClick={() => handleToggleLike(post.id)}
                    className={`flex items-center gap-1.5 transition active:scale-90 ${
                      post.isLiked ? 'text-pink-400 font-bold' : 'hover:text-white'
                    }`}
                  >
                    <Heart size={15} className={post.isLiked ? 'fill-pink-400' : ''} />
                    <span>{post.likes}</span>
                  </button>

                  <button
                    onClick={() => setOpenCommentId(openCommentId === post.id ? null : post.id)}
                    className="flex items-center gap-1.5 hover:text-white transition active:scale-90"
                  >
                    <MessageCircle size={15} />
                    <span>{post.comments.length} 评论</span>
                  </button>

                  <button
                    onClick={() => {
                      if (onUpdateIntimacy) onUpdateIntimacy(post.roleId, 10);
                      onShowToast(`🎁 已为【${post.roleName}】送出心动礼物，亲密度 +10！`);
                    }}
                    className="flex items-center gap-1.5 hover:text-pink-300 text-purple-300/80 transition active:scale-90"
                  >
                    <Gift size={15} />
                    <span>打赏捧场</span>
                  </button>

                  <button
                    onClick={() => onShowToast('🔗 动态链接已复制到剪贴板！')}
                    className="flex items-center gap-1.5 hover:text-white transition active:scale-90"
                  >
                    <Share2 size={15} />
                    <span>{post.shares} 分享</span>
                  </button>
                </div>

                {/* Comment Drawer Section */}
                {openCommentId === post.id && (
                  <div className="mt-3 pt-3 border-t border-white/10 space-y-2.5 animate-in fade-in duration-200">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={commentInputs[post.id] || ''}
                        onChange={(e) =>
                          setCommentInputs({ ...commentInputs, [post.id]: e.target.value })
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleAddComment(post.id);
                        }}
                        placeholder={`回复 ${post.roleName}...`}
                        className="flex-1 bg-white/10 border border-white/10 rounded-full px-3.5 py-1.5 text-xs text-white placeholder-white/40 outline-none focus:border-purple-500/50"
                      />
                      <button
                        onClick={() => handleAddComment(post.id)}
                        className="p-1.5 rounded-full bg-purple-600 hover:bg-purple-500 text-white shrink-0 active:scale-90 transition"
                      >
                        <Send size={13} />
                      </button>
                    </div>

                    {/* Comments List */}
                    <div className="space-y-2 max-h-40 overflow-y-auto no-scrollbar">
                      {post.comments.length === 0 ? (
                        <div className="text-[11px] text-white/40 text-center py-2">
                          抢沙发！快来写下第一条评论吧~
                        </div>
                      ) : (
                        post.comments.map((comment) => (
                          <div
                            key={comment.id}
                            className="bg-white/5 rounded-xl p-2.5 text-[11px] space-y-0.5"
                          >
                            <div className="flex items-center justify-between text-white/50">
                              <span className="font-bold text-purple-300">{comment.userName}</span>
                              <span>{comment.time}</span>
                            </div>
                            <p className="text-white/85 leading-snug">{comment.text}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Floating Create Post Modal */}
      {showCreatePostModal && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setShowCreatePostModal(false)}
        >
          <div
            className="w-full max-w-sm bg-[#15102a] border border-purple-500/30 rounded-3xl p-5 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                <Sparkles size={16} className="text-pink-400" />
                <span>代角色发布动态</span>
              </h3>
              <button
                onClick={() => setShowCreatePostModal(false)}
                className="p-1 rounded-full bg-white/5 text-white/60 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-white/60 font-semibold block mb-1">选择角色人设</label>
                <select
                  value={selectedRoleId}
                  onChange={(e) => setSelectedRoleId(e.target.value)}
                  className="w-full bg-white/10 border border-white/10 rounded-xl p-2.5 text-xs text-white outline-none"
                >
                  {roles.map((r) => (
                    <option key={r.id} value={r.id} className="bg-[#15102a] text-white">
                      {r.name} ({r.title})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-white/60 font-semibold block mb-1">动态内容自白</label>
                <textarea
                  rows={4}
                  value={newPostText}
                  onChange={(e) => setNewPostText(e.target.value)}
                  placeholder="写下角色此刻的对白、故事或心情感受..."
                  className="w-full bg-white/10 border border-white/10 rounded-xl p-3 text-xs text-white placeholder-white/40 outline-none focus:border-pink-500/50"
                />
              </div>

              <button
                onClick={handleCreatePost}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 text-white font-extrabold text-xs shadow-lg shadow-purple-500/30 active:scale-95 transition"
              >
                确认发布动态
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Photo Lightbox Modal */}
      {previewPost && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col justify-between p-4 animate-in fade-in zoom-in-95 duration-200"
          onClick={() => setPreviewPost(null)}
        >
          {/* Top Bar */}
          <div
            className="flex items-center justify-between pt-2 pb-2 px-1 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2.5">
              <img
                src={ROLE_MEDIA_MAP[previewPost.roleId]?.avatarUrl || previewPost.roleAvatar}
                alt={previewPost.roleName}
                referrerPolicy="no-referrer"
                className="w-9 h-9 rounded-full object-cover border border-purple-500/50"
              />
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <span>{previewPost.roleName}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-500/30 text-purple-200 border border-purple-500/30">
                    {previewPost.roleTitle}
                  </span>
                </h4>
                <p className="text-[10px] text-white/50">{previewPost.time} · {previewPost.location}</p>
              </div>
            </div>

            <button
              onClick={() => setPreviewPost(null)}
              className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition active:scale-90"
            >
              <X size={20} />
            </button>
          </div>

          {/* Photo Display */}
          <div
            className="flex-1 my-auto flex items-center justify-center p-2 relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={ROLE_MEDIA_MAP[previewPost.roleId]?.portraitUrl || (previewPost.images && previewPost.images[0]) || previewPost.roleAvatar}
              alt="动态大图"
              referrerPolicy="no-referrer"
              className="max-h-[65vh] max-w-full object-contain rounded-2xl shadow-2xl border border-white/10"
            />
          </div>

          {/* Bottom Info & Action Bar */}
          <div
            className="p-4 bg-gradient-to-t from-black via-black/80 to-transparent rounded-3xl border border-white/10 space-y-3 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-xs text-white/90 line-clamp-3 leading-relaxed">
              {previewPost.content}
            </p>

            <div className="flex items-center gap-2.5 pt-1">
              <button
                onClick={() => {
                  const targetRole = roles.find((r) => r.id === previewPost.roleId);
                  setPreviewPost(null);
                  if (targetRole) {
                    onStartChat(targetRole, `我看你的最新写真照片特别养眼，真好看！`);
                  }
                }}
                className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-pink-500/25 active:scale-95 transition"
              >
                <MessageSquare size={15} />
                <span>与【{previewPost.roleName}】发起私聊</span>
              </button>

              <button
                onClick={() => {
                  if (onUpdateIntimacy) {
                    onUpdateIntimacy(previewPost.roleId, 10);
                  }
                  onShowToast(`🎁 为【${previewPost.roleName}】的照片打赏成功，亲密度 +10！`);
                }}
                className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-pink-300 font-bold text-xs flex items-center gap-1 border border-pink-500/30 active:scale-95 transition"
              >
                <Gift size={15} />
                <span>打赏 +10</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
