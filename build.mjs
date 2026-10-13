// Arma index.html con las fichas de datos/fichas.mjs (anverso y reverso lado a lado).
//   node build.mjs             arma index.html
//   node build.mjs shot 11     captura PNG de la ficha 11 (anverso + reverso) en salida/, con y sin líneas de base
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';
import { guionesEnHtml } from './tools/silabas.mjs';
import { FICHAS, PARADAS, TOTAL } from './datos/fichas.mjs';

const ROOT = dirname(fileURLToPath(import.meta.url));
const [cmd, arg] = process.argv.slice(2);
const f = (n) => n.toFixed(2);

// ── Mapa del reverso: misma cartografía y mismas coordenadas de parada que el libro (tools/mapas.mjs) ──
const GEO = JSON.parse(readFileSync(join(ROOT, 'assets', 'maps', 'geo.json'), 'utf8')).general;
const P = {
  '01': [-54.8, -65.23], '02': [-40.8, -62.99], '03': [-39.5, -62.68], '04': [-39.12, -62.47], '05': [-38.8, -62.17],
  '06': [-38.07, -61.98], '07': [-36.35, -60.02], '08': [-34.6, -58.38], '09': [-32.95, -60.65], '10': [-31.63, -60.7],
  '11': [-31.73, -60.53], '12': [-34.6, -58.38], '13': [-47.75, -65.9], '14': [-49.31, -67.73], '15': [-50.02, -68.52],
};
const TIERRA = [P['02'], P['03'], P['04'], [-38.72, -62.27], P['05'], [-38.5, -61.8], P['06'], [-37.75, -61.35], [-36.95, -60.35], P['07'],
  [-35.44, -58.81], P['08'], [-34.57, -59.11], [-34.25, -59.47], [-34.06, -60.1], [-33.33, -60.22], P['09'], [-31.97, -60.92], P['10']];
// El recorrido del río Santa Cruz se corta antes de la Cordillera, como en el libro
const SANTA_CRUZ = GEO.rios['Santa Cruz'].flat().filter(([lon]) => lon > -71.3 && lon < -68.6).sort((a, b) => b[0] - a[0]).map(([lon, lat]) => [lat, lon]);
const AGUA = [
  [P['10'], P['11']],
  [P['11'], [-32.2, -60.6], [-32.95, -60.58], [-33.3, -60.15], [-33.7, -59.55], [-34.05, -59.05], [-34.42, -58.58], P['08']],
  [P['08'], [-34.95, -57.5], [-35.5, -56.4], [-36.6, -55.9], [-38.5, -57.0], [-40.6, -60.2], [-43.0, -63.0], [-45.5, -65.0], [-47.3, -65.3], P['13']],
  [P['13'], [-48.3, -65.8], [-49.0, -67.0], P['14']],
  [P['14'], [-49.7, -67.45], [-50.13, -68.3], P['15']],
  [P['15'], ...SANTA_CRUZ],
];
const MAPA = { latN: -29.6, latS: -55.6, lonW: -74.2, W: 20.8, H: 39 };

function mapa(aqui) {
  const { latN, latS, lonW, W, H } = MAPA;
  const k = H / (latN - latS), kx = k * Math.cos((((latN + latS) / 2) * Math.PI) / 180);
  const xy = ([lat, lon]) => [(lon - lonW) * kx, (latN - lat) * k];
  const traza = (lineas, cerrar) => lineas.map((l) => l.map(([lon, lat]) => xy([lat, lon])).map(([x, y], i) => `${i ? 'L' : 'M'}${f(x)} ${f(y)}`).join('') + (cerrar ? 'Z' : '')).join('');
  const linea = (pts) => pts.map(xy).map(([x, y], i) => `${i ? 'L' : 'M'}${f(x)} ${f(y)}`).join('');
  const [ax, ay] = xy(P[aqui]);
  const lado = ax > W * 0.62 ? -1 : 1;
  return `<svg class="r-mapa" viewBox="0 0 ${W} ${H}" role="img" aria-label="Mapa del recorrido con la parada ${aqui} marcada">
<defs><clipPath id="clip-${aqui}"><rect width="${W}" height="${H}"/></clipPath></defs>
<g clip-path="url(#clip-${aqui})">
<path class="m-otro" d="${traza(GEO.otros, true)}"/><path class="m-tierra" d="${traza(GEO.arg, true)}"/><path class="m-costa" d="${traza(GEO.costa)}"/>
<path class="m-ruta" d="${linea(TIERRA)}"/>${AGUA.map((t) => `<path class="m-ruta m-ruta--agua" d="${linea(t)}"/>`).join('')}
${Object.entries(P).filter(([id]) => id !== aqui && id !== '12').map(([, pos]) => { const [x, y] = xy(pos); return `<circle class="m-parada" cx="${f(x)}" cy="${f(y)}" r="0.42"/>`; }).join('')}
</g>
<circle class="m-anillo" cx="${f(ax)}" cy="${f(ay)}" r="2.1"/><circle class="m-aqui" cx="${f(ax)}" cy="${f(ay)}" r="0.95"/>
<text class="m-rotulo" x="${f(ax + lado * 3.1)}" y="${f(ay + 0.95)}"${lado < 0 ? ' text-anchor="end"' : ''}>${aqui}</text>
</svg>`;
}

