// Cotejo de los textos de las fichas. Uso: node tools/cotejo.mjs
// 1) LIBRO: cada tramo del texto de Darwin (entre cortes […]) y cada nota D / E tiene que estar, letra por letra,
//    en las páginas del libro (LIBRO/book/pages), que son la selección v2 ya cotejada.
// 2) ESCANEO: cada tramo se busca en la capa de texto del escaneo (LIBRO/crudo.txt), comparando solo letras
//    (sin tildes, espacios ni signos, porque el reconocimiento los daña). De ahí sale también el capítulo.
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { FICHAS } from '../datos/fichas.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const LIBRO = join(ROOT, '..', 'LIBRO');
const limpio = (h) => h.replace(/<!--[^]*?-->/g, '').replace(/<svg[^]*?<\/svg>/g, ' ').replace(/<[^>]+>/g, '').replace(/­/g, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
const letras = (t) => t.normalize('NFD').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();

const paginas = Object.fromEntries(readdirSync(join(LIBRO, 'book', 'pages')).map((f) => [f.slice(0, 3), limpio(readFileSync(join(LIBRO, 'book', 'pages', f), 'utf8'))]));
const todo = Object.values(paginas).join(' ');
const crudo = readFileSync(join(LIBRO, 'crudo.txt'), 'utf8');
// Capítulos del escaneo, por posición de su título
const ROMANOS = ['IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'];
const caps = [...crudo.matchAll(/^CAP[IÍ]TULO\s+\S+/gm)].map((m, i) => ({ cap: ROMANOS[i], pos: letras(crudo.slice(0, m.index)).length }));
const crudoL = letras(crudo.replace(/-\r?\n/g, ''));
const capDe = (pos) => caps.filter((c) => c.pos <= pos).pop()?.cap;

let fallas = 0;
for (const x of FICHAS) {
  const tramos = limpio(x.darwin).split('[…]').map((t) => t.trim()).filter(Boolean);
  const fuente = x.fuente.map((p) => paginas[p]).join(' ');
  const avisos = [];
  const capitulos = new Set();
  for (const t of tramos) {
    if (!fuente.includes(t)) avisos.push(`NO ESTÁ EN EL LIBRO (pág. ${x.fuente.join(', ')}): «${t.slice(0, 60)}…»`);
    const pos = crudoL.indexOf(letras(t));
    if (pos < 0) {
      // el reconocimiento falla en alguna palabra: se prueba por mitades para ubicar el tramo
      const l = letras(t); let a = -1, b = -1;
      for (let i = 0; i + 30 <= l.length && a < 0; i += 15) a = crudoL.indexOf(l.slice(i, i + 30));
      if (a < 0 && b < 0) avisos.push(`no se ubicó en el escaneo: «${t.slice(0, 60)}…»`);
      else { avisos.push(`escaneo: coincide en parte (reconocimiento dañado): «${t.slice(0, 50)}…»`); capitulos.add(capDe(a >= 0 ? a : b)); }
    } else capitulos.add(capDe(pos));
  }
  for (const [tag, n] of x.notas) if (tag !== 'ED')
    for (const t of limpio(n).split('[…]').map((s) => s.trim()).filter(Boolean)) if (!todo.includes(t)) avisos.push(`NOTA ${tag} NO ESTÁ EN EL LIBRO: «${t.slice(0, 60)}…»`);
  // Citas entre comillas dentro de las notas ED: también tienen que estar en el libro
  for (const [tag, n] of x.notas) if (tag === 'ED')
    for (const [, cita] of limpio(n).matchAll(/«([^»]{12,})»/g)) if (!todo.includes(cita.replace(/[.,;:]$/, ''))) avisos.push(`cita en nota ED que no está en el libro: «${cita}»`);
  const cap = [...capitulos].join('/');
  if (cap !== x.capitulo) avisos.push(`capítulo: la ficha dice ${x.capitulo}, el escaneo ubica el texto en ${cap || '?'}`);
  fallas += avisos.filter((a) => /NO ESTÁ|capítulo|no se ubicó|cita/.test(a)).length;
  console.log(`${x.num} ${x.titulo.padEnd(22)} cap. ${cap.padEnd(5)} ${avisos.length ? '\n   · ' + avisos.join('\n   · ') : 'libro ✓  escaneo ✓'}`);
}
console.log(fallas ? `\n${fallas} punto(s) para revisar.` : '\nTodo coincide con el libro.');
