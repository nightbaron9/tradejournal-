// ── SIDEBAR ───────────────────────────────────────────────────────────────────
function toggleSidebar() { document.getElementById('sidebar').classList.toggle('collapsed'); }
function toggleMobileSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('mobile-overlay');
  sidebar.classList.toggle('mobile-open');
  overlay.classList.toggle('visible');
}
function closeMobileSidebar() {
  document.getElementById('sidebar').classList.remove('mobile-open');
  document.getElementById('mobile-overlay').classList.remove('visible');
}

// ── NAVIGATION ────────────────────────────────────────────────────────────────
const TITLES = { dashboard:'Dashboard', tradelog:'Trade Log', positions:'Open Positions', analytics:'Analytics', journal:'Notes & Journal', settings:'Settings' };
function navigate(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('screen-'+id).classList.add('active');
  document.querySelector(`.nav-item[data-screen="${id}"]`).classList.add('active');
  document.getElementById('topbar-title').textContent = TITLES[id];
  if (id === 'analytics') setTimeout(renderAnalytics, 50);
  if (id === 'journal') {
    jnlVy = vy; jnlVm = vm;
    setTimeout(renderJournal, 20);
  }
  // Close mobile sidebar on navigation
  closeMobileSidebar();
}

let activePeriod = 'mtd'; // 'mtd' | 'ytd' | 'all'
document.querySelectorAll('.period-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.period-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    activePeriod = this.dataset.period || this.textContent.trim().toLowerCase();
    refreshAllScreens();
  });
});
function refreshAllScreens() {
  renderWidgets();
  renderCal();
  renderTrades();
  renderPositions();
  if (document.getElementById('screen-analytics').classList.contains('active')) renderAnalytics();
}
function getDateRange() {
  const now = new Date(2026, 2, 21); // today = Mar 21 2026
  if (activePeriod === 'mtd') return { start: '2026-03-01', end: '2026-03-21' };
  if (activePeriod === 'ytd') return { start: '2026-01-01', end: '2026-03-21' };
  return { start: '2025-01-01', end: '2026-03-21' }; // all
}
function inRange(dateStr) {
  const { start, end } = getDateRange();
  return dateStr >= start && dateStr <= end;
}

// ── TRADE LOG DATA ────────────────────────────────────────────────────────────
const trades = [
  {id:1, sym:'MSFT', date:'2026-03-03', time:'09:45', side:'long', entry:415.20, exit:427.44, qty:50,  pl:620,  tags:['momentum','open-gap'], notes:'Clean gap-and-go. Held to target.'},
  {id:2, sym:'AMD',  date:'2026-03-03', time:'11:20', side:'long', entry:178.40, exit:180.60, qty:100, pl:220,  tags:['momentum'], notes:''},
  {id:3, sym:'AAPL', date:'2026-03-04', time:'10:15', side:'long', entry:213.50, exit:211.40, qty:200, pl:-420, tags:['reversal'], notes:'Stopped out. Overextended entry.'},
  {id:4, sym:'NVDA', date:'2026-03-05', time:'09:32', side:'long', entry:878.10, exit:908.40, qty:30,  pl:910,  tags:['earnings-play','trend'], notes:'Post-earnings gap. Held full size.'},
  {id:5, sym:'META', date:'2026-03-05', time:'10:50', side:'long', entry:612.30, exit:628.80, qty:20,  pl:330,  tags:['trend'], notes:''},
  {id:6, sym:'SPY',  date:'2026-03-06', time:'14:10', side:'long', entry:561.20, exit:566.80, qty:50,  pl:280,  tags:['eod-fade'], notes:''},
  {id:7, sym:'QQQ',  date:'2026-03-06', time:'14:30', side:'long', entry:483.10, exit:490.60, qty:40,  pl:300,  tags:['eod-fade'], notes:''},
  {id:8, sym:'TSLA', date:'2026-03-09', time:'09:45', side:'short',entry:252.40, exit:270.00, qty:50,  pl:-880, tags:['chop'], notes:'Tried to short the squeeze too early.'},
  {id:9, sym:'AMZN', date:'2026-03-09', time:'11:00', side:'long', entry:196.80, exit:186.80, qty:30,  pl:-300, tags:['chop'], notes:'Bad read on the sector.'},
  {id:10,sym:'GOOG', date:'2026-03-10', time:'13:20', side:'long', entry:178.50, exit:181.30, qty:25,  pl: 70,  tags:['trend'], notes:'Small winner, slow day.'},
  {id:11,sym:'NVDA', date:'2026-03-11', time:'09:35', side:'long', entry:880.20, exit:910.20, qty:60,  pl:1800, tags:['momentum','high-vol'], notes:'AI announcement. Best trade of month.'},
  {id:12,sym:'AMD',  date:'2026-03-11', time:'09:55', side:'long', entry:178.00, exit:183.40, qty:100, pl:540,  tags:['momentum'], notes:'Rode the sector move with NVDA.'},
  {id:13,sym:'MSFT', date:'2026-03-12', time:'10:10', side:'long', entry:424.00, exit:434.50, qty:40,  pl:420,  tags:['trend'], notes:''},
  {id:14,sym:'META', date:'2026-03-12', time:'11:30', side:'long', entry:619.00, ext:641.67,  exit:641.67, qty:15, pl:340, tags:['trend'], notes:''},
  {id:15,sym:'RIVN', date:'2026-03-13', time:'09:40', side:'long', entry:11.80,  exit:8.35,   qty:200, pl:-690, tags:['small-cap'], notes:'Failed breakout. Cut loss quickly.'},
  {id:16,sym:'SPY',  date:'2026-03-16', time:'14:45', side:'long', entry:562.00, exit:566.80, qty:100, pl:480,  tags:['eod-fade'], notes:''},
  {id:17,sym:'AAPL', date:'2026-03-17', time:'09:50', side:'long', entry:211.00, exit:217.40, qty:100, pl:640,  tags:['momentum'], notes:''},
  {id:18,sym:'NVDA', date:'2026-03-17', time:'11:00', side:'long', entry:882.00, exit:905.00, qty:20,  pl:460,  tags:['momentum'], notes:''},
  {id:19,sym:'COIN', date:'2026-03-18', time:'10:30', side:'long', entry:218.40, exit:213.60, qty:50,  pl:-240, tags:['crypto'], notes:'Crypto sector weak all session.'},
  {id:20,sym:'JPM',  date:'2026-03-19', time:'13:00', side:'long', entry:241.00, exit:251.33, qty:30,  pl:310,  tags:['sector-rotation'], notes:''},
  {id:21,sym:'TSLA', date:'2026-03-20', time:'09:55', side:'long', entry:244.60, exit:265.00, qty:25,  pl:510,  tags:['momentum'], notes:''},
  {id:22,sym:'AMD',  date:'2026-03-20', time:'11:15', side:'long', entry:177.80, exit:182.93, qty:80,  pl:410,  tags:['momentum'], notes:''},
  // February 2026
  {id:23,sym:'AAPL', date:'2026-02-03', time:'10:10', side:'long', entry:228.40, exit:235.10, qty:80,  pl:536,  tags:['momentum'], notes:'Strong open on earnings follow-through.'},
  {id:24,sym:'NVDA', date:'2026-02-05', time:'09:40', side:'long', entry:855.00, exit:841.20, qty:40,  pl:-552, tags:['chop'], notes:'Failed breakout attempt.'},
  {id:25,sym:'SPY',  date:'2026-02-10', time:'14:20', side:'long', entry:557.80, exit:563.40, qty:60,  pl:336,  tags:['eod-fade'], notes:''},
  {id:26,sym:'MSFT', date:'2026-02-12', time:'10:05', side:'long', entry:418.60, exit:430.20, qty:35,  pl:406,  tags:['trend'], notes:''},
  {id:27,sym:'META', date:'2026-02-18', time:'09:50', side:'long', entry:698.40, exit:681.00, qty:20,  pl:-348, tags:['reversal'], notes:'Faded into earnings. Bad timing.'},
  {id:28,sym:'AMD',  date:'2026-02-20', time:'11:30', side:'long', entry:175.20, exit:181.80, qty:120, pl:792,  tags:['momentum'], notes:''},
  {id:29,sym:'QQQ',  date:'2026-02-24', time:'14:15', side:'long', entry:490.20, exit:496.60, qty:50,  pl:320,  tags:['eod-fade'], notes:''},
  {id:30,sym:'TSLA', date:'2026-02-26', time:'09:45', side:'short',entry:265.80, exit:251.40, qty:30,  pl:432,  tags:['reversal'], notes:'Perfect fade off resistance.'},
  // January 2026
  {id:31,sym:'NVDA', date:'2026-01-06', time:'09:35', side:'long', entry:842.00, exit:868.40, qty:25,  pl:660,  tags:['momentum'], notes:'New year momentum carry.'},
  {id:32,sym:'AAPL', date:'2026-01-08', time:'10:20', side:'long', entry:240.60, exit:233.80, qty:100, pl:-680, tags:['reversal'], notes:'Stopped out. Market reversed hard.'},
  {id:33,sym:'SPY',  date:'2026-01-13', time:'14:30', side:'long', entry:545.20, exit:552.10, qty:80,  pl:552,  tags:['trend'], notes:''},
  {id:34,sym:'MSFT', date:'2026-01-15', time:'10:00', side:'long', entry:410.40, exit:419.80, qty:50,  pl:470,  tags:['trend'], notes:''},
  {id:35,sym:'AMZN', date:'2026-01-20', time:'09:50', side:'long', entry:228.60, exit:240.20, qty:45,  pl:522,  tags:['momentum'], notes:'Strong breakout post-MLK.'},
  {id:36,sym:'GOOG', date:'2026-01-22', time:'11:10', side:'long', entry:195.40, exit:188.60, qty:60,  pl:-408, tags:['chop'], notes:'Choppy day. Should have sat out.'},
  {id:37,sym:'META', date:'2026-01-27', time:'09:45', side:'long', entry:680.20, exit:702.60, qty:25,  pl:560,  tags:['earnings-play'], notes:'Crushed earnings. Held overnight.'},
  {id:38,sym:'TSLA', date:'2026-01-29', time:'10:15', side:'long', entry:388.40, exit:404.20, qty:40,  pl:632,  tags:['momentum'], notes:''},
];

// ── FILTER / SORT STATE ───────────────────────────────────────────────────────
let filterState = { side: 'all', result: 'all', tag: 'all' };
let sortState = { col: 'date', dir: 'desc' };

function getFiltered() {
  const q = document.getElementById('tl-search-input').value.trim().toLowerCase();
  return trades.filter(t => {
    if (!inRange(t.date)) return false;
    if (q && !t.sym.toLowerCase().includes(q)) return false;
    if (filterState.side !== 'all' && t.side !== filterState.side) return false;
    if (filterState.result === 'win' && t.pl <= 0) return false;
    if (filterState.result === 'loss' && t.pl > 0) return false;
    if (filterState.tag !== 'all' && !(t.tags||[]).includes(filterState.tag)) return false;
    return true;
  });
}