// ── Piezas del sistema (las mismas del libro) ──
const MARCA = '<svg class="marca" viewBox="0 0 9 9" aria-hidden="true"><circle cx="4.5" cy="4.5" r="4.3"/><path d="M4.5 0.2V2.4M4.5 6.6V8.8M0.2 4.5H2.4M6.6 4.5H8.8"/><circle class="marca__punto" cx="4.5" cy="4.5" r="0.55"/></svg>';
const BALDOSA = '<svg class="minitile" viewBox="0 0 28 27" aria-hidden="true"><path class="tile__fill" d="M14 4C20.5 8.5 20.5 17 14 21.5C7.5 17 7.5 8.5 14 4Z"/><path class="tile__line" d="M14 21.5V24.5"/><path class="tile__cut" d="M14 7V21.5M14 11L17 8.8M14 11L11 8.8M14 14.5L17.6 12M14 14.5L10.4 12M14 18L17 15.8M14 18L11 15.8"/></svg>';
const sello = (ruta) => existsSync(join(ROOT, ruta)) ? `${ruta}?v=${createHash('sha256').update(readFileSync(join(ROOT, ruta))).digest('hex').slice(0, 8)}` : ruta;

function anverso(x) {
  const p = PARADAS[x.parada];
  return `<section class="cara cara--anverso" lang="es">
  <div class="a-imagen${x.imagen.modo === 'lamina' ? ' a-imagen--lamina' : ''}" style="background-image:url(${sello(`assets/images/${x.imagen.archivo}`)})" role="img" aria-label="${x.imagen.alt}"></div>
  <div class="caja">
    <p class="a-kicker">${BALDOSA}<span>Ficha de campo · ${x.categoria}</span><span><b>${x.num}</b> / ${TOTAL}</span></p>
    <h1 class="a-titulo${x.cursiva ? ' a-titulo--cursiva' : ''}">${x.titulo}</h1>
    ${guionesEnHtml(`<p class="a-darwin">${x.darwin}</p>`)}
    <dl class="a-meta">
      <div><dt>Fecha</dt><dd>${p.fecha}</dd></div>
      <div><dt>Parada</dt><dd><b>${x.parada}</b> ${p.nombre}</dd></div>
      <div><dt>Diario</dt><dd>Capítulo ${x.capitulo}</dd></div>
    </dl>
  </div>
</section>`;
}

function reverso(x) {
  const p = PARADAS[x.parada];
  return `<section class="cara cara--reverso" lang="es">
  <div class="caja">
    <div class="r-cabeza">${MARCA}<div><h2>Darwin en la Argentina</h2><p>Fichas de campo</p></div><p class="r-num"><b>${x.num}</b> / ${TOTAL}</p></div>
    <div class="r-filete"></div>
    <div class="r-cuerpo">
      ${mapa(x.parada)}
      <div class="r-parada">
        <p class="r-rotulo">Parada</p>
        <p class="r-numero">${x.parada}</p>
        <h1>${p.nombre.replace(' / ', '&nbsp;/<br>')}</h1>
        <dl class="r-dato">
          <div><dt>Fecha</dt><dd>${p.fecha}</dd></div>
          <div><dt>Cómo llega Darwin</dt><dd>${p.medio[0].toUpperCase() + p.medio.slice(1)}</dd></div>

        </dl>
      </div>
    </div>
    <div class="r-notas">${x.notas.map(([t, n]) => `<p><span class="notetag${t === 'ED' ? ' notetag--ed' : ''}">${t}</span>${n}</p>`).join('')}</div>
    <div class="r-pie">
      <dl class="r-dato">
        <div><dt>En el libro</dt><dd>${/^\d{3}$/.test(x.paginas) ? 'Pág.' : 'Págs.'} ${x.paginas}</dd></div>
        <div><dt>Diario, edición de 1921</dt><dd>Capítulo ${x.capitulo}</dd></div>
        <div><dt>Mapa digital</dt><dd>Escaneá el código</dd></div>
      </dl>
      <img class="r-qr" src="assets/images/qr-mapa-digital.svg" alt="Código QR: enlace al mapa digital">
    </div>
  </div>
</section>`;
}

