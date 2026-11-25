(function(){
"use strict";
const stars={
 shai:{name:"谢伊·吉尔杰斯-亚历山大",en:"Shai Gilgeous-Alexander",pos:"PG",num:2,ovr:98,style:"持球攻坚",salary:38,photo:true},
 edwards:{name:"安东尼·爱德华兹",en:"Anthony Edwards",pos:"SG",num:5,ovr:95,style:"突破 · 三分",salary:34,photo:true},
 brown:{name:"杰伦·布朗",en:"Jaylen Brown",pos:"SF",num:7,ovr:96,style:"锋线攻防",salary:37,photo:true},
 giannis:{name:"扬尼斯·阿德托昆博",en:"Giannis Antetokounmpo",pos:"PF",num:34,ovr:97,style:"冲筐 · 协防",salary:37,photo:true},
 wemby:{name:"维克托·文班亚马",en:"Victor Wembanyama",pos:"C",num:1,ovr:97,style:"护框 · 顺下",salary:13.4,photo:true}
};
const ops=window.TeamOps;
const marks=ops.byTeam;
const tabs={office:["首页","⌂"],season:["赛季","▦"],players:["阵容","♙"],training:["训练","◇"],market:["市场","⇄"],packs:["开包","▣"],league:["联盟","◎"],settings:["设置","⚙"]};
const menu=["office","season","players","training","market","packs","league"];
const escape=text=>String(text).replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[char]);
const mark=(id,extra="")=>`<span class="fr-mark nba-logo ${extra}" aria-hidden="true"><img src="assets/teams/${marks[id]?id:"sa"}.svg" alt=""></span>`;
const teamIdentities={
 atl:["亚特兰大","#f04c67","ATL"],bos:["波士顿","#42c587","BOS"],bkn:["布鲁克林","#a6abbc","BKN"],
 cha:["夏洛特","#48c7d1","CHA"],chi:["芝加哥","#f34b65","CHI"],cle:["克利夫兰","#dba76b","CLE"],
 dal:["达拉斯","#5ba6f3","DAL"],den:["丹佛","#f4c760","DEN"],det:["底特律","#fb5575","DET"],
 gs:["金州","#f4bd54","GSW"],hou:["休斯敦","#f65c6c","HOU"],ind:["印第安纳","#f1c357","IND"],
 lac:["洛杉矶","#67a2f4","LAC"],lal:["洛杉矶","#f7c748","LAL"],mem:["孟菲斯","#95acd9","MEM"],
 mia:["迈阿密","#f65275","MIA"],mil:["密尔沃基","#60bd90","MIL"],min:["明尼苏达","#9ddd65","MIN"],
 no:["新奥尔良","#c9ae78","NOP"],ny:["纽约","#fa963f","NYK"],okc:["俄克拉荷马城","#64beff","OKC"],
 orl:["奥兰多","#62b4f9","ORL"],phi:["费城","#5f9dff","PHI"],phx:["菲尼克斯","#fc9a53","PHX"],
 por:["波特兰","#ff6e78","POR"],sac:["萨克拉门托","#bc8cec","SAC"],sa:["圣安东尼奥","#b6c2d5","SAS"],
 tor:["多伦多","#ff617c","TOR"],utah:["犹他","#e2df6e","UTA"],wsh:["华盛顿","#f27283","WAS"]
};
const teamCity=id=>teamIdentities[id]?.[0]||"";
const teamAccent=id=>teamIdentities[id]?.[1]||"";
const arenas={
 atl:"州立农场球馆",bos:"北岸花园球馆",bkn:"巴克莱中心",cha:"光谱中心",chi:"联合中心",
 cle:"火箭抵押球场",dal:"美航中心",den:"鲍尔球馆",det:"小凯萨球馆",gs:"大通中心",
 hou:"丰田中心",ind:"增益球馆",lac:"直觉穹顶",lal:"加密球馆",mem:"联邦快递球场",
 mia:"卡西亚中心",mil:"费哲球场",min:"标靶中心",no:"冰沙国王中心",ny:"麦迪逊广场花园",
 okc:"佩伯德中心",orl:"起亚中心",phi:"富国银行中心",phx:"足迹中心",por:"摩达中心",
 sac:"金州中心",sa:"霜库中心",tor:"丰业银行球馆",utah:"德尔塔中心",wsh:"首都体育馆"
};
const iconPaths={
 home:'<path fill="currentColor" d="M6 22 24 8l18 14v18H30V28H18v12H6V22z"/>',
 trophy:'<path fill="currentColor" d="M16 6h16v9a8 8 0 0 1-16 0V6zm-2 3h-6a8 8 0 0 0 7 8v-4h-1V9zm20 0v4h-1v4a8 8 0 0 0 7-8h-6zM21 26h6v5h7v5H14v-5h7v-5z"/>',
 jersey:'<path fill="currentColor" d="M14 8l10 6 10-6 9 7-6 6v21H11V21l-6-6 9-7z"/>',
 dumbbell:'<path fill="currentColor" d="M6 18h6v12H6zm8-4h6v20h-6zm16 0h6v20h-6zm8 4h6v12h-6zM18 21h12v6H18z"/>',
 cart:'<path fill="currentColor" d="M8 8h5l2 4h19l-4 14H16L12 12H8zm10 24a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm14 0a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"/>',
 pack:'<path fill="currentColor" d="M8 16l16-8 16 8v16l-16 8-16-8V16zm16 2 10-5v12l-10 5-10-5V13l10 5z"/>',
 shield:'<path fill="currentColor" d="M24 4l16 6v12c0 10-7 16-16 20C15 38 8 32 8 22V10l16-6z"/>',
 coin:'<circle cx="24" cy="24" r="14" fill="currentColor"/><path d="M24 14v20M19 20h7.5a3.5 3.5 0 0 1 0 7H19" fill="none" stroke="#5a3a08" stroke-width="2.4"/>',
 gem:'<path fill="currentColor" d="M24 6l14 12-14 24L10 18 24 6z"/>',
 refresh:'<path fill="currentColor" d="M24 8a16 16 0 1 0 15 10h-6a10 10 0 1 1-9-14V8zm10 0v10H24l10-10z"/>',
 calendar:'<path fill="currentColor" d="M14 8h4v4h12V8h4v4h4v28H10V12h4V8zm22 14H12v14h24V22z"/>',
 menu:'<path fill="currentColor" d="M8 12h32v4H8zm0 10h32v4H8zm0 10h32v4H8z"/>',
 back:'<path fill="currentColor" d="M30 10L16 24l14 14-4 4L8 24 26 6z"/>',
 ball:'<circle cx="24" cy="24" r="14" fill="currentColor"/><path d="M10 24h28M24 10c5 5 5 23 0 28M24 10c-5 5-5 23 0 28" fill="none" stroke="#4a2a06" stroke-width="2"/>'
};
function icon(name){
 return `<svg class="ico" viewBox="0 0 48 48" aria-hidden="true">${iconPaths[name]||""}</svg>`;
}
function rarityOf(ovr){
 const rating=Number(ovr);
 if(rating>=95) return "holo";
 if(rating>=90) return "legend";
 if(rating>=83) return "gold";
 if(rating>=76) return "silver";
 return "bronze";
}
function shownName(id,player){
 return window.PlayerSkins?.[id]?.name||player.name;
}
function cardStats(player,ovr){
 const style=player.style||"";
 const nudge=(words,amount)=>words.some(word=>style.includes(word))?amount:0;
 const clamp=value=>Math.max(45,Math.min(99,Math.round(value)));
 const base=Number(ovr)||70;
 const shoot=clamp(base-3+nudge(["投","三分","投射"],6)+nudge(["攻坚"],2));
 const drive=clamp(base-1+nudge(["突破","冲筐","顺下"],6));
 const defense=clamp(base-5+nudge(["防","护框","协防"],8));
 const board=clamp(base-2+nudge(["篮板"],6));
 const table={
  PG:[["组织",clamp(base-2+nudge(["组织","传球"],5))],["突破",drive],["防守",defense]],
  SG:[["投篮",shoot],["突破",drive],["防守",defense]],
  SF:[["得分",shoot],["突破",drive],["防守",defense]],
  PF:[["篮板",board],["内线",drive],["防守",defense]],
  C:[["篮板",board],["护框",clamp(base-3+nudge(["护框"],7))],["防守",defense]]
 };
 return table[player.pos]||[["投篮",shoot],["突破",drive],["防守",defense]];
}
function cardBack(){
 return `<span class="card-back" aria-hidden="true"><span class="card-back-ring"></span><span class="card-back-gem"></span></span>`;
}
function collectibleCard({id,player,ovr,logo,photo,action,pressed=null,asStar=false,deal=0,disabled=false}){
 const tier=rarityOf(ovr);
 const name=shownName(id,player);
 const stats=cardStats(player,ovr).map(([label,value])=>`<span><small>${label}</small><b>${value}</b></span>`).join("");
 const holo=tier==="holo"?'<span class="card-holo" aria-hidden="true"></span>':"";
 const crown=["holo","legend","gold"].includes(tier)?'<span class="card-crown" aria-hidden="true"></span>':"";
 const attrs=[`data-action="${action}"`,`data-value="${id}"`,`data-rarity="${tier}"`];
 if(pressed!==null) attrs.push(`aria-pressed="${pressed}"`);
 if(asStar) attrs.push(`style="--deal:${deal}"`);
 if(disabled) attrs.push("disabled");
 return `<button type="button" class="roster-cover rarity-${tier}${asStar?" star-card":""}" ${attrs.join(" ")}><span class="card-frame" aria-hidden="true"></span>${holo}${crown}${photo(id,"card-portrait")}<span class="card-rating"><b>${ovr}</b><small>${escape(player.pos)}</small></span>${mark(logo,"card-team-logo")}<span class="card-plate"><b title="${escape(name)}">${escape(name)}</b><span class="card-stats">${stats}</span></span><span class="card-gem" aria-hidden="true"></span></button>`;
}
function openingLogoPicker({logo,region="all",query=""},button){
 const selected=teamCity(logo);
 const choices=Object.entries(teamIdentities).map(([id,[city,color,code]])=>{
  const team=marks[id];
  const searchable=[city+team.name,team.en,code].join(" ");
  return `<button type="button" class="opening-team" data-action="choose-logo" data-value="${id}" data-region="${team.conference}" data-search="${escape(searchable)}" aria-pressed="${logo===id}" style="--club-accent:${color}">
  <span class="opening-team-code">${code}</span>${mark(id,"opening-team-logo")}
  <span class="opening-team-name">${city}</span><small>${team.conference==="E"?"东部":"西部"}</small></button>`;
 }).join("");
 const filters=Object.entries({all:"全部",E:"东部",W:"西部"}).map(([id,label])=>`<button type="button" data-action="opening-region" data-value="${id}" aria-pressed="${region===id}">${label}</button>`).join("");
 return `<div class="opening-searchbar"><div class="opening-regions" role="group" aria-label="筛选赛区">${filters}</div><input id="opening-team-search" type="search" aria-label="搜索球队" placeholder="搜索球队…" value="${escape(query)}" maxlength="50" autocomplete="off"></div>
  <div id="opening-choices" class="opening-team-grid">${choices}</div>
  <p id="opening-no-results" class="opening-empty" role="status" hidden>没有找到符合条件的球队。</p>
  <div class="opening-actions"><div><span>${selected?"已选 "+selected:"请选择一个队标"}</span></div>${button("选择当家球星","setup-next",{primary:true,disabled:!logo})}</div>`;
}
function filterOpeningLogos(game,{region="all",query=""}){
 const list=game.querySelector("#opening-choices");
 if(!list)return;
 const match=query.trim().toLocaleLowerCase().replace(/\s+/g,"");
 let count=0;
 for(const choice of list.children){
  choice.hidden=(region!=="all"&&choice.dataset.region!==region)||!choice.dataset.search.toLocaleLowerCase().replace(/\s+/g,"").includes(match);
  if(!choice.hidden)count++;
 }
 game.querySelector("#opening-no-results").hidden=count>0;
}
function logoChoices(selected,action){
 return `<div class="create-grid logos nba-grid">${ops.teams.map(t=>`<button type="button" class="card logo-choice" data-action="${action}" data-value="${t.id}" aria-pressed="${selected===t.id}">${mark(t.id)}<b>${teamCity(t.id)}</b></button>`).join("")}</div>`;
}
function wizard(state,button,photo){
 const {step,logo,star}=state.setup;
 const pickingLogo=step===1;
 const labels=["球队队标","当家球星"];
 let content;
 if(pickingLogo){
  content=openingLogoPicker(state.setup,button);
 }else{
  const dealIn=!state.setup.dealt;
  const cards=Object.entries(stars).map(([id,p],index)=>collectibleCard({id,player:p,ovr:p.ovr,logo,photo,action:"choose-star",pressed:star===id,asStar:true,deal:index})).join("");
  content=`<div class="create-grid star-grid${dealIn?" is-dealing":""}">${cards}</div><div class="actions">${button("上一步","setup-back")}${button("执教","create-team",{primary:true,disabled:!star})}</div>`;
 }
 return `<section class="setup-page opening-page"><header class="opening-hero"><div class="opening-brand">篮球总经理</div><p>从建队开始，执掌你的球队。</p></header><div class="setup-steps">${labels.map((label,index)=>`<span ${step===index+1?'aria-current="step"':""} class="${step===index+1?"current":""}">${index+1} ${label}</span>`).join("")}</div><section class="create-panel ${pickingLogo?"opening-picker":""}"><h1>${pickingLogo?"选择球队队标":"选择当家球星"}</h1><p class="muted">${pickingLogo?"30 支球队队标":teamCity(logo)+" · 选择一名球星加入首发"}</p>${content}</section></section>`;
}
function navigation(active,flow){
 const glyphs={office:"home",season:"trophy",players:"jersey",training:"dumbbell",market:"cart",packs:"pack",league:"shield"};
 return menu.map(id=>{
  const [label]=tabs[id];
  return `<button type="button" class="rail-btn" data-action="tab" data-value="${id}" ${id===active&&!flow?'aria-current="page"':""}>${icon(glyphs[id])}<span>${label}</span></button>`;
 }).join("");
}
function newsLine(state,players){
 const name=state.team?.name||"球队";
 const bits=[`${name} 执教进行中`];
 const [wins,losses]=ops.ownRecord(state);
 if(wins||losses) bits.push(`本季 ${wins} 胜 ${losses} 负`);
 for(const game of ops.schedule(state)){
  if(!game.result) continue;
  const outcome=game.result.home>game.result.away?"胜":"负";
  bits.push(`对阵${teamCity(game.team.id)}${game.team.name} ${outcome} ${game.result.home}:${game.result.away}`);
 }
 for(const id of state.meta.signed){
  const player=players[id];
  if(player) bits.push(`签下 ${player.name}`);
 }
 if(state.meta.coach&&ops.coaches[state.meta.coach]) bits.push(`主教练 ${window.skinName(state.meta.coach,ops.coaches[state.meta.coach].name)} 到任`);
 if(bits.length===1) bits.push("休赛期进行中，完成选秀和合同后开启揭幕战");
 return bits.join("    ·    ");
}
function kickoffWhen(day){
 const date=new Date(Date.UTC(2025,5,25+(day??0)));
 const weeks=["周日","周一","周二","周三","周四","周五","周六"];
 return `${date.getUTCMonth()+1}-${String(date.getUTCDate()).padStart(2,"0")} ${weeks[date.getUTCDay()]} 19:00`;
}
function lobbyPage(state,{photo,players,rating,progress}){
 const order=["PG","SG","SF","PF","C"];
 const logo=state.team.logo;
 const ranked=order.map(pos=>({pos,id:state.starters[pos]})).filter(item=>item.id&&players[item.id]).sort((a,b)=>rating(b.id)-rating(a.id)||order.indexOf(a.pos)-order.indexOf(b.pos));
 const placed=Array(ranked.length);
 const visual=[2,1,3,0,4];
 ranked.forEach((item,rank)=>{ placed[visual[rank]]=item; });
 const cards=placed.filter(Boolean).map(item=>{
  const player=players[item.id];
  return `<div class="lobby-slot">${collectibleCard({id:item.id,player,ovr:rating(item.id),logo,photo,action:"player-detail"})}</div>`;
 }).join("");
 const [wins,losses]=ops.ownRecord(state);
 const next=ops.schedule(state).find(game=>!game.result);
 const conf=marks[logo]?.conference==="W"?"西部":"东部";
 const standing=wins||losses?`${conf}`:`${conf} · 赛季未开始`;
 const current=progress();
 const ready=state.rookieSigned&&Boolean(state.veteran);
 const playLabel=state.result?"查看赛季":"开始比赛";
 const playAttrs=state.result
  ? `data-action="tab" data-value="season"`
  : `data-action="open-flow" data-value="${current}"${current>=2&&!ready?" disabled":""}`;
 const bars=[42,68,36,78,54,88,46,72,60].map(height=>`<i style="height:${height}%"></i>`).join("");
 const fixture=next?`<div class="vs-board"><div>${mark(logo)}<b>${escape(state.team.name)}</b></div><span class="vs-mark">VS</span><div>${mark(next.team.id)}<b>${teamCity(next.team.id)}${next.team.name}</b></div></div><p class="vs-meta">${next.day===null&&next.index===0?"揭幕战":kickoffWhen(next.day)}<span>|</span>${arenas[logo]||"主场球馆"}</p>`:`<p class="vs-meta">本赛季赛程已全部结束。</p>`;
 const ticker=newsLine(state,players);
 return `<div class="lobby"><div class="lobby-stage"><div class="lobby-arc">${cards}</div><div class="lobby-platform" aria-hidden="true"><span class="platform-ring"></span>${mark(logo,"platform-crest")}</div></div><aside class="lobby-side"><section class="side-card next-card"><h2>${icon("calendar")}下一场比赛</h2>${fixture}</section><button type="button" class="play-btn" ${playAttrs}>${icon("ball")}${playLabel}</button><section class="side-card record-card"><h2>本赛季战绩</h2><div class="record-body"><div><b>${wins} 胜 ${losses} 负</b><small>${standing}</small></div><div class="bars" aria-hidden="true">${bars}</div></div></section></aside><div class="lobby-news"><span class="news-tag">新闻</span>${mark(logo,"news-crest")}<div class="lobby-news-track"><span>${escape(ticker)}</span></div><button type="button" class="news-more" data-action="tab" data-value="season" aria-label="查看赛季">${icon("back")}</button></div></div>`;
}
function packPage(button){
 return `<section class="panel pack-hub"><div class="pack-hub-art" aria-hidden="true">${cardBack()}${cardBack()}${cardBack()}</div><div><h2>球星卡包</h2><p>卡背裂开，按最高稀有度打出光柱，扇开后翻面。全息或传奇会停在正中。</p><div class="actions">${button("开启演示包","pack-demo",{primary:true})}</div></div></section>`;
}
function packMarkup(pack,{photo,button}){
 const best=pack.entries.reduce((top,entry)=>entry.ovr>=top.ovr?entry:top,pack.entries[0]);
 const tier=rarityOf(best.ovr);
 const titles={holo:"全息降临！",legend:"传奇降临！",gold:"黄金开包",silver:"球星开包",bronze:"球星开包"};
 const cards=pack.entries.map((entry,index)=>{
  const focus=entry.id===pack.focus?" is-focus":"";
  const front=collectibleCard({id:entry.id,player:entry.player,ovr:entry.ovr,logo:pack.logo,photo,action:"pack-hold"});
  const fan=(index-(pack.entries.length-1)/2)*8;
  return `<div class="flip-card${focus}" data-id="${entry.id}" style="--fan:${fan}deg;--i:${index}"><div class="flip-inner"><div class="flip-face front">${front}</div><div class="flip-face back">${cardBack()}</div></div></div>`;
 }).join("");
 const doneActions=pack.kind==="create"
  ? button("进入球队","pack-close",{primary:true})
  : `${button("再开一包","pack-again",{primary:true})}${button("收入阵容","pack-close")}`;
 const cash=pack.cash==null?"":`<div class="hud-pill is-gold"><span class="pill-ico">${icon("coin")}</span><small>金币</small><b>$${Number(pack.cash).toFixed(1)}M</b></div><div class="hud-pill is-gem"><span class="pill-ico">${icon("gem")}</span><small>钻石</small><b>${pack.gems??0}</b></div>`;
 const reduced=pack.phase==="done"?"1":"0";
 return `<div class="pack-stage" data-beam="${tier}" data-reduced="${reduced}"><header class="pack-hud"><button type="button" class="hud-icon" data-action="pack-skip" aria-label="跳过">${icon("back")}</button>${cash}</header><h1 class="pack-title">${titles[tier]}</h1><div class="pack-beam" aria-hidden="true"></div><div class="pack-stack" aria-hidden="true">${cardBack()}${cardBack()}${cardBack()}</div><div class="pack-fan">${cards}</div><div class="pack-actions">${doneActions}</div></div>`;
}
function marketItems(prospects){
 const source={...ops.free,...ops.coaches,...prospects};
 return source;
}
function marketPage(state,{button,photo,prospects}){
 const items=marketItems(prospects);
 const tab=state.marketTab;
 const ids=tab==="watch"?state.meta.watch:Object.keys({free:ops.free,coach:ops.coaches,rookie:prospects}[tab]);
 const sub=Object.entries(ops.marketTabs).map(([id,label])=>`<button type="button" class="btn" data-action="market-tab" data-value="${id}" aria-pressed="${id===tab}">${label}</button>`).join("");
 const cards=ids.map(id=>{
  const p=items[id];
  if(!p)return "";
  const coach=Object.hasOwn(ops.coaches,id);
  const sign=p.years?`${p.years} 年 · $${p.salary.toFixed(1)}M / 年`:"首轮新秀 · 通过选秀签约";
  return `<article class="market-item">${coach?'<span class="coach-icon" aria-hidden="true">⌂</span>':photo(id,"mini-photo")}<div><h3>${escape(window.skinName(id,p.name))}</h3><p>${coach?"主教练":p.pos} · ${p.style}</p><small>${sign}</small></div>${button("详情","market-detail",{value:id})}</article>`;
 }).join("");
 return `<section class="market-hub"><div class="subtabs">${sub}</div><p class="muted market-note">${tab==="free"?"模拟自由市场 · 查看报价并直接签约":tab==="coach"?"选择执教风格，聘用主教练":tab==="rookie"?"比较新秀并前往选秀大会":"已关注的球员和教练"}</p>
 ${cards||'<p class="panel muted">暂无关注。在球员或教练详情中点「加入关注」。</p>'}
 ${tab==="rookie"?`<div class="actions">${button("前往选秀","open-flow",{value:"0",primary:true})}${button("新秀与续约合同","open-flow",{value:"1",disabled:!state.draft})}</div>`:""}</section>`;
}
function marketDetail(state,id,{button,photo,prospects,money,payroll,cap}){
 const p=marketItems(prospects)[id];
 if(!p)return null;
 const kind=Object.hasOwn(ops.coaches,id)?"coach":Object.hasOwn(prospects,id)?"rookie":"free";
 const signed=state.meta.signed.includes(id)||state.meta.coach===id;
 const followed=state.meta.watch.includes(id);
 const affordable=state.meta.energy>=2&&state.meta.cash>=p.salary&&(kind!=="free"||payroll()+p.salary<=cap);
 const terms=kind==="rookie" ? `预计首年 ${money(p.salary)} · 首轮新秀合同` : `${p.years} 年 · ${money(p.salary)} / 年`;
 const action=kind==="rookie" ? button("前往选秀","open-flow",{value:"0",primary:true}) : button(signed?"已签约":affordable?(kind==="coach"?"聘为主教练":"确认签约"):"资金、薪资空间或行动力不足","market-sign",{value:id,primary:true,disabled:signed||!affordable});
 return {title:escape(window.skinName(id,p.name)),content:`<div class="market-detail-body">${kind==="coach"?'<span class="coach-icon" aria-hidden="true">⌂</span>':photo(id,"mini-photo")}<div><strong>${p.en}</strong><p>${kind==="coach"?"主教练":p.pos} · ${p.style} · 评分 ${p.ovr}</p></div></div>
 <p>${p.report}</p><p><b>${terms}</b></p>${kind==="rookie"?`<p>游戏潜力 ${p.range.join("–")}</p>`:`<p class="muted">签约时支付首年费用，扣除 2 点行动力。${kind==="coach"&&state.meta.coach&&!signed?"签约后将更换现任主教练。":""}</p>`}
 <div class="actions">${button(followed?"取消关注":"加入关注","market-watch",{value:id})}${action}</div><div class="actions">${button("关闭","close")}</div>`};
}
function playerDetail(state,id,{button,photo,players,money,roster,rating}){
 if(!roster().includes(id))return null;
 const p=players[id], salary=id==="paul"?state.veteran.offer.amount:p.salary;
 return {title:p.name,content:`<div class="market-detail-body">${photo(id,"mini-photo")}<div><strong>${p.en}</strong><p>${p.pos} · ${p.style} · 评分 ${rating(id)}</p></div></div><p>年薪 ${money(salary)} · ${p.years?p.years+" 年":p.deal||"新秀合同"}</p>${button("关闭","close")}`};
}
function fixtureLine(fixture,button){
 const {index,team,result,day}=fixture;
 const outcome=result?result.home>result.away?"胜":"负":"";
 const time=day!==null?ops.date(day):index===0?"揭幕战":"揭幕战后 "+fixture.offset+" 天";
 return `<div class="fixture-line"><span class="fixture-date">${time}</span>${mark(team.id,"fixture-logo")}<b>${teamCity(team.id)}${team.name}</b><span class="fixture-result${outcome==="胜"?" win-result":""}">${result?outcome+" "+result.home+" : "+result.away:"待赛"}</span>${index===0&&result?button("战报","open-flow",{value:"3"}):""}</div>`;
}
function seasonPage(state,{button,progress}){
 const [wins,losses]=ops.ownRecord(state);
 const total=wins+losses;
 const games=ops.schedule(state);
 const complete=games.every(game=>game.result);
 return `<section class="season-summary" aria-label="球队战绩"><div><small>胜场</small><b>${wins}</b></div><div><small>负场</small><b>${losses}</b></div><div><small>胜率</small><b>${total?Math.round(wins/total*100)+"%":"—"}</b></div></section>
 <section class="panel season-calendar"><div class="panel-head"><h2>赛季日程</h2><span class="muted">${total} / ${games.length} 场</span></div>
 <div class="fixture-list">${games.map(game=>fixtureLine(game,button)).join("")}</div>
 <div class="actions">${state.result?button(complete?"赛季已结束":"推进一天","advance-day",{primary:true,disabled:complete}):button(progress()===3?"进入揭幕战":"继续赛季准备","open-flow",{value:String(progress()),primary:true})}</div>
 <p class="muted">${state.result?"推进日期时自动模拟当天的常规赛。":"揭幕战结算后会锁定常规赛日期。"}</p></section>`;
}
function trainingPage(state,{button,roster,players,photo,rating,practicePlayer,tactics}){
 const id=practicePlayer();
 const p=players[id];
 const sessions=ops.practiceProgress(state.meta,id);
 const max=rating(id)>=(id===state.team.star?99:84);
 const selected=state.drill;
 const drills=Object.entries(ops.drills).map(([key,label])=>`<button class="tactic training-choice" type="button" data-action="training-drill" data-value="${key}" aria-pressed="${key===selected}"><b>${label}</b><small>${state.meta.training[id]?.[key]||0} 次</small></button>`).join("");
 const tacticsList=Object.entries(tactics).map(([key,t])=>`<button class="tactic training-choice" type="button" data-action="training-tactic" data-value="${key}" aria-pressed="${key===state.tactic}"><b>${t.name}</b><small>${t.subtitle}</small></button>`).join("");
 return `<div class="dashboard-grid training-grid"><section class="panel"><div class="panel-head"><h2>球员训练</h2><span class="muted">行动力 ${state.meta.energy} / 6</span></div>
 <label for="practice-player">选择球员</label><select id="practice-player">${roster().map(key=>`<option value="${key}" ${key===id?"selected":""}>${players[key].name} · ${players[key].pos}</option>`).join("")}</select>
 <div class="training-player">${photo(id,"mini-photo")}<div><b>${p.name}</b><small>评分 ${rating(id)} · ${p.pos}</small></div><span>${max?"已达上限":sessions%3+" / 3"}</span></div>
 <div class="cards">${drills}</div><p class="muted">每次消耗 2 点行动力。完成 3 次训练，评分提升 1。</p>
 <div class="actions">${button(max?"已达评分上限":state.meta.energy<2?"行动力不足":"开始训练","train",{primary:true,disabled:max||state.meta.energy<2})}</div></section>
 <section class="panel"><div class="panel-head"><h2>战术安排</h2></div><div class="tactic-plan">${tacticsList}</div><p class="muted">当前战术会作为比赛默认设置，可在揭幕战最后一攻前调整。</p></section></div>`;
}
function dashboard(state,{button,photo,roster,players,money,progress,prospects,rating,practicePlayer,tactics}){
 const {team,view}=state;
 const name=escape(team.name);
 const ready=state.rookieSigned && Boolean(state.veteran);
 const current=progress();
 const open=(label,phase,opts={})=>button(label,"open-flow",{value:String(phase),...opts});
 let content;
 if(view==="office"){
  return lobbyPage(state,{button,photo,players,money,rating,progress});
 }
 if(view==="season"){
  content=seasonPage(state,{button,progress});
 }else if(view==="training"){
  content=trainingPage(state,{button,roster,players,photo,rating,practicePlayer,tactics});
 }else if(view==="players"){
  const starters=Object.values(state.starters);
  const ids=[...starters,...roster().filter(id=>!starters.includes(id))];
  content=`<section class="roster-panel"><div class="panel-head"><h2>阵容 · ${ids.length} 人</h2><span class="muted">首发 ${starters.length} 人</span></div><div class="roster-cards">${ids.map(id=>{
   const p=players[id], salary=id==="paul"?state.veteran.offer.amount:p.salary, ovr=rating(id);
   const role=id===team.star?"当家球星":starters.includes(id)?"首发":"";
   return `<article class="roster-card">${collectibleCard({id,player:p,ovr,logo:team.logo,photo,action:"player-detail"})}<div class="roster-actions"><small>${money(salary)} / 年</small>${role?`<span class="roster-role">${role}</span>`:button("设为首发","dashboard-start",{value:id})}</div></article>`;
  }).join("")}</div></section>`;
 }else if(view==="packs"){
  content=packPage(button);
 }else if(view==="market"){
  content=marketPage(state,{button,photo,prospects});
 }else if(view==="league"){
  const r=state.result;
  const opponent=ops.schedule(state)[0].team;
  content=`<section class="panel"><h2>球队赛程</h2><div class="row"><div><b>揭幕战 · 对阵${teamCity(opponent.id)}${opponent.name}</b><small>${r?`${r.home} : ${r.away} · ${r.made?"胜":"负"}`:"单场试玩"}</small></div>${open(r?"查看战报":"进入比赛",3,{primary:true,disabled:!ready})}</div>${ready?"":'<p class="muted">完成选秀和合同待办后开放比赛。</p>'}</section>${ops.standings(state,{button,mark,escape})}`;
 }else{
  content=`<section class="panel"><h2>本地存档</h2><p>${name} · 进度自动保存在当前浏览器。</p><div class="actions">${button("更换队标","toggle-team-logo")}${button("素材来源","credits")}${button("重新开档","reset")}</div>${state.logoSettings?logoChoices(team.logo,"update-team-logo"):""}</section>`;
 }
 return `<div class="management-heading"><h1>${tabs[view][0]}</h1></div>${content}`;
}
window.FranchiseUI={stars,marks,tabs,escape,mark,icon,wizard,navigation,dashboard,marketDetail,playerDetail,filterOpeningLogos,teamCity,teamAccent,rarityOf,packMarkup,cardBack,collectibleCard};
})();