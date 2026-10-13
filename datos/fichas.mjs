// Contenido de las fichas de campo. Una entrada por ficha.
// REGLAS: el texto de Darwin (campo `darwin`) sale literal de las páginas del libro (LIBRO/book/pages),
// que a su vez salen de la selección v2 cotejada con el escaneo. Los cortes van con […].
// Los nombres científicos van como figuran en la edición de 1921. Las notas D y E son literales de la edición;
// todo lo demás es voz editorial (ED). `node tools/cotejo.mjs` compara cada texto con el libro y con el escaneo.

// Paradas: número, nombre, fecha y medio de viaje, iguales a las páginas 008–009 y 102 del libro.
export const PARADAS = {
  '01': { nombre: 'Bahía del Buen Suceso', fecha: '17–20 dic. 1832', medio: 'por mar' },
  '02': { nombre: 'Carmen de Patagones / Río Negro', fecha: '3–10 ago. 1833', medio: 'por mar' },
  '03': { nombre: 'Camino al Río Colorado', fecha: 'desde 11 ago. 1833', medio: 'a caballo' },
  '04': { nombre: 'Camino a Bahía Blanca', fecha: 'ago. 1833', medio: 'a caballo' },
  '05': { nombre: 'Bahía Blanca / Punta Alta', fecha: '24 ago.–7 sep. 1833', medio: 'a caballo' },
  '06': { nombre: 'Sierra de la Ventana', fecha: '8–10 sep. 1833', medio: 'a caballo' },
  '07': { nombre: 'Travesía de las Pampas', fecha: '11–19 sep. 1833', medio: 'a caballo' },
  '08': { nombre: 'Buenos Aires I', fecha: '20 sep. 1833', medio: 'a caballo' },
  '09': { nombre: 'Camino al Paraná / Rosario', fecha: '27–30 sep. 1833', medio: 'a caballo' },
  '10': { nombre: 'Paraná fósil / Santa Fe', fecha: '1–5 oct. 1833', medio: 'a caballo' },
  '11': { nombre: 'Bajada / geología del Paraná', fecha: '5–12 oct. 1833', medio: 'cruce del río' },
  '12': { nombre: 'Buenos Aires II', fecha: 'desde 20 oct. 1833', medio: 'por el río, en balandra' },
  '13': { nombre: 'Puerto Deseado', fecha: '23 dic. 1833', medio: 'por mar' },
  '14': { nombre: 'Puerto San Julián', fecha: '9 ene. 1834', medio: 'por mar' },
  '15': { nombre: 'Río Santa Cruz', fecha: '13 abr.–8 may. 1834', medio: 'en botes balleneros' },
};

export const TOTAL = 24;
const C = '<span class="cut">[…]</span>';

