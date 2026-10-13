// División silábica del español para el corte de palabras a fin de línea.
// El build inserta guiones opcionales (U+00AD) en el cuerpo de texto: así el justificado
// puede partir palabras con criterio y no abrir ríos. Los archivos de página no se tocan.

const FUERTE = 'aeoáéóíú';          // las débiles con tilde rompen el diptongo
const VOCAL = 'aeiouáéíóúü';
const INSEPARABLE = new Set(['pr', 'br', 'tr', 'dr', 'cr', 'gr', 'fr', 'pl', 'bl', 'cl', 'gl', 'fl', 'ch', 'll', 'rr', 'qu']);

export function silabas(palabra) {
  const w = palabra.toLowerCase();
  const esVocal = (i) => VOCAL.includes(w[i]) && !(w[i] === 'u' && w[i - 1] === 'q');
  const cortes = [];
  let i = 0;
  while (i < w.length && !esVocal(i)) i++;                 // consonantes iniciales
  while (i < w.length) {
    let j = i;                                             // núcleo vocálico
    while (j + 1 < w.length && esVocal(j + 1) && !(FUERTE.includes(w[j]) && FUERTE.includes(w[j + 1]))) j++;
    if (j + 1 < w.length && esVocal(j + 1)) { cortes.push(j + 1); i = j + 1; continue; }   // hiato
    let k = j + 1;
    while (k < w.length && !esVocal(k)) k++;               // consonantes hasta la vocal siguiente
    if (k >= w.length) break;
    const n = k - (j + 1);
    const par = w.slice(k - 2, k);
    let corte;
    if (n === 0) corte = k;
    else if (n === 1) corte = j + 1;
    else if (n === 2) corte = INSEPARABLE.has(par) ? j + 1 : j + 2;
    else corte = INSEPARABLE.has(par) ? k - 2 : k - 1;
    cortes.push(corte);
    i = k;
  }
  const partes = [];
  let prev = 0;
  for (const c of cortes) { partes.push(palabra.slice(prev, c)); prev = c; }
  partes.push(palabra.slice(prev));
  return partes;
}

// Guiones opcionales: palabras en minúscula de 6 letras o más; al menos 2 letras antes y 3 después.
// No se parten nombres propios ni palabras con mayúscula inicial.
export function guionesOpcionales(texto) {
  return texto.replace(/(?<![\p{L}­])\p{Ll}{6,}(?![\p{L}])/gu, (palabra) => {
    const s = silabas(palabra);
    let out = s[0], izq = s[0].length;
    for (let n = 1; n < s.length; n++) {
      const der = palabra.length - izq;
      out += (izq >= 2 && der >= 3 ? '­' : '') + s[n];
      izq += s[n].length;
    }
    return out;
  });
}

// Aplica los guiones al texto (no a las etiquetas) de un fragmento HTML.
export const guionesEnHtml = (html) => html.replace(/>([^<]+)</g, (_, t) => '>' + guionesOpcionales(t) + '<');
