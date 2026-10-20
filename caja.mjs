// Caja contenedora de las 24 fichas: estuche de solapas (tuck end) para el mazo de 74 × 105 mm.
//   node caja.mjs        arma caja.html (A4: troquel con el arte) y salida/caja-imprenta.pdf + salida/caja.png
// Medidas interiores: 76 × 107 × 11 mm (1 mm de holgura por lado; 24 fichas de cartulina de 300 g ≈ 8,5 mm).
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';
import { FICHAS, TOTAL } from './datos/fichas.mjs';

const ROOT = dirname(fileURLToPath(import.meta.url));
const [cmd] = process.argv.slice(2);

// ── Troquel (mm). Orden de paneles: frente · lomo · dorso · lateral · solapa de pegado ──
const W = 76, H = 107, D = 11, TUCK = 14, GLUE = 9, B = 3;
const xF = 0, xA = W, xB = W + D, xS = 2 * W + D, xG = 2 * W + 2 * D, ANCHO = xG + GLUE;
const yL = TUCK, y0 = TUCK + D, y1 = y0 + H, yBL = y1 + D, ALTO = yBL + TUCK;
const NOTCH = 7; // media luna para sacar la tapa

const corte = [
  `M${xF} ${y0}H${W / 2 - NOTCH}A${NOTCH} ${NOTCH} 0 0 0 ${W / 2 + NOTCH} ${y0}H${xA}`,
  // guardapolvo superior del lomo
  `V${y0 - 8}Q${xA} ${y0 - 10} ${xA + 2} ${y0 - 10}H${xB - 1.5}L${xB} ${y0}V${yL}`,
  // tapa con su lengüeta
  `H${xB + 1.5}V${5}Q${xB + 1.5} 0 ${xB + 6.5} 0H${xS - 6.5}Q${xS - 1.5} 0 ${xS - 1.5} 5V${yL}H${xS}V${y0}`,
  // guardapolvo superior del lateral y solapa de pegado
  `L${xS + 1.5} ${y0 - 10}H${xG - 2}Q${xG} ${y0 - 10} ${xG} ${y0 - 8}V${y0}L${ANCHO} ${y0 + 4}V${y1 - 4}L${xG} ${y1}`,
  // guardapolvo inferior del lateral, borde inferior del dorso
  `V${y1 + 8}Q${xG} ${y1 + 10} ${xG - 2} ${y1 + 10}H${xS + 1.5}L${xS} ${y1}H${xB}`,
  // guardapolvo inferior del lomo
  `L${xB - 1.5} ${y1 + 10}H${xA + 2}Q${xA} ${y1 + 10} ${xA} ${y1 + 8}V${y1}V${yBL}`,
  // fondo con su lengüeta
  `H${W - 1.5}V${ALTO - 5}Q${W - 1.5} ${ALTO} ${W - 6.5} ${ALTO}H${6.5}Q${1.5} ${ALTO} ${1.5} ${ALTO - 5}V${yBL}H${xF}Z`,
].join('');
const pliegue = [
  ...[xA, xB, xS, xG].map((x) => `M${x} ${y0}V${y1}`),
  `M${xB} ${y0}H${xS}`, `M${xB + 1.5} ${yL}H${xS - 1.5}`, `M${xA} ${y0}H${xB}`, `M${xS} ${y0}H${xG}`,
  `M${xF} ${y1}H${xA}`, `M${1.5} ${yBL}H${W - 1.5}`, `M${xA} ${y1}H${xB}`, `M${xS} ${y1}H${xG}`,
].join('');

