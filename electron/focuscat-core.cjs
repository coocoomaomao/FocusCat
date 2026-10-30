const REWARDS = [
  {id:'paper_ball',name:'纸团',emoji:'⚪',rarity:'common',weight:28,desc:'墨团从桌角扒拉回来的纸团。'},
  {id:'bottle_cap',name:'瓶盖',emoji:'🔘',rarity:'common',weight:24,desc:'会在地板上滚很远的瓶盖。'},
  {id:'leaf',name:'银杏叶',emoji:'🍂',rarity:'common',weight:20,desc:'从窗边叼回来的秋天。'},
  {id:'fish',name:'小鱼干',emoji:'🐟',rarity:'rare',weight:12,desc:'墨团最舍不得分给你的零食。'},
  {id:'feather',name:'蓝羽毛',emoji:'🪶',rarity:'rare',weight:8,desc:'不知道从哪里找到的漂亮羽毛。'},
  {id:'star',name:'星星玻璃珠',emoji:'🔮',rarity:'rare',weight:5,desc:'在光里会闪一下的小珠子。'},
  {id:'gold_fish',name:'金墨鱼',emoji:'🌟',rarity:'ssr',weight:2,desc:'传说中的墨境城幸运物。'},
  {id:'moon',name:'月亮徽章',emoji:'🌙',rarity:'ssr',weight:1,desc:'只有很专注的人才能看到。'}
];

function weightedReward(random=Math.random){
  const total=REWARDS.reduce((s,x)=>s+x.weight,0);
  let n=random()*total;
  for(const item of REWARDS){n-=item.weight;if(n<0)return {...item}}
  return {...REWARDS[0]};
}

function formatTime(totalSeconds){
  const s=Math.max(0,Math.floor(Number(totalSeconds)||0));
  const m=Math.floor(s/60),sec=s%60;
  return `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
}

function normalizeState(raw={}){
  const inv=raw.inventory&&typeof raw.inventory==='object'?raw.inventory:{};
  return {
    sessions:Math.max(0,Number(raw.sessions)||0),
    totalMinutes:Math.max(0,Number(raw.totalMinutes)||0),
    todayMinutes:Math.max(0,Number(raw.todayMinutes)||0),
    todaySessions:Math.max(0,Number(raw.todaySessions)||0),
    streak:Math.max(0,Number(raw.streak)||0),
    coins:Math.max(0,Number(raw.coins)||0),
    inventory:Object.fromEntries(Object.entries(inv).map(([k,v])=>[k,Math.max(0,Number(v)||0)])),
    lastDate:String(raw.lastDate||'')
  };
}

function dateKey(d=new Date()){
  const y=d.getFullYear(),m=String(d.getMonth()+1).padStart(2,'0'),day=String(d.getDate()).padStart(2,'0');
  return `${y}-${m}-${day}`;
}

function dayBefore(key){
  if(!/^\d{4}-\d{2}-\d{2}$/.test(key))return '';
  const [y,m,d]=key.split('-').map(Number);const x=new Date(y,m-1,d);x.setDate(x.getDate()-1);return dateKey(x);
}

function applyCompletedSession(raw,minutes,reward,today=dateKey()){
  const state=normalizeState(raw);const mins=Math.max(1,Math.round(Number(minutes)||25));
  if(state.lastDate!==today){
    const continued=state.lastDate===dayBefore(today);
    state.todayMinutes=0;state.todaySessions=0;state.streak=continued?state.streak+1:1;state.lastDate=today;
  } else if(state.streak===0){state.streak=1}
  state.sessions+=1;state.totalMinutes+=mins;state.todayMinutes+=mins;state.todaySessions+=1;
  state.coins+=Math.max(5,Math.round(mins/5));
  if(reward?.id)state.inventory[reward.id]=(state.inventory[reward.id]||0)+1;
  return state;
}

function rarityLabel(r){return r==='ssr'?'SSR':r==='rare'?'稀有':'普通'}
module.exports={REWARDS,weightedReward,formatTime,normalizeState,dateKey,dayBefore,applyCompletedSession,rarityLabel};