const pares = FICHAS.map((x) => `<div class="par" id="f${x.num}"><div class="recorte">${anverso(x)}</div><div class="recorte">${reverso(x)}</div></div>`);
const css = createHash('sha256').update(readFileSync(join(ROOT, 'styles', 'fichas.css'))).digest('hex').slice(0, 8);
const pagina = (cuerpo, extra = '') => `<!doctype html>
<!-- GENERADO por build.mjs — no editar a mano. Editar datos/fichas.mjs y styles/fichas.css. -->
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=660">
<title>Darwin en la Argentina — fichas de campo</title>
<link rel="stylesheet" href="styles/fichas.css?v=${css}">
${extra}</head>
<body>
${cuerpo}
</body>
</html>
`;

// index.html: revisión en pantalla (anverso y reverso lado a lado). Tecla G: líneas de base.
// ?f=11 aísla una ficha · ?bloque=2 muestra seis fichas por vez · lo que no entra en su caja queda marcado en rojo
writeFileSync(join(ROOT, 'index.html'), pagina(`<p class="titulo-sitio"><b>Darwin en la Argentina</b>Fichas de campo · ${FICHAS.length} de ${TOTAL} · frente y dorso de cada una</p>
${pares.join('\n')}
<script>
  const q = new URLSearchParams(location.search);
  if (q.has('guias')) document.body.classList.add('guias');
  if (q.get('f')) { document.body.classList.add('single'); document.getElementById('f' + q.get('f'))?.classList.add('is-target'); }
  if (q.get('bloque')) { document.body.classList.add('hoja'); const b = q.get('bloque') - 1; document.querySelectorAll('.par').forEach((p, i) => { if (Math.floor(i / 6) !== b) p.remove(); }); }
  addEventListener('keydown', (e) => { if (e.key === 'g') document.body.classList.toggle('guias'); });
  document.fonts.ready.then(() => {
    for (const el of document.querySelectorAll('.a-titulo, .a-darwin, .a-meta, .r-parada, .r-notas'))
      if ((!el.matches('.a-titulo') && el.scrollHeight > el.clientHeight + 1) || el.scrollWidth > el.clientWidth + 1) el.classList.add('desborda');
    document.body.dataset.revisado = '1';
  });
</script>`));

// pantalla.html: una cara por página, al tamaño final (74 × 105 mm), anverso y reverso alternados
writeFileSync(join(ROOT, 'pantalla.html'), pagina(FICHAS.map((x) => `<div class="recorte">${anverso(x)}</div>\n<div class="recorte">${reverso(x)}</div>`).join('\n'),
  '<style>@page { size: 74mm 105mm; margin: 0; } body { display: block; padding: 0; background: none; } .recorte { break-after: page; box-shadow: none; }</style>\n'));

