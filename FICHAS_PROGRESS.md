# FICHAS_PROGRESS — fichas de campo

Tercera pieza del sistema «Darwin en la Argentina» (libro + mapa digital + fichas). No se toca nada dentro de LIBRO ni de WEB.

Estados: propuesta / trabajando / revisión / APROBADA.

Resumen (12 oct. 2026): 24 de 24 fichas en revisión · sistema y lista aprobados por Patricio · pendiente: mockup de la pág. 007.

## Sistema (aprobado por Patricio el 12 oct. 2026, con el QR agrandado)
- Formato: A7 vertical, 74 × 105 mm, sangrado 3 mm (TP4). Línea de base de 3,75 mm = 28 líneas, como las 28 del libro. Márgenes laterales 5 mm.
- Anverso (papel), tres franjas del TP4 (40 / 45 / 15 %): imagen (11 líneas) · rótulo + título + texto de Darwin (13) · metadata fija: fecha, parada, capítulo del diario (4).
- Reverso (azul pleno): marca del sistema y número de ficha · mapa del recorrido con la parada marcada · parada, fecha y medio de viaje · notas D / E / ED · página del libro, capítulo y QR del mapa digital (17 mm).
- Tipografías, colores, código de notas (D y E en contorno, ED llena), baldosa de registro y marca: copiados del libro.
- Texto de Darwin: Lora 8 pt / 3,75 mm, justificado con el silabeo del libro (tools/silabas.mjs, copia). Hasta 8 líneas. Sale literal de LIBRO/book/pages, con […] en los cortes.
- Título: Playfair 17 pt, una sola línea (hasta unos 20 caracteres).
- Fechas, nombres de parada y medio de viaje: los de las páginas 008–009 y 102 del libro (datos/fichas.mjs → PARADAS).
- Mapa del reverso: misma cartografía (assets/maps/geo.json, copia) y mismas coordenadas de parada que tools/mapas.mjs del libro. El recorrido del Santa Cruz se corta antes de la Cordillera.
- Imágenes: tools/imagenes.py lee los originales del libro (solo lectura) y escribe en assets/images/. Dos modos: lámina entera sobre papel, o imagen a sangre.

## Cómo se arma
- `py tools/imagenes.py` → recortes en assets/images/ y hoja de control salida/_imagenes.jpg.
- `node tools/cotejo.mjs` → compara cada texto de Darwin y cada nota D / E con las páginas del libro (letra por letra) y con el escaneo (solo letras); también controla el capítulo.
- `node build.mjs` → index.html (revisión), pantalla.html e imprenta.html.
- `node build.mjs revisar` → avisa si algún texto no entra en su caja y deja hojas de seis fichas en salida/_bloque-N.png.
- `node build.mjs shot 11` → salida/ficha-11.png (y con líneas de base).
- `node build.mjs pdf` → salida/fichas-pantalla.pdf (una cara por página, 74 × 105 mm) y salida/fichas-imprenta.pdf (A4, 4 fichas por pliego, sangrado 3 mm, marcas de corte; cada pliego de anversos va seguido de su pliego de reversos, espejado para doble faz con volteo por el lado largo).

## Fichas
| N.º | Parada | Título | Categoría | Pág. libro (texto) | Imagen (original del libro) | Estado |
|---|---|---|---|---|---|---|
| 01 | 01 | Fagus betuloides | Flora | 016 | 016a | revisión |
| 02 | 01 | El bosque fueguino | Paisaje | 015 | 014-015-bosque | revisión |
| 03 | 02 | La salina | Territorio | 021 | 024 | revisión |
| 04 | 02 | Cristales y sales | Materiales | 022 | 022a-padre | revisión |
| 05 | 02 | Flamencos | Fauna | 023 | 023d-flamenco | revisión |
| 06 | 03 | Walleechu | Observación | 028 | 028 | revisión |
| 07 | 03 | Agutí | Fauna | 030 | 030 | revisión |
| 08 | 03 | Cruzar el Colorado | Observación | 031 | 031 | revisión |
| 09 | 04 | La posta | Observación | 034 | 034 | revisión |
| 10 | 05 | Punta Alta | Territorio | 036 | 036 | revisión |
| 11 | 05 | Megatherium | Fósil | 044 | tapa-megatherium | revisión (muestra aprobada) |
| 12 | 05 | Scelidotherium | Fósil | 038 | 042 | revisión |
| 13 | 06 | Sierra de la Ventana | Territorio | 051 | 051 | revisión |
| 14 | 07 | El fogón | Observación | 053 | 053 | revisión |
| 15 | 08 | La cuadrícula | Territorio | 061 | 060-afueras | revisión |
| 16 | 09 | Cardos gigantes | Flora | 065 | 065 | revisión |
| 17 | 09 | Vizcacha | Fauna | 066 | assets/originales/17-vizcacha.webp (nueva) | revisión |
| 18 | 09 | El Paraná en Rosario | Territorio | 068 | 068 | revisión |
| 19 | 10 | El mastodonte | Fósil | 071 | 070 | revisión |
| 20 | 11 | Diente de caballo | Fósil | 076–077 | 076 | revisión |
| 21 | 12 | La ciudad sitiada | Observación | 083 | assets/originales/21-ciudad-sitiada.webp (nueva) | revisión |
| 22 | 13 | Guanaco | Fauna | 086 | 086 | revisión |
| 23 | 14 | Macrauchenia | Fósil | 092 | 092 | revisión |
| 24 | 15 | Contra la corriente | Observación | 096 | 096 | revisión |

