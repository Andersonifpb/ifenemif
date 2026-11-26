/* tema.js · IF-ENEM · carregar DEPOIS de app.js e banco-questoes.js
   Redefine o visual das telas e acrescenta o sorteio do banco de questões.
   A lógica do sistema (app.js) não é alterada. */

CONFIG.pastaQuestoes = "img/imgquestoes/";   // pasta das imagens das questões

/* ---------- Imagens por assunto (id do bloco -> arquivo em img/) ---------- */
const fotoUrl = f => "img/" + f;
const IMG_ASSUNTO = { area:"geometriaplana.jpg", volume:"geometriaespacial.jpg", probabilidade:"probabilidade.jpg",
  estatistica:"matematica2.jpg", razao:"razaoproporcao.jpg", porcentagem:"porcentagem.jpg", funcoes:"funcao.jpg",
  combinatoria:"matematica3.jpg", progressoes:"progressao.jpg", equacoes:"equacao.jpg", trigonometria:"trigonometria.jpg",
  geral:"matematicageral.jpg" };
const IMG_GENERICAS = ["matematica.png", "matematica2.jpg", "matematica3.jpg", "razao.jpg"];   // assuntos sem foto própria
const imgAssunto = (b, i) => fotoUrl(IMG_ASSUNTO[b.id] || IMG_GENERICAS[i % IMG_GENERICAS.length]);

/* ---------- Banco de questões: junta as extras e sorteia nos simulados ---------- */
iniciarSimulado = function(n){
  const pool = QS.map(q => q.n);
  for(let i = pool.length - 1; i > 0; i--){ const j = Math.floor(Math.random() * (i + 1)); [pool[i], pool[j]] = [pool[j], pool[i]]; }
  const ids = pool.slice(0, Math.min(n, pool.length)).sort((a, b) => a - b);   // sorteio sem repetição
  sim = { tamanho:n, ids, resp:{}, idx:0, inicio:Date.now() };
  location.hash = "#/simulado"; render();
};

/* ---------- Barra superior: menu do aluno + saudação com o nome ---------- */
const saudacao = () => { const h = new Date().getHours(); return h < 12 ? "Bom dia" : h < 18 ? "Boa tarde" : "Boa noite"; };
const _montaMenu = montaMenu;
montaMenu = function(){
  _montaMenu();
  const chip = $("#user-chip"); if(!chip) return;
  const u = sessao && !ehAdmin() ? usuarioAtual() : null;
  if(!u){ chip.innerHTML = ""; return; }
  const h = location.hash || "#/home", on = p => h.startsWith(p) ? "on" : "";
  const n = notifs().filter(x => x.userId === sessao.id && !x.lida).length;
  $("#menu").innerHTML = `<a class="${on('#/home')}" href="#/home">Início</a>
    <a class="${on('#/simulado')}" href="#/simulados">Simulados</a>
    <a class="${on('#/videos')}" href="#/videos">Vídeo-aulas</a>
    <a class="${on('#/desempenho')}" href="#/desempenho">Perfil</a>
    <a class="${on('#/notificacoes')}" href="#/notificacoes">Avisos${n ? `<span class="badge">${n}</span>` : ""}</a>`;
  chip.innerHTML = `<span class="avatar">${esc(u.nome.trim().charAt(0).toUpperCase())}</span>
    <span class="quem"><small>${saudacao()},</small><b>${esc(u.nome)}</b></span><button onclick="sair()">Sair</button>`;
};

/* ---------- Login ---------- */
vLogin = function(){
  const av = sessionStorage.getItem("aviso"); sessionStorage.removeItem("aviso");
  const modo = vLogin.modo || "aluno";
  return `<div class="login-fundo"></div><div class="login-shell">
    <section class="login-foto"><div><h2>Matemática para o ENEM, no seu ritmo.</h2>
      <p>Faça simulados com questões de provas anteriores e assista às vídeo-aulas indicadas para os assuntos em que você mais erra.</p></div></section>
    <div class="card auth">
      <h1>Entrar no IF-<span style="color:var(--verde)">ENEM</span></h1>
      <p class="muted">Use o e-mail e a senha do seu cadastro.</p>
      ${av ? `<div class="msg warn">${esc(av)}</div>` : ""}
      <div class="tabs"><button class="${modo==='aluno'?'on':''}" onclick="vLogin.modo='aluno';render()">Estudante</button>
        <button class="${modo==='admin'?'on':''}" onclick="vLogin.modo='admin';render()">Administrador</button></div>
      <form onsubmit="return fazLogin(event)">
        <label class="f" for="lg">${modo==='admin' ? "Usuário" : "E-mail"}</label>
        <input id="lg" type="${modo==='admin' ? 'text' : 'email'}" required autocomplete="username">
        <label class="f" for="ls">Senha</label>
        <input id="ls" type="password" required autocomplete="current-password">
        <div id="lerr"></div>
        <button class="btn" style="width:100%;margin-top:16px">Entrar</button>
      </form>
      ${modo==='aluno' ? `<p class="small" style="text-align:center">Ainda não tem conta? <a href="#/cadastro">Cadastre-se</a></p>` : ""}
    </div></div>`;
};