// ── Piezas del sistema (las mismas del libro y de las fichas) ──
const MARCA = '<svg class="marca" viewBox="0 0 9 9" aria-hidden="true"><circle cx="4.5" cy="4.5" r="4.3"/><path d="M4.5 0.2V2.4M4.5 6.6V8.8M0.2 4.5H2.4M6.6 4.5H8.8"/><circle class="marca__punto" cx="4.5" cy="4.5" r="0.55"/></svg>';
// Línea de las 15 paradas, la misma curva de la tapa del libro (tapa/tapa.html), redibujada al ancho pedido
const RUTA = [[2, 6], [15.14, 5.2], [28.29, 3.6], [41.43, 3], [54.57, 4.1], [67.71, 5.4], [80.86, 4.6], [94, 3.1], [107.14, 2.3], [120.29, 3], [133.43, 4.4], [146.57, 5.9], [159.71, 6.8], [172.86, 6.1], [186, 5]];
const ruta = (ancho, alto) => {
  const pts = RUTA.map(([x, y]) => [((x - 2) / 184) * (ancho - 1) + 0.5, ((y - 2.3) / 4.5) * (alto - 1) + 0.5]);
  let d = `M${pts[0][0].toFixed(2)} ${pts[0][1].toFixed(2)}`;
  for (let i = 1; i < pts.length; i++) {
    const [p0, p1, p2, p3] = [pts[i - 2] || pts[i - 1], pts[i - 1], pts[i], pts[i + 1] || pts[i]];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6], c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${c1.map((v) => v.toFixed(2)).join(' ')} ${c2.map((v) => v.toFixed(2)).join(' ')} ${p2.map((v) => v.toFixed(2)).join(' ')}`;
  }
  return `<svg class="ruta" viewBox="0 0 ${ancho} ${alto}" style="width:${ancho}mm;height:${alto}mm" aria-hidden="true"><path d="${d}"/>${pts.map(([x, y]) => `<circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="0.42"/>`).join('')}</svg>`;
};

// Cuántas fichas hay de cada tipo, en el orden en que aparecen
const tipos = [];
for (const x of FICHAS) { const t = tipos.find((t) => t[0] === x.categoria); t ? t[1]++ : tipos.push([x.categoria, 1]); }

const at = (x, y, w, h, cls, html = '', extra = '') => `<div class="${cls}" style="left:${x}mm;top:${y}mm;width:${w}mm;height:${h}mm;${extra}">${html}</div>`;

// Fondos impresos: 3 mm de sangrado en los bordes de corte, 1 mm hacia las solapas que no se imprimen
const fondos = [
  at(xB, y0, W, H + B, 'tinta tinta--papel'),
  at(xF - B, y0 - B, W + B, H + B, 'tinta tinta--azul'),
  at(xF - B, y0 - B, W + B, 38 + B, 'tinta tinta--imagen'),
  at(xF - B, y1, W + 2 * B, D + 1, 'tinta tinta--azul'),
  at(xA, y0 - 1, D, H + 2, 'tinta tinta--azul'),
  at(xS, y0 - 1, D, H + 2, 'tinta tinta--azul'),
  at(xB - B, yL - 1, W + 2 * B, D + 1, 'tinta tinta--azul'),
].join('');

const frente = at(xF, y0, W, H, 'panel panel--frente', `
  ${MARCA}
  <p class="f-autor">Charles Darwin</p>
  <h1 class="f-titulo">Darwin<br>en la Argentina</h1>
  <p class="f-sub">Fichas de campo</p>
  ${ruta(W - 12, 4.2)}
  <p class="f-pie"><span>01</span><span>${TOTAL} fichas · 15 paradas · 1832–1834</span><span>15</span></p>`);

const dorso = at(xB, y0, W, H, 'panel panel--dorso', `
  <h2 class="d-titulo">Un territorio<br>en ${TOTAL} fichas</h2>
  <p class="d-texto">Cada ficha toma un pasaje del diario de Charles Darwin en el actual territorio argentino. En el frente, una imagen, el texto original y los datos del registro; en el dorso, la parada en el mapa del recorrido y las notas que acompañan la lectura. Se pueden ordenar por parada, por fecha o por tema, y leer junto al libro y al mapa digital.</p>
  <dl class="d-tipos">${tipos.map(([t, n]) => `<div><dt>${t}</dt><dd>${n}</dd></div>`).join('')}</dl>
  <div class="d-notas">
    <p><span class="notetag">D</span>Nota de Darwin</p>
    <p><span class="notetag">E</span>Nota de la edición española de 1921</p>
    <p><span class="notetag notetag--ed">ED</span>Nota editorial del proyecto</p>
  </div>
  <div class="d-pie">
    <div>
      <p class="d-qr-rotulo"><b>Mapa digital</b>Escaneá el código para recorrer las 15 paradas en el mapa interactivo.</p>
      <p class="d-creditos">Selección a partir de <i>Diario del viaje de un naturalista alrededor del mundo</i>, traducción española de Espasa-Calpe, 1921.</p>
      <p class="d-creditos">Proyecto académico de Diseño Editorial – FAPyD, Universidad Nacional de Rosario. 2026. Patricio Campodonico · Martina Emma Calderón Calp</p>
    </div>
    <img class="d-qr" src="assets/images/qr-mapa-digital.svg" alt="Código QR: enlace al mapa digital">
  </div>`);

const lomo = at(xA, y0, D, H, 'panel panel--lado', `<p class="lado-texto">${MARCA}<b>Darwin en la Argentina</b><span>Fichas de campo</span></p>`);
const lateral = at(xS, y0, D, H, 'panel panel--lado', `<p class="lado-texto"><span>${TOTAL} fichas · 15 paradas · 1832–1834</span></p>`);
// La tapa se lee desde el frente con la caja cerrada: va girada 180°
const tapa = at(xB, yL, W, D, 'panel panel--tapa', `<p class="tapa-texto">${MARCA}<span>Fichas de campo</span></p>`);
const fondo = at(xF, y1, W, D, 'panel panel--tapa', `<p class="tapa-texto tapa-texto--fondo"><span>Diseño Editorial · FAPyD · UNR · 2026</span></p>`);

const rotulos = [
  [xF + W / 2, y0 + H / 2, 'Frente'], [xB + W / 2, y0 + H / 2, 'Dorso'],
].map(([x, y, t]) => `<text x="${x}" y="${y}">${t}</text>`).join('');
const SIN_TINTA = [[xA + D / 2, y0 - 4.5, 'guardapolvo'], [xS + D / 2, y0 - 4.5, 'guardapolvo'], [xA + D / 2, y1 + 5.5, 'guardapolvo'], [xS + D / 2, y1 + 5.5, 'guardapolvo'],
  [xB + W / 2, yL / 2 + 1, 'lengüeta (sin imprimir)'], [W / 2, yBL + TUCK / 2 + 1, 'lengüeta (sin imprimir)']];

const troquel = (guia) => `<svg class="troquel${guia ? ' troquel--guia' : ''}" viewBox="${-B - 10} ${-B - 10} ${ANCHO + 2 * B + 20} ${ALTO + 2 * B + 20}" style="left:${-B - 10}mm;top:${-B - 10}mm;width:${ANCHO + 2 * B + 20}mm;height:${ALTO + 2 * B + 20}mm" aria-hidden="true">
${guia === 'negro' ? `<path fill="none" stroke="#fff" stroke-width="0.45" d="${corte}${pliegue}"/><path fill="none" stroke="#000" stroke-width="0.15" d="${corte}"/><path fill="none" stroke="#000" stroke-width="0.15" stroke-dasharray="1.2 0.8" d="${pliegue}"/>` : ''}
${guia === true ? `<path class="t-corte" d="${corte}"/><path class="t-pliegue" d="${pliegue}"/>
<g class="t-rotulo">${SIN_TINTA.map(([x, y, t]) => `<text x="${x}" y="${y}">${t}</text>`).join('')}<text x="${xG + GLUE / 2}" y="${(y0 + y1) / 2}" transform="rotate(-90 ${xG + GLUE / 2} ${(y0 + y1) / 2})">pegar · sin imprimir</text></g>` : ''}
<g class="t-marcas"><path fill="none" stroke="#000" stroke-width="0.12" d="${[
  // marcas de corte en las esquinas del troquel y de pliegue afuera del sangrado
  ...[0, ANCHO].flatMap((x) => [0, ALTO].map((y) => `M${x} ${y < 1 ? y - B - 2 : y + B + 2}V${y < 1 ? y - B - 7 : y + B + 7}M${x < 1 ? x - B - 2 : x + B + 2} ${y}H${x < 1 ? x - B - 7 : x + B + 7}`)),
  ...[xA, xB, xS, xG].map((x) => `M${x} ${-B - 2}V${-B - 6}M${x} ${ALTO + B + 2}V${ALTO + B + 6}`),
  ...[y0, y1].map((y) => `M${-B - 2} ${y}H${-B - 6}M${ANCHO + B + 2} ${y}H${ANCHO + B + 6}`),
].join('')}"/></g>
</svg>`;

const caja = (guia) => `<div class="troquel-arte" style="left:${OX}mm;top:${OY}mm;width:${ANCHO}mm;height:${ALTO}mm">
<div class="arte">${fondos}${frente}${lomo}${dorso}${lateral}${tapa}${fondo}</div>
${troquel(guia)}
</div>`;

const OX = (210 - ANCHO) / 2, OY = 34;

const css = `
.hoja { position: relative; width: 210mm; height: 297mm; overflow: hidden; break-after: page; background: #fff; }
.troquel-arte { position: absolute; }
.arte { position: absolute; inset: 0; overflow: visible; }
.arte > div { position: absolute; box-sizing: border-box; }
.tinta--papel { background: var(--paper); }
.tinta--azul { background: var(--blue-deep); }
.tinta--imagen { background: url(assets/images/caja-san-julian.jpg) 50% 47% / cover no-repeat; }
.panel { color: var(--paper); font-family: var(--font-ui); font-kerning: normal; font-synthesis: none; }
.panel p, .panel h1, .panel h2, .panel dl, .panel dd { margin: 0; font-weight: 400; }
.panel > * { position: absolute; }

/* Frente: la tapa del libro en vertical */
.panel--frente .marca { left: 6mm; top: 43.5mm; width: 6mm; height: 6mm; }
.f-autor { left: 14.5mm; top: 44.6mm; font-size: 6.5pt; font-weight: 500; line-height: 3.75mm; }
.f-titulo { left: 6mm; right: 5mm; top: 53mm; font-family: var(--font-display); font-size: 21pt; line-height: 8.4mm; letter-spacing: -0.01em; }
.f-sub { left: 6mm; top: 71.5mm; font-family: var(--font-display); font-style: italic; font-size: 12pt; line-height: 5mm; }
.panel--frente .ruta { left: 6mm; top: 89mm; }
.f-pie { left: 6mm; right: 6mm; top: 94.6mm; display: flex; justify-content: space-between; font-size: 5.5pt; font-weight: 500; line-height: 3mm; }
.ruta { display: block; overflow: visible; }
.ruta path { fill: none; stroke: currentColor; stroke-width: 0.2; }
.ruta circle { fill: currentColor; }

/* Dorso: papel, como la contratapa */
.panel--dorso { color: var(--blue-deep); }
.d-titulo { left: 6mm; right: 6mm; top: 7mm; font-family: var(--font-display); font-size: 14pt; line-height: 6mm; letter-spacing: -0.005em; }
.d-texto { left: 6mm; right: 6mm; top: 22.5mm; font-size: 6.25pt; line-height: 2.95mm; text-align: justify; hyphens: auto; }
.d-tipos { left: 6mm; right: 6mm; top: 46mm; display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.4mm 2mm; padding-top: 1.6mm;
  background: linear-gradient(var(--blue-deep), var(--blue-deep)) top / 100% var(--rule-fine) no-repeat; }
.d-tipos div { display: flex; gap: 1.2mm; font-size: 5.5pt; line-height: 2.6mm; }
.d-tipos dt { font-weight: 500; } .d-tipos dd { font-weight: 700; font-variant-numeric: tabular-nums; }
.d-notas { left: 6mm; right: 6mm; top: 58.5mm; display: grid; gap: 1.1mm; }
.d-notas p { font-size: 5.75pt; line-height: 3mm; }
.panel--dorso .notetag { box-shadow: inset 0 0 0 var(--rule-fine) var(--blue-deep); color: var(--blue-deep); margin-right: 1.6mm; min-width: 4mm; }
.panel--dorso .notetag--ed { background: var(--blue-deep); color: var(--paper); }
.d-pie { left: 6mm; right: 6mm; top: 74mm; bottom: 6mm; display: grid; grid-template-columns: 1fr 21mm; column-gap: 3mm; padding-top: 2mm;
  background: linear-gradient(var(--blue-deep), var(--blue-deep)) top / 100% var(--rule-fine) no-repeat; }
.d-pie > div { display: flex; flex-direction: column; gap: 1.6mm; }
.d-qr-rotulo { font-size: 6pt; line-height: 2.9mm; }
.d-qr-rotulo b { display: block; font-weight: 700; }
.d-creditos { font-size: 4.75pt; line-height: 2.35mm; color: var(--blue-80); }
.d-qr { width: 21mm; height: 21mm; display: block; align-self: start; }

/* Lomo y lateral: texto de abajo hacia arriba */
.lado-texto { left: 50%; top: 50%; width: ${H - 10}mm; transform: translate(-50%, -50%) rotate(-90deg); display: flex; align-items: center; justify-content: center; gap: 1.6mm;
  font-size: 7pt; line-height: 4mm; white-space: nowrap; }
.lado-texto b { font-weight: 600; }
.lado-texto span { font-weight: 400; }
.lado-texto .marca { position: static; width: 4.4mm; height: 4.4mm; }

/* Tapas */
.tapa-texto { inset: 0; display: flex; align-items: center; justify-content: center; gap: 1.8mm; transform: rotate(180deg); font-size: 6.5pt; font-weight: 600; }
.tapa-texto .marca { position: static; width: 4.4mm; height: 4.4mm; }
.tapa-texto--fondo { transform: none; font-size: 5.5pt; font-weight: 500; }

/* Troquel: corte continuo, pliegue a trazos (solo en la hoja guía) */
.troquel { position: absolute; overflow: visible; }
.t-corte { fill: none; stroke: #E6007E; stroke-width: 0.2; }
.t-pliegue { fill: none; stroke: #E6007E; stroke-width: 0.2; stroke-dasharray: 1.2 0.8; }
.t-rotulo text { font: 500 1.3px Inter, Arial, sans-serif; fill: #9a9a9a; text-anchor: middle; }
.t-marcas path { fill: none; stroke: #000; stroke-width: 0.12; }
.hoja__rotulo { position: absolute; left: 14mm; right: 14mm; margin: 0; font: 500 6pt/3.2mm Inter, Arial, sans-serif; color: #000; }
.hoja__rotulo b { font-weight: 700; }
.leyenda { display: inline-flex; align-items: center; gap: 1mm; margin-right: 4mm; }
.leyenda i { display: inline-block; width: 6mm; border-top: 0.25mm solid #E6007E; }
.leyenda i.p { border-top-style: dashed; }
@media screen { body { background: #8f9499; } .hoja { margin: 8mm auto; } }
`;

const rotulo = (txt) => `<p class="hoja__rotulo" style="top:${OY + ALTO + B + 14}mm">${txt}</p>`;
const datos = `Caja de las fichas · estuche con solapas · interior ${W} × ${H} × ${D} mm (para ${TOTAL} fichas de 74 × 105 mm) · troquel ${ANCHO} × ${ALTO} mm · sangrado 3 mm`;
const hojas = [
  `<div class="hoja">${caja(true)}${rotulo(`<b>Hoja guía</b> · ${datos}<br><span class="leyenda"><i></i>corte</span><span class="leyenda"><i class="p"></i>pliegue</span>El troquel (magenta) no se imprime en la versión final: es la guía para cortar y doblar.<br>Imprimir al 100 % en cartulina de 300–350 g, de un solo lado. Pegar la solapa por dentro del frente.`)}</div>`,
  `<div class="hoja">${caja(false)}${rotulo(`<b>Para imprimir</b> · ${datos} · marcas de corte y de pliegue fuera del sangrado`)}</div>`,
];

// Preentrega: el arte con el troquel en negro fino, para cortar y doblar a mano
const preentrega = `<div class="hoja">${caja('negro')}${rotulo(`<b>Preentrega</b> · ${datos}<br><span class="leyenda"><i style="border-color:#000"></i>corte</span><span class="leyenda"><i class="p" style="border-color:#000"></i>pliegue</span>Imprimir al 100 % en cartulina de 300–350 g, de un solo lado. Las partes en blanco no llevan tinta; la solapa angosta se pega por dentro del frente.`)}</div>`;

const html = (hojas) => `<!doctype html>
<!-- GENERADO por caja.mjs — no editar a mano. -->
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=800">
<title>Darwin en la Argentina — caja de las fichas</title>
<link rel="stylesheet" href="styles/fichas.css">
<style>@page { size: 210mm 297mm; margin: 0; } html, body { display: block; padding: 0; margin: 0; }${css}</style>
</head>
<body>
${hojas.join('\n')}
</body>
</html>
`;
writeFileSync(join(ROOT, 'caja.html'), html(hojas));
writeFileSync(join(ROOT, 'caja-preentrega.html'), html([preentrega]));
console.log(`Caja: troquel ${ANCHO} × ${ALTO} mm · interior ${W} × ${H} × ${D} mm`);

const chrome = ['C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'].find(existsSync);
const run = (args) => execFileSync(chrome, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--virtual-time-budget=5000', ...args], { stdio: 'ignore' });
const url = pathToFileURL(join(ROOT, 'caja.html')).href;
if (cmd !== 'html') {
  run([`--print-to-pdf=${join(ROOT, 'salida', 'caja-imprenta.pdf')}`, '--no-pdf-header-footer', url]);
  // Captura de la hoja guía a 3 px por mm
  run(['--force-device-scale-factor=3.78', '--window-size=794,1123', `--screenshot=${join(ROOT, 'salida', 'caja.png')}`, url]);
  const urlP = pathToFileURL(join(ROOT, 'caja-preentrega.html')).href;
  run([`--print-to-pdf=${join(ROOT, 'salida', 'caja-preentrega.pdf')}`, '--no-pdf-header-footer', urlP]);
  run(['--force-device-scale-factor=3.78', '--window-size=794,1123', `--screenshot=${join(ROOT, 'salida', 'caja-preentrega.png')}`, urlP]);
  console.log('PDF y captura en salida/');
}