## Decisiones de la tanda del 12 oct. 2026
- Títulos acortados para que entren en una línea, tomados de los títulos de página del libro cuando existen: «Cristales y sales» (022), «Walleechu» (028), «Contra la corriente» (096). Otros: «Cruzar el Colorado» (libro: «Cruzar el Río Colorado»), «La cuadrícula», «El mastodonte», «Diente de caballo», «Agutí», «Macrauchenia» (los nombres completos de la edición van en el texto o en la nota).
- Llamadas de nota (1), (3) conservadas en el texto, como en el libro; la nota D o E correspondiente va en el reverso (01, 15, 20, 22). En la 13, la nota E de la altura de la sierra va sin llamada porque el fragmento elegido no la trae.
- Grafías de la fuente que se dejan como en el libro: «asi» (11), «mi» (13), «mas que» (16), «Africa» (09), «fué». Las tres del medio llevan nota ED en el reverso.
- Guanaco (22): se quitó una oración («En el estado de naturaleza…») con […] para que el texto entre en 8 líneas.
- Punta Alta (10): se usa el original completo de la imagen (1536 × 1024), no la franja del libro: queda a 488 ppp. Ya no es un problema de resolución.
- Capítulos verificados con el escaneo: 01–02 cap. X · 03–10 cap. IV · 11–12 cap. V · 13–15 cap. VI · 16–20 cap. VII · 22–23 cap. VIII · 24 cap. IX.
- Resolución de las imágenes: 325 ppp las más bajas (06, 16, 19, que salen de originales verticales); el resto, de 398 a 1105 ppp.
- QR: 17 mm (pedido de Patricio). Falta probarlo con un teléfono sobre una impresión.

## Cotejo
- `node tools/cotejo.mjs`: los 23 textos y las notas D / E coinciden letra por letra con las páginas del libro. En el escaneo, 18 coinciden enteros; 01, 04, 10, 12 y 23 coinciden en parte porque el reconocimiento está dañado en alguna palabra (son pasajes que el libro ya corrigió y anotó).
- Falta el cotejo a la vista contra las páginas escaneadas (lo mismo que tiene pendiente el libro).

## Problemas abiertos
- Ficha 21: RESUELTO el 12 oct. 2026. Imagen generada por Patricio en ChatGPT con el prompt entregado (camino desierto, piquete en el puente, viajero solo, ciudad al fondo); original en assets/originales/, 488 ppp. Texto de la pág. 083, cotejado (cap. VII). El juego queda en 24: 6 pliegos completos.
- Ficha 17: RESUELTO el 12 oct. 2026. Vizcacha nueva generada por Patricio en ChatGPT (orejas cortas, franjas en la cara, bigotes largos); original en assets/originales/, 595 ppp. La página 066 del LIBRO sigue con la imagen vieja: se puede reemplazar con esta si Patricio lo autoriza.
- La web tiene 9 puntos sin número; el libro y las fichas, 15 paradas numeradas. El QR lleva al mapa en general, no a una parada.
- El «Cuaderno de campo» de la web tiene registros (ñandú, armadillos, hornero, zorrillo) cuyo texto no está en la selección v2: quedan fuera salvo que Patricio autorice ampliar la selección. El Toxodon tiene texto (pág. 039) pero no lámina en el libro.
- El PDF de Chrome sale de 74,1 × 105,2 mm y el A4 de 209,9 × 297 mm (redondeo a píxel, igual que en el libro).
- Color: los PDF están en RGB. Falta definir la conversión del azul para imprenta (pendiente también en el libro).
- Mockup para la página 007 del libro: prompt y referencias entregados (referencias/); falta generarlo.

## Publicación en GitHub (12 oct. 2026)
- Repo público: https://github.com/patriciocampodonico/darwin-en-la-argentina-fichas (carpeta FICHAS, sin salida/ ni referencias/).
- Página (GitHub Pages, rama main): https://patriciocampodonico.github.io/darwin-en-la-argentina-fichas/ — muestra index.html: cada ficha de a dos (frente y dorso), con aire entre una ficha y la siguiente.
- Después de cada cambio: node build.mjs → git add -A → git commit → git push. La página se actualiza sola en 1–2 minutos.

