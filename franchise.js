(function(){
"use strict";
const stars={
 shai:{name:"谢伊·吉尔杰斯-亚历山大",en:"Shai Gilgeous-Alexander",pos:"PG",num:2,ovr:98,style:"持球攻坚",salary:38,photo:true},
 edwards:{name:"安东尼·爱德华兹",en:"Anthony Edwards",pos:"SG",num:5,ovr:95,style:"突破 · 三分",salary:34,photo:true},
 brown:{name:"杰伦·布朗",en:"Jaylen Brown",pos:"SF",num:7,ovr:94,style:"锋线攻防",salary:37,photo:true},
 giannis:{name:"扬尼斯·阿德托昆博",en:"Giannis Antetokounmpo",pos:"PF",num:34,ovr:97,style:"冲筐 · 协防",salary:37,photo:true},
 wemby:{name:"维克托·文班亚马",en:"Victor Wembanyama",pos:"C",num:1,ovr:97,style:"护框 · 顺下",salary:13.4,photo:true}
};
const ops=window.TeamOps;
const marks=ops.byTeam;
const tabs={office:["办公室","▤"],season:["赛季","▦"],training:["训练","◇"],players:["球员","♙"],market:["市场","⇄"],league:["联盟","◎"],settings:["设置","⚙"]};
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
function rarityOf(ovr){
 const rating=Number(ovr);
 if(rating>=90) return "legend";
 if(rating>=83) return "gold";
 if(rating>=76) return "silver";
 return "bronze";
}
function collectibleCard({id,player,ovr,logo,photo,action,pressed=null,asStar=false,deal=0}){
 const tier=rarityOf(ovr);
 const shine=tier==="legend"?'<span class="card-shine" aria-hidden="true"></span>':"";
 const number=player.num==null?"":`<span class="card-num">#${player.num}</span> `;
 const attrs=[`data-action="${action}"`,`data-value="${id}"`,`data-rarity="${tier}"`];
 if(pressed!==null) attrs.push(`aria-pressed="${pressed}"`);
 if(asStar) attrs.push(`style="--deal:${deal}"`);
 return `<button type="button" class="roster-cover rarity-${tier}${asStar?" star-card":""}" ${attrs.join(" ")}>${photo(id,"card-portrait")}${mark(logo,"card-team-logo")}<span class="card-ovr">${ovr}<small>${escape(player.pos)}</small></span>${shine}<span class="card-namebar"><b title="${escape(player.name)}">${escape(player.name)}</b><small>${number}${escape(player.style)}</small></span></button>`;
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
 return Object.entries(tabs).map(([id,[label,glyph]])=>`<button type="button" data-action="tab" data-value="${id}" ${id===active&&!flow?'aria-current="page"':""}><span aria-hidden="true">${glyph}</span>${label}</button>`).join("");
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
  return `<article class="market-item">${coach?'<span class="coach-icon" aria-hidden="true">⌂</span>':photo(id,"mini-photo")}<div><h3>${p.name}</h3><p>${coach?"主教练":p.pos} · ${p.style}</p><small>${sign}</small></div>${button("详情","market-detail",{value:id})}</article>`;
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
 return {title:p.name,content:`<div class="market-detail-body">${kind==="coach"?'<span class="coach-icon" aria-hidden="true">⌂</span>':photo(id,"mini-photo")}<div><strong>${p.en}</strong><p>${kind==="coach"?"主教练":p.pos} · ${p.style} · 评分 ${p.ovr}</p></div></div>
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
 return `<div class="fixture-line"><span class="fixture-date">${time}</span>${mark(team.id)}<div><b>${teamCity(team.id)}${team.name}</b><small>${index===0?"揭幕战":"常规赛 · 主场"}</small></div><div class="fixture-result"><span class="${outcome==="胜"?"win-result":""}">${result?outcome+" "+result.home+" : "+result.away:"待赛"}</span>${index===0&&result?button("战报","open-flow",{value:"3"}):""}</div></div>`;
}
function seasonPage(state,{button,progress}){
 const [wins,losses]=ops.ownRecord(state);
 const total=wins+losses;
 const games=ops.schedule(state);
 const complete=games.every(game=>game.result);
 return `<section class="season-summary" aria-label="球队战绩"><div><small>胜场</small><b>${wins}</b></div><div><small>负场</small><b>${losses}</b></div><div><small>胜率</small><b>${total?Math.round(wins/total*100)+"%":"—"}</b></div></section>
 <section class="panel season-calendar"><div class="panel-head"><h2>赛季日程</h2><span class="muted">${total} / ${games.length} 场</span></div>
 ${games.map(game=>fixtureLine(game,button)).join("")}
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
  const [wins,losses]=ops.ownRecord(state);
  const next=ops.schedule(state).find(game=>!game.result);
  return `<div class="management-heading office-heading"><h1>办公室</h1><span>${wins} 胜 · ${losses} 负</span></div>${ops.status(state.meta,money)}<div class="dashboard-grid office-grid"><section class="panel"><h2>球队经营</h2><p>主教练 · ${ops.coaches[state.meta.coach]?.name||"待聘任"} · 阵容 ${roster().length} 人</p><div class="office-next"><small>当前进度</small><strong>${state.result?next?"赛季进行中":"赛季已结束":["选秀夜","合同中心","首发安排","揭幕战"][current]}</strong></div><div class="actions">${state.result?button("查看赛季","tab",{value:"season",primary:true}):open("继续经营",current,{primary:true})}${button("推进一天","advance-day")}</div></section><section class="panel office-fixture"><h2>赛程与战绩</h2>${next?fixtureLine(next,button):"<p>本赛季赛程已全部结束。</p>"}<div class="actions">${button("进入赛季","tab",{value:"season"})}</div></section><section class="panel"><h2>球队首发</h2><div class="office-lineup">${Object.values(state.starters).map(id=>`<span><small>${players[id].pos}</small><b>${players[id].name}</b><strong>${rating(id)}</strong></span>`).join("")}</div><div class="actions">${button("查看球员","tab",{value:"players"})}</div></section><section class="panel"><h2>训练与战术</h2><p>当前战术 · ${tactics[state.tactic].name}</p><p>剩余行动力 · ${state.meta.energy} / 6</p><div class="actions">${button("安排训练","tab",{value:"training"})}</div></section></div>`;
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
window.FranchiseUI={stars,marks,tabs,escape,mark,wizard,navigation,dashboard,marketDetail,playerDetail,filterOpeningLogos,teamCity,teamAccent};
})();