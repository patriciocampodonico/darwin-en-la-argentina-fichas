"""Pliegos A3 doble faz: la caja a sangre + fichas 8–14 en el espacio que sobra, y las fichas 15–24.
(Las fichas 1–7 ya se imprimieron con la caja la vez anterior.)

Toma las piezas ya armadas (vectoriales) de salida/caja-preentrega-A4.pdf y salida/fichas-doble-faz-A3.pdf:
frentes a sangre al corte exacto, dorsos con 3 mm de demasía, espejados para voltear por el lado largo.
La caja es de una sola cara: en el dorso su lugar queda en blanco. Sin marcas ni texto.

    py tools/pliego_caja.py   →  salida/caja-y-fichas-A3.pdf
"""
from pathlib import Path
import pymupdf

ROOT = Path(__file__).resolve().parent.parent
SAL = ROOT / 'salida'
MM = 72 / 25.4
W, H, FW, FH, GAP, DEM = 297, 420, 74, 105, 6, 3

# Caja (caja.mjs): troquel 189 × 161 mm, centrada en la A4 con OY = 34
CW, CH = 189, 161
COX, COY = (210 - CW) / 2, 34

# Grilla del A3 de fichas (build.mjs): 3 × 3, 6 mm entre fichas
GX, GY = (W - (3 * FW + 2 * GAP)) / 2, (H - (3 * FH + 2 * GAP)) / 2


def r(x, y, w, h):
    return pymupdf.Rect(x * MM, y * MM, (x + w) * MM, (y + h) * MM)


def origen(k):
    """Página y lugar de la ficha k (0–23) en fichas-doble-faz-A3.pdf."""
    s, j = divmod(k, 9)
    fila, col = divmod(j, 3)
    x, y = GX + col * (FW + GAP), GY + fila * (FH + GAP)
    xd = GX + (2 - col) * (FW + GAP)
    return 2 * s, r(x, y, FW, FH), 2 * s + 1, r(xd - DEM, y - DEM, FW + 2 * DEM, FH + 2 * DEM)


def poner(frente, dorso, fichas, lugares):
    for k, (x, y) in zip(fichas, lugares):
        pf, rf, pd, rd = origen(k)
        frente.show_pdf_page(r(x, y, FW, FH), A3, pf, clip=rf)
        xd = W - x - FW  # espejado: doble faz volteando por el lado largo
        dorso.show_pdf_page(r(xd - DEM, y - DEM, FW + 2 * DEM, FH + 2 * DEM), A3, pd, clip=rd)


A3 = pymupdf.open(SAL / 'fichas-doble-faz-A3.pdf')
CAJA = pymupdf.open(SAL / 'caja-preentrega-A4.pdf')
out = pymupdf.open()


def par():
    for _ in range(2):
        out.new_page(width=W * MM, height=H * MM)
    return out[-2], out[-1]


# Pliego 1: caja arriba a la izquierda, una ficha a su derecha, dos filas de tres abajo
mx = (W - (CW + GAP + FW)) / 2
my = (H - (CH + GAP + 2 * FH + GAP)) / 2
xd = mx + CW + GAP
y2 = my + CH + GAP
lugares = [(xd, my)] + [(xd - c * (FW + GAP), y2 + f * (FH + GAP)) for f in range(2) for c in (2, 1, 0)]
fr, do = par()
fr.show_pdf_page(r(mx, my, CW, CH), CAJA, 0, clip=r(COX, COY, CW, CH))
poner(fr, do, range(7, 14), lugares)

# Pliegos siguientes: el resto de las fichas en la grilla 3 × 3 de siempre
grilla = [(GX + c * (FW + GAP), GY + f * (FH + GAP)) for f in range(3) for c in range(3)]
resto = list(range(14, 24))
for i in range(0, len(resto), 9):
    fr, do = par()
    poner(fr, do, resto[i:i + 9], grilla)

# Último pliego: le sumamos una caja de repuesto (mismo armado que el pliego 1)
fr.show_pdf_page(r(mx, y2, CW, CH), CAJA, 0, clip=r(COX, COY, CW, CH))

# Imágenes a 300 ppp como máximo, para que el PDF quede por debajo de 10 MB
# (las fotos de las fichas miden ~74 mm de ancho: 1000 px ≈ 340 ppp)
import io
from PIL import Image
hechas = set()
for pg in out:
    for img in pg.get_images(full=True):
        xref, smask, w, h = img[0], img[1], img[2], img[3]
        if xref in hechas or smask or (max(w, h) <= 1000 and len(out.xref_stream_raw(xref)) < 150_000):
            continue
        hechas.add(xref)
        pil = Image.open(io.BytesIO(out.extract_image(xref)['image'])).convert('RGB')
        pil.thumbnail((1000, 1000), Image.LANCZOS)
        buf = io.BytesIO()
        pil.save(buf, 'JPEG', quality=78, optimize=True)
        pg.replace_image(xref, stream=buf.getvalue())
tmp = out.tobytes(garbage=4, deflate=True)
out = pymupdf.open('pdf', tmp)  # segunda pasada: une las fotos repetidas
out.save(SAL / 'caja-y-fichas-A3.pdf', garbage=4, deflate=True)
print(f'caja-y-fichas-A3.pdf · {out.page_count} páginas A3 (frente y dorso) · caja + fichas 8–24')