function getSorted(list) {
  const { col, dir } = sortState;
  return [...list].sort((a, b) => {
    let va = a[col], vb = b[col];
    if (col === 'date') { va = a.date + a.time; vb = b.date + b.time; }
    if (col === 'sym') { va = a.sym; vb = b.sym; }
    if (typeof va === 'string') return dir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
    return dir === 'asc' ? va - vb : vb - va;
  });
}

function sortBy(col) {
  if (sortState.col === col) sortState.dir = sortState.dir === 'asc' ? 'desc' : 'asc';
  else { sortState.col = col; sortState.dir = 'desc'; }
  renderTrades();
}

function applyFilters() { renderTrades(); }

function setFilter(type, val, el, lblId, lblText) {
  event.stopPropagation();
  filterState[type] = val;
  document.getElementById(lblId).textContent = lblText;
  // update selected state
  el.closest('.filter-dd').querySelectorAll('.fd-item').forEach(i => i.classList.remove('selected'));
  el.classList.add('selected');
  // mark filter active
  const filterEl = el.closest('.tl-filter');
  filterEl.classList.toggle('active', val !== 'all');
  filterEl.classList.remove('dd-open');
  renderTrades();
}

function toggleFilterDD(id) {
  event.stopPropagation();
  const el = document.getElementById(id);
  const isOpen = el.classList.contains('dd-open');
  document.querySelectorAll('.tl-filter').forEach(f => f.classList.remove('dd-open'));
  if (!isOpen) el.classList.add('dd-open');
}
document.addEventListener('click', () => document.querySelectorAll('.tl-filter').forEach(f => f.classList.remove('dd-open')));

function fmt(v, short=false) {
  if (v === 0) return '$0';
  const abs = Math.abs(v);
  const s = short && abs >= 1000 ? '$' + (abs/1000).toFixed(abs%1000===0?0:2) + 'K' : '$' + abs.toLocaleString();
  return (v > 0 ? '+' : '-') + s;
}

function fmtPrice(p) { return p ? '$' + p.toFixed(2) : '—'; }