/* ---------- Cartões de simulado (início e aba Simulados) ---------- */
const cartoesSimulado = () => CONFIG.tamanhosSimulado.map(n => `<button class="pcard" onclick="iniciarSimulado(${n})">
  <img src="${fotoUrl("simuladao.webp")}" alt="" loading="lazy" onerror="this.remove()"><span class="num">${n}</span>
  <span class="tx"><span class="t">Simulado ${n}</span>
  <span class="d">${n <= 15 ? "Rápido" : n <= 30 ? "Intermediário" : "Completo"} · ${n * 3} min recomendados</span></span></button>`).join("");

/* ---------- Início do aluno ---------- */
vHome = function(){
  const u = usuarioAtual(); if(!u){ sair(); return ""; }
  const st = statsAluno(u.id), dif = topicosDificeis(st.topicos).map(d => d.id), agora = new Date();
  const assunto = (b, i) => {
    const x = st.topicos[b.id], p = x ? pct(x.ac, x.total) : 0;
    const tag = !x ? ["", "Novo"] : dif.includes(b.id) ? ["er", "Revisar"] : p >= 70 ? ["ok", "Em dia"] : ["", "Praticar"];
    return `<a class="acard" href="#/videos/${b.id}">
      <span class="acard-img" style="background-image:linear-gradient(180deg,rgba(8,30,22,.05) 30%,rgba(8,30,22,.88)),url('${imgAssunto(b, i)}')">${esc(b.nome)}</span>
      <span class="acard-b"><span class="tag ${tag[0]}">${tag[1]}</span>
        <span class="bar ${x && p < 40 ? "r" : ""}" style="display:block;margin-top:8px"><i style="width:${p}%"></i></span>
        <span class="small muted">${x ? `${x.ac} de ${x.total} acertos` : "Nenhuma questão feita ainda"}</span></span></a>`;
  };
  return `<div class="home"><div>
    <section class="sec"><h2 class="sec-t">Pratique como no ENEM</h2><div class="pratique">${cartoesSimulado()}</div></section>
    <section class="sec"><a class="opc" href="#/videos"><img src="${fotoUrl("videoaula.jpg")}" alt="" loading="lazy" onerror="this.parentNode.classList.add('sem-img');this.remove()">
      <div class="opc-t"><h3>Vídeo-aulas</h3><p>Os conteúdos mais cobrados, organizados por assunto, com indicações para o que você mais erra.</p></div></a></section>
    <section class="sec"><h2 class="sec-t">Assuntos</h2><div class="assuntos">${BL.map(assunto).join("")}</div></section>
  </div>
  <aside class="home-lado card">
    <img class="aluno" src="${fotoUrl("aluno.jpg")}" alt="Estudante" onerror="this.style.display='none'">
    <div class="relogio" id="relogio" role="timer" aria-label="Hora atual">${agora.toLocaleTimeString("pt-BR")}</div>
    <p class="data-hoje" id="data-hoje">${agora.toLocaleDateString("pt-BR", { weekday:"long", day:"numeric", month:"long" })}</p>
  </aside></div>`;
};

/* ---------- Simulados ---------- */
vSimulados = () => `<h1>Simulados</h1>
  <p class="muted lead">Matemática e suas Tecnologias, com questões do ENEM. A cada simulado as questões são sorteadas do banco, então nenhum simulado é igual ao outro.</p>
  <div class="pratique wide">${cartoesSimulado()}</div>`;

