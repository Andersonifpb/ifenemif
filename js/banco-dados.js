/* banco-dados.js · gabaritos e vídeos
   2025 = caderno AMARELO, 2º dia (questões 136 a 180). A 178 foi anulada pelo Inep e fica fora dos sorteios.
   2024 = caderno CINZA, 2º dia (questões 136 a 180).
   Fontes: gabarito oficial do Inep divulgado pela imprensa (O Povo, 19/11/2025) e correção do Estratégia
   Vestibulares (2024). Confira com os PDFs oficiais em gov.br/inep antes de usar com os alunos.
   Cada linha de gabarito tem 45 letras, na ordem das questões 136 a 180. */
const BANCO_VERSAO = 2;
const _g = s => s.replace(/ /g, "").split("");
const GAB_2025 = _g("CECCA DDBEB CACEC BDDDB ADEEA BBECC DABEA DDEBE AAXCC");
const GAB_2024 = _g("DBCEC EACAD ABBEC BEDAD CCDCC ABBBC ECEBC EADAB BADDD");
/* Imagens existentes de 2024: a 136 (questão-136-2024.png) e 138 a 177 (138.png ...). Acrescente números aqui quando adicionar mais. */
const ARQ_2024 = [136, ...Array.from({ length:40 }, (_, i) => 138 + i)];
/* "assunto" = id de bloco (area, volume, probabilidade, estatistica, razao, porcentagem, funcoes, combinatoria,
   progressoes, equacoes, trigonometria, geral). "dif" = "f", "m" ou "d" (fácil, média, difícil). Ainda não classificados. */
const BANCO = [];
GAB_2025.forEach((g, i) => { const num = 136 + i; if(g !== "X") BANCO.push({ n:num, num, ano:2025, arq:`questão-${num}-2025.png`, gab:g, assunto:"geral", dif:"m" }); });
ARQ_2024.forEach(num => BANCO.push({ n:1000 + num, num, ano:2024, arq:num === 136 ? "questão-136-2024.png" : `${num}.png`, gab:GAB_2024[num - 136], assunto:"geral", dif:"m" }));

/* Vídeo-aulas do Portal da Matemática OBMEP/IMPA (módulo Função Afim, prof. Gustavo Adolfo): [título, id do YouTube] */
const VIDEOS_EXTRAS = { funcoes: [
  ["Função afim: definição e propriedades básicas (OBMEP)", "eKbehcUu1fA"],
  ["Função afim: caracterização (OBMEP)", "aP9h36jUUCo"],
  ["Gráfico da função afim (OBMEP)", "l8qOtCNb0W0"],
  ["Função afim: resolução de exercícios, parte 1 (OBMEP)", "INzRUKMFMqs"],
  ["Função afim: resolução de exercícios, parte 2 (OBMEP)", "qM7oBbEwzuM"],
  ["Função afim: resolução de exercícios, parte 3 (OBMEP)", "lyJusL0Sm3Y"],
  ["Função afim: resolução de exercícios, parte 4 (OBMEP)", "lO3M22KbclM"],
  ["Função afim: noções básicas I, aula 1 (OBMEP)", "QVD1luUkkwE"],
  ["Função afim: noções básicas I, aula 2 (OBMEP)", "jLDaHj1FtC8"],
  ["Função afim: noções básicas I, aula 3 (OBMEP)", "ixM7t6yBBGM"] ] };
