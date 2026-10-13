# Recorta el mockup fotográfico de las fichas de su fondo gris (fondo y sombra pasan a transparente),
# con el mismo criterio que LIBRO/book/tools/recorte.py. Uso: py tools/mockup.py
import os
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy import ndimage as nd

D = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'assets', 'mockup')
im = Image.open(os.path.join(D, 'mockup-fichas.webp')).convert('RGB')
a = np.asarray(im.filter(ImageFilter.GaussianBlur(1.2))).astype(int)
r, b = a[..., 0], a[..., 2]
# El fondo y su sombra son grises fríos (poca saturación); el papel es cálido (rojo > azul) y el dorso es azul saturado
papel = (r - b) > 4
azul = (b - r) > 45
# La ilustración del guanaco (ficha del medio) es azul grisáceo, casi como el fondo: su zona se marca a mano
# con las esquinas medidas sobre el original (1774 × 887 px)
guanaco = Image.new('L', [s * 4 for s in im.size], 0)
ImageDraw.Draw(guanaco).polygon([(x * 4, y * 4) for x, y in [(730, 49.5), (1166, 80.5), (1145, 360), (695, 330)]], fill=255)
guanaco = np.asarray(guanaco.resize(im.size, Image.LANCZOS)) > 127
obj = nd.binary_fill_holes(nd.binary_closing(nd.binary_opening(papel | azul, iterations=2), iterations=4) | guanaco)
lab, n = nd.label(obj)
tam = nd.sum(obj, lab, range(1, n + 1))
obj = np.isin(lab, [i + 1 for i, t in enumerate(tam) if t > 0.02 * obj.size])
# Canto del mazo (gris, como la sombra): la máscara se extiende hacia abajo solo bajo la ficha de la izquierda
canto = nd.binary_dilation(obj, structure=np.ones((25, 1)), origin=(-12, 0))
canto[:, int(obj.shape[1] * .46):] = False
obj = nd.binary_fill_holes(obj | canto)
obj = nd.gaussian_filter(obj.astype(float), 2) > 0.5
alpha = Image.fromarray((obj * 255).astype('uint8')).filter(ImageFilter.GaussianBlur(0.7))
out = im.convert('RGBA'); out.putalpha(alpha); out = out.crop(alpha.getbbox())
out.save(os.path.join(D, '007-mockup-fichas.png')); print(out.size)
# Control: el recorte sobre el papel del libro
fondo = Image.new('RGBA', out.size, '#EFEEE6'); fondo.alpha_composite(out)
fondo.convert('RGB').save(os.path.join(D, '_control.jpg'), quality=88)
