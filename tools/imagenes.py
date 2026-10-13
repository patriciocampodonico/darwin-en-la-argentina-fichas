# Prepara las ilustraciones de las fichas a partir de los originales del libro (solo lectura):
# recorte a la caja de la ficha y paso a las dos tintas del sistema, igual que LIBRO/book/tools/fotos.py.
# Uso: py tools/imagenes.py        (escribe assets/images/NN-nombre.jpg y salida/_imagenes.jpg para revisarlas)
import glob, os, re
from PIL import Image, ImageOps, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LIBRO = os.path.join(ROOT, '..', 'LIBRO', 'book')
SRC = os.path.join(LIBRO, 'assets', 'images', 'originales')
OUT = os.path.join(ROOT, 'assets', 'images')
INK, PAPER = '#1A3A5C', '#EFEEE6'

# Caja de imagen del anverso: 74 × 41,25 mm (11 líneas) + 3 mm de sangrado arriba y a los lados
CAJA = (80, 44.25)
# Lámina: entra entera dentro de la caja, con 3 mm de aire
LAMINA = (68, 35.25)

# Los originales «Imagen de ChatGPT…» no llevan nombre: el libro los asigna por orden de descarga
# a la lista FOTOS de su tools/fotos.py. Acá se lee esa lista para encontrar el original de cada página.
orden = re.findall(r"^\s+\('(\d{3}[ab]?)', '[\w-]+',", open(os.path.join(LIBRO, 'tools', 'fotos.py'), encoding='utf-8').read(), re.M)
sueltos = sorted(glob.glob(os.path.join(SRC, 'Imagen*.png')), key=os.path.getmtime)
assert len(orden) == len(sueltos), f'{len(sueltos)} originales para {len(orden)} cajas'
DE_PAGINA = dict(zip(orden, sueltos))

# ficha, nombre, original (página del libro o archivo), modo (c = llena la caja a sangre, l = lámina entera sobre papel),
# foco x, foco y del recorte (0–1)
FICHAS = [
    ('01', 'fagus-betuloides', '016a', 'l', .5, .5),
    ('02', 'bosque-fueguino', '014-015-bosque.webp', 'c', .72, .62),
    ('03', 'salina', '024', 'c', .5, .47),
    ('04', 'cristales', '022a-padre.webp', 'l', .5, .5),
    ('05', 'flamenco', '023d-flamenco.webp', 'l', .5, .5),
    ('06', 'walleechu', '028', 'c', .5, .42),
    ('07', 'aguti', '030', 'l', .5, .5),
    ('08', 'yeguada', '031', 'c', .5, .62),
    ('09', 'posta', '034', 'c', .5, .52),
    ('10', 'punta-alta', '036', 'c', .5, .55),
    ('11', 'megatherium', 'tapa-megatherium.webp', 'l', .5, .5),
    ('12', 'scelidotherium', '042', 'l', .5, .5),
    ('13', 'sierra-de-la-ventana', '051', 'c', .4, .5),
    ('14', 'fogon', '053', 'c', .5, .52),
    ('15', 'cuadricula', '060-afueras.webp', 'l', .5, .5),
    ('16', 'cardal', '065', 'c', .5, .3),
    ('17', 'vizcacha', '17-vizcacha.webp', 'l', .5, .5),  # imagen nueva (ChatGPT, 12 oct. 2026): reemplaza la del libro, que parecía un conejo
    ('18', 'parana-rosario', '068', 'c', .5, .5),
    ('19', 'barranca', '070', 'c', .5, .45),
    ('20', 'diente-caballo', '076', 'l', .5, .5),
    ('21', 'ciudad-sitiada', '21-ciudad-sitiada.webp', 'c', .5, .55),  # imagen nueva (ChatGPT, 12 oct. 2026): assets/originales/
    ('22', 'guanaco', '086', 'c', .5, .45),
    ('23', 'macrauchenia', '092', 'l', .5, .5),
    ('24', 'sirga', '096', 'c', .5, .55),
]

hechas = []
for num, name, src, mode, fx, fy in FICHAS:
    propia = os.path.join(ROOT, 'assets', 'originales', src)  # imágenes hechas para las fichas
    f = DE_PAGINA[src] if src in DE_PAGINA else propia if os.path.exists(propia) else os.path.join(SRC, src)
    im = Image.open(f).convert('L')
    w, h = im.size
    if mode == 'c':
        ar = CAJA[0] / CAJA[1]
        cw, ch = (w, round(w / ar)) if w / h < ar else (round(h * ar), h)
        x0 = min(max(round(fx * w - cw / 2), 0), w - cw)
        y0 = min(max(round(fy * h - ch / 2), 0), h - ch)
        im = ImageOps.autocontrast(im.crop((x0, y0, x0 + cw, y0 + ch)), cutoff=0.5)
        mm = CAJA[0]
    else:
        # Lámina: el fondo de papel de la imagen pasa a blanco para fundirse con la ficha
        bg = sorted(im.resize((64, 64)).get_flattened_data())[int(64 * 64 * .6)]
        lut = [min(255, round(255 * (v - 40) / (bg - 12 - 40))) if v > 40 else 0 for v in range(256)]
        im = im.point(lut)
        im = im.crop(ImageOps.invert(im).point(lambda v: 255 if v > 24 else 0).getbbox())  # recorte al dibujo
        w, h = im.size
        mm = LAMINA[0] if w / h > LAMINA[0] / LAMINA[1] else LAMINA[1] * w / h
    im = ImageOps.colorize(im, black=INK, white=PAPER)
    out = os.path.join(OUT, f'{num}-{name}.jpg')
    im.save(out, quality=92)
    hechas.append((num, name, im))
    print(num, os.path.basename(f)[-22:], '->', os.path.basename(out), im.size, f'{round(im.size[0] / mm * 25.4)} ppp')

# Hoja de revisión: todos los recortes juntos
cols, cw, ch = 6, 320, 200
hoja = Image.new('RGB', (cols * cw, ((len(hechas) + cols - 1) // cols) * ch), 'white')
d = ImageDraw.Draw(hoja)
for i, (num, name, im) in enumerate(hechas):
    t = im.copy(); t.thumbnail((cw - 8, ch - 22))
    x, y = (i % cols) * cw + 4, (i // cols) * ch + 2
    hoja.paste(t, (x, y)); d.text((x, y + ch - 20), f'{num} {name}', fill='black')
hoja.save(os.path.join(ROOT, 'salida', '_imagenes.jpg'), quality=85)