// paginas: páginas del libro (texto visible) · fuente: páginas de donde sale el texto de Darwin (para el cotejo)
export const FICHAS = [
  {
    num: '01', parada: '01', categoria: 'Flora', titulo: 'Fagus betuloides', cursiva: true,
    imagen: { archivo: '01-fagus-betuloides.jpg', modo: 'lamina', alt: 'Rama de haya con hojas, ilustración botánica' },
    darwin: `Todos los árboles pertenecían a una especie, el <i>Fagus betuloides</i>; porque el número de otras especies de <i>Fagus</i> y el de <i>Drymis winteri</i> (1) carecía de importancia. El haya que acabo de citar conserva sus hojas durante el año entero, pero su follaje tiene un color verde pardusco peculiar, con un tinte amarillento. ${C}`,
    capitulo: 'X', paginas: '016', fuente: ['016'],
    notas: [
      ['E', '(1) Arbolito de la familia de las magnoliáceas, que se extiende del sur de Méjico al estrecho de Magallanes.'],
      ['ED', 'Los nombres científicos se conservan como figuran en la edición de 1921.'],
    ],
  },
  {
    num: '02', parada: '01', categoria: 'Paisaje', titulo: 'El bosque fueguino',
    imagen: { archivo: '02-bosque-fueguino.jpg', alt: 'Bosque cerrado con un torrente entre troncos caídos' },
    darwin: `La sombría profundidad de aquel barranco se concertaba con los universales signos de trastornos. ${C} La masa enmarañada de vegetación vigorosa mezclada con troncos y follaje secos me recordó los bosques tropicales; pero había una diferencia, porque en estas mudas soledades la Muerte y no la Vida parecía ser el espíritu predominante.`,
    capitulo: 'X', paginas: '014 y 015', fuente: ['015'],
    notas: [
      ['ED', 'Como el bosque no lo deja avanzar, Darwin sube por la ribera de un torrente que baja de la montaña.'],
      ['ED', 'Darwin también relata encuentros con habitantes fueguinos. Sus descripciones expresan la mirada europea y los prejuicios de su época; deben leerse en ese contexto.'],
    ],
  },
  {
    num: '03', parada: '02', categoria: 'Territorio', titulo: 'La salina',
    imagen: { archivo: '03-salina.jpg', alt: 'Extensión blanca y llana de una salina en medio de la llanura' },
    darwin: `Durante el invierno esta salina es un gran charco de salmuera, que en verano se convierte en un gran campo de sal blanca como la nieve. ${C} Cualquiera de estas extensiones, de perfecto nivel y deslumbrante blancura, en medio de la llanura desolada, ofrece siempre un espectáculo extraordinario.`,
    capitulo: 'IV', paginas: '021', fuente: ['021'],
    notas: [
      ['ED', 'Las medidas del fragmento: 24 km del pueblo a la salina; el lago, 4 km de largo «por más de uno y medio de ancho»; 10 a 12 cm de sal en las márgenes.'],
      ['ED', 'El pueblo es El Carmen o Patagones, sobre el río Negro.'],
    ],
  },
  {
    num: '04', parada: '02', categoria: 'Materiales', titulo: 'Cristales y sales',
    imagen: { archivo: '04-cristales.jpg', modo: 'lamina', alt: 'Cristal de yeso alargado, lámina en grabado' },
    darwin: `Las márgenes del lago están formadas de légamo y en él se hallan sepultados numerosos y grandes cristales de yeso, algunos de los cuales tienen siete centímetros de largo, mientras en la superficie yacen esparcidos otros de sulfato de sodio. Los gauchos llaman a los primeros «el padre de la sal» y a los segundos «la madre» ${C}`,
    capitulo: 'IV', paginas: '022', fuente: ['022'],
    notas: [
      ['ED', '«Padre» y «madre de la sal» son los nombres que Darwin recoge de los gauchos; no son nomenclatura científica actual.'],
      ['ED', 'La lámina muestra «el padre»: un cristal de yeso.'],
    ],
  },
  {
    num: '05', parada: '02', categoria: 'Fauna', titulo: 'Flamencos',
    imagen: { archivo: '05-flamenco.jpg', modo: 'lamina', alt: 'Flamenco con el pico en el agua' },
    darwin: `Este lago es frecuentado por numerosos flamencos, que procrean aquí; en toda Patagonia, en el norte de Chile y en las islas de los Galápagos he encontrado estas aves dondequiera que había lagos salados. En el sitio de que trato los vi vadeando de aquí para allá en busca de comida <span class="nowrap">—probablemente</span> de gusanos escondidos en el cieno— ${C}`,
    capitulo: 'IV', paginas: '023', fuente: ['023'],
    notas: [
      ['ED', 'Lo que Darwin observa en la salmuera, en orden: espuma verde («confervas»), color rojizo («infusorios»), gusanos anélidos y flamencos.'],
      ['ED', 'Para Darwin es «un pequeño mundo de vivientes» adaptados a ese medio (pág. 024).'],
    ],
  },
  {
    num: '06', parada: '03', categoria: 'Observación', titulo: 'Walleechu',
    imagen: { archivo: '06-walleechu.jpg', alt: 'Árbol espinoso sin hojas con ofrendas atadas a las ramas' },
    darwin: `Poco después de pasar la primera fuente dimos vista a un árbol famoso, que los indios veneran como altar de Walleechu. ${C} Como estábamos en invierno el árbol no tenía hojas, pero en su lugar pendían de las ramas secas varias ofrendas atadas con cordeles, tales como cigarros, pan, carne, pedazos de tela, etcétera.`,
    capitulo: 'IV', paginas: '028', fuente: ['028'],
    notas: [
      ['ED', '«Walleechu» es la grafía con que Darwin anota el nombre. El fragmento describe una práctica religiosa de los pueblos indígenas de la región con palabras de su época; debe leerse en ese contexto.'],
    ],
  },
  {
    num: '07', parada: '03', categoria: 'Fauna', titulo: 'Agutí',
    imagen: { archivo: '07-aguti.jpg', modo: 'lamina', alt: 'Agutí de perfil, cuerpo entero' },
    darwin: `De cuando en cuando podían verse un ciervo o un guanaco (llama salvaje), pero el agutí (<i>Cavia Patagónica</i>) es el cuadrúpedo más común. Este animal representa aquí a nuestras liebres; se diferencia, sin embargo, de este género en muchos respectos esenciales, como, por ejemplo, en tener solamente tres dedos en las patas traseras. ${C}`,
    capitulo: 'IV', paginas: '030', fuente: ['030'],
    notas: [
      ['ED', 'Nombre en la edición de 1921: <i>Cavia Patagónica</i>. Los nombres científicos se conservan como figuran en esa edición.'],
      ['ED', 'Más adelante, en una nota, Darwin compara Patagonia con los desiertos de Siria: «el guanaco reemplaza a la gacela y el agutí a la liebre» (pág. 097).'],
    ],
  },
  {
    num: '08', parada: '03', categoria: 'Observación', titulo: 'Cruzar el Colorado',
    imagen: { archivo: '08-yeguada.jpg', alt: 'Cabezas de caballos a flor de agua cruzando un río; una canoa detenida' },
    darwin: `Al cruzarle en la canoa nos vimos detenidos por inmensas yeguadas, que pasaban nadando ${C} Nunca he contemplado un espectáculo tan original como el que presentaban cientos y cientos de cabezas todas en la misma dirección, con las orejas erguidas y las fosas nasales dilatadas, dando resoplidos y apareciendo a flor de agua como un banco de extraños animales anfibios.`,
    capitulo: 'IV', paginas: '031', fuente: ['031'],
    notas: [
      ['ED', 'Las yeguadas seguían a «una división de tropas que se hallaba en el interior».'],
      ['ED', 'Las medidas del fragmento: el río tiene «unos 60 metros de ancho» en el paso; hasta la desembocadura hay nueve leguas en línea recta, «pero 25 por el agua».'],
    ],
  },
  {
    num: '09', parada: '04', categoria: 'Observación', titulo: 'La posta',
    imagen: { archivo: '09-posta.jpg', alt: 'Rancho con corral de palos y cañas, rodeado por un foso, al pie de un cerro bajo' },
    darwin: `Esta posta tenía por jefe a un teniente negro nacido en Africa, y en su elogio debo decir que no había un rancho entre el Colorado y Buenos Aires que se acercara a éste en orden y limpieza. Allí encontramos un cuartito para los forasteros que llegaran y un pequeño corral para los caballos, y ambos locales estaban hechos de palos y cañas; ${C}`,
    capitulo: 'IV', paginas: '034', fuente: ['034'],
    notas: [
      ['ED', 'La casa estaba «al pie de un cerro de 30 a 60 metros de alto»; alrededor se había cavado «un foso o zanja», como defensa.'],
      ['ED', '«Africa» va sin tilde, como en la edición de 1921.'],
    ],
  },
  {
    num: '10', parada: '05', categoria: 'Territorio', titulo: 'Punta Alta',
    imagen: { archivo: '10-punta-alta.jpg', alt: 'Costa baja de noche clara, con bancos de cieno y gaviotas' },
    darwin: `Pasamos la noche en Punta Alta, y me ocupé en buscar huesos fósiles; el sitio me invitaba a ello, pues este punto es una perfecta catacumba de monstruos de razas extintas. La noche era serena y clara, y la extremada monotonía del paisaje le hacía interesante aun entre la mezcolanza de bancos de cieno y gaviotas, montículos de arena y buitres solitarios.`,
    capitulo: 'IV', paginas: '036', fuente: ['036'],
    notas: [
      ['ED', 'En la playa, «en el espacio de unos 200 metros cuadrados», Darwin encontró los restos de nueve grandes cuadrúpedos (págs. 038 y 039).'],
      ['ED', 'Darwin observó este lugar en más de una visita (pág. 037).'],
    ],
  },
  {
    num: '11', parada: '05', categoria: 'Fósil', titulo: 'Megatherium',
    imagen: { archivo: '11-megatherium.jpg', modo: 'lamina', alt: 'Esqueleto de Megatherium apoyado en la cola y los pies, contra un árbol' },
    // «asi» va sin tilde, como en la fuente y en el libro.
    darwin: `El profesor Owen, con mucha mayor probabilidad, cree que en vez de trepar a los árboles doblaban hacia abajo las ramas y arrancaban las más débiles, alimentándose asi de las hojas. ${C} Con sus grandes colas y enormes pies firmemente asentados en tierra, como un trípode, podían desarrollar libremente toda la fuerza de sus potentísimos brazos y grandes uñas.`,
    capitulo: 'V', paginas: '038 y 044', fuente: ['044'],
    notas: [
      ['ED', 'Darwin habla de los «animales megateroideos»: <i>Megatherium</i>, <i>Megalonyx</i>, <i>Scelidotherium</i> y <i>Mylodon</i>. La explicación es del profesor Owen, tal como la resume Darwin.'],
      ['ED', 'Lo que Darwin encontró de este animal en Punta Alta: «Varias partes de tres cabezas y otros huesos». Es el primero de un inventario de nueve grandes cuadrúpedos.'],
    ],
  },
  {
    num: '12', parada: '05', categoria: 'Fósil', titulo: 'Scelidotherium',
    imagen: { archivo: '12-scelidotherium.jpg', modo: 'lamina', alt: 'Esqueleto parcial de Scelidotherium, con la rótula y el caparazón' },
    darwin: `${C} El <i>Scelidotherium</i>, animal también afín, del que obtuve un esqueleto casi completo. Ha debido ser tan grande como un rinoceronte; por la estructura de la cabeza se acerca muchísimo al hormiguero del Cabo, según Owen; pero en otros particulares se parece a los armadillos.`,
    capitulo: 'V', paginas: '038 y 042', fuente: ['038'],
    notas: [
      ['ED', 'Es el tercero del inventario de Punta Alta: «animal también afín» al <i>Megatherium</i> y al <i>Megalonyx</i>.'],
      ['ED', 'Los huesos estaban «en sus relativas posiciones propias», incluso la rótula. Darwin concluye que los restos estaban «frescos y unidos por sus ligamentos» cuando quedaron en la grava (pág. 042).'],
    ],
  },
  {
    num: '13', parada: '06', categoria: 'Territorio', titulo: 'Sierra de la Ventana',
    imagen: { archivo: '13-sierra-de-la-ventana.jpg', alt: 'Llanura hasta el horizonte vista desde las rocas de la sierra' },
    darwin: `Quedé, en definitiva, desencantado con esta ascensión. Hasta el panorama era insignificante: una llanura como el mar, pero sin su bello color y contornos definidos. Sin embargo, para mi fué un espectáculo nuevo, y con un poco de peligro para darle saborcete, como la sal a la carne.`,
    capitulo: 'VI', paginas: '047 a 051', fuente: ['051'],
    notas: [
      ['E', 'Esta sierra tiene de altura máxima 1.060 metros.'],
      ['ED', 'El 9 de septiembre Darwin llega a la cima del segundo pico, «con extrema dificultad», y renuncia a los dos más altos (pág. 050).'],
      ['ED', '«mi» va sin tilde, como en la edición de 1921.'],
    ],
  },
  {
    num: '14', parada: '07', categoria: 'Observación', titulo: 'El fogón',
    imagen: { archivo: '14-fogon.jpg', alt: 'Soldados sentados alrededor de una hoguera de noche, con picas clavadas en el suelo' },
    darwin: `Por la noche, mientras estaban sentados alrededor de la hoguera jugando a la baraja, me retiré a un lado para contemplar aquella escena, digna de Salvator Rosa. ${C} en torno de los jugadores yacían tendidos los perros, y cerca de éstos las armas, ${C} mientras a distancia un poco mayor se erguían las largas picas de los jinetes clavadas en el césped.`,
    capitulo: 'VI', paginas: '053', fuente: ['053'],
    notas: [
      ['ED', '12–13 de septiembre, en la tercera posta. Darwin describe la escena de la hoguera hacia afuera: jugadores, perros, armas, picas y, al fondo, los caballos atados.'],
      ['ED', 'Los jugadores son los soldados de la posta.'],
    ],
  },
  {
    num: '15', parada: '08', categoria: 'Territorio', titulo: 'La cuadrícula',
    imagen: { archivo: '15-cuadricula.jpg', modo: 'lamina', alt: 'Vista desde arriba de las afueras, con setos y arboledas, que pasan a una cuadrícula' },
    darwin: `La ciudad de Buenos Aires es grande (1), y a mi juicio una de las de trazado más regular que hay en el mundo. Todas las calles se cortan en ángulo recto, y las paralelas equidistan unas de otras, estando las casas reunidas en bloques cuadrados de idénticas dimensiones, llamados cuadras.`,
    capitulo: 'VI', paginas: '060 y 061', fuente: ['061'],
    notas: [
      ['D', `(1) Dícese que contiene 60.000 habitantes (*). ${C}`],
      ['E', '(*) Buenos Aires tiene hoy —ochenta y ocho años después de la visita de Darwin— 1.794.170 habitantes.'],
      ['ED', 'Ese «hoy» es el de la traducción: 1921.'],
    ],
  },
  {
    num: '16', parada: '09', categoria: 'Flora', titulo: 'Cardos gigantes',
    imagen: { archivo: '16-cardal.jpg', alt: 'Cardos gigantes vistos de cerca, como una textura' },
    darwin: `${C} la tierra cubierta de macizos de trébol acre y cardos gigantes. Estos, ${C} no habían alcanzado en esta época del año mas que las dos terceras partes de su altura; en ciertos sitios podían ocultar un caballo, pero en otros no habían brotado aún ${C} Las masas eran de un verde vivísimo y semejaban un bosque en miniatura en grandes espacios descampados.`,
    capitulo: 'VII', paginas: '065', fuente: ['065'],
    notas: [
      ['ED', '28 de septiembre, después de Luján y Areco. Por los cardos, «los buenos pastos escasean» y quedan «grandes extensiones abandonadas entre estancia y estancia».'],
      ['ED', '«mas que» va sin tilde, como en la edición de 1921.'],
    ],
  },
  {
    num: '17', parada: '09', categoria: 'Fauna', titulo: 'Vizcacha',
    imagen: { archivo: '17-vizcacha.jpg', modo: 'lamina', alt: 'Vizcacha en la boca de su madriguera, junto a un montón de huesos y tallos' },
    darwin: `La vizcacha tiene la singular costumbre de llevar a la boca de su madriguera todos los objetos duros que halla; en torno de cada una de estas madrigueras se ven reunidos en montón informe numerosos huesos de reses, piedras, tallos de cardos, terrones de tierra endurecida, fango seco, etc., en cantidad suficiente para llenar una carretilla.`,
    capitulo: 'VII', paginas: '066', fuente: ['066'],
    notas: [
      ['ED', 'Darwin no encuentra la razón de esta costumbre: «no tengo ni la más remota conjetura».'],
      ['ED', 'Según el fragmento, cerca de Buenos Aires estos animales son «excesivamente comunes» y prefieren las partes de la llanura cubiertas de cardos gigantes.'],
    ],
  },
  {
    num: '18', parada: '09', categoria: 'Territorio', titulo: 'El Paraná en Rosario',
    imagen: { archivo: '18-parana-rosario.jpg', alt: 'Río muy ancho con islas bajas y frondosas, visto desde la barranca' },
    darwin: `Rosario es una gran ciudad, edificada en una meseta horizontal levantada sobre el Paraná unos 18 metros. El río aquí es muy ancho y tiene numerosas islas, bajas y frondosas, como también la opuesta ribera. La vista del río parecería la de un gran lago, a no ser por las islitas en forma de delgadas cintas, únicos objetos que dan idea del agua corriente.`,
    capitulo: 'VII', paginas: '068', fuente: ['068'],
    notas: [
      ['ED', 'Poco antes, en San Nicolás, Darwin anota: «he visto por vez primera el magnífico río Paraná» (pág. 067).'],
      ['ED', 'Para Darwin, la grandeza del río está en que comunica países, en la extensión de su comarca y en el territorio que avena (pág. 069).'],
    ],
  },
  {
    num: '19', parada: '10', categoria: 'Fósil', titulo: 'El mastodonte',
    imagen: { archivo: '19-barranca.jpg', alt: 'Barranca vertical sobre el río Paraná' },
    darwin: `${C} encontré dos enormes esqueletos muy próximos, que se proyectaban en atrevido relieve, saliendo del tajo perpendicular del Paraná. Sin embargo, estaban tan podridos que sólo me fué posible extraer pequeños fragmentos de uno de los grandes molares; bastan, a pesar de todo, para demostrar que los restos mencionados pertenecieron a un mastodonte ${C}`,
    capitulo: 'VII', paginas: '070 y 071', fuente: ['071'],
    notas: [
      ['ED', '1 de octubre, en el río Tercero o Saladillo. Darwin se detiene «la mayor parte del día para buscar huesos fósiles» (pág. 070).'],
      ['ED', 'Los hombres de la canoa conocían los esqueletos. Suponían que el mastodonte «debió de fabricarse sus madrigueras, como la vizcacha».'],
    ],
  },
  {
    num: '20', parada: '11', categoria: 'Fósil', titulo: 'Diente de caballo',
    imagen: { archivo: '20-diente-caballo.jpg', modo: 'lamina', alt: 'Diente fósil de caballo, de lado y por la corona' },
    darwin: `${C} hallé dientes del <i>Toxodon</i> y mastodonte, junto con el diente de un caballo ${C} El último me interesó grandemente (1), por lo que tuve escrupuloso cuidado de comprobar con toda certeza el hecho de haber quedado sepultado al mismo tiempo que los otros restos ${C}`,
    capitulo: 'VII', paginas: '076 y 077', fuente: ['076', '077'],
    notas: [
      ['D', '(1) Apenas necesito afirmar aquí las pruebas indiscutibles de que en tiempos de Colón no vivía en América ningún caballo.'],
      ['ED', 'El método, paso a paso: hallar el diente, verificar que quedó sepultado con los otros restos, compararlo con otros dientes e inferir que en Sudamérica vivió un caballo indígena (pág. 077).'],
    ],
  },
  {
    num: '21', parada: '12', categoria: 'Observación', titulo: 'La ciudad sitiada',
    imagen: { archivo: '21-ciudad-sitiada.jpg', alt: 'Camino desierto hacia la ciudad; un viajero solo, a pie, y un piquete de soldados en un puente' },
    darwin: `${C} si me avenía a dejar el guía y los caballos yo podría pasar, yendo solo, los puestos de los centinelas. ${C} El camino, por espacio de una legua, estaba enteramente desierto. Encontré un piquete de soldados, que se contentaron con echar una mirada a un antiguo pasaporte mío, y al fin, con no pequeña satisfacción, me vi dentro de la ciudad.`,
    capitulo: 'VII', paginas: '082 y 083', fuente: ['083'],
    notas: [
      ['ED', '20 de octubre: Darwin desembarca en Las Conchas y se entera de que, por «una revolución violenta, todos los puertos habían sido embargados» (pág. 082).'],
      ['ED', 'Lo dejan pasar cuando menciona «las obsequiosas atenciones recibidas del general Rosas» en el Colorado.'],
    ],
  },
  {
    num: '22', parada: '13', categoria: 'Fauna', titulo: 'Guanaco',
    imagen: { archivo: '22-guanaco.jpg', alt: 'Guanaco de pie sobre la meseta, con un rebaño a lo lejos' },
    darwin: `El guanaco, o llama salvaje (3), es el cuadrúpedo característico de las llanuras de Patagonia; en Sudamérica representa el camello del Oriente. ${C} Generalmente vive en pequeños rebaños de 12 a 30 individuos; pero en las riberas de Santa Cruz vimos un rebaño que debía de contener lo menos 500.`,
    capitulo: 'VIII', paginas: '086', fuente: ['086'],
    notas: [
      ['E', `(3) ${C} Las especies son la llama, guanaco o huanaco (<i>Lama huanacus</i>), la alpaca (<i>L. pacos</i>) y la vicuña (<i>L. vicunna</i>). ${C}`],
      ['ED', 'Darwin se pregunta por qué a veces huyen y a veces se quedan mirando: «¿O es que la curiosidad se sobrepone a su timidez?».'],
    ],
  },
  {
    num: '23', parada: '14', categoria: 'Fósil', titulo: 'Macrauchenia',
    imagen: { archivo: '23-macrauchenia.jpg', modo: 'lamina', alt: 'Medio esqueleto de Macrauchenia, de cuello largo' },
    darwin: `En Puerto San Julián, en un légamo rojo que cubre la grava de la llanura, de 27 metros de altitud, encontré medio esqueleto del <i>Macrauchenia Patachonica</i>, notable cuadrúpedo, tan grande como un camello. ${C} en la estructura de los huesos de su largo cuello ofrece una evidente relación con el camello, o más bien con el guanaco y llama.`,
    capitulo: 'VIII', paginas: '092', fuente: ['092'],
    notas: [
      ['ED', 'Darwin lo relaciona, por su grupo, con los Paquidermos (rinoceronte, tapir y <i>Palæotherium</i>) y, por los huesos del cuello, con el guanaco y la llama.'],
      ['ED', 'Son el nombre y los grupos de la edición de 1921. No es una clasificación actual.'],
    ],
  },
  {
    num: '24', parada: '15', categoria: 'Observación', titulo: 'Contra la corriente',
    imagen: { archivo: '24-sirga.jpg', alt: 'Hombres tirando con sogas de tres botes desde la ribera de un río' },
    darwin: `19 de abril.—Claro es que contra una corriente tan violenta resultaba del todo imposible remar o utilizar las velas; en consecuencia, hubo de recurrirse al artificio de estar los tres botes, uno tras otro, proa con proa, dejando dos hombres en cada uno, mientras los restantes saltaron a tierra para sirgar.`,
    capitulo: 'IX', paginas: '096', fuente: ['096'],
    notas: [
      ['ED', 'La expedición sale el 18 de abril: tres botes balleneros, 25 expedicionarios y provisiones para tres semanas (pág. 094).'],
      ['ED', 'El 4 de mayo los botes dan la vuelta. Darwin ve la Cordillera a lo lejos, pero no llega a ella (pág. 101).'],
    ],
  },
];