function formatDate(d) {
  const [y, m, day] = d.split('-');
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${months[+m-1]} ${+day}`;
}

function renderSummary(list) {
  const totalPL = list.reduce((s,t) => s + t.pl, 0);
  const wins = list.filter(t => t.pl > 0).length;
  const wr = list.length ? Math.round(wins/list.length*100) : 0;
  const avgWin = wins ? list.filter(t=>t.pl>0).reduce((s,t)=>s+t.pl,0)/wins : 0;
  const losses = list.filter(t => t.pl <= 0);
  const avgLoss = losses.length ? losses.reduce((s,t)=>s+t.pl,0)/losses.length : 0;
  document.getElementById('tl-summary').innerHTML = `
    <div class="tl-stat"><div class="tl-stat-lbl">Total P&L</div><div class="tl-stat-val ${totalPL>=0?'g':'r'}">${fmt(totalPL,true)}</div></div>
    <div class="tl-stat"><div class="tl-stat-lbl">Win rate</div><div class="tl-stat-val b">${wr}%</div></div>
    <div class="tl-stat"><div class="tl-stat-lbl">Trades</div><div class="tl-stat-val k">${list.length}</div></div>
    <div class="tl-stat"><div class="tl-stat-lbl">Avg win</div><div class="tl-stat-val g">${wins ? fmt(Math.round(avgWin)) : '—'}</div></div>
    <div class="tl-stat"><div class="tl-stat-lbl">Avg loss</div><div class="tl-stat-val r">${losses.length ? fmt(Math.round(avgLoss)) : '—'}</div></div>
  `;
}

function renderTrades() {
  const filtered = getFiltered();
  const sorted = getSorted(filtered);
  document.getElementById('tl-count').innerHTML = `<span>${filtered.length}</span> trade${filtered.length!==1?'s':''}`;
  renderSummary(filtered);

  // sort arrows
  ['sym','date','entry','exit','qty','pl'].forEach(c => {
    const el = document.getElementById('sort-'+c);
    if (!el) return;
    el.classList.remove('sorted');
    if (sortState.col === c) {
      el.textContent = sortState.dir === 'asc' ? '↑' : '↓';
      el.parentElement.classList.add('sorted');
    } else {
      el.textContent = '↕';
      el.parentElement.classList.remove('sorted');
    }
  });

  const tbody = document.getElementById('tl-tbody');
  if (!sorted.length) {
    tbody.innerHTML = `<tr><td colspan="9"><div class="tl-empty"><strong>No trades found</strong>Try adjusting your filters or search.</div></td></tr>`;
    return;
  }
  tbody.innerHTML = sorted.map(t => {
    const noteClass = t.notes ? 'has-note' : '';
    return `<tr>
      <td><div class="td-sym">${t.sym}</div></td>
      <td><div class="td-date">${formatDate(t.date)}</div><div class="td-time">${t.time}</div></td>
      <td><span class="td-side ${t.side}">${t.side === 'long' ? 'Long' : 'Short'}</span></td>
      <td><div class="td-price">${fmtPrice(t.entry)}</div></td>
      <td><div class="td-price">${fmtPrice(t.exit)}</div></td>
      <td><div class="td-qty">${t.qty}</div></td>
      <td><div class="td-pl ${t.pl>=0?'g':'r'}">${fmt(t.pl)}</div></td>
      <td><span class="td-result ${t.pl>0?'w':'l'}">${t.pl>0?'W':'L'}</span></td>
      <td><div class="td-note ${noteClass}">${t.notes || '—'}</div></td>
    </tr>`;
  }).join('');
}

// ── DASHBOARD WIDGETS ─────────────────────────────────────────────────────────
const WIN_RATE_IDS = new Set(['win_rate','long_wr','short_wr','green_days','kelly']);
function vizDonut(pct,color){const r=20,cx=24,cy=24,sw=4.5,circ=2*Math.PI*r,dash=(pct/100)*circ,gap=circ-dash;const hex=color==='g'?'#16a34a':color==='r'?'#dc2626':'#2563eb';const track=color==='g'?'#dcfce7':color==='r'?'#fee2e2':'#dbeafe';return`<svg width="48" height="48" viewBox="0 0 48 48"><circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${track}" stroke-width="${sw}"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${hex}" stroke-width="${sw}" stroke-dasharray="${dash.toFixed(2)} ${gap.toFixed(2)}" stroke-linecap="round" transform="rotate(-90 ${cx} ${cy})"/></svg>`;}
const STAT_GROUPS=[{label:'Performance',stats:[{id:'net_pl',label:'Net P&L',value:'+$4,230',color:'g',sub:'Mar 2026'},{id:'realized_pl',label:'Realized P&L',value:'+$4,230',color:'g',sub:'38 closed trades'},{id:'unrealized_pl',label:'Unrealized P&L',value:'+$1,698',color:'g',sub:'4 open positions'},{id:'profit_factor',label:'Profit factor',value:'2.91',color:'b',sub:'gross profit / loss'},{id:'expectancy',label:'Expectancy',value:'+$111',color:'g',sub:'per trade'},{id:'best_trade',label:'Best trade',value:'+$1,800',color:'g',sub:'NVDA · Mar 11'},{id:'worst_trade',label:'Worst trade',value:'-$880',color:'r',sub:'TSLA · Mar 9'},{id:'best_day',label:'Best day',value:'+$2,340',color:'g',sub:'Mar 11'},{id:'worst_day',label:'Worst day',value:'-$1,180',color:'r',sub:'Mar 9'}]},{label:'Trades',stats:[{id:'total_trades',label:'Total trades',value:'38',color:'k',sub:'Mar 2026'},{id:'closed_trades',label:'Closed trades',value:'38',color:'k',sub:'all exited'},{id:'open_trades',label:'Open trades',value:'4',color:'b',sub:'live positions'},{id:'avg_trade_pl',label:'Avg trade P&L',value:'+$111',color:'g',sub:'per closed trade'},{id:'avg_daily_pl',label:'Avg daily P&L',value:'+$326',color:'g',sub:'trading days only'},{id:'hold_time',label:'Avg hold time',value:'1h 22m',color:'k',sub:'per trade'}]},{label:'Win / Loss',stats:[{id:'win_rate',label:'Win rate',value:'62%',color:'b',sub:'24W / 14L',pct:62},{id:'avg_win',label:'Avg win',value:'+$347',color:'g',sub:'per winning trade'},{id:'avg_loss',label:'Avg loss',value:'-$182',color:'r',sub:'per losing trade'},{id:'largest_win',label:'Largest win',value:'+$1,800',color:'g',sub:'NVDA · Mar 11'},{id:'largest_loss',label:'Largest loss',value:'-$880',color:'r',sub:'TSLA · Mar 9'},{id:'payoff_ratio',label:'Payoff ratio',value:'1.91',color:'b',sub:'avg win / avg loss'}]},{label:'Risk',stats:[{id:'max_drawdown',label:'Max drawdown',value:'-$1,180',color:'r',sub:'Mar 9'},{id:'curr_drawdown',label:'Current drawdown',value:'$0',color:'k',sub:'at peak equity'},{id:'avg_rr',label:'Avg R multiple',value:'1.91R',color:'b',sub:'risk-reward ratio'}]},{label:'Consistency',stats:[{id:'green_days',label:'Green days',value:'77%',color:'g',sub:'10 of 13 days',pct:77},{id:'red_days',label:'Red days',value:'3',color:'r',sub:'23% of trading days'},{id:'consec_wins',label:'Longest win streak',value:'4',color:'g',sub:'consecutive days'},{id:'consec_losses',label:'Longest loss streak',value:'1',color:'r',sub:'consecutive days'},{id:'avg_win_day',label:'Avg winning day',value:'+$905',color:'g',sub:'per green day'},{id:'avg_loss_day',label:'Avg losing day',value:'-$703',color:'r',sub:'per red day'}]},{label:'Time',stats:[{id:'best_weekday',label:'Best weekday',value:'Thu',color:'g',sub:'+$3,440 avg'},{id:'worst_weekday',label:'Worst weekday',value:'Mon',color:'r',sub:'-$285 avg'},{id:'morning_pl',label:'Morning session',value:'+$3,120',color:'g',sub:'9:30–11:30'},{id:'midday_pl',label:'Midday session',value:'+$690',color:'g',sub:'11:30–14:00'},{id:'afternoon_pl',label:'Afternoon session',value:'+$420',color:'g',sub:'14:00–16:00'}]},{label:'Symbols',stats:[{id:'best_symbol',label:'Best symbol',value:'NVDA',color:'g',sub:'+$3,170 this month'},{id:'worst_symbol',label:'Worst symbol',value:'TSLA',color:'r',sub:'-$370 this month'},{id:'most_traded',label:'Most traded',value:'NVDA',color:'k',sub:'4 trades'}]},{label:'Long / Short',stats:[{id:'long_pl',label:'Long P&L',value:'+$5,410',color:'g',sub:'34 long trades'},{id:'short_pl',label:'Short P&L',value:'-$1,180',color:'r',sub:'4 short trades'},{id:'long_wr',label:'Long win rate',value:'68%',color:'b',sub:'23W / 11L',pct:68},{id:'short_wr',label:'Short win rate',value:'25%',color:'r',sub:'1W / 3L',pct:25}]},{label:'Advanced',stats:[{id:'sharpe',label:'Sharpe ratio',value:'1.84',color:'b',sub:'risk-adjusted return'},{id:'kelly',label:'Kelly %',value:'28%',color:'b',sub:'optimal position size',pct:28},{id:'sortino',label:'Sortino ratio',value:'2.31',color:'b',sub:'downside-adjusted'}]}];
let widgetSelections=['net_pl','win_rate','avg_win','unrealized_pl'];
const statById={};STAT_GROUPS.forEach(g=>g.stats.forEach(s=>{statById[s.id]=s;}));
function computeStats() {
  const pt = trades.filter(t => inRange(t.date));
  const wins = pt.filter(t=>t.pl>0), losses = pt.filter(t=>t.pl<=0);
  const totalPL = pt.reduce((s,t)=>s+t.pl,0);
  const wr = pt.length ? Math.round(wins.length/pt.length*100) : 0;
  const avgWin = wins.length ? Math.round(wins.reduce((s,t)=>s+t.pl,0)/wins.length) : 0;
  const avgLoss = losses.length ? Math.round(losses.reduce((s,t)=>s+t.pl,0)/losses.length) : 0;
  const days = [...new Set(pt.map(t=>t.date))];
  const dayPLs = days.map(d=>pt.filter(t=>t.date===d).reduce((s,t)=>s+t.pl,0));
  const greenDays = dayPLs.filter(p=>p>0).length;
  const avgDayPL = days.length ? Math.round(dayPLs.reduce((a,b)=>a+b,0)/days.length) : 0;
  const bestTrade = pt.length ? pt.reduce((a,b)=>b.pl>a.pl?b:a,pt[0]) : null;
  const worstTrade = pt.length ? pt.reduce((a,b)=>b.pl<a.pl?b:a,pt[0]) : null;
  const bestDayDate = dayPLs.length ? days[dayPLs.indexOf(Math.max(...dayPLs))] : null;
  const worstDayDate = dayPLs.length ? days[dayPLs.indexOf(Math.min(...dayPLs))] : null;
  const profitFactor = losses.length && losses.reduce((s,t)=>s+t.pl,0) !== 0
    ? Math.abs(wins.reduce((s,t)=>s+t.pl,0) / losses.reduce((s,t)=>s+t.pl,0)).toFixed(2) : '—';
  const expectancy = pt.length ? Math.round((wr/100)*avgWin + (1-wr/100)*avgLoss) : 0;
  const periodLabel = activePeriod==='mtd'?'Mar 2026':activePeriod==='ytd'?'YTD 2026':'All time';
  // Patch live stat values
  const patch = (id, val, sub) => { if(statById[id]){ statById[id].value=val; if(sub!==undefined) statById[id].sub=sub; }};
  patch('net_pl',      fmtC(totalPL,true), `${pt.length} trades · ${periodLabel}`);
  patch('realized_pl', fmtC(totalPL,true), `${pt.length} closed trades`);
  patch('total_trades',String(pt.length), periodLabel);
  patch('closed_trades',String(pt.length), 'all exited');
  patch('avg_trade_pl', fmtC(Math.round(totalPL/(pt.length||1))), 'per closed trade');
  patch('avg_daily_pl', fmtC(avgDayPL), 'trading days only');
  patch('win_rate', wr+'%', wins.length+'W / '+losses.length+'L'); statById['win_rate'].pct=wr;
  patch('avg_win', fmtC(avgWin), 'per winning trade');
  patch('avg_loss', fmtC(avgLoss), 'per losing trade');
  patch('green_days', Math.round(greenDays/(days.length||1)*100)+'%', greenDays+' of '+days.length+' days');
  statById['green_days'].pct = days.length ? Math.round(greenDays/days.length*100) : 0;
  if(bestTrade) patch('best_trade', fmtC(bestTrade.pl), bestTrade.sym+' · '+formatDate(bestTrade.date));
  if(worstTrade) patch('worst_trade', fmtC(worstTrade.pl), worstTrade.sym+' · '+formatDate(worstTrade.date));
  if(bestDayDate) { const bdpl=dayPLs[days.indexOf(bestDayDate)]; patch('best_day',fmtC(bdpl,true),formatDate(bestDayDate)); }
  if(worstDayDate) { const wdpl=dayPLs[days.indexOf(worstDayDate)]; patch('worst_day',fmtC(wdpl,true),formatDate(worstDayDate)); }
  patch('profit_factor', String(profitFactor), 'gross profit / loss');
  patch('expectancy', fmtC(expectancy), 'per trade');
  patch('max_drawdown', fmtC(Math.min(...dayPLs,0),true), dayPLs.length?formatDate(days[dayPLs.indexOf(Math.min(...dayPLs))]):'—');
}
function renderWidgets(){computeStats();const row=document.getElementById('widgets-row');row.innerHTML='';widgetSelections.forEach((sid,idx)=>{const s=statById[sid];const hd=WIN_RATE_IDS.has(sid)&&s.pct!==undefined;const w=document.createElement('div');w.className='widget';w.innerHTML=`<div class="wg-header" data-idx="${idx}"><span class="wg-lbl">${s.label}</span><span class="wg-arrow"><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span></div><div class="wg-body"><div class="wg-left"><div class="wg-val ${s.color}">${s.value}</div><div class="wg-sub">${s.sub}</div></div>${hd?`<div class="wg-viz">${vizDonut(s.pct,s.color)}</div>`:''}</div><div class="wg-dropdown">${buildDD(idx,sid)}</div>`;row.appendChild(w);});row.querySelectorAll('.wg-header').forEach(h=>{h.addEventListener('click',e=>{e.stopPropagation();const w=h.closest('.widget');const was=w.classList.contains('open');row.querySelectorAll('.widget').forEach(x=>x.classList.remove('open'));if(!was)w.classList.add('open');});});row.querySelectorAll('.dd-item').forEach(item=>{item.addEventListener('click',e=>{e.stopPropagation();widgetSelections[+item.dataset.idx]=item.dataset.id;renderWidgets();});});}
function buildDD(idx,selId){return STAT_GROUPS.map(g=>`<div class="dd-group-label">${g.label}</div>`+g.stats.map(s=>`<div class="dd-item${s.id===selId?' selected':''}" data-idx="${idx}" data-id="${s.id}">${s.label}</div>`).join('')).join('');}
document.addEventListener('click',()=>document.querySelectorAll('.widget.open').forEach(w=>w.classList.remove('open')));

// ── CALENDAR ─────────────────────────────────────────────────────────────────
const MONTHS=['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const today=new Date(2026,2,21);let vy=2026,vm=2,sel=null;
const calData={'2026-03-03':{pl:840,trades:[{sym:'MSFT',pl:620,desc:'Long 50 shares',time:'09:45'},{sym:'AMD',pl:220,desc:'Long 100 shares',time:'11:20'}],tags:['momentum','open-gap'],notes:'Clean gap-and-go on MSFT.'},'2026-03-04':{pl:-420,trades:[{sym:'AAPL',pl:-420,desc:'Long 200 shares',time:'10:15'}],tags:['reversal'],notes:'Stopped out.'},'2026-03-05':{pl:1240,trades:[{sym:'NVDA',pl:910,desc:'Long 30 shares',time:'09:32'},{sym:'META',pl:330,desc:'Long 20 shares',time:'10:50'}],tags:['earnings-play'],notes:'NVDA gapped post-earnings.'},'2026-03-06':{pl:580,trades:[{sym:'SPY',pl:280,desc:'Long 50 shares',time:'14:10'},{sym:'QQQ',pl:300,desc:'Long 40 shares',time:'14:30'}],tags:['eod-fade'],notes:''},'2026-03-09':{pl:-1180,trades:[{sym:'TSLA',pl:-880,desc:'Short 50 shares',time:'09:45'},{sym:'AMZN',pl:-300,desc:'Long 30 shares',time:'11:00'}],tags:['chop'],notes:'Painful squeeze.'},'2026-03-10':{pl:320,trades:[{sym:'GOOG',pl:320,desc:'Long 25 shares',time:'13:20'}],tags:['trend'],notes:''},'2026-03-11':{pl:2340,trades:[{sym:'NVDA',pl:1800,desc:'Long 60 shares',time:'09:35'},{sym:'AMD',pl:540,desc:'Long 100 shares',time:'09:55'}],tags:['momentum'],notes:'Best day this month.'},'2026-03-12':{pl:760,trades:[{sym:'MSFT',pl:420,desc:'Long 40 shares',time:'10:10'},{sym:'META',pl:340,desc:'Long 15 shares',time:'11:30'}],tags:['trend'],notes:''},'2026-03-13':{pl:-690,trades:[{sym:'RIVN',pl:-690,desc:'Long 200 shares',time:'09:40'}],tags:['small-cap'],notes:'Failed breakout.'},'2026-03-16':{pl:480,trades:[{sym:'SPY',pl:480,desc:'Long 100 shares',time:'14:45'}],tags:['eod-fade'],notes:''},'2026-03-17':{pl:1100,trades:[{sym:'AAPL',pl:640,desc:'Long 100 shares',time:'09:50'},{sym:'NVDA',pl:460,desc:'Long 20 shares',time:'11:00'}],tags:['momentum'],notes:''},'2026-03-18':{pl:-240,trades:[{sym:'COIN',pl:-240,desc:'Long 50 shares',time:'10:30'}],tags:['crypto'],notes:'Weak sector.'},'2026-03-19':{pl:310,trades:[{sym:'JPM',pl:310,desc:'Long 30 shares',time:'13:00'}],tags:['sector-rotation'],notes:''},'2026-03-20':{pl:920,trades:[{sym:'TSLA',pl:510,desc:'Long 25 shares',time:'09:55'},{sym:'AMD',pl:410,desc:'Long 80 shares',time:'11:15'}],tags:['momentum'],notes:''}};
function kk(y,m,d){return`${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;}
function fmtC(v,short=false){if(v===0)return'$0';const abs=Math.abs(v);const s=short&&abs>=1000?'$'+(abs/1000).toFixed(abs%1000===0?0:2)+'K':'$'+abs.toLocaleString();return(v>0?'+':'-')+s;}
function renderCal(){const body=document.getElementById('cal-body');body.innerHTML='';const fd=new Date(vy,vm,1).getDay(),dim=new Date(vy,vm+1,0).getDate(),dipm=new Date(vy,vm,0).getDate();document.getElementById('month-label').textContent=`${MONTHS[vm]} ${vy}`;let mpl=0,mdays=0;for(let d=1;d<=dim;d++){const k=kk(vy,vm,d);if(calData[k]){mpl+=calData[k].pl;mdays++;}}const hpl=document.getElementById('hdr-pl');hpl.textContent=fmtC(mpl,true);hpl.className='hsv '+(mpl>=0?'green':'red');document.getElementById('hdr-days').textContent=mdays+' days';let cells=[];for(let i=0;i<fd;i++)cells.push({d:dipm-fd+1+i,cur:false});for(let d=1;d<=dim;d++)cells.push({d,cur:true});while(cells.length%7!==0)cells.push({d:cells.length-fd-dim+1,cur:false});for(let w=0;w<cells.length/7;w++){const week=cells.slice(w*7,w*7+7);let wpl=0,wdays=0;week.forEach(c=>{if(c.cur){const k=kk(vy,vm,c.d);if(calData[k]){wpl+=calData[k].pl;wdays++;}}});const row=document.createElement('div');row.className='week-row';week.forEach(c=>{const cell=document.createElement('div');const k=c.cur?kk(vy,vm,c.d):null,d=k?calData[k]:null;const isT=c.cur&&vy===today.getFullYear()&&vm===today.getMonth()&&c.d===today.getDate();const isFut=c.cur&&new Date(vy,vm,c.d)>today;const isWk=[0,6].includes(new Date(vy,vm,c.d).getDay());const isC=c.cur&&!isFut&&!isWk;let cls='cal-cell';if(!c.cur)cls+=' other';else if(d&&d.pl>0)cls+=' win';else if(d&&d.pl<0)cls+=' loss';if(isC)cls+=' clickable';if(k&&k===sel)cls+=' selected';cell.className=cls;const dn=document.createElement('div');dn.className='dn';if(isT){const s=document.createElement('span');s.className='dn-today';s.textContent=c.d;dn.appendChild(s);}else dn.textContent=c.d;cell.appendChild(dn);if(d&&c.cur&&!isFut){const pl=document.createElement('div');pl.className='day-pl '+(d.pl>=0?'g':'r');pl.textContent=fmtC(d.pl,true);cell.appendChild(pl);const meta=document.createElement('div');meta.className='day-meta';const wins=d.trades.filter(t=>t.pl>0).length;meta.innerHTML=`${d.trades.length} trade${d.trades.length>1?'s':''}<br><span class="day-wr">${Math.round(wins/d.trades.length*100)}%</span>`;cell.appendChild(meta);if(d.notes){const ni=document.createElement('div');ni.className='note-icon';ni.innerHTML='<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 2h8v7l-2 1H2V2z" stroke="currentColor" stroke-width="1.1" stroke-linejoin="round"/><path d="M4 5h4M4 7h2" stroke="currentColor" stroke-width="1" stroke-linecap="round"/></svg>';cell.appendChild(ni);}}if(isC)cell.addEventListener('click',()=>selectDay(k,c.d));row.appendChild(cell);});const wc=document.createElement('div');wc.className='wcol-cell';const pc=wpl>0?'g':wpl<0?'r':'z';wc.innerHTML=`<div class="wk-lbl">Week ${w+1}</div><div class="wk-pl ${pc}">${wdays>0?fmtC(wpl,true):'$0'}</div><div class="wk-days">${wdays} day${wdays!==1?'s':''}</div>`;row.appendChild(wc);body.appendChild(row);}}

const jnlData = {
  '2026-03-03': { mood:4, confidence:75, tags:['momentum','open-gap'], note:'Strong open. MSFT gapped clean and I caught it early. AMD was a secondary play off the same sector move — took it on the retest. Felt in control all morning, didn\'t overtrade.', lessons:'Wait for the retest on secondary names — don\'t chase the first move.', trades:['MSFT','AMD'] },
  '2026-03-04': { mood:2, confidence:40, tags:['reversal'], note:'Stopped out on AAPL. Entry was too extended — I knew it but took the trade anyway. Need to respect the rules on overextended entries.', lessons:'Don\'t trade extended setups just because they\'ve been working.', trades:['AAPL'] },
  '2026-03-05': { mood:5, confidence:90, tags:['earnings-play','trend'], note:'NVDA earnings gap was exactly what I planned. Held full size through the move and took profit into resistance. META was a clean follow-through. Best planned day of the month so far.', lessons:'Pre-planning earnings setups pays off. Trust the plan.', trades:['NVDA','META'] },
  '2026-03-06': { mood:3, confidence:60, tags:['eod-fade'], note:'Slow day until the afternoon. SPY and QQQ both faded into close as expected. Nothing exciting but executed cleanly.', lessons:'', trades:['SPY','QQQ'] },
  '2026-03-09': { mood:1, confidence:30, tags:['chop'], note:'Terrible day. Tried to short TSLA into a squeeze — horrible timing. Then revenge traded AMZN and lost again. Should have stopped after the TSLA loss. Two bad decisions in one day.', lessons:'Stop after two losses. Revenge trading is the fastest way to blow up a good month.', trades:['TSLA','AMZN'] },
  '2026-03-10': { mood:3, confidence:55, tags:['trend'], note:'Small GOOG win. Slow day, not much happening. Sat on hands most of the session which was the right call.', lessons:'Sitting on hands is a position too.', trades:['GOOG'] },
  '2026-03-11': { mood:5, confidence:95, tags:['momentum','high-vol'], note:'NVDA AI announcement. This was the best trade of the month. Had conviction, sized up, held through the move. AMD followed. Felt dialed in all session — this is what preparation looks like.', lessons:'When you have conviction and the tape confirms it, hold the full position.', trades:['NVDA','AMD'] },
  '2026-03-12': { mood:4, confidence:70, tags:['trend'], note:'Solid follow-through day. MSFT and META both continued the upward trend from yesterday. Clean execution, no complaints.', lessons:'', trades:['MSFT','META'] },
  '2026-03-13': { mood:2, confidence:45, tags:['small-cap'], note:'RIVN failed the breakout. Cut the loss quickly which I\'m proud of — but the trade was low quality. Need to avoid small-cap breakouts without strong sector support.', lessons:'Small-cap breakouts need sector tailwind. Standalone setups are lower quality.', trades:['RIVN'] },
  '2026-03-16': { mood:3, confidence:60, tags:['eod-fade'], note:'EOD SPY fade worked again. Uneventful but profitable. These setups are consistent.', lessons:'', trades:['SPY'] },
  '2026-03-17': { mood:4, confidence:75, tags:['momentum'], note:'AAPL and NVDA both ran cleanly. Good execution, right sizing. Momentum still strong in the market.', lessons:'', trades:['AAPL','NVDA'] },
  '2026-03-18': { mood:2, confidence:35, tags:['crypto'], note:'COIN was a mistake. The crypto sector was weak all session and I knew it. Traded it anyway. Small loss but an avoidable one.', lessons:'Don\'t trade into a weak sector. Sector context matters.', trades:['COIN'] },
  '2026-03-19': { mood:3, confidence:65, tags:['sector-rotation'], note:'JPM trade was a clean sector rotation play. Financials were strong. Simple setup, clean execution.', lessons:'', trades:['JPM'] },
  '2026-03-20': { mood:4, confidence:80, tags:['momentum'], note:'TSLA finally gave a clean long setup — very different from the failed short earlier in the month. AMD held the range and broke out. Good end to the week.', lessons:'The same ticker can give both your worst and best trades. Approach each setup fresh.', trades:['TSLA','AMD'] },
};

const jnlLessons = [
  'Wait for the retest on secondary names.',
  'Stop after two losses — no revenge trades.',
  'Sitting on hands is a position too.',
  'When conviction is high and the tape confirms, hold the full size.',
  'Small-cap breakouts need sector tailwind.',
  'Don\'t trade into a weak sector.',
  'The same ticker can give your worst and best trade.',
];

function selectDay(k,d){sel=k;renderCal();const dd=calData[k],date=new Date(vy,vm,d),ds=`${DAYS[date.getDay()]}, ${MONTHS[vm].slice(0,3)} ${d}`;const drawer=document.getElementById('day-drawer');document.getElementById('drawer-date').textContent=ds;drawer.classList.add('open');if(!dd){document.getElementById('drawer-pl').textContent='No trades';document.getElementById('drawer-pl').className='drawer-pl';document.getElementById('drawer-stats').innerHTML=`<div style="color:var(--text3);font-size:12px">No trades recorded.</div>`;document.getElementById('drawer-trades').innerHTML='';const _jn0=jnlData[k]||{};document.getElementById('drawer-notes').innerHTML=`<textarea class="cal-notes" placeholder="Add notes for this day…" oninput="if(!jnlData['${k}'])jnlData['${k}']={mood:0,confidence:70,tags:[],note:'',lessons:''};jnlData['${k}'].note=this.value">${_jn0.note||''}</textarea>`;return;}const wins=dd.trades.filter(t=>t.pl>0).length,losses=dd.trades.filter(t=>t.pl<=0).length,wr=Math.round(wins/dd.trades.length*100);const plEl=document.getElementById('drawer-pl');plEl.textContent=fmtC(dd.pl);plEl.className='drawer-pl '+(dd.pl>=0?'g':'r');document.getElementById('drawer-stats').innerHTML=`<div><div class="ds-lbl">Trades</div><div class="ds-val">${dd.trades.length}</div></div><div><div class="ds-lbl">Wins</div><div class="ds-val g">${wins}</div></div><div><div class="ds-lbl">Losses</div><div class="ds-val r">${losses}</div></div><div><div class="ds-lbl">Win rate</div><div class="ds-val">${wr}%</div></div>`;document.getElementById('drawer-trades').innerHTML=dd.trades.map(t=>`<div class="tr-row"><div class="tr-sym">${t.sym}</div><div class="tr-info"><div class="tr-desc">${t.desc}</div><div class="tr-time">${t.time}</div></div><div class="tr-pl ${t.pl>=0?'g':'r'}">${fmtC(t.pl)}</div></div>`).join('');const _jn1=(jnlData[k]&&jnlData[k].note)||dd.notes||'';document.getElementById('drawer-notes').innerHTML=`<div class="ds-lbl" style="margin-bottom:6px">Notes</div><textarea class="cal-notes" placeholder="Add notes for this day…" oninput="if(!jnlData['${k}'])jnlData['${k}']={mood:0,confidence:70,tags:[],note:'',lessons:''};jnlData['${k}'].note=this.value">${_jn1}</textarea>`;setTimeout(()=>drawer.scrollIntoView({behavior:'smooth',block:'nearest'}),50);}
function clearSel(){sel=null;renderCal();document.getElementById('day-drawer').classList.remove('open');}
function syncNoteToJournal(dateKey, val) {
  if (!jnlData[dateKey]) jnlData[dateKey] = { mood:0, confidence:70, tags:[], note:'', lessons:'' };
  jnlData[dateKey].note = val;
}


function prevMonth(){vm--;if(vm<0){vm=11;vy--;}clearSel();}
function nextMonth(){vm++;if(vm>11){vm=0;vy++;}clearSel();}
function goToday(){vy=today.getFullYear();vm=today.getMonth();clearSel();selectDay(kk(vy,vm,today.getDate()),today.getDate());}

// ── OPEN POSITIONS ────────────────────────────────────────────────────────────
const positions = [
  { sym:'AAPL', name:'Apple Inc.',        side:'long',  qty:100, entry:211.40, price:217.80, mktval:21780, unpl:640,  pct:3.02,  dayPl:180,  opened:'Mar 18', note:'Holding above 50MA. Target $225.' },
  { sym:'NVDA', name:'NVIDIA Corp.',      side:'long',  qty:30,  entry:880.20, price:918.20, mktval:27546, unpl:1140, pct:4.32,  dayPl:420,  opened:'Mar 17', note:'AI momentum intact. Trail stop at $900.' },
  { sym:'TSLA', name:'Tesla Inc.',        side:'short', qty:50,  entry:248.60, price:254.80, mktval:12740, unpl:-310, pct:-2.49, dayPl:-90,  opened:'Mar 20', note:'Watching $260 resistance. Risk is high.' },
  { sym:'SPY',  name:'SPDR S&P 500 ETF', side:'long',  qty:20,  entry:541.80, price:553.20, mktval:11064, unpl:228,  pct:2.10,  dayPl:60,   opened:'Mar 19', note:'' },
];
let posSortState = { col:'unpl', dir:'desc' };
const BAR_COLORS = { AAPL:'#3b82f6', NVDA:'#8b5cf6', TSLA:'#ef4444', SPY:'#10b981' };
function fmtPos(v,short=false){if(v===0)return'$0';const abs=Math.abs(v);const s=short&&abs>=1000?'$'+(abs/1000).toFixed(1)+'K':'$'+abs.toLocaleString();return(v>0?'+':'-')+s;}
function sortPos(col){if(posSortState.col===col)posSortState.dir=posSortState.dir==='asc'?'desc':'asc';else{posSortState.col=col;posSortState.dir='desc';}renderPositions();}
function triggerSync(){const btn=document.querySelector('.sync-btn');if(btn){btn.textContent='Syncing\u2026';btn.disabled=true;}setTimeout(()=>{if(btn){btn.textContent='Refresh';btn.disabled=false;}},1200);}
function renderPositions(){
  // Update period label in summary
  const pLbl = document.getElementById('pos-period-lbl');
  if (pLbl) pLbl.textContent = 'Period: ' + (activePeriod==='mtd'?'MTD':activePeriod==='ytd'?'YTD':'All time');
  const sorted=[...positions].sort((a,b)=>{const va=a[posSortState.col],vb=b[posSortState.col];if(typeof va==='string')return posSortState.dir==='asc'?va.localeCompare(vb):vb.localeCompare(va);return posSortState.dir==='asc'?va-vb:vb-va;});
  ['sym','qty','entry','price','mktval','unpl','pct'].forEach(c=>{const el=document.getElementById('psort-'+c);if(!el)return;const th=el.parentElement;th.classList.remove('sorted');if(posSortState.col===c){el.textContent=posSortState.dir==='asc'?'\u2191':'\u2193';th.classList.add('sorted');}else el.textContent='\u2195';});
  const maxUnpl=Math.max(...positions.map(p=>Math.abs(p.unpl)));
  document.getElementById('pos-tbody').innerHTML=sorted.map(p=>{
    const pc=p.unpl>=0?'g':'r',ptc=p.pct>=0?'g':'r',dc=p.dayPl>0?'g':p.dayPl<0?'r':'flat';
    const bw=Math.round((Math.abs(p.unpl)/maxUnpl)*100);
    return `<tr>
      <td><div class="pos-sym">${p.sym}</div><div class="pos-name">${p.name}</div></td>
      <td><span class="pos-side ${p.side}">${p.side==='long'?'Long':'Short'}</span></td>
      <td><div class="pos-num">${p.qty}</div></td>
      <td><div class="pos-num">$${p.entry.toFixed(2)}</div></td>
      <td><div class="pos-num">$${p.price.toFixed(2)}</div></td>
      <td><div class="pos-num">$${p.mktval.toLocaleString()}</div></td>
      <td><div class="pos-pl ${pc}">${fmtPos(p.unpl)}</div><div class="pl-bar-wrap"><div class="pl-bar ${pc}" style="width:${bw}%"></div></div></td>
      <td><span class="pos-pct ${ptc}">${p.pct>0?'+':''}${p.pct.toFixed(2)}%</span></td>
      <td><span class="pos-day ${dc}">${p.dayPl!==0?(p.dayPl>0?'+':'-')+'$'+Math.abs(p.dayPl):'—'}</span></td>
      <td><div style="color:var(--text3);font-size:11px">${p.opened}</div></td>
    </tr>`;
  }).join('');
  const totalVal=positions.reduce((s,p)=>s+p.mktval,0);
  document.getElementById('pos-alloc').innerHTML=positions.map(p=>{const pct=Math.round((p.mktval/totalVal)*100);return`<div class="alloc-row"><div class="alloc-sym">${p.sym}</div><div class="alloc-bar-bg"><div class="alloc-bar" style="width:${pct}%;background:${BAR_COLORS[p.sym]||'#6366f1'}"></div></div><div class="alloc-pct">${pct}%</div></div>`;}).join('');
  const lv=positions.filter(p=>p.side==='long').reduce((s,p)=>s+p.mktval,0);
  const sv=positions.filter(p=>p.side==='short').reduce((s,p)=>s+p.mktval,0);
  const lu=positions.filter(p=>p.side==='long').reduce((s,p)=>s+p.unpl,0);
  const su=positions.filter(p=>p.side==='short').reduce((s,p)=>s+p.unpl,0);
  const lp=Math.round((lv/(lv+sv))*100),sp=100-lp;
  document.getElementById('pos-ls').innerHTML=`<div class="ls-row"><div class="ls-label"><span>Long exposure</span><span>$${lv.toLocaleString()}</span></div><div class="ls-bar-bg"><div class="ls-bar g" style="width:${lp}%"></div></div><div class="ls-meta"><span class="g">${lp}% of portfolio</span><span class="g">${fmtPos(lu)}</span></div></div><div class="ls-row"><div class="ls-label"><span>Short exposure</span><span>$${sv.toLocaleString()}</span></div><div class="ls-bar-bg"><div class="ls-bar r" style="width:${sp}%"></div></div><div class="ls-meta"><span class="r">${sp}% of portfolio</span><span class="r">${fmtPos(su)}</span></div></div>`;
  document.getElementById('pos-notes').innerHTML=positions.map(p=>{const pc=p.unpl>=0?'g':'r';return`<div class="pnote-row"><div class="pnote-header"><span class="pnote-sym">${p.sym}</span><span class="pnote-pl ${pc}">${fmtPos(p.unpl)}</span></div><textarea class="pnote-text" placeholder="Add a note for this position\u2026">${p.note}</textarea></div>`;}).join('');
}




// ── ANALYTICS ─────────────────────────────────────────────────────────────────
const chartInstances = {};
function destroyChart(id){ if(chartInstances[id]){ chartInstances[id].destroy(); delete chartInstances[id]; } }

function fmtA(v,short=false){ if(v===0)return'$0'; const abs=Math.abs(v); const s=short&&abs>=1000?'$'+(abs/1000).toFixed(1)+'K':'$'+abs.toLocaleString(); return(v>0?'+':'-')+s; }

function getAnFiltered(){
  const side   = document.getElementById('an-filter-side')?.value||'all';
  const result = document.getElementById('an-filter-result')?.value||'all';
  const sym    = document.getElementById('an-filter-sym')?.value||'all';
  const session= document.getElementById('an-filter-session')?.value||'all';
  return trades.filter(t=>{
    if(!inRange(t.date)) return false;
    if(side!=='all'&&t.side!==side) return false;
    if(result==='win'&&t.pl<=0) return false;
    if(result==='loss'&&t.pl>0) return false;
    if(sym!=='all'&&t.sym!==sym) return false;
    if(session!=='all'){
      const h=parseInt(t.time.split(':')[0]);
      if(session==='morning'&&(h<9||h>=11)) return false;
      if(session==='midday'&&(h<11||h>=14)) return false;
      if(session==='afternoon'&&(h<14||h>=16)) return false;
    }
    return true;
  });
}

function toggleFilterDrawer() {
  document.getElementById('an-filter-drawer').classList.toggle('open');
  document.getElementById('an-filter-overlay').classList.toggle('open');
  document.getElementById('an-filter-btn').classList.toggle('active');
}
function closeFilterDrawer() {
  document.getElementById('an-filter-drawer').classList.remove('open');
  document.getElementById('an-filter-overlay').classList.remove('open');
  document.getElementById('an-filter-btn').classList.remove('active');
}
function updateFilterBadge() {
  const filters = ['an-filter-side','an-filter-result','an-filter-sym','an-filter-session'];
  const active = filters.filter(id => { const el=document.getElementById(id); return el && el.value !== 'all'; }).length;
  const badge = document.getElementById('an-filter-badge');
  if (badge) { badge.style.display = active > 0 ? 'inline-flex' : 'none'; badge.textContent = active; }
  const btn = document.getElementById('an-filter-btn');
  if (btn) btn.classList.toggle('active', active > 0 && !document.getElementById('an-filter-drawer').classList.contains('open'));
}
function resetAnFilters(){
  ['an-filter-side','an-filter-result','an-filter-sym','an-filter-session'].forEach(id=>{
    const el=document.getElementById(id); if(el) el.value='all';
  });
  updateFilterBadge();
  renderAnalytics();
}

function populateSymFilter(){
  const el=document.getElementById('an-filter-sym'); if(!el) return;
  const cur=el.value;
  const syms=[...new Set(trades.filter(t=>inRange(t.date)).map(t=>t.sym))].sort();
  el.innerHTML='<option value="all">All symbols</option>'+syms.map(s=>`<option value="${s}">${s}</option>`).join('');
  el.value=syms.includes(cur)?cur:'all';
}
function updateAnPeriodLabel(pt, periodLabel) {
  const el = document.getElementById('an-period-lbl');
  if (el) el.textContent = pt.length + ' trades · ' + periodLabel;
}

function renderAnalytics(){
  populateSymFilter();
  updateFilterBadge();
  const pt=getAnFiltered();
  if(!pt.length){
    ['an-summary-bar','an-risk-cards','an-streak-vis','an-session-bars'].forEach(id=>{const el=document.getElementById(id);if(el)el.innerHTML='<div style="color:var(--text3);font-size:12px;padding:12px 0">No trades in this period.</div>';});
    ['equity','daily','winrate','dist','wl','weekday','hour','symbol','ls'].forEach(destroyChart);
    return;
  }
  const sorted=[...pt].sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time));
  const wins=pt.filter(t=>t.pl>0), losses=pt.filter(t=>t.pl<=0);
  const totalPL=pt.reduce((s,t)=>s+t.pl,0);
  const wr=pt.length?Math.round(wins.length/pt.length*100):0;
  const avgWin=wins.length?Math.round(wins.reduce((s,t)=>s+t.pl,0)/wins.length):0;
  const avgLoss=losses.length?Math.round(losses.reduce((s,t)=>s+t.pl,0)/losses.length):0;
  const grossProfit=wins.reduce((s,t)=>s+t.pl,0);
  const grossLoss=Math.abs(losses.reduce((s,t)=>s+t.pl,0));
  const pf=grossLoss>0?(grossProfit/grossLoss).toFixed(2):'—';
  const exp=pt.length?Math.round((wr/100)*avgWin+(1-wr/100)*avgLoss):0;
  // drawdown
  let cum=0,peak=0,maxDD=0;
  sorted.forEach(t=>{ cum+=t.pl; peak=Math.max(peak,cum); maxDD=Math.max(maxDD,peak-cum); });
  const periodLabel=activePeriod==='mtd'?'Mar 2026':activePeriod==='ytd'?'YTD 2026':'All time';
  updateAnPeriodLabel(pt, periodLabel);

  // ① SUMMARY BAR
  const sumCards=[
    {l:'Net P&L',v:fmtA(totalPL,true),c:totalPL>=0?'g':'r',s:pt.length+' trades'},
    {l:'Win rate',v:wr+'%',c:'b',s:wins.length+'W / '+losses.length+'L'},
    {l:'Profit factor',v:pf,c:'k',s:'gross profit / loss'},
    {l:'Expectancy',v:fmtA(exp),c:exp>=0?'g':'r',s:'per trade'},
    {l:'Avg win',v:fmtA(avgWin),c:'g',s:'per winner'},
    {l:'Avg loss',v:fmtA(avgLoss),c:'r',s:'per loser'},
    {l:'Max drawdown',v:fmtA(-maxDD,true),c:'r',s:'peak to trough'},
    {l:'Total trades',v:String(pt.length),c:'k',s:periodLabel},
    {l:'Largest win',v:fmtA(wins.length?Math.max(...wins.map(t=>t.pl)):0,true),c:'g',s:wins.length?sorted.filter(t=>t.pl===Math.max(...wins.map(t=>t.pl)))[0]?.sym||'—':'—'},
    {l:'Largest loss',v:fmtA(losses.length?Math.min(...losses.map(t=>t.pl)):0,true),c:'r',s:losses.length?sorted.filter(t=>t.pl===Math.min(...losses.map(t=>t.pl)))[0]?.sym||'—':'—'},
  ];
  document.getElementById('an-summary-bar').style.gridTemplateColumns='repeat(5,1fr)';
  document.getElementById('an-summary-bar').innerHTML=sumCards.map(c=>`<div class="an-stat"><div class="an-stat-lbl">${c.l}</div><div class="an-stat-val ${c.c}">${c.v}</div><div class="an-stat-sub">${c.s}</div></div>`).join('');

  // ② EQUITY CURVE
  let ecum=0;
  const eqData=sorted.map(t=>{ecum+=t.pl;return ecum;});
  const eqLabels=sorted.map((t,i)=>i%Math.ceil(sorted.length/8)===0?t.sym:'');
  const eqColor=ecum>=0?'#16a34a':'#dc2626';
  document.getElementById('an-equity-sub').textContent='Cumulative realized P&L · '+periodLabel;
  destroyChart('equity');
  chartInstances['equity']=new Chart(document.getElementById('chart-equity').getContext('2d'),{type:'line',data:{labels:sorted.map(t=>t.date),datasets:[{data:eqData,borderColor:eqColor,backgroundColor:ecum>=0?'rgba(22,163,74,0.08)':'rgba(220,38,38,0.08)',borderWidth:2,pointRadius:0,pointHoverRadius:4,fill:true,tension:0.3}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{callbacks:{label:ctx=>' $'+ctx.parsed.y.toLocaleString()}}},scales:{x:{display:false},y:{grid:{color:'rgba(0,0,0,0.04)'},ticks:{font:{size:11},color:'#9ca3af',callback:v=>'$'+v.toLocaleString()},border:{display:false}}}}});

  // Daily P&L bars
  const dayMap={};
  pt.forEach(t=>{dayMap[t.date]=(dayMap[t.date]||0)+t.pl;});
  const dayDates=Object.keys(dayMap).sort();
  const dayVals=dayDates.map(d=>dayMap[d]);
  document.getElementById('an-daily-sub').textContent=dayDates.length+' trading days';
  destroyChart('daily');
  chartInstances['daily']=new Chart(document.getElementById('chart-daily').getContext('2d'),{type:'bar',data:{labels:dayDates.map(d=>{const p=d.split('-');return p[1]+'/'+p[2];}),datasets:[{data:dayVals,backgroundColor:dayVals.map(v=>v>=0?'rgba(22,163,74,0.22)':'rgba(220,38,38,0.22)'),borderColor:dayVals.map(v=>v>=0?'#16a34a':'#dc2626'),borderWidth:1.5,borderRadius:4}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{callbacks:{label:ctx=>' $'+ctx.parsed.y.toLocaleString()}}},scales:{x:{grid:{display:false},ticks:{font:{size:10},color:'#9ca3af',maxTicksLimit:8},border:{display:false}},y:{grid:{color:'rgba(0,0,0,0.04)'},ticks:{font:{size:11},color:'#9ca3af',callback:v=>'$'+v.toLocaleString()},border:{display:false}}}}});

  // Rolling win rate
  const wsize=5;
  const wrLabels=[],wrData=[];
  for(let i=wsize-1;i<sorted.length;i++){const sl=sorted.slice(i-wsize+1,i+1);wrLabels.push(sorted[i].sym);wrData.push(Math.round(sl.filter(t=>t.pl>0).length/wsize*100));}
  destroyChart('winrate');
  chartInstances['winrate']=new Chart(document.getElementById('chart-winrate').getContext('2d'),{type:'line',data:{labels:wrLabels,datasets:[{data:wrData,borderColor:'#2563eb',backgroundColor:'rgba(37,99,235,0.07)',borderWidth:2,pointRadius:0,fill:true,tension:0.4},{data:wrLabels.map(()=>50),borderColor:'rgba(0,0,0,0.1)',borderWidth:1,borderDash:[4,4],pointRadius:0,fill:false}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{callbacks:{label:(ctx)=>ctx.datasetIndex===0?' '+ctx.parsed.y+'%':''}}},scales:{x:{display:false},y:{min:0,max:100,grid:{color:'rgba(0,0,0,0.04)'},ticks:{font:{size:11},color:'#9ca3af',callback:v=>v+'%'},border:{display:false}}}}});

  // ③ DISTRIBUTION
  const buckets=['<-500','-500 to -200','-200 to -50','-50 to 0','0 to 50','50 to 200','200 to 500','>500'];
  const counts=new Array(8).fill(0);
  pt.forEach(t=>{const p=t.pl;if(p<=-500)counts[0]++;else if(p<=-200)counts[1]++;else if(p<=-50)counts[2]++;else if(p<0)counts[3]++;else if(p<=50)counts[4]++;else if(p<=200)counts[5]++;else if(p<=500)counts[6]++;else counts[7]++;});
  const dColors=counts.map((_,i)=>i<4?'rgba(220,38,38,0.20)':'rgba(22,163,74,0.20)');
  const dBorders=counts.map((_,i)=>i<4?'#dc2626':'#16a34a');
  destroyChart('dist');
  chartInstances['dist']=new Chart(document.getElementById('chart-dist').getContext('2d'),{type:'bar',data:{labels:buckets,datasets:[{data:counts,backgroundColor:dColors,borderColor:dBorders,borderWidth:1.5,borderRadius:4}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{callbacks:{label:ctx=>' '+ctx.parsed.y+' trade'+(ctx.parsed.y!==1?'s':'')}}},scales:{x:{grid:{display:false},ticks:{font:{size:9},color:'#9ca3af'},border:{display:false}},y:{grid:{color:'rgba(0,0,0,0.04)'},ticks:{font:{size:11},color:'#9ca3af',stepSize:1},border:{display:false}}}}});

  // Win vs loss avg bar
  document.getElementById('an-wl-sub').textContent=fmtA(avgWin)+' avg win · '+fmtA(avgLoss)+' avg loss';
  const payoff=avgLoss!==0?Math.abs(avgWin/avgLoss).toFixed(2):'—';
  destroyChart('wl');
  chartInstances['wl']=new Chart(document.getElementById('chart-wl').getContext('2d'),{type:'bar',data:{labels:['Avg win','Avg loss','Largest win','Largest loss'],datasets:[{data:[avgWin,Math.abs(avgLoss),wins.length?Math.max(...wins.map(t=>t.pl)):0,losses.length?Math.abs(Math.min(...losses.map(t=>t.pl))):0],backgroundColor:['rgba(22,163,74,0.20)','rgba(220,38,38,0.20)','rgba(22,163,74,0.35)','rgba(220,38,38,0.35)'],borderColor:['#16a34a','#dc2626','#16a34a','#dc2626'],borderWidth:1.5,borderRadius:5}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{callbacks:{label:ctx=>' $'+ctx.parsed.y.toLocaleString()}}},scales:{x:{grid:{display:false},ticks:{font:{size:10},color:'#9ca3af'},border:{display:false}},y:{grid:{color:'rgba(0,0,0,0.04)'},ticks:{font:{size:11},color:'#9ca3af',callback:v=>'$'+v.toLocaleString()},border:{display:false}}}}});

  // Streaks dots
  let curStreak=1,longestW=0,longestL=0,curW=0,curL=0;
  const recentDots=sorted.slice(-20);
  sorted.forEach((t,i)=>{if(i===0)return;if(t.pl>0&&sorted[i-1].pl>0){curW++;longestW=Math.max(longestW,curW);curL=0;}else if(t.pl<=0&&sorted[i-1].pl<=0){curL++;longestL=Math.max(longestL,curL);curW=0;}else{curW=t.pl>0?1:0;curL=t.pl<=0?1:0;}});
  longestW=Math.max(longestW,1);longestL=Math.max(longestL,1);
  document.getElementById('an-streak-sub').textContent='Last '+Math.min(20,sorted.length)+' trades';
  const dotHTML=recentDots.map(t=>`<div class="sdot ${t.pl>0?'w':'l'}" title="${t.sym} ${t.pl>0?'+':''}$${Math.abs(t.pl)}"></div>`).join('');
  document.getElementById('an-streak-vis').innerHTML=`
    <div class="streak-row"><div class="streak-label">Recent trades</div><div class="streak-dots">${dotHTML}</div></div>
    <div class="streak-row" style="margin-top:8px"><div class="streak-label" style="color:var(--green)">Longest win streak</div><div class="streak-dots">${Array.from({length:Math.min(longestW,12)},()=>'<div class="sdot w"></div>').join('')}</div><span style="font-size:11px;color:var(--green);margin-left:6px;font-weight:500">${longestW}</span></div>
    <div class="streak-row"><div class="streak-label" style="color:var(--red)">Longest loss streak</div><div class="streak-dots">${Array.from({length:Math.min(longestL,12)},()=>'<div class="sdot l"></div>').join('')}</div><span style="font-size:11px;color:var(--red);margin-left:6px;font-weight:500">${longestL}</span></div>`;

  // ④ RISK CARDS
  const days2=[...new Set(pt.map(t=>t.date))];
  const dayPLArr=days2.map(d=>pt.filter(t=>t.date===d).reduce((s,t)=>s+t.pl,0));
  const avgDayPL=days2.length?Math.round(dayPLArr.reduce((a,b)=>a+b,0)/days2.length):0;
  const worstDay=dayPLArr.length?Math.min(...dayPLArr):0;
  const riskCards=[
    {l:'Max drawdown',v:fmtA(-maxDD,true),c:'r'},{l:'Avg daily P&L',v:fmtA(avgDayPL,true),c:avgDayPL>=0?'g':'r'},
    {l:'Worst day',v:fmtA(worstDay,true),c:'r'},{l:'Worst trade',v:fmtA(losses.length?Math.min(...losses.map(t=>t.pl)):0,true),c:'r'},
    {l:'Profit factor',v:String(pf),c:'k'},{l:'Payoff ratio',v:avgLoss?Math.abs(avgWin/avgLoss).toFixed(2):'—',c:'k'},
    {l:'Avg position size',v:Math.round(pt.reduce((s,t)=>s+t.qty,0)/(pt.length||1))+' shares',c:'k'},
    {l:'Current drawdown',v:'$0',c:'g'},
  ];
  document.getElementById('an-risk-cards').innerHTML=riskCards.map(c=>`<div class="an-risk-card"><div class="an-risk-lbl">${c.l}</div><div class="an-risk-val ${c.c}">${c.v}</div></div>`).join('');

  // ⑤ WEEKDAY
  const dNames=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const wdPL=[0,0,0,0,0,0,0],wdCnt=[0,0,0,0,0,0,0];
  pt.forEach(t=>{const d=new Date(t.date+'T12:00:00').getDay();wdPL[d]+=t.pl;wdCnt[d]++;});
  const wdLabels=[1,2,3,4,5].map(i=>dNames[i]);
  const wdData=[1,2,3,4,5].map(i=>wdCnt[i]?Math.round(wdPL[i]/wdCnt[i]):0);
  destroyChart('weekday');
  chartInstances['weekday']=new Chart(document.getElementById('chart-weekday').getContext('2d'),{type:'bar',data:{labels:wdLabels,datasets:[{data:wdData,backgroundColor:wdData.map(v=>v>=0?'rgba(22,163,74,0.20)':'rgba(220,38,38,0.20)'),borderColor:wdData.map(v=>v>=0?'#16a34a':'#dc2626'),borderWidth:1.5,borderRadius:5}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{callbacks:{label:ctx=>' avg $'+ctx.parsed.y.toLocaleString()}}},scales:{x:{grid:{display:false},ticks:{font:{size:11},color:'#9ca3af'},border:{display:false}},y:{grid:{color:'rgba(0,0,0,0.04)'},ticks:{font:{size:11},color:'#9ca3af',callback:v=>'$'+v.toLocaleString()},border:{display:false}}}}});

  // Hour of day
  const hMap={},hCnt={};
  pt.forEach(t=>{const h=parseInt(t.time.split(':')[0]);hMap[h]=(hMap[h]||0)+t.pl;hCnt[h]=(hCnt[h]||0)+1;});
  const hours=[9,10,11,12,13,14,15];
  const hData=hours.map(h=>hCnt[h]?Math.round(hMap[h]/hCnt[h]):0);
  destroyChart('hour');
  chartInstances['hour']=new Chart(document.getElementById('chart-hour').getContext('2d'),{type:'bar',data:{labels:hours.map(h=>h+':00'),datasets:[{data:hData,backgroundColor:hData.map(v=>v>=0?'rgba(22,163,74,0.20)':'rgba(220,38,38,0.20)'),borderColor:hData.map(v=>v>=0?'#16a34a':'#dc2626'),borderWidth:1.5,borderRadius:5}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{callbacks:{label:ctx=>' avg $'+ctx.parsed.y.toLocaleString()}}},scales:{x:{grid:{display:false},ticks:{font:{size:11},color:'#9ca3af'},border:{display:false}},y:{grid:{color:'rgba(0,0,0,0.04)'},ticks:{font:{size:11},color:'#9ca3af',callback:v=>'$'+v.toLocaleString()},border:{display:false}}}}});

  // Session bars
  const sessions=[{l:'Morning',h:[9,10]},{l:'Midday',h:[11,12,13]},{l:'Afternoon',h:[14,15]}];
  const sessionData=sessions.map(s=>{const st=pt.filter(t=>s.h.includes(parseInt(t.time.split(':')[0])));return{l:s.l,pl:st.reduce((a,b)=>a+b.pl,0),cnt:st.length};});
  const maxSPL=Math.max(...sessionData.map(s=>Math.abs(s.pl)),1);
  document.getElementById('an-session-sub').textContent=periodLabel;
  document.getElementById('an-session-bars').innerHTML=sessionData.map(s=>{const pct=Math.round((Math.abs(s.pl)/maxSPL)*100);const c=s.pl>=0?'g':'r';const barC=s.pl>=0?'#16a34a':'#dc2626';return`<div class="session-bar-row"><div class="session-lbl">${s.l}</div><div class="session-bar-bg"><div class="session-bar" style="width:${pct}%;background:${barC}"></div></div><div class="session-val ${c}">${fmtA(s.pl,true)}</div></div>`;}).join('');

  // ⑥ SYMBOL
  const symMap={};
  pt.forEach(t=>{symMap[t.sym]=(symMap[t.sym]||0)+t.pl;});
  const symE=Object.entries(symMap).sort((a,b)=>b[1]-a[1]);
  document.getElementById('an-sym-sub').textContent=symE.length+' symbols · '+periodLabel;
  destroyChart('symbol');
  chartInstances['symbol']=new Chart(document.getElementById('chart-symbol').getContext('2d'),{type:'bar',data:{labels:symE.map(e=>e[0]),datasets:[{data:symE.map(e=>e[1]),backgroundColor:symE.map(e=>e[1]>=0?'rgba(22,163,74,0.20)':'rgba(220,38,38,0.20)'),borderColor:symE.map(e=>e[1]>=0?'#16a34a':'#dc2626'),borderWidth:1.5,borderRadius:5}]},options:{responsive:true,maintainAspectRatio:false,indexAxis:'y',plugins:{legend:{display:false},tooltip:{callbacks:{label:ctx=>' $'+ctx.parsed.x.toLocaleString()}}},scales:{x:{grid:{color:'rgba(0,0,0,0.04)'},ticks:{font:{size:11},color:'#9ca3af',callback:v=>'$'+v.toLocaleString()},border:{display:false}},y:{grid:{display:false},ticks:{font:{size:11},color:'#6b7280'},border:{display:false}}}}});

  // Long vs short
  const lT=pt.filter(t=>t.side==='long'),sT=pt.filter(t=>t.side==='short');
  const lPL=lT.reduce((s,t)=>s+t.pl,0),sPL=sT.reduce((s,t)=>s+t.pl,0);
  const lWR=lT.length?Math.round(lT.filter(t=>t.pl>0).length/lT.length*100):0;
  const sWR=sT.length?Math.round(sT.filter(t=>t.pl>0).length/sT.length*100):0;
  document.getElementById('an-ls-sub').textContent=lT.length+' long · '+sT.length+' short';
  destroyChart('ls');
  chartInstances['ls']=new Chart(document.getElementById('chart-ls').getContext('2d'),{type:'bar',data:{labels:['Total P&L','Win rate %','Trade count'],datasets:[{label:'Long',data:[lPL,lWR,lT.length],backgroundColor:'rgba(22,163,74,0.20)',borderColor:'#16a34a',borderWidth:1.5,borderRadius:5},{label:'Short',data:[sPL,sWR,sT.length],backgroundColor:'rgba(220,38,38,0.20)',borderColor:'#dc2626',borderWidth:1.5,borderRadius:5}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'bottom',labels:{boxWidth:10,font:{size:11},color:'#6b7280',padding:12}},tooltip:{callbacks:{label:ctx=>{const v=ctx.parsed.y;if(ctx.dataIndex===0)return' $'+v.toLocaleString();if(ctx.dataIndex===1)return' '+v+'%';return' '+v+' trades';}}}},scales:{x:{grid:{display:false},ticks:{font:{size:11},color:'#9ca3af'},border:{display:false}},y:{grid:{color:'rgba(0,0,0,0.04)'},ticks:{font:{size:11},color:'#9ca3af'},border:{display:false}}}}});
}

