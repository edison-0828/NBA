(function () {
"use strict";

const prospects = {
  harper: {name:"迪伦·哈珀", en:"Dylan Harper", pos:"PG", num:2, ovr:80, range:[86,94], school:"罗格斯大学", style:"挡拆持球", salary:12.4, report:"能借掩护进攻篮筐，也会在协防到位时分球。首发后可以担任挡拆发起人。", photo:true},
  edgecombe: {name:"VJ·埃奇库姆", en:"VJ Edgecombe", pos:"SG", num:77, ovr:79, range:[85,93], school:"贝勒大学", style:"外线防守", salary:12.4, report:"追防能力突出，适合领防对方后场核心。阵地战可以从底角接球投篮做起。", photo:true},
  ace: {name:"埃斯·贝利", en:"Ace Bailey", pos:"SF", num:19, ovr:77, range:[84,95], school:"罗格斯大学", style:"锋线投射", salary:12.4, report:"身高和出手点能帮他在侧翼创造投篮机会，有潜力成为第二得分点。"}
};

const players = {
  fox: {name:"达龙·福克斯", en:"De’Aaron Fox", pos:"PG", num:4, ovr:84, style:"突破组织", salary:11, next:0, deal:"剩余 1 年"},
  castle: {name:"斯蒂芬·卡斯尔", en:"Stephon Castle", pos:"SG", num:5, ovr:81, style:"外线防守", salary:9.6, next:10.1, deal:"新秀合同"},
  vassell: {name:"德文·瓦塞尔", en:"Devin Vassell", pos:"SF", num:24, ovr:82, style:"接球投射", salary:11, next:11, deal:"长期合同"},
  barnes: {name:"哈里森·巴恩斯", en:"Harrison Barnes", pos:"PF", num:40, ovr:78, style:"空间四号位", salary:8, next:0, deal:"剩余 1 年"},
  wemby: {name:"维克托·文班亚马", en:"Victor Wembanyama", pos:"C", num:1, ovr:97, style:"护框 · 顺下", salary:13.4, next:16.9, deal:"新秀合同", photo:true},
  biyombo: {name:"俾斯麦·比永博", en:"Bismack Biyombo", pos:"C", num:18, ovr:74, style:"护框 · 篮板", salary:3.3, deal:"剩余 1 年"},
  johnson: {name:"凯尔登·约翰逊", en:"Keldon Johnson", pos:"SF", num:0, ovr:77, style:"冲筐得分", salary:9, next:9, deal:"剩余 2 年"},
  sochan: {name:"杰里米·索汉", en:"Jeremy Sochan", pos:"PF", num:10, ovr:78, style:"机动换防", salary:7.1, next:0, deal:"剩余 1 年"},
  paul: {name:"克里斯·保罗", en:"Chris Paul", pos:"PG", num:3, ovr:80, style:"节奏掌控", salary:0, next:0, deal:"合同到期"},
  ...prospects
};

const ui = window.FranchiseUI;
const ops = window.TeamOps;
Object.assign(players,ops.free);
for (const [id, star] of Object.entries(ui.stars)) {
  if (!players[id]) players[id] = {...star, deal:"建队合同"};
}
// Position, rating and contract values are calibrated for this prototype.
const rotationPool = {
  PG:["fox","jones","fultz","alvarado"],
  SG:["castle","grimes","beasley","dort"],
  SF:["vassell","johnson","hart","nesmith"],
  PF:["barnes","sochan","washington","toppin"],
  C:["biyombo","richards","bitadze","looney"]
};
const rotationPlayers = [
  ["jones","泰厄斯·琼斯","Tyus Jones","PG",1,78,"传球组织",6,6],
  ["fultz","马克尔·富尔茨","Markelle Fultz","PG",20,75,"突破组织",3,0],
  ["alvarado","何塞·阿尔瓦拉多","Jose Alvarado","PG",15,78,"外线防守",5,5],
  ["grimes","昆廷·格莱姆斯","Quentin Grimes","SG",5,81,"接球投射",10,10],
  ["beasley","马利克·比斯利","Malik Beasley","SG",5,80,"外线投射",8,0],
  ["dort","吕冈茨·多尔特","Luguentz Dort","SG",5,82,"侧翼领防",14,14],
  ["hart","约什·哈特","Josh Hart","SF",3,83,"篮板 · 推进",13,13],
  ["nesmith","阿隆·内史密斯","Aaron Nesmith","SF",23,81,"侧翼投射",11,11],
  ["washington","P.J.·华盛顿","P.J. Washington","PF",25,82,"换防 · 投射",13,13],
  ["toppin","奥比·托平","Obi Toppin","PF",1,79,"顺下终结",9,9],
  ["richards","尼克·理查兹","Nick Richards","C",2,77,"篮板 · 顺下",5,5],
  ["bitadze","戈加·比塔泽","Goga Bitadze","C",35,79,"护框 · 掩护",8,8],
  ["looney","凯文·卢尼","Kevon Looney","C",5,76,"卡位 · 篮板",6,6]
];
for (const [id,name,en,pos,num,ovr,style,salary,next] of rotationPlayers) {
  players[id]={name,en,pos,num,ovr,style,salary,next,deal:next ? "剩余 2 年" : "剩余 1 年"};
}

function allocateRoster(starId) {
  const starPosition = players[starId].pos;
  const starters = {};
  const bench = [];
  for (const [position,ids] of Object.entries(rotationPool)) {
    const eligible = ids.filter(id=>id!==starId && players[id].ovr<=84);
    const first = eligible.splice(Math.floor(Math.random()*eligible.length),1)[0];
    if (position===starPosition) {
      starters[position]=starId;
      bench.push(first);
    } else {
      starters[position]=first;
      bench.push(eligible[Math.floor(Math.random()*eligible.length)]);
    }
  }
  return {starters,openingRoster:[...Object.values(starters),...bench]};
}

const tactics = {
  roll: {name:"中路挡拆", subtitle:"掩护后顺下冲筐"},
  kick: {name:"突破分球", subtitle:"吸引协防后找底角"},
  iso: {name:"后卫单打", subtitle:"拉开空间攻击换防"}
};
const positions = ["PG","SG","SF","PF","C"];
const stages = ["选秀","合同","首发","揭幕战"];
const key = "basketball-gm-2025-v1";
const initial = () => ({
  setup:{step:1,logo:null,star:null},team:null,view:"office",flow:false,
  meta:ops.fresh(),marketTab:"free",conference:"all",logoSettings:false,practicePlayer:null,drill:"shooting",
  phase:0, selected:"harper", draft:null, scouted:[], rookieSigned:false,
  offer:{amount:8, years:1, option:"none"}, veteran:null,
  starters:{},openingRoster:null,
  tactic:"roll", result:null
});

const game = document.querySelector("#game");
const steps = document.querySelector("#steps");
const mainNav = document.querySelector("#franchise-nav");
const teamBadge = document.querySelector("#team-badge");
const toast = document.querySelector("#status");
const dialog = document.querySelector("#dialog");
const reduced = matchMedia("(prefers-reduced-motion: reduce)");
let replay = null;
let state = readSave();
if (state.result && state.meta.seasonOrigin===null) {
  state.meta.seasonOrigin=state.meta.day;
  state.meta.seasonClub=state.team.logo;
  save();
}
if (state.team && !Object.hasOwn(ui.marks,state.team.logo)) state.team.logo="sa";
if (!Object.hasOwn(ui.marks,state.setup.logo)) state.setup.logo=null;
if (state.setup.step!==2 || !state.setup.logo) state.setup.step=1;
if (state.team && !state.openingRoster) {
  const previous = state.starters;
  Object.assign(state,allocateRoster(state.team.star));
  for (const [position,id] of Object.entries(previous)) {
    if (roster().includes(id)) state.starters[position]=id;
  }
  save();
}

function readSave() {
  try {
    const data = JSON.parse(localStorage.getItem(key));
    if (data && Number.isInteger(data.phase) && data.phase >= 0 && data.phase < stages.length) return {...initial(),...data,meta:{...ops.fresh(),...data.meta}};
  } catch {
    // An unavailable browser store leaves the current session playable.
  }
  return initial();
}

function save() {
  try { localStorage.setItem(key, JSON.stringify(state)); }
  catch { announce("此浏览器无法保存进度，本次仍可继续试玩。"); }
}

function announce(message) { toast.textContent = message; }

function photo(id, className = "photo") {
  const p = players[id];
  const initials = p.en.split(" ").map(part => part[0]).slice(0,2).join("");
  const hasPortrait = ops.portraitIds.has(id);
  const path = p.photo && (!hasPortrait || !["card-portrait","mini-photo"].includes(className))
    ? `assets/${id}.jpg`
    : hasPortrait ? `assets/portraits/${id}.webp` : "";
  const img = path ? `<img src="${path}" alt="" ${["photo","card-portrait"].includes(className) ? 'loading="lazy"' : ""}>` : "";
  return `<span class="${className}" aria-hidden="true"><span class="initial">${initials}</span>${img}</span>`;
}

function button(text, action, {value="", primary=false, disabled=false} = {}) {
  return `<button type="button" class="btn${primary ? " primary" : ""}" data-action="${action}" data-value="${value}"${disabled ? " disabled" : ""}>${text}</button>`;
}

function progression() {
  if (!state.draft) return 0;
  if (!state.rookieSigned || !state.veteran) return 1;
  return state.result || state.lineupReady ? 3 : 2;
}

function teamName() { return ui.escape(state.team.name); }

function rating(id) {
  const cap=id===state.team.star?99:84;
  return Math.min(cap,players[id].ovr+Math.floor(ops.practiceProgress(state.meta,id)/3));
}

function practicePlayer() {
  return roster().includes(state.practicePlayer)?state.practicePlayer:state.team.star;
}

function advanceDay() {
  ops.nextDay(state);
  const ids=Object.values(state.starters);
  const strength=ids.reduce((sum,id)=>sum+rating(id),0)/positions.length;
  const drill=state.tactic==="roll"?"fitness":"shooting";
  const bonus=ids.reduce((sum,id)=>sum+(state.meta.training[id]?.[drill]||0),0);
  const defense=ids.reduce((sum,id)=>sum+(state.meta.training[id]?.defense||0),0);
  ops.simulateDueGames(state,strength,Math.min(3,bonus*.2),Math.min(3,defense*.2));
}

function render(focus = false) {
  document.body.classList.toggle("opening-mode",!state.team);
  document.body.classList.toggle("management-mode",Boolean(state.team));
  const onFlow = Boolean(state.team && state.flow);
  mainNav.hidden = !state.team;
  steps.hidden = !onFlow;
  teamBadge.innerHTML = state.team ? ui.mark(state.team.logo) + '<span><b>' + teamName() + '</b><small>我的球队</small></span>' : "";
  mainNav.innerHTML = state.team ? ui.navigation(state.view, onFlow) : "";
  steps.innerHTML = stages.map((label, index) => `<span class="step ${index === state.phase ? "current" : index < state.phase ? "done" : ""}" ${index === state.phase ? 'aria-current="step"' : ""}><b>${String(index+1).padStart(2,"0")}</b>${label}</span>`).join("");
  game.innerHTML = !state.team ? ui.wizard(state,button,photo) : onFlow ? [draftScreen, contractScreen, lineupScreen, gameScreen][state.phase]() : ui.dashboard(state,{button,photo,roster,players,money,progress:progression,prospects,rating,practicePlayer,tactics});
  if (!state.team) ui.filterOpeningLogos(game,state.setup);
  if (focus) {
    game.focus();
    window.scrollTo(0, 0);
  }
}

function draftScreen() {
  const current = prospects[state.selected];
  const scouted = state.scouted.includes(state.selected);
  const cards = Object.entries(prospects).map(([id, p]) =>
    `<button type="button" class="card" data-action="select" data-value="${id}" aria-pressed="${id === state.selected}" ${state.draft ? "disabled" : ""}>
      ${photo(id)}<b>${p.name}</b><small>${p.school} · ${p.pos}</small><small class="rating">即战力 ${p.ovr} · ${p.style}</small>
    </button>`).join("");
  return `<section class="hero">
    ${photo(state.team.star,"hero-photo")}
    <div class="hero-body"><span class="eyebrow">2025 DRAFT NIGHT</span><h1>选秀之夜</h1><p>达拉斯已选中库珀·弗拉格。现在，轮到你用榜眼签为${teamName()}挑一位新秀。</p><span class="pick">首轮第 2 顺位 · ${teamName()}</span></div>
  </section>
  <div class="panel-head"><h2>新秀看板</h2><span class="muted">球探名额 ${2-state.scouted.length} / 2</span></div>
  <div class="cards">${cards}</div>
  <section class="report ${state.draft ? "reveal" : ""}">
    <h3>${state.draft ? teamName() + "选中 " : ""}${current.name} ${state.draft ? '<span class="stamp">榜眼</span>' : ""}</h3>
    <p class="muted">${current.en} · ${current.style} · 潜力 ${scouted ? current.range.join("–") : "待球探评估"}</p>
    <p>${scouted ? current.report : "使用球探名额查看潜力区间和战术适配。"}</p>
  </section>
  <div class="actions">${state.draft ? button("进入合同中心", "next", {primary:true}) : button(scouted ? "已完成试训" : "安排球探试训","scout",{disabled:scouted || state.scouted.length >= 2}) + button("用榜眼签选中他","draft",{primary:true})}</div>`;
}

const money = value => "$" + value.toFixed(1) + "M";
const cap = [154.6, 165.4];


function rosterPayroll(index=0) {
  return [...state.openingRoster,...state.meta.signed].reduce((sum,id)=>{
    const p=players[id];
    return sum+(index===0?p.salary:p.next??(p.years===1?0:p.salary));
  },0);
}

function marketPayroll() {
  return rosterPayroll()+(state.draft?prospects[state.draft].salary:0)+(state.veteran?.kind==="signed"?state.veteran.offer.amount:0);
}

function budget(index) {
  const rookie = prospects[state.draft];
  const projected = index > 0 ? rookie.salary * 1.05 : rookie.salary;
  const offer = state.veteran?.kind === "signed" ? state.veteran.offer : state.offer;
  const veteran = state.veteran?.kind === "released" || index >= offer.years ? 0 : offer.amount;
  const payroll = rosterPayroll(index);
  const used=payroll+projected+veteran;
  return {space:cap[index]-used,used};
}

function ledger() {
  return `<div class="ledger">${cap.map((limit,index) => {
    const {space,used} = budget(index);
    return `<div><small class="muted">${index === 0 ? "2025–26" : "2026–27"} · 预计空间</small>
      <strong class="${space < 0 ? "over" : ""}">${space < 0 ? "超帽 " + money(-space) : money(space)}</strong>
      <meter min="0" max="${limit}" value="${Math.min(used,limit)}" aria-label="${index ? "下赛季" : "本赛季"}工资帽使用"></meter>
      <small class="muted">${money(used)} / ${money(limit)}</small></div>`;
  }).join("")}</div>`;
}

function contractScreen() {
  const rookie = prospects[state.draft];
  const stopped = Boolean(state.veteran);
  const years = state.offer.years;
  return `<div class="intro"><span class="eyebrow">FRONT OFFICE</span><h1>合同中心</h1><p>先锁定榜眼，再决定是否留下克里斯·保罗。</p></div>
  <section class="panel"><h3>${rookie.name} · 榜眼合同</h3><p class="muted">首年 ${money(rookie.salary)} · 前两年保障 · 后两年球队选项</p>
  <div class="actions">${state.rookieSigned ? '<span class="stamp">已签约</span>' : button("签署新秀合同","sign-rookie",{primary:true})}</div></section>
  <section class="panel"><h3>克里斯·保罗 · ${stopped ? (state.veteran.kind === "signed" ? "续约完成" : "进入自由市场") : "续约谈判"}</h3>
  <p class="muted">${stopped ? "工资表已计入你的决定。" : "球员优先考虑保障年限，也看重能自己决定去留的选项。"}</p>
  ${stopped ? (state.veteran.kind === "signed" ? `<p>${money(state.veteran.offer.amount)} / 年 · ${state.veteran.offer.years} 年${state.veteran.offer.option === "none" ? "" : state.veteran.offer.option === "team" ? " · 末年球队选项" : " · 末年球员选项"} <span class="stamp">已签约</span></p>` : "") :
  `<div class="form"><label>年薪 <strong id="amount-label">${money(state.offer.amount)}</strong><input id="amount" type="range" min="3" max="15" step=".5" value="${state.offer.amount}"></label>
  <label>年限<select id="years">${[1,2,3].map(y=>`<option value="${y}" ${y===years?"selected":""}>${y} 年</option>`).join("")}</select></label>
  <label>末年选项<select id="option" ${years===1?"disabled":""}>${[["none","无选项"],["team","球队选项"],["player","球员选项"]].map(([id,name])=>`<option value="${id}" ${state.offer.option===id?"selected":""}>${name}</option>`).join("")}</select></label></div>
  <p id="negotiation" role="status">${state.counter || ""}</p><div class="actions">${button("放走球员","release")}${button("提交续约报价","offer",{primary:true})}</div>`}
  <div id="ledger">${ledger()}</div>
  <p class="muted">采用试玩薪资参数。预计空间按建队阵容、新秀合同和当前续约报价计算。</p></section>
  <div class="actions">${button("确认阵容","next",{primary:true,disabled:!state.rookieSigned || !state.veteran})}</div>`;
}

function offerContract() {
  const {amount,years,option} = state.offer;
  let minimum = years === 1 ? 9 : 7.5;
  if (option === "player") minimum -= 1;
  if (option === "team") minimum += 1;
  if (budget(0).space < 0 || budget(1).space < 0) {
    state.counter = "报价超出试玩工资帽。请降低年薪或调整年限。";
  } else if (amount < minimum) {
    state.counter = `经纪人还价：按这个年限和选项，至少需要 ${money(minimum)} / 年。`;
  } else {
    state.veteran = {kind:"signed", offer:{...state.offer}};
    delete state.counter;
  }
}

function roster() {
  const base = [...state.openingRoster,...state.meta.signed];
  if (state.rookieSigned) base.push(state.draft);
  if (state.veteran?.kind === "signed") base.push("paul");
  return base;
}

function lineupScreen() {
  const starters = Object.values(state.starters);
  const list = [...starters,...roster().filter(id => !starters.includes(id))];
  return `<div class="intro"><span class="eyebrow">STARTING FIVE</span><h1>安排揭幕战首发</h1><p>换人会影响比赛强度和最后一攻。你可以让榜眼从第一场开始首发。</p></div>
  <section class="panel"><h3>${teamName()}</h3>${list.map(id=>{
    const p=players[id], on=starters.includes(id);
    return `<div class="row">${photo(id,"mini-photo")}<div class="player-text"><b>${p.name} ${id===state.draft ? " · 新秀" : ""}</b><small>${p.pos} · ${p.style} · 能力 ${rating(id)}</small><small>${id === "paul" ? money(state.veteran.offer.amount) + " / 年 · " + state.veteran.offer.years + " 年" : money(p.salary) + " / 年 · " + (p.deal || "新秀合同")}</small></div>
    ${on ? `<span class="muted">首发 ${p.pos}</span>` : `<button type="button" class="btn starter" data-action="start" data-value="${id}">设为首发</button>`}</div>`;
  }).join("")}</section><div class="actions">${button("进入揭幕战","next",{primary:true})}</div>`;
}

function scoreFor(tactic) {
  const starters = Object.values(state.starters);
  const overall = starters.reduce((sum,id)=>sum+rating(id),0)/starters.length;
  const lead = players[state.starters.PG];
  const targetId=state.starters[tactic === "kick" ? "SG" : tactic === "roll" ? "C" : "PG"];
  const target = players[targetId];
  const bonus = tactic === "kick" ? (target.style.includes("投射") ? 6 : 2) : tactic === "roll" ? 7 : 0;
  const coachBonus = ops.coaches[state.meta.coach]?.tactic===tactic ? .04 : 0;
  const chance = Math.max(.2, Math.min(.83, .38 + coachBonus + (overall-80)*.012 + (rating(state.starters.PG)-80)*.008 + (rating(targetId)-80)*.009 + bonus*.016));
  const made = Math.random() < chance;
  const points = made ? (tactic === "kick" ? 3 : 2) : 0;
  const homeBefore = scoreForDisplay();
  const awayBefore = homeBefore + 1;
  const opponent=ops.schedule(state)[0].team;
  const finish = made ? `${target.name}命中${points===3?"三":"两"}分，${teamName()}锁定胜局。` : `${target.name}的出手偏出，${ui.teamCity(opponent.id)}守住领先。`;
  const setup = tactic === "roll" ? `${lead.name}借掩护推进，把球传给顺下的${target.name}。` : tactic === "kick" ? `${lead.name}突破吸引协防，分球给底角的${target.name}。` : `${lead.name}拉开空间，面对换防出手。`;
  return {opponent:opponent.id,homeBefore,awayBefore,home:homeBefore+points,away:awayBefore,setup,finish,made,points,assist:made && tactic!=="iso" ? lead.name : ""};
}

function court() {
  const lineup=state.result?.lineup||state.starters;
  const pg=players[lineup.PG], sg=players[lineup.SG], c=players[lineup.C];
  return `<div class="court" aria-hidden="true"><span id="point-pg" class="dot" style="left:48%;top:80%">${pg.num}</span><span id="point-sg" class="dot" style="left:83%;top:36%">${sg.num}</span><span id="point-c" class="dot" style="left:59%;top:52%">${c.num}</span><span class="dot def" style="left:46%;top:52%">D</span><span class="dot def" style="left:72%;top:36%">D</span><span id="ball" class="ball" style="left:49%;top:72%"></span></div>`;
}

function gameScreen() {
  const result = state.result;
  const opponent=ops.schedule(state)[0].team;
  const opponentName=ui.teamCity(opponent.id)+opponent.name;
  const playing = Boolean(replay);
  const before = result || {homeBefore:scoreForDisplay(),awayBefore:scoreForDisplay()+1};
  const home = result && !playing ? result.home : before.homeBefore;
  const away = result && !playing ? result.away : before.awayBefore;
  return `<div class="intro"><span class="eyebrow">OPENING NIGHT</span><h1>揭幕战 · 最后一攻</h1><p>${opponentName}领先 1 分。末节还剩 12 秒，你有一次出手机会。</p></div>
  <section class="scoreboard"><span class="muted">${result && !playing ? "全场结束" : "第四节 · 00:12"}</span>
  <div class="line-score"><span>${teamName()}</span><span>${opponentName}</span></div><div class="boxscore"><b>${home}</b><b>:</b><b>${away}</b></div>${court()}</section>
  ${result ? `<section class="report" role="status"><h3>${playing ? "回合进行中" : result.made ? teamName() + "赢下揭幕战" : ui.teamCity(opponent.id)+"赢下揭幕战"}</h3>
  <p>${result.setup}</p>${playing ? "" : `<p>${result.finish}${result.assist ? ` 助攻：${result.assist}。` : ""}</p>`}</section>
  <div class="actions">${playing ? button("跳过回放","skip") : button("返回联盟","tab",{value:"league",primary:true})}</div>`
  : `<div class="cards tactics">${Object.entries(tactics).map(([id,t])=>`<button type="button" class="tactic" data-action="tactic" data-value="${id}" aria-pressed="${id===state.tactic}"><b>${t.name}</b><small>${t.subtitle}</small></button>`).join("")}</div>
  <div class="actions">${button("返回首发调整","back")}${button("执行最后一攻","play",{primary:true})}</div>`}`;
}

function scoreForDisplay() {
  const overall=Object.values(state.starters).reduce((sum,id)=>sum+rating(id),0)/positions.length;
  return Math.round(101+(overall-84)*.35);
}

function endReplay() {
  if (!replay) return;
  clearTimeout(replay.timer);
  replay = null;
  render();
  announce(state.result.finish);
}

function play() {
  if (state.result || replay) return;
  state.result = {...scoreFor(state.tactic),lineup:{...state.starters}};
  state.meta.seasonOrigin=state.meta.day;
  state.meta.seasonClub=state.team.logo;
  state.meta.reputation += state.result.made ? 8 : 2;
  save();
  if (reduced.matches || !Element.prototype.animate) {
    render();
    announce(state.result.finish);
    return;
  }
  replay = {timer:setTimeout(endReplay,1750)};
  render();
  const route = state.tactic==="roll" ? [["49%","72%"],["47%","46%"],["52%","29%"]] : state.tactic==="kick" ? [["49%","72%"],["44%","42%"],["83%","36%"]] : [["49%","72%"],["39%","53%"],["44%","36%"]];
  document.querySelector("#point-pg").animate([{left:"48%",top:"80%"},{left:route[1][0],top:route[1][1]}],{duration:700,fill:"forwards"});
  if (state.tactic==="roll") document.querySelector("#point-c").animate([{left:"59%",top:"52%"},{left:"52%",top:"29%"}],{duration:850,fill:"forwards"});
  document.querySelector("#ball").animate([...route,[ "50%",state.result.made ? "9%" : "17%" ]].map(([left,top])=>({left,top})),{duration:1450,fill:"forwards"});
}

function showDialog(title, content) {
  dialog.innerHTML=`<h2 id="dialog-title">${title}</h2>${content}`;
  if (!dialog.open) dialog.showModal();
}

const actions = {
  "advance-day"() { advanceDay(); },
  "training-drill"(id) { if (Object.hasOwn(ops.drills,id)) state.drill=id; },
  "training-tactic"(id) { if (Object.hasOwn(tactics,id)) state.tactic=id; },
  train() {
    if (state.meta.energy<2) return;
    const id=practicePlayer();
    const cap=id===state.team.star?99:84;
    if (rating(id)>=cap) return;
    const sessions=(state.meta.training[id]??={});
    sessions[state.drill]=(sessions[state.drill]||0)+1;
    state.meta.energy-=2;
    announce(players[id].name+" 完成"+ops.drills[state.drill]);
  },
  "toggle-team-logo"() { state.logoSettings=!state.logoSettings; },
  "update-team-logo"(id) {
    if (state.team && Object.hasOwn(ui.marks,id)) {
      state.team.logo=id;
      if (state.team.cityNamed) state.team.name=ui.teamCity(id);
    }
  },
  "market-tab"(id) { if (Object.hasOwn(ops.marketTabs,id)) state.marketTab=id; },
  conference(id) { if (["all","E","W"].includes(id)) state.conference=id; },
  "choose-logo"(id) { if (Object.hasOwn(ui.marks,id)) state.setup.logo=id; },
  "opening-region"(id) { if (["all","E","W"].includes(id)) state.setup.region=id; },
  "choose-star"(id) { if (Object.hasOwn(ui.stars,id)) state.setup.star=id; },
  "setup-back"() { state.setup.step=1; },
  "setup-next"() { if (state.setup.logo) state.setup.step=2; },
  "create-team"() {
    const {logo,star}=state.setup;
    if (!logo || !star || state.team) return;
    state.team={name:ui.teamCity(logo),logo,star,cityNamed:true};
    Object.assign(state,allocateRoster(star));
    state.view="office";
  },
  tab(id) {
    if (!state.team || !Object.hasOwn(ui.tabs,id)) return;
    if (replay) {
      clearTimeout(replay.timer);
      replay=null;
    }
    state.view=id;
    state.flow=false;
  },
  "open-flow"(value) {
    const phase=Number(value);
    if (!state.team || !Number.isInteger(phase) || phase<0 || phase>3) return;
    if (phase===1 && !state.draft) return;
    if (phase>=2 && (!state.rookieSigned || !state.veteran)) return;
    state.phase=phase;
    state.flow=true;
  },
  "dashboard-start"(id) {
    if (roster().includes(id)) state.starters[players[id].pos]=id;
  },
  select(id) { if (!state.draft && prospects[id]) state.selected=id; },
  scout() { if (!state.draft && state.scouted.length<2 && !state.scouted.includes(state.selected)) state.scouted.push(state.selected); },
  draft() { if (!state.draft) state.draft=state.selected; },
  next() {
    const ready = [Boolean(state.draft),state.rookieSigned && Boolean(state.veteran),true];
    if (ready[state.phase]) {
      if (state.phase===2) state.lineupReady=true;
      state.phase++;
    }
  },
  "sign-rookie"() { state.rookieSigned=true; },
  release() { if (!state.veteran) state.veteran={kind:"released"}; },
  offer() { if (!state.veteran) offerContract(); },
  start(id) { if (!state.result && roster().includes(id)) state.starters[players[id].pos]=id; },
  back() { if (!state.result) state.phase=2; },
  tactic(id) { if (tactics[id] && !state.result) state.tactic=id; }
};

document.addEventListener("click",event=>{
  const target=event.target.closest("button[data-action]");
  if (!target || target.disabled) return;
  const {action,value}=target.dataset;
  if (action==="play") return play();
  if (action==="skip") return endReplay();
  if (action==="close") return dialog.close();
  if (["market-detail","player-detail","team-detail","market-watch","market-sign"].includes(action)) {
    const context={button,photo,prospects,players,money,roster,mark:ui.mark,escape:ui.escape,payroll:marketPayroll,cap:cap[0],rating};
    if (action==="market-watch" && (ops.free[value]||ops.coaches[value]||prospects[value])) {
      const at=state.meta.watch.indexOf(value);
      if (at<0) state.meta.watch.push(value);
      else state.meta.watch.splice(at,1);
      save();
      render();
    }
    if (action==="market-sign") {
      const coach=ops.coaches[value];
      const p=coach||ops.free[value];
      if (p && state.meta.energy>=2 && state.meta.cash>=p.salary && !(coach ? state.meta.coach===value : state.meta.signed.includes(value)||marketPayroll()+p.salary>cap[0])) {
        if (coach) state.meta.coach=value;
        else state.meta.signed.push(value);
        state.meta.energy-=2;
        state.meta.cash-=p.salary;
        state.meta.reputation+=2;
        save();
        render();
        announce(p.name+"已签约");
      }
    }
    const detail=action==="team-detail"?ops.teamDetail(state,value,context):action==="player-detail"?ui.playerDetail(state,value,context):ui.marketDetail(state,value,context);
    if (detail) showDialog(detail.title,detail.content);
    return;
  }
  if (action==="open-flow" && dialog.open) dialog.close();
  if (action==="credits") {
    showDialog("素材来源",`<ul>
      <li>NBA 队标和球员头像来自 <a href="https://www.nba.com/teams" target="_blank" rel="noopener">NBA</a>，联盟球员及主教练名单来自 <a href="https://www.espn.com/nba/teams" target="_blank" rel="noopener">ESPN</a> 名单快照。</li>
      <li>文班亚马 · Frenchieinportland · <a href="https://commons.wikimedia.org/wiki/File:Victor_Wembanyama_San_Antonio_Spurs_2024.jpg" target="_blank" rel="noopener">原图</a> · <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener">CC BY 4.0</a></li>
      <li>哈珀 · Petsbikes · <a href="https://commons.wikimedia.org/wiki/File:Dylan_Harper_in_2026_(cropped).jpg" target="_blank" rel="noopener">原图</a> · <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener">CC BY-SA 4.0</a></li>
      <li>埃奇库姆 · SneakinDeacon · <a href="https://commons.wikimedia.org/wiki/File:V._J._Edgecombe_Baylor_2025_(cropped).jpg" target="_blank" rel="noopener">原图</a> · <a href="https://creativecommons.org/licenses/by-sa/2.0/" target="_blank" rel="noopener">CC BY-SA 2.0</a></li>
      <li>亚历山大 · All-Pro Reels · <a href="https://commons.wikimedia.org/wiki/File:Shai_Gilgeous-Alexander_(51815871018)_(cropped).jpg" target="_blank" rel="noopener">原图</a> · <a href="https://creativecommons.org/licenses/by-sa/2.0/" target="_blank" rel="noopener">CC BY-SA 2.0</a></li>
      <li>爱德华兹 · CCS Pictures · <a href="https://commons.wikimedia.org/wiki/File:Anthony_Edwards_(cropped).jpg" target="_blank" rel="noopener">原图</a> · <a href="https://creativecommons.org/licenses/by-sa/2.0/" target="_blank" rel="noopener">CC BY-SA 2.0</a></li>
      <li>杰伦·布朗 · All-Pro Reels · <a href="https://commons.wikimedia.org/wiki/File:Jaylen_Brown_2022.jpg" target="_blank" rel="noopener">原图</a> · <a href="https://creativecommons.org/licenses/by-sa/2.0/" target="_blank" rel="noopener">CC BY-SA 2.0</a></li>
      <li>阿德托昆博 · All-Pro Reels · <a href="https://commons.wikimedia.org/wiki/File:Giannis_Antetokounmpo_(51664127127)_(cropped).jpg" target="_blank" rel="noopener">原图</a> · <a href="https://creativecommons.org/licenses/by-sa/2.0/" target="_blank" rel="noopener">CC BY-SA 2.0</a></li>
    </ul><p>照片在界面中按比例裁切显示。建队球星照片已缩小。<a href="https://www.nba.com/draft/2025/draft-board" target="_blank" rel="noopener">2025 NBA 官方选秀看板</a></p>${button("关闭","close")}`);
    return;
  }
  if (action==="reset") {
    showDialog("重新开档？",`<p>当前浏览器中的这份试玩进度将被替换。</p><div class="actions">${button("取消","close")}${button("确认重开","reset-confirm",{primary:true})}</div>`);
    return;
  }
  if (action==="reset-confirm") {
    if (replay) clearTimeout(replay.timer);
    replay=null;
    state=initial();
    save();
    dialog.close();
    render(true);
    return;
  }
  if (!Object.hasOwn(actions,action)) return;
  const previousScreen=[state.phase,state.setup.step,state.view,state.flow,Boolean(state.team)].join();
  actions[action](value);
  save();
  const screenChanged=previousScreen!==[state.phase,state.setup.step,state.view,state.flow,Boolean(state.team)].join();
  render(screenChanged);
  if (!screenChanged) {
    const next=Array.from(game.querySelectorAll("button[data-action]")).find(el=>el.dataset.action===action && el.dataset.value===value && !el.disabled);
    if (next) next.focus({preventScroll:true});
    else game.querySelector(".actions .primary:not(:disabled)")?.focus({preventScroll:true});
  }
});

game.addEventListener("input",event=>{
  if (event.target.id==="opening-team-search") {
    state.setup.query=event.target.value;
    ui.filterOpeningLogos(game,state.setup);
    return;
  }
  if (event.target.id!=="amount") return;
  state.offer.amount=Number(event.target.value);
  delete state.counter;
  document.querySelector("#amount-label").textContent=money(state.offer.amount);
  document.querySelector("#negotiation").textContent="";
  document.querySelector("#ledger").innerHTML=ledger();
  save();
});

game.addEventListener("change",event=>{
  const id=event.target.id;
  if (id==="practice-player") {
    if (roster().includes(event.target.value)) state.practicePlayer=event.target.value;
    save();
    render();
    game.querySelector("#practice-player")?.focus();
    return;
  }
  if (id!=="years" && id!=="option") return;
  if (id==="years") {
    state.offer.years=Number(event.target.value);
    const select=document.querySelector("#option");
    select.disabled=state.offer.years===1;
    if (select.disabled) state.offer.option=select.value="none";
  } else state.offer.option=event.target.value;
  delete state.counter;
  document.querySelector("#negotiation").textContent="";
  document.querySelector("#ledger").innerHTML=ledger();
  save();
});

game.addEventListener("load",event=>{
  if (event.target instanceof HTMLImageElement) event.target.classList.add("is-loaded");
},true);

game.addEventListener("error",event=>{
  if (event.target instanceof HTMLImageElement) event.target.hidden=true;
},true);

render();
})();