/* ---------- Vídeo-aulas ---------- */
const FONTES = [
  { nome:"Portal da Matemática OBMEP", url:"https://www.youtube.com/@portalmatematicaobmep", txt:"Vídeo-aulas do IMPA/OBMEP, do ensino fundamental ao médio." },
  { nome:"Portal da OBMEP", url:"https://portaldaobmep.impa.br/", txt:"Vídeo-aulas, apostilas e exercícios resolvidos de acesso gratuito." },
  { nome:"PIC OBMEP no YouTube", url:"https://www.youtube.com/PICOBMEP", txt:"Aulas do Programa de Iniciação Científica da OBMEP." }
];
const termoBusca = b => b.nome.split("·").pop().split("(")[0].trim();
const buscaObmep = b => "https://www.youtube.com/@portalmatematicaobmep/search?query=" + encodeURIComponent(termoBusca(b));
vVideos = function(sel){
  const u = usuarioAtual(), st = u ? statsAluno(u.id) : { topicos:{} }, dif = topicosDificeis(st.topicos).map(d => d.id), sg = sugestoes(st.topicos, 4);
  const vis = b => b.videos.filter(v => v.ok !== false && ytId(v.url));
  return `<section class="banner" style="background-image:linear-gradient(90deg,rgba(13,59,44,.92),rgba(13,59,44,.4)),url('${fotoUrl("biblioteca.jpg")}')">
    <div><h1>Vídeo-aulas</h1><p>Conteúdos mais cobrados no ENEM, por assunto. Os vídeos vêm de instituições públicas e abrem aqui mesmo ou no site de origem.</p></div></section>
  ${!sel && sg.lista.length ? `<section class="sec"><h2 class="sec-t">${sg.geral ? "Para começar" : "Sugeridas para você"}</h2><div class="vgrid">${sg.lista.map(cardVideo).join("")}</div></section>` : ""}
  <div class="fontes-v">${FONTES.map(f => `<a class="fonte" href="${f.url}" target="_blank" rel="noopener"><b>${f.nome}</b><span class="small muted">${f.txt}</span></a>`).join("")}</div>
  <div class="chips">${BL.map(b => `<a class="chip ${sel === b.id ? "on" : ""}" href="#/videos/${b.id}">${esc(b.nome)}</a>`).join("")}
    ${sel ? `<a class="chip" href="#/videos">Ver todos</a>` : ""}</div>
  ${BL.filter(b => !sel || b.id === sel).map(b => { const vs = vis(b); return `<section class="bloco" id="b-${b.id}">
    <h2>${esc(b.nome)} ${dif.includes(b.id) ? `<span class="pill r">recomendado para você</span>` : ""}</h2>
    ${vs.length ? `<div class="vgrid">${vs.map(cardVideo).join("")}</div>` : ""}
    <a class="link-fonte" href="${buscaObmep(b)}" target="_blank" rel="noopener">Buscar "${esc(termoBusca(b))}" no Portal da Matemática OBMEP</a></section>`; }).join("")}`;
};

/* ---------- Perfil (a antiga aba Desempenho, agora com cabeçalho do estudante) ---------- */
const _vDesempenho = vDesempenho;
vDesempenho = function(a, b){
  const u = usuarioAtual(), st = statsAluno(u.id);
  return `<section class="banner" style="background-image:linear-gradient(90deg,rgba(13,59,44,.94),rgba(13,59,44,.5)),url('${fotoUrl("conquistas.jpg")}')">
    <span class="avatar g">${esc(u.nome.trim().charAt(0).toUpperCase())}</span>
    <div><h1>${esc(u.nome)}</h1><p>${esc(u.email)}</p></div>
    <div class="pstats"><div><b>${st.simulados}</b><span>simulados</span></div><div><b>${pct(st.ac, st.resp)}%</b><span>aproveitamento</span></div><div><b>${st.ac}</b><span>acertos</span></div></div>
  </section>` + _vDesempenho(a, b);
};

/* ---------- Relógio digital (API Date do navegador, sem serviço externo) ---------- */
const tick = () => {
  const r = $("#relogio"), dt = $("#data-hoje"); if(!r) return;
  const d = new Date(), hora = d.toLocaleTimeString("pt-BR");
  const data = d.toLocaleDateString("pt-BR", { weekday:"long", day:"numeric", month:"long" });
  if(r.textContent !== hora) r.textContent = hora;
  if(dt && dt.textContent !== data) dt.textContent = data;
};
setInterval(tick, 1000);

/* ---------- Interface do aluno sem emojis ---------- */
const reEmoji = /[\p{Extended_Pictographic}\uFE0F\u200D]/gu;
function limpaEmojis(){
  if(ehAdmin()) return;
  const w = document.createTreeWalker($("#app"), NodeFilter.SHOW_TEXT);
  for(let n; n = w.nextNode();){ const v = n.nodeValue.replace(reEmoji, ""); if(v !== n.nodeValue) n.nodeValue = v; }
}
new MutationObserver(() => limpaEmojis()).observe($("#app"), { childList:true, subtree:true });


