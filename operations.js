(function(){
"use strict";
const {teams,portraits}=window.LeagueData;
const byTeam=Object.fromEntries(teams.map(t=>[t.id,t]));
const portraitIds=new Set(portraits);
const free={
 morris:{name:"蒙特·莫里斯",en:"Monte Morris",pos:"PG",num:23,ovr:77,style:"控球组织",salary:5.5,years:2,report:"替补控卫，擅长保护球权和阵地战组织。"},
 walker:{name:"朗尼·沃克四世",en:"Lonnie Walker IV",pos:"SG",num:8,ovr:79,style:"突破得分",salary:7,years:2,report:"适合替补席得分，能在转换中快速攻击篮筐。"},
 covington:{name:"罗伯特·科温顿",en:"Robert Covington",pos:"SF",num:33,ovr:77,style:"协防 · 三分",salary:4.5,years:1,report:"侧翼轮换球员，可提供协防和无球投射。"},
 wood:{name:"克里斯蒂安·伍德",en:"Christian Wood",pos:"PF",num:35,ovr:80,style:"投射 · 篮板",salary:7.5,years:2,report:"能拉开内线空间，适合作为第二阵容的得分点。"},
 bamba:{name:"穆罕默德·班巴",en:"Mo Bamba",pos:"C",num:11,ovr:76,style:"护框 · 篮板",salary:4,years:1,report:"具备护框体型，可为首发中锋分担轮换时间。"}
};
const coaches={
 dantoni:{name:"迈克·德安东尼",en:"Mike D’Antoni",ovr:86,style:"快节奏进攻",tactic:"roll",salary:5,years:2,report:"鼓励快速推进与早期挡拆，适合有优质后卫和射手的阵容。"},
 stotts:{name:"特里·斯托茨",en:"Terry Stotts",ovr:84,style:"无球跑位",tactic:"kick",salary:4,years:2,report:"用无球掩护和空间设计为后场创造投篮机会。"},
 vogel:{name:"弗兰克·沃格尔",en:"Frank Vogel",ovr:85,style:"护框防守",tactic:"roll",salary:5,years:2,report:"优先保护篮筐和防守篮板，擅长以中锋为防守核心。"}
};
const marketTabs={free:"自由市场",coach:"球队教练",rookie:"新秀",watch:"我的关注"};
const fixtures=[
 {opponent:"dal",offset:0},{opponent:"den",offset:2},{opponent:"bos",offset:4},
 {opponent:"phx",offset:6},{opponent:"okc",offset:8},{opponent:"mia",offset:10}
];
const drills={shooting:"投篮专项",defense:"防守脚步",fitness:"体能训练"};

function fresh(){
 return {day:0,cash:45,reputation:0,energy:6,coach:null,signed:[],watch:[],records:{},training:{},seasonOrigin:null,seasonClub:null,seasonResults:{}};
}
function schedule(state){
 const earlierOpponents=new Set([state.result?.opponent,...Object.values(state.meta.seasonResults).map(result=>result.opponent)]);
 return fixtures.map((fixture,index)=>{
  const day=state.meta.seasonOrigin===null?null:state.meta.seasonOrigin+fixture.offset;
  const result=index===0 ? state.result&&{home:state.result.home,away:state.result.away} : state.meta.seasonResults[index];
  const club=result?(state.meta.seasonClub??state.team.logo):state.team.logo;
  const replacement=result?"lac":teams.find(t=>t.id!==club&&!earlierOpponents.has(t.id)&&!fixtures.some(game=>game.opponent===t.id)).id;
  const scheduled=fixture.opponent===club?replacement:fixture.opponent;
  const opponent=index===0&&result ? state.result.opponent??fixture.opponent : result?.opponent??scheduled;
  return {...fixture,opponent,index,day,result,team:byTeam[opponent]};
 });
}
function ownRecord(state){
 const played=schedule(state).filter(game=>game.result);
 const wins=played.filter(game=>game.result.home>game.result.away).length;
 return [wins,played.length-wins];
}
function simulateDueGames(state,starterStrength,attackBonus,defenseBonus){
 if(state.meta.seasonOrigin===null)return;
 for(const fixture of schedule(state)){
  if(fixture.index===0||fixture.result||fixture.day>state.meta.day)continue;
  const swing=Math.floor(Math.random()*23)-11;
  const home=Math.round(101+(starterStrength-80)*1.3+attackBonus+swing);
  let away=Math.round(101+(fixture.index%4)+Math.floor(Math.random()*13)-6-defenseBonus);
  if(home===away)away++;
  state.meta.seasonResults[fixture.index]={home,away,opponent:fixture.opponent};
  state.meta.reputation+=home>away?3:1;
 }
}
function practiceProgress(meta,id){
 const sessions=meta.training[id]||{};
 return Object.values(sessions).reduce((total,count)=>total+count,0);
}
function date(day){
 return new Date(Date.UTC(2025,5,25+day)).toISOString().slice(0,10).replaceAll("-",".");
}
function nextDay(state){
 const {meta}=state;
 meta.day++;
 meta.energy=6;
 const scheduled=meta.seasonOrigin===null?null:schedule(state).find(game=>game.index>0&&!game.result&&game.day===meta.day);
 const pairings=teams.filter(team=>team.id!==state.team.logo && team.id!==scheduled?.opponent);
 for(let i=pairings.length-1;i>0;i--){
  const j=Math.floor(Math.random()*(i+1));
  [pairings[i],pairings[j]]=[pairings[j],pairings[i]];
 }
 for(let i=0;i+1<pairings.length;i+=2){
  const a=pairings[i].id,b=pairings[i+1].id;
  const winner=Math.random()<.5?a:b, loser=winner===a?b:a;
  (meta.records[winner]??=[0,0])[0]++;
  (meta.records[loser]??=[0,0])[1]++;
 }
}
function status(meta,money){
 const title=meta.reputation>=20?"资深总经理":meta.reputation>=8?"球队经理":"新任总经理";
 const stats=[["日期",date(meta.day)],["可用资金",money(meta.cash)],["声望",meta.reputation],["称号",title],["行动力",meta.energy+" / 6"]];
 return `<section class="office-status" aria-label="球队状态">${stats.map(([label,value])=>`<div><small>${label}</small><strong>${value}</strong></div>`).join("")}</section>`;
}
function skinFace(id){
 const src=window.skinPortrait?.(id);
 return src?`<img class="skin-mini" src="${src}" alt="">`:"";
}
function teamRecord(state,team){
 const [wins,losses]=state.meta.records[team.id]??[0,0];
 const games=schedule(state).filter(game=>game.opponent===team.id&&game.result);
 return [wins+games.filter(game=>game.result.away>game.result.home).length,losses+games.filter(game=>game.result.away<game.result.home).length];
}
function standings(state,{button,mark,escape}){
 const record=team=>team.id===state.team.logo?ownRecord(state):teamRecord(state,team);
 const pct=([w,l])=>w+l?w/(w+l):0;
 const mode=state.conference;
 const list=teams.filter(t=>mode==="all"||mode===t.conference).sort((a,b)=>pct(record(b))-pct(record(a))||record(b)[0]-record(a)[0]||a.en.localeCompare(b.en));
 return `<section class="panel standings"><div class="panel-head"><h2>联盟战绩</h2><span class="muted">${date(state.meta.day)} · 模拟战绩</span></div>
 <div class="subtabs">${Object.entries({all:"全部",E:"东部",W:"西部"}).map(([id,label])=>`<button class="btn" data-action="conference" data-value="${id}" aria-pressed="${mode===id}">${label}</button>`).join("")}</div>
 <div class="record-row record-head"><span>#</span><span>球队</span><span>胜</span><span>负</span></div>
 ${list.map((t,i)=>{
  const own=t.id===state.team.logo;
  const [w,l]=record(t);
  return `<button type="button" class="record-row team-record${own?" own-record":""}" data-action="team-detail" data-value="${t.id}"><span>${i+1}</span><span>${mark(t.id)}<b>${escape(own?state.team.name:t.name)}${own?" <small>我的球队</small>":""}</b></span><b>${w}</b><b>${l}</b></button>`;
 }).join("")}</section>`;
}
function teamBudget(state,team){
 const index=teams.indexOf(team);
 const [w,l]=teamRecord(state,team);
 return {cash:Math.round((26+index%11*2.7+w*.12-l*.04)*10)/10,payroll:104+index%12*3.7};
}
function teamDetail(state,id,{mark,escape,button,money,players,roster,rating,payroll}){
 const team=byTeam[id];
 if(!team)return null;
 if(id===state.team.logo){
  const [w,l]=ownRecord(state);
  const ids=roster();
  const coach=state.meta.coach&&coaches[state.meta.coach]?window.skinName(state.meta.coach,coaches[state.meta.coach].name):"待聘任";
  return {title:escape(state.team.name),content:`<div class="team-detail-heading">${mark(id,"big-mark")}<div><strong>我的球队</strong><p>${team.conference==="E"?"东部":"西部"} · ${w}胜 ${l}负</p></div></div>
  <dl class="detail-data"><div><dt>主教练</dt><dd>${coach}</dd></div><div><dt>阵容人数</dt><dd>${ids.length} 人</dd></div><div><dt>可用资金</dt><dd>${money(state.meta.cash)}</dd></div><div><dt>球队薪资</dt><dd>${money(payroll())}</dd></div></dl>
  <h3>球队名单</h3><div class="detail-roster">${ids.map(key=>`<div>${skinFace(key)}<b>${escape(window.skinName(key,players[key].name))}</b><span>${players[key].pos} · ${rating(key)}</span></div>`).join("")}</div>${button("关闭","close")}`};
 }
 const [w,l]=teamRecord(state,team);
 const {cash,payroll:teamPay}=teamBudget(state,team);
 return {title:team.name,content:`<div class="team-detail-heading">${mark(id,"big-mark")}<div><strong>${escape(team.en)}</strong><p>${team.conference==="E"?"东部":"西部"} · ${w}胜 ${l}负</p></div></div>
 <dl class="detail-data"><div><dt>主教练</dt><dd>${escape(window.skinCoach(id,team.coach))}</dd></div><div><dt>执教经历</dt><dd>${team.experience??"—"} 年</dd></div><div><dt>可用资金</dt><dd>${money(cash)}</dd></div><div><dt>球队薪资</dt><dd>${money(teamPay)}</dd></div></dl>
 <h3>球队名单 · ${team.roster.length} 人</h3><div class="detail-roster">${team.roster.map(p=>`<div>${skinFace(p.id)}<b>${escape(window.skinName(p.id,p.name))}</b><span>${p.pos} · ${p.age??"—"} 岁</span></div>`).join("")}</div><p class="muted">人员使用资料快照，战绩和资金来自游戏模拟。</p>${button("关闭","close")}`};
}
window.TeamOps={teams,byTeam,portraitIds,free,coaches,marketTabs,fresh,date,nextDay,status,standings,teamDetail,schedule,ownRecord,drills,practiceProgress,simulateDueGames};
})();