// ── INIT ─────────────────────────────────────────────────────────────────────
navigate('dashboard');
renderWidgets();
renderCal();
selectDay(kk(2026,2,20),20);
renderTrades();
renderPositions();
// analytics + journal render on demand



// ── NOTES & JOURNAL ─────────────────────────────────────────────────────────

// Journal data — keyed by date string

let jnlVm = 2, jnlVy = 2026;
let jnlSelectedDate = null;
let jnlExpandedDate = null;
const MONTHS_JNL = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS_JNL = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

function fmtJDate(str) {
  const [y,m,d] = str.split('-');
  return DAYS_JNL[new Date(str+'T12:00:00').getDay()] + ', ' + MONTHS_JNL[+m-1].slice(0,3) + ' ' + +d;
}
function fmtJPL(v) {
  if (!v && v!==0) return '';
  const abs = Math.abs(v);
  return (v>0?'+':v<0?'-':'') + '$' + abs.toLocaleString();
}
function getDayPL(date) {
  const dayTrades = trades.filter(t => t.date === date);
  return dayTrades.reduce((s,t) => s+t.pl, 0);
}

function renderJnlMiniCal() {
  const grid = document.getElementById('jnl-cal-grid');
  const monthLbl = document.getElementById('jnl-cal-month');
  if (!grid) return;
  monthLbl.textContent = MONTHS_JNL[jnlVm] + ' ' + jnlVy;
  const fd = new Date(jnlVy, jnlVm, 1).getDay();
  const dim = new Date(jnlVy, jnlVm+1, 0).getDate();
  const dipm = new Date(jnlVy, jnlVm, 0).getDate();
  let html = '';
  for (let i=0; i<fd; i++) {
    html += `<div class="jnl-day other">${dipm-fd+1+i}</div>`;
  }
  for (let d=1; d<=dim; d++) {
    const dateStr = `${jnlVy}-${String(jnlVm+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const isToday = dateStr === '2026-03-21';
    const hasEntry = !!jnlData[dateStr];
    const pl = getDayPL(dateStr);
    const plClass = pl > 0 ? 'win' : pl < 0 ? 'loss' : '';
    const sel = dateStr === jnlSelectedDate ? 'selected' : '';
    const todayCls = isToday ? 'today' : '';
    const entryCls = hasEntry ? 'has-entry' : '';
    html += `<div class="jnl-day ${todayCls} ${entryCls} ${plClass} ${sel}" onclick="jnlSelectDate('${dateStr}')">${d}</div>`;
  }
  let next=1;
  while ((fd+dim+next-1)%7!==0) {
    html += `<div class="jnl-day other">${next++}</div>`;
  }
  grid.innerHTML = html;
}

function jnlPrevMonth() {
  jnlVm--; if(jnlVm<0){jnlVm=11;jnlVy--;}
  // sync so renderJournal uses this month
  vm = jnlVm; vy = jnlVy;
  renderJournal();
}
function jnlNextMonth() {
  jnlVm++; if(jnlVm>11){jnlVm=0;jnlVy++;}
  vm = jnlVm; vy = jnlVy;
  renderJournal();
}
function jnlSelectDate(date) {
  jnlSelectedDate = date;
  jnlExpandedDate = date;
  renderJnlMiniCal();
  renderJournal();
  // scroll to that entry
  setTimeout(()=>{
    const el = document.getElementById('jnl-entry-'+date);
    if (el) el.scrollIntoView({behavior:'smooth', block:'nearest'});
  }, 60);
}

function renderJnlLessons() {
  const el = document.getElementById('jnl-lessons-list');
  if (!el) return;
  el.innerHTML = jnlLessons.map((l,i) => `
    <div class="jnl-lesson-item">
      <div class="jnl-lesson-dot"></div>
      <div class="jnl-lesson-text" contenteditable="true" onblur="jnlLessons[${i}]=this.textContent.trim()">${l}</div>
    </div>`).join('');
}

function addLesson() {
  jnlLessons.push('');
  renderJnlLessons();
  const items = document.querySelectorAll('.jnl-lesson-text');
  if (items.length) { items[items.length-1].focus(); }
}

function renderJournal() {
  renderJnlMiniCal();
  renderJnlLessons();

  const q = (document.getElementById('jnl-search')?.value||'').toLowerCase().trim();
  const tagRaw = document.getElementById('jnl-filter-tag')?.value||'all';
  const tagF = tagRaw === '__hide__' ? 'all' : tagRaw;
  const hideTags = tagRaw === '__hide__';
  const moodF = document.getElementById('jnl-filter-mood')?.value||'all';

  // Build weekdays for the current dashboard month (vy/vm), newest first
  const allDays = [];
  const daysInMonth = new Date(vy, vm + 1, 0).getDate();
  // End = last day of month or today (Mar 21), whichever is earlier
  const monthEnd = new Date(Math.min(
    new Date(vy, vm, daysInMonth).getTime(),
    new Date('2026-03-21').getTime()
  ));
  const monthStart = new Date(vy, vm, 1);
  let cursor = new Date(monthEnd);
  cursor.setHours(12, 0, 0, 0);
  while (cursor >= monthStart) {
    const dow = cursor.getDay();
    if (dow !== 0 && dow !== 6) { // weekdays only
      const ds = cursor.toISOString().slice(0,10);
      if (!jnlData[ds]) jnlData[ds] = { mood:0, confidence:70, tags:[], note:'', lessons:'' };
      allDays.push(ds);
    }
    cursor.setDate(cursor.getDate()-1);
  }
  let dates = allDays;

  // Apply filters
  dates = dates.filter(date => {
    const entry = jnlData[date];
    if (tagF !== 'all' && !(entry.tags||[]).includes(tagF)) return false;
    if (moodF !== 'all' && String(entry.mood) !== moodF) return false;
    if (q && !entry.note.toLowerCase().includes(q) && !date.includes(q) && !(entry.tags||[]).join(' ').includes(q)) return false;
    return true;
  });

  const countEl = document.getElementById('jnl-count');
  const mName = MONTHS_JNL[vm] + ' ' + vy;
  if (countEl) countEl.innerHTML = `<span>${dates.filter(d=>d.trim()!=='' || jnlData[d]?.note).length > 0 ? dates.length : dates.length}</span> entr${dates.length===1?'y':'ies'} · <span style="font-weight:400;color:var(--text3)">${mName}</span>`;

  const container = document.getElementById('jnl-entries');
  if (!container) return;

  if (!dates.length) {
    container.innerHTML = '<div style="padding:40px 0;text-align:center;color:var(--text3);font-size:13px"><strong style="display:block;color:var(--text2);margin-bottom:4px">No entries found</strong>Try adjusting your search or filters.</div>';
    return;
  }

  // Apply hide-tags based on dropdown selection
  const _entriesEl = document.getElementById('jnl-entries');
  if (_entriesEl) _entriesEl.classList.toggle('hide-tags', hideTags);

  container.innerHTML = dates.map(date => {
    const entry = jnlData[date];
    const pl = getDayPL(date);
    const plClass = pl > 0 ? 'g' : pl < 0 ? 'r' : 'z';
    const dayTrades = trades.filter(t => t.date === date);
    const isExpanded = date === jnlExpandedDate;
    const moodStars = [1,2,3,4,5].map(n =>
      `<span class="jnl-star ${n<=(entry.mood||0)?'filled':'empty'}" onclick="setMood('${date}',${n})">★</span>`
    ).join('');
    const tagHtml = (entry.tags||[]).map(t =>
      `<span class="jnl-etag">${t}<span class="jnl-etag-rm" onclick="removeTag('${date}','${t}')">×</span></span>`
    ).join('');
    const preview = entry.note ? entry.note.slice(0, 80) + (entry.note.length > 80 ? '…' : '') : 'No notes yet — click to add';
    const tradeRows = dayTrades.map(t => `
      <div class="jnl-trade-mini">
        <div class="jnl-trade-sym">${t.sym}</div>
        <div class="jnl-trade-side ${t.side}">${t.side==='long'?'L':'S'}</div>
        <div class="jnl-trade-desc">${t.qty} shares · ${t.time}</div>
        <div class="jnl-trade-pl ${t.pl>=0?'g':'r'}">${fmtJPL(t.pl)}</div>
      </div>`).join('');

    return `<div class="jnl-entry ${isExpanded?'expanded':''}" id="jnl-entry-${date}">
      <div class="jnl-entry-header" onclick="toggleEntry('${date}')">
        <div class="jnl-entry-date">${fmtJDate(date)}</div>
        <div class="jnl-entry-pl ${plClass}">${pl!==0?fmtJPL(pl):'—'}</div>
        <div class="jnl-entry-trades">${dayTrades.length} trade${dayTrades.length!==1?'s':''}</div>
        <div class="jnl-entry-preview">${isExpanded?'':preview}</div>
        <div class="jnl-entry-tags">${tagHtml}</div>
        <div class="jnl-mood">${moodStars}</div>
        <svg class="jnl-chevron" width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 3l4 4-4 4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </div>
      <div class="jnl-entry-body">
        <div class="jnl-body-cols">
          <div class="jnl-body-left">
            <div>
              <div class="jnl-field-label">Journal entry</div>
              <textarea class="jnl-textarea" placeholder="What happened today? What did you do well? What could you improve?" onchange="jnlData['${date}'].note=this.value">${entry.note||''}</textarea>
            </div>
            <div>
              <div class="jnl-field-label">Lesson learned</div>
              <textarea class="jnl-textarea lessons-ta" placeholder="One key takeaway from today…" onchange="jnlData['${date}'].lessons=this.value">${entry.lessons||''}</textarea>
            </div>
            <div>
              <div class="jnl-field-label">Tags / setups</div>
              <div class="jnl-tag-row">${tagHtml}
                <button class="jnl-tag-add" onclick="promptTag('${date}')">+ tag</button>
              </div>
            </div>
          </div>
          <div class="jnl-body-right">
            <div>
              <div class="jnl-field-label">Mood</div>
              <div class="jnl-mood-picker">
                <div class="jnl-mood-stars">${[1,2,3,4,5].map(n=>`<span class="jnl-mood-star ${n<=(entry.mood||0)?'filled':''}" onclick="setMood('${date}',${n})">★</span>`).join('')}</div>
                <span class="jnl-mood-lbl">${['','Bad','Poor','Neutral','Good','Great'][entry.mood||0]||''}</span>
              </div>
            </div>
            <div>
              <div class="jnl-field-label">Confidence</div>
              <div class="jnl-conf-row">
                <span class="jnl-conf-label">Rule following</span>
                <input type="range" class="jnl-conf-slider" min="0" max="100" value="${entry.confidence||50}" oninput="jnlData['${date}'].confidence=+this.value;this.nextElementSibling.textContent=this.value+'%'">
                <span class="jnl-conf-val">${entry.confidence||50}%</span>
              </div>
            </div>
            <div>
              <div class="jnl-field-label">Trades this day</div>
              ${tradeRows || '<div style="font-size:11px;color:var(--text3);padding:4px 0">No trades recorded.</div>'}
            </div>
          </div>
        </div>
      </div>
    </div>`;
  }).join('');
}

function toggleEntry(date) {
  jnlExpandedDate = jnlExpandedDate === date ? null : date;
  renderJournal();
  if (jnlExpandedDate) {
    setTimeout(()=>{
      const el = document.getElementById('jnl-entry-'+date);
      if(el) el.scrollIntoView({behavior:'smooth', block:'nearest'});
    }, 50);
  }
}

function setMood(date, val) {
  if (!jnlData[date]) jnlData[date] = { mood:val, confidence:70, tags:[], note:'', lessons:'' };
  jnlData[date].mood = val;
  renderJournal();
}

function promptTag(date) {
  const tag = window.prompt('Add tag:');
  if (tag && tag.trim()) {
    if (!jnlData[date]) jnlData[date] = { mood:3, confidence:70, tags:[], note:'', lessons:'' };
    if (!jnlData[date].tags) jnlData[date].tags = [];
    if (!jnlData[date].tags.includes(tag.trim())) {
      jnlData[date].tags.push(tag.trim());
      renderJournal();
    }
  }
}

function removeTag(date, tag) {
  if (jnlData[date] && jnlData[date].tags) {
    jnlData[date].tags = jnlData[date].tags.filter(t => t !== tag);
    renderJournal();
  }
}

function newEntry() {
  const date = window.prompt('Enter date (YYYY-MM-DD):', '2026-03-21');
  if (!date || !date.match(/^\d{4}-\d{2}-\d{2}$/)) return;
  if (!jnlData[date]) jnlData[date] = { mood:3, confidence:70, tags:[], note:'', lessons:'' };
  jnlExpandedDate = date;
  jnlSelectedDate = date;
  renderJournal();
}


// ── SETTINGS ─────────────────────────────────────────────────────────────────
function settingsSave() { /* auto-save on change — would POST to API in production */ }
function settingsSaveAll() {
  const btn = event.target;
  const orig = btn.textContent;
  btn.textContent = 'Saved ✓';
  btn.style.background = '#16a34a';
  setTimeout(() => { btn.textContent = orig; btn.style.background = ''; }, 2000);
}
function settingsDisconnect() {
  if (confirm('Disconnect Interactive Brokers? Live position syncing will stop.')) {
    alert('Broker disconnected. You can reconnect at any time.');
  }
}
function settingsUploadAvatar() {
  const input = document.createElement('input');
  input.type = 'file'; input.accept = 'image/*';
  input.onchange = e => {
    const file = e.target.files[0];
    if (file) alert('Photo "' + file.name + '" selected. Would upload in production.');
  };
  input.click();
}
function settingsClearData() {
  if (confirm('Clear all trade data? This cannot be undone.')) {
    alert('All trade data cleared. (Demo — no data was actually deleted.)');
  }
}
function settingsResetAccount() {
  if (confirm('Reset your account? All data and settings will be lost.')) {
    alert('Account reset. (Demo — no data was actually deleted.)');
  }
}
function settingsDeleteAccount() {
  const confirmed = prompt('Type DELETE to confirm account deletion:');
  if (confirmed === 'DELETE') {
    alert('Account deleted. (Demo — no data was actually deleted.)');
  }
}