/* ---------- Banco de questões (gabaritos oficiais) e vídeos extras ---------- */
const _carregarDados = carregarDados;
carregarDados = function(){
  _carregarDados();
  const o = Store.get("overrides", {}), ov = o.versao === BANCO_VERSAO ? (o.questoes || []) : [];
  QS = BANCO.map(b => ({ ...b, ...(ov.find(q => q.n === b.n) || {}) }));
  Object.entries(VIDEOS_EXTRAS).forEach(([id, lista]) => { const b = BL.find(x => x.id === id); if(!b) return;
    lista.forEach(([titulo, yt]) => { const url = "https://www.youtube.com/watch?v=" + yt;
      if(!b.videos.some(v => v.url === url)) b.videos.push({ titulo, url, ok:true, verificado:new Date().toISOString().slice(0, 10) }); }); });
};
const _salvarDados = salvarDados;
salvarDados = function(){ _salvarDados(); const o = Store.get("overrides", {}); o.versao = BANCO_VERSAO; Store.set("overrides", o); };

/* ---------- Login do administrador sem senha no código (config-admin.js) ---------- */
fazLogin = async function(e){
  e.preventDefault();
  const l = $("#lg").value.trim(), s = $("#ls").value, err = $("#lerr");
  const erro = m => { err.innerHTML = `<div class="msg err">${m}</div>`; return false; };
  if(vLogin.modo === "admin"){
    if(!ADMIN.hash) return erro("A senha do administrador ainda não foi configurada. Abra gerar-hash.html, siga as instruções e recarregue.");
    if(l.toLowerCase() !== ADMIN.usuario.toLowerCase() || await hashAdmin(s) !== ADMIN.hash) return erro("Usuário ou senha de administrador inválidos.");
    sessao = { role:"admin" };
  } else {
    const u = usuarios().find(x => x.email === l.toLowerCase());
    if(!u || u.hash !== await hash(s)) return erro("E-mail ou senha inválidos.");
    sessao = { role:"aluno", id:u.id };
  }
  Store.set("sessao", sessao); ultimaAtividade = Date.now();
  location.hash = ehAdmin() ? "#/admin/visao" : "#/home"; render(); return false;
};

/* ---------- Tema claro/escuro ---------- */
const ICO = { escuro:'<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5"/></svg>',
              claro:'<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M21 13A9 9 0 1 1 11 3a7 7 0 0 0 10 10z"/></svg>' };
function aplicaTema(t){ document.documentElement.dataset.tema = t; try{ localStorage.setItem("ifenem_tema", t); }catch(e){} const b = $("#tema-btn"); if(b) b.innerHTML = ICO[t]; }
function alternaTema(){ aplicaTema(document.documentElement.dataset.tema === "escuro" ? "claro" : "escuro"); }
aplicaTema(document.documentElement.dataset.tema || "claro");

/* ---------- Cronômetro do simulado (recomendado: 3 min por questão, como no ENEM) ---------- */
const fmtTempo = s => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
function atualizaCron(){
  const ativo = location.hash === "#/simulado" && sim; let el = $("#cron");
  if(!ativo){ if(el) el.remove(); return; }
  if(!el){ el = document.createElement("div"); el.id = "cron"; document.body.appendChild(el); }
  const dec = Math.round((Date.now() - sim.inicio) / 1000), rec = sim.ids.length * 180;
  el.className = dec > rec ? "cron estourou" : "cron";
  el.innerHTML = `<b>${fmtTempo(dec)}</b><span>recomendado ${fmtTempo(rec)}</span>`;
}
setInterval(atualizaCron, 1000); window.addEventListener("hashchange", atualizaCron);

/* ---------- Resultado com gráfico e tempo ---------- */
const _vResultado = vResultado;
vResultado = function(id){
  const r = resultados().find(x => x.id === id), base = _vResultado(id);
  if(!r) return base;
  const p = pct(r.ac, r.total), c = 2 * Math.PI * 52;
  return `<section class="banner res"><div class="donut"><svg viewBox="0 0 120 120" width="130" height="130"><circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,.2)" stroke-width="12"/><circle cx="60" cy="60" r="52" fill="none" stroke="#e3b341" stroke-width="12" stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - p / 100)}"/></svg><b>${p}%</b></div>
    <div><h1 style="margin:0">Seu desempenho no simulado</h1><p>${r.ac} acertos em ${r.total} questões</p></div>
    <div class="pstats"><div><b>${r.ac}</b><span>acertos</span></div><div><b>${r.er - r.branco}</b><span>erros</span></div><div><b>${r.branco}</b><span>em branco</span></div>
    <div><b>${fmtTempo(r.seg || 0)}</b><span>de ${fmtTempo(r.total * 180)} recomendados</span></div></div></section>` + base;
};

render(); // redesenha a tela atual com o novo tema