## Mockup para la página 007 del libro (12 oct. 2026)
- Generado por Patricio en ChatGPT en dos pasos: el primero mostraba tres veces el Megatherium; el segundo (referencias/mockup-007-v2) muestra tres fichas distintas: frente 11 Megatherium, frente 22 Guanaco y dorso 16 (parada 09).
- Original: assets/mockup/mockup-fichas.webp. Recorte del fondo gris con tools/mockup.py → assets/mockup/007-mockup-fichas.png (1509 × 836 px, fondo transparente). La zona del guanaco se marca a mano porque su azul grisáceo se confunde con el fondo.
- Diferencia con la ficha real: en el mockup ChatGPT escribió «así» con tilde en el Megatherium (la ficha dice «asi», como la fuente). A 60 mm de ancho no se lee.
- FALTA: colocarlo en LIBRO/book/pages/007.html (reemplaza el esquema de líneas de «Fichas de campo»). La 007 está aprobada y bloqueada: se necesita el OK de Patricio.

## Prueba de impresión (13 oct. 2026)
- `node build.mjs prueba [números]` → salida/prueba-impresion-A4.pdf: UNA hoja A4 doble faz con 5 fichas (el máximo que entra con 3 mm de demasía por ficha): tres acostadas a la izquierda y dos de pie a la derecha. Página 1 frentes, página 2 dorsos espejados (doble faz, volteo por el borde largo; las acostadas giran al revés en el dorso).
- Marcas de corte en cada esquina de cada ficha: un trazo dentro de la demasía (de 1 a 3 mm del corte, negro con halo blanco) que se alarga donde hay margen libre.
- Fichas de la prueba: 11, 22, 21 (acostadas) y 01, 17 (de pie): una lámina sobre papel y una imagen a sangre de cada tipo.
- Orden de corte sugerido: primero el corte vertical que separa las dos columnas, después cada columna por separado.
- El PDF de imprenta completo (fichas-imprenta.pdf) sigue siendo de 4 por pliego, todas de pie.

## 20 oct. 2026 — Macrauchenia nueva y páginas del libro −2
- Ficha 23: nueva ilustración de ChatGPT (medio esqueleto semienterrado en el légamo, sin cráneo), la misma que el libro puso en la 090. Original en assets/originales/23-macrauchenia.webp; modo lámina.
- El libro se renumeró −2 el 14 oct. (BOOK_PROGRESS). Corregidas todas las páginas citadas en las fichas (paginas, fuente y «pág.» de las notas ED) y los códigos de imagen de tools/imagenes.py. Cotejo: todo coincide con el libro. Nada desborda. Las imágenes de las demás fichas no cambiaron.
- El mockup de las fichas ya está en el libro como 005-mockup-fichas.webp (la antigua 007).
- PDFs de pantalla, imprenta y prueba regenerados.

## 20 oct. 2026 — Dorso sin QR
- Pedido de Patricio: se quita el QR del mapa digital (y el dato «Mapa digital · Escaneá el código») del dorso de las 24 fichas; el QR va en la caja contenedora. El link a la web en su lugar queda pendiente (Patricio está por mudar la web a una organización de GitHub para que el link no lleve su nombre).
- El pie del dorso (En el libro · Diario) pasa a la misma altura y columnas que los datos del frente (filas 25–28, filete arriba). Las notas ganan filas (16–24). Nada desborda.
- 20 oct. 2026 · Dorso: las notas (citas E, D y ED) van centradas en alto entre el mapa y el pie (pedido de Patricio). Nada desborda.
- 20 oct. 2026 · Dorso: el bloque del mapa y la parada baja un renglón (filas 5–16 con un renglón de aire bajo el filete); las notas pasan a las filas 17–24, centradas. Nada desborda.
- 20 oct. 2026 · Dorso: el nombre de la parada pasa de Playfair Display 10 pt a Inter semibold 8,5 pt (corrección de la profesora: los trazos finos de la Playfair se pierden impresos en tamaño chico). Nada desborda.

## 20 oct. 2026 — Caja contenedora
- caja.mjs arma caja.html y salida/caja-imprenta.pdf (A4, 2 hojas: guía con troquel magenta y versión para imprenta con marcas de corte y de pliegue) + salida/caja.png.
- Estuche con solapas (tuck end) de una pieza: frente · lomo · dorso · lateral · solapa de pegado. Interior 76 × 107 × 11 mm (1 mm de holgura por lado; 24 fichas de 300 g ≈ 8,5 mm). Troquel 183 × 157 mm, sangrado 3 mm. Tapa en el dorso con lengüeta, fondo en el frente; media luna en el frente para sacar la tapa.
- Frente: la tapa del libro en vertical (grabado de San Julián, marca, Charles Darwin, título en Playfair, «Fichas de campo» en cursiva, línea de las 15 paradas). Dorso en papel como la contratapa: texto editorial en Inter, cantidad de fichas por tipo, código de notas D/E/ED, QR del mapa digital (pedido de Patricio), créditos. Lomo y lateral en Inter (la Playfair chica se pierde impresa).
- Pendiente: el QR apunta al link actual de la web; cuando la web se mude a la organización de GitHub hay que regenerarlo (también en las otras piezas que lo usen).
- 20 oct. 2026 · Caja: versión de preentrega (caja-preentrega.html → salida/caja-preentrega.pdf) con el troquel en negro fino (0,15 mm; corte continuo, pliegue a trazos) sobre un filete blanco para que se vea sobre el azul. Para cortar y doblar a mano.