// imprenta.html: pliegos A4 con 4 fichas, sangrado de 3 mm y marcas de corte.
// Cada pliego de anversos va seguido de su pliego de reversos, con las columnas espejadas (impresión a doble faz, volteo por el lado largo).
const X0 = (210 - 160) / 2, Y0 = (297 - 222) / 2;
const marcas = () => {
  const xs = [3, 77, 83, 157].map((v) => X0 + v), ys = [3, 108, 114, 219].map((v) => Y0 + v);
  const d = [...xs.map((x) => `M${x} ${Y0 - 6}V${Y0 - 2}M${x} ${Y0 + 224}V${Y0 + 228}`), ...ys.map((y) => `M${X0 - 6} ${y}H${X0 - 2}M${X0 + 162} ${y}H${X0 + 166}`)].join('');
  return `<svg class="marcas" viewBox="0 0 210 297" aria-hidden="true"><path d="${d}"/></svg>`;
};
const pliegos = [];
for (let i = 0; i < FICHAS.length; i += 4) {
  const grupo = FICHAS.slice(i, i + 4), n = i / 4 + 1, de = Math.ceil(FICHAS.length / 4);
  for (const [lado, cara] of [['anverso', anverso], ['reverso', reverso]])
    pliegos.push(`<div class="pliego">${grupo.map((x, k) => {
      const col = lado === 'anverso' ? k % 2 : 1 - (k % 2), fila = k >> 1;
      return `<div class="puesto" style="left:${X0 + col * 80}mm;top:${Y0 + fila * 111}mm">${cara(x)}</div>`;
    }).join('')}${marcas()}<p class="pliego__rotulo">Darwin en la Argentina · fichas de campo · pliego ${n} de ${de} · ${lado} · fichas ${grupo.map((x) => x.num).join(', ')} · A7 74 × 105 mm · sangrado 3 mm</p></div>`);
}
writeFileSync(join(ROOT, 'imprenta.html'), pagina(pliegos.join('\n'), `<style>@page { size: 210mm 297mm; margin: 0; } body { display: block; padding: 0; background: none; }
.pliego { position: relative; width: 210mm; height: 297mm; overflow: hidden; break-after: page; background: #fff; }
.puesto { position: absolute; }
.marcas { position: absolute; inset: 0; width: 210mm; height: 297mm; } .marcas path { fill: none; stroke: #000; stroke-width: 0.1; }
.pliego__rotulo { position: absolute; left: ${X0}mm; top: ${Y0 + 232}mm; margin: 0; font: 500 6pt Inter, Arial, sans-serif; color: #000; }
@media screen { body { background: #8f9499; } .pliego { margin: 8mm auto; } }</style>\n`));
console.log(`Fichas armadas: ${FICHAS.length}/${TOTAL}`);

const chrome = ['C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'].find(existsSync);
const run = (args, opt = { stdio: 'ignore' }) => execFileSync(chrome, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--virtual-time-budget=5000', ...args], opt);
const url = (f) => pathToFileURL(join(ROOT, f)).href;
const out = (f) => join(ROOT, 'salida', f);

if (cmd === 'shot') {
  // 8 + 74 + 8 + 74 + 8 mm de ancho · 8 + 105 + 8 mm de alto, a 96 px por pulgada
  for (const g of ['', '-guias'])
    run([`--screenshot=${out(`ficha-${arg}${g}.png`)}`, '--window-size=650,457', '--force-device-scale-factor=4', `${url('index.html')}?f=${arg}${g ? '&guias=1' : ''}`]);
  console.log('Captura en salida/');
}
if (cmd === 'revisar') {
  // Lo que desborda su caja + hojas de seis fichas para mirarlas juntas
  const dom = run(['--dump-dom', url('index.html')], { encoding: 'utf8', maxBuffer: 64e6 });
  const mal = [...dom.matchAll(/<div class="par" id="f(\d+)">([^]*?)(?=<div class="par"|<script)/g)].flatMap(([, n, h]) => [...h.matchAll(/class="([\w- ]*?) desborda"/g)].map((m) => `${n}: ${m[1]}`));
  console.log(dom.includes('data-revisado') ? (mal.length ? `DESBORDA → ${mal.join(' · ')}` : 'Nada desborda.') : 'No se pudo revisar.');
  for (let b = 1; b <= Math.ceil(FICHAS.length / 6); b++)
    run([`--screenshot=${out(`_bloque-${b}.png`)}`, '--window-size=1876,878', '--force-device-scale-factor=1.4', `${url('index.html')}?bloque=${b}`]);
  console.log('Hojas de revisión en salida/');
}
if (cmd === 'pdf') {
  run([`--print-to-pdf=${out('fichas-pantalla.pdf')}`, '--no-pdf-header-footer', url('pantalla.html')]);
  run([`--print-to-pdf=${out('fichas-imprenta.pdf')}`, '--no-pdf-header-footer', url('imprenta.html')]);
  console.log('PDF en salida/');
}