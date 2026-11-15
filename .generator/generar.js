const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, AlignmentType,
  Header, PageNumber, ImageRun, ExternalHyperlink, Table, TableRow, TableCell,
  WidthType,
} = require("docx");

const IMG_DIR = "/home/alternova/Documentos/entrega-transformers-nlp";
const REPO_URL = "https://github.com/JSBeltran93/transformers-nlp-sentimientos";

function sizeOf(path) {
  const buf = fs.readFileSync(path);
  const width = buf.readUInt32BE(16);
  const height = buf.readUInt32BE(20);
  return { width, height, buf };
}

function figureParagraph(path, maxWidth, caption) {
  const { width, height, buf } = sizeOf(path);
  const scale = maxWidth / width;
  const w = Math.round(width * scale);
  const h = Math.round(height * scale);
  return [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 200, after: 100 },
      children: [new ImageRun({ data: buf, transformation: { width: w, height: h }, type: "png" })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 300 },
      children: [new TextRun({ text: caption, italics: true, size: 20 })],
    }),
  ];
}

const FONT = "Times New Roman";
const SIZE = 24;

function p(text, opts = {}) {
  return new Paragraph({
    spacing: { line: 480, after: opts.after ?? 0 },
    alignment: opts.align ?? AlignmentType.JUSTIFIED,
    indent: opts.indent ? { firstLine: 720 } : undefined,
    children: Array.isArray(text) ? text : [new TextRun({ text, font: FONT, size: SIZE, bold: opts.bold, italics: opts.italics })],
  });
}

function heading(text) {
  return new Paragraph({
    spacing: { before: 300, after: 200, line: 480 },
    children: [new TextRun({ text, font: FONT, size: SIZE, bold: true })],
  });
}

function code(lines) {
  return new Paragraph({
    spacing: { after: 200 },
    shading: { fill: "F2F2F2" },
    children: lines.split("\n").flatMap((line, i) => [
      ...(i > 0 ? [new TextRun({ text: "", break: 1 })] : []),
      new TextRun({ text: line, font: "Courier New", size: 18 }),
    ]),
  });
}

const children = [];

// Portada
children.push(
  new Paragraph({ spacing: { before: 2000 }, children: [] }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { line: 480, after: 100 },
    children: [new TextRun({ text: "Informe de Trabajo: Transformers aplicados al Procesamiento de Lenguaje Natural", font: FONT, size: 28, bold: true })],
  }),
  new Paragraph({ spacing: { before: 1600 }, children: [] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { line: 480 }, children: [new TextRun({ text: "Joan Schneider Beltrán Delgado", font: FONT, size: SIZE })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { line: 480 }, children: [new TextRun({ text: "CADI, Universidad de Cundinamarca, Especialización en Inteligencia Artificial", font: FONT, size: SIZE })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { line: 480 }, children: [new TextRun({ text: "Inteligencia Artificial - Conceptos", font: FONT, size: SIZE })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { line: 480 }, children: [new TextRun({ text: "15 de noviembre de 2026", font: FONT, size: SIZE })] }),
  new Paragraph({ children: [], pageBreakBefore: true }),
);

children.push(
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 300, line: 480 },
    children: [new TextRun({ text: "Informe de Trabajo: Transformers aplicados al Procesamiento de Lenguaje Natural", font: FONT, size: SIZE, bold: true })],
  }),
  heading("Introducción"),
  p("Este informe recoge una práctica con modelos Transformers aplicados al procesamiento de lenguaje natural (NLP), usando un modelo preentrenado de la librería Hugging Face transformers para clasificar el sentimiento de un grupo de oraciones. Se explican primero los fundamentos de la arquitectura Transformer y su mecanismo de atención, y luego se describe la práctica, los resultados obtenidos y lo que se puede concluir de ellos.", { indent: true, after: 200 }),
);

children.push(heading("Conceptos clave"));

children.push(
  new Paragraph({ spacing: { line: 480, after: 150 }, children: [new TextRun({ text: "Qué es un Transformer", font: FONT, size: SIZE, bold: true, italics: true })] }),
  p('Un Transformer es una arquitectura de red neuronal pensada originalmente para traducción automática, presentada por Vaswani et al. (2017) en el artículo "Attention is all you need". A diferencia de las redes recurrentes (RNN/LSTM), que leen una secuencia palabra por palabra, un Transformer procesa toda la secuencia de una vez, apoyándose por completo en el mecanismo de atención para relacionar palabras sin importar qué tan lejos estén unas de otras en el texto.', { indent: true, after: 200 }),

  new Paragraph({ spacing: { line: 480, after: 150 }, children: [new TextRun({ text: "El mecanismo de atención", font: FONT, size: SIZE, bold: true, italics: true })] }),
  p('La pieza central de un Transformer es el mecanismo de self-attention: para cada palabra de una oración, el modelo calcula qué tan relevantes son todas las demás palabras para entenderla en ese contexto puntual. Esto se logra con tres vectores derivados de cada palabra (query, key y value); comparando la query de una palabra contra las keys de las demás, el modelo obtiene un peso que indica cuánto debe fijarse en cada una al construir su representación final. El Multi-Head Attention repite este cálculo varias veces en paralelo, con pesos distintos cada vez, lo que le permite al modelo captar a la vez varios tipos de relación, por ejemplo una sintáctica y otra semántica.', { indent: true, after: 200 }),

  new Paragraph({ spacing: { line: 480, after: 150 }, children: [new TextRun({ text: "Estructura: encoder y decoder", font: FONT, size: SIZE, bold: true, italics: true })] }),
  p("La arquitectura original del Transformer se divide en dos bloques: el encoder, que toma la secuencia de entrada y la convierte en una representación vectorial cargada de contexto, y el decoder, que usa esa representación para ir generando la secuencia de salida palabra por palabra. Cada bloque apila varias capas idénticas, y cada capa combina una etapa de atención con una red feed-forward, además de normalización y conexiones residuales que ayudan a que el entrenamiento no se desestabilice en redes tan profundas. No todos los modelos usan ambas mitades: BERT se queda solo con el encoder, pensado para entender texto; GPT usa solo el decoder, pensado para generarlo; y modelos como T5 o BART conservan la arquitectura completa.", { indent: true, after: 200 }),

  new Paragraph({ spacing: { line: 480, after: 150 }, children: [new TextRun({ text: "Aplicaciones en NLP", font: FONT, size: SIZE, bold: true, italics: true })] }),
  p("Hoy en día los Transformers sostienen casi todas las aplicaciones de NLP que se usan a diario: clasificación de texto y análisis de sentimientos, traducción automática, resumen de documentos, respuesta a preguntas, y generación de texto. Los modelos de lenguaje conversacional como ChatGPT son, en el fondo, Transformers tipo decoder llevados a una escala enorme.", { indent: true, after: 200 }),
);

children.push(heading("Descripción de la práctica"));

children.push(
  new Paragraph({ spacing: { line: 480, after: 150 }, children: [new TextRun({ text: "Modelo utilizado", font: FONT, size: SIZE, bold: true, italics: true })] }),
  p("Para esta práctica se usó distilbert-base-uncased-finetuned-sst-2-english, una versión reducida de BERT (DistilBERT) ya afinada específicamente para clasificar sentimientos de forma binaria (positivo/negativo) sobre el dataset SST-2. Se accedió al modelo a través del pipeline de alto nivel sentiment-analysis de la librería transformers de Hugging Face, que se encarga internamente de tokenizar el texto, pasarlo por el modelo y convertir la salida en una etiqueta junto con su probabilidad.", { indent: true, after: 100 }),
  code(`from transformers import pipeline

clasificador = pipeline("sentiment-analysis",
                         model="distilbert-base-uncased-finetuned-sst-2-english")

oraciones = [
    "I love how this model understands context so well.",
    "This movie was a complete waste of my time.",
    "The weather today is okay, nothing special.",
    "Transformers have completely changed the field of NLP.",
    "I am really disappointed with the customer service.",
]

resultados = clasificador(oraciones)
for oracion, resultado in zip(oraciones, resultados):
    print(f"{oracion!r} -> {resultado['label']} ({resultado['score']:.4f})")`),

  new Paragraph({ spacing: { line: 480, after: 150 }, children: [new TextRun({ text: "Procedimiento", font: FONT, size: SIZE, bold: true, italics: true })] }),
  p("Se armó un grupo breve de 5 oraciones en inglés (el idioma en el que el modelo fue afinado), con distintos matices de sentimiento: dos claramente positivas, dos claramente negativas, y una neutra a propósito, para ver cómo se comporta el modelo frente a un caso límite. El pipeline tokeniza cada oración, la pasa por las capas del Transformer, incluido el mecanismo de atención descrito antes, y produce un vector de probabilidades que termina convertido en la etiqueta final (POSITIVE o NEGATIVE) junto con su nivel de confianza.", { indent: true, after: 200 }),
);

children.push(heading("Resultados obtenidos"));

children.push(p("El modelo clasificó las 5 oraciones de la siguiente manera:", { indent: true, after: 100 }));

const rows = [
  ["Oración", "Etiqueta", "Confianza"],
  ["I love how this model understands context so well.", "POSITIVE", "0.9998"],
  ["This movie was a complete waste of my time.", "NEGATIVE", "0.9998"],
  ["The weather today is okay, nothing special.", "NEGATIVE", "0.9952"],
  ["Transformers have completely changed the field of NLP.", "POSITIVE", "0.9952"],
  ["I am really disappointed with the customer service.", "NEGATIVE", "0.9998"],
];
const table = new Table({
  width: { size: 100, type: WidthType.PERCENTAGE },
  rows: rows.map((row, idx) => new TableRow({
    children: row.map((cell, colIdx) => new TableCell({
      width: { size: colIdx === 0 ? 60 : 20, type: WidthType.PERCENTAGE },
      children: [new Paragraph({ alignment: colIdx === 0 ? AlignmentType.LEFT : AlignmentType.CENTER, children: [new TextRun({ text: cell, font: FONT, size: 20, bold: idx === 0 })] })],
    })),
  })),
});
children.push(table);
children.push(new Paragraph({ spacing: { after: 200 }, children: [] }));

children.push(
  p('Las cuatro oraciones con una carga emocional clara, dos positivas y dos negativas, quedaron bien clasificadas y con una confianza casi perfecta (99.98% y 99.52%). La oración neutra, puesta a propósito como caso límite ("The weather today is okay, nothing special"), terminó clasificada como NEGATIVE con 99.52% de confianza.', { indent: true, after: 200 }),
);

children.push(heading("Análisis de resultados"));

children.push(
  p('El modelo acertó en los cuatro casos obvios, lo cual ya se esperaba de un Transformer afinado justo para esta tarea. Lo verdaderamente interesante fue cómo manejó el caso ambiguo. El modelo se entrenó sobre SST-2, un dataset con solo dos clases posibles: positivo o negativo, sin ninguna opción de "neutral". Así que, frente a una oración genuinamente neutra, tiene que decantarse igual por uno de los dos extremos, aunque ninguno la describa bien. Aquí se inclinó por NEGATIVE, probablemente porque frases como "nothing special" suelen acompañar opiniones poco entusiastas en los datos con los que se entrenó.', { indent: true, after: 200 }),
  p("Esto deja ver algo clave sobre los Transformers preentrenados: la calidad de sus respuestas depende tanto de la arquitectura como del conjunto de datos y las etiquetas usadas para afinarlos. El mecanismo de atención le da al modelo una lectura muy fina del contexto, por eso la confianza se mantiene alta incluso en la oración neutra, pero esa misma arquitectura no puede inventarse una categoría que nunca existió en su entrenamiento. Dicho de otra forma, el modelo no malinterpretó la oración; simplemente se le estaba pidiendo una respuesta binaria para un caso que no lo es.", { indent: true, after: 200 }),
  p("La confianza tan alta en los cuatro casos claros tiene una explicación sencilla: como el modelo fue afinado específicamente para análisis de sentimientos en inglés, rinde mucho mejor en ese tipo de tarea que un modelo de propósito general sin ese ajuste. Esa es, justamente, la ventaja práctica del transfer learning con Transformers preentrenados.", { indent: true, after: 200 }),
);

children.push(heading("Mapa mental"));
children.push(p("A continuación se presenta el mapa mental con los conceptos principales de los Transformers, su relación y su organización jerárquica.", { indent: true, after: 100 }));
children.push(...figureParagraph(`${IMG_DIR}/mapa_mental.png`, 500, "Figura 1. Mapa mental — Transformers: mecanismo de atención, estructura encoder-decoder, representación de entrada, modelos conocidos y aplicaciones en NLP."));

children.push(heading("Conclusiones"));

children.push(
  p("Esta práctica muestra de forma muy concreta por qué los Transformers se volvieron la base del procesamiento de lenguaje natural actual: un modelo preentrenado y afinado clasificó correctamente el sentimiento de varias oraciones con una confianza altísima, sin entrenar nada desde cero ni escribir reglas manuales de análisis de texto. Ese desempeño descansa por completo en el mecanismo de atención, que le permite al modelo relacionar cada palabra con el resto de la oración y armar así una representación rica del contexto.", { indent: true, after: 200 }),
  p("El caso de la oración neutra deja, por su parte, una lección distinta pero igual de útil: un Transformer no entiende el lenguaje de forma general ni es infalible, sino que está atado a las categorías y los datos con los que fue afinado. Cuando la realidad no encaja del todo en esas categorías, como ocurre con un sentimiento neutro frente a un clasificador binario, el modelo igual entrega una respuesta segura, aunque esa seguridad no garantice un acierto. Vale la pena recordar esto en cualquier aplicación real: la confianza numérica de un modelo no equivale a la certeza de que su respuesta sea correcta, y los casos ambiguos son más comunes de lo que parece.", { indent: true, after: 200 }),
);

children.push(heading("Repositorio de GitHub"));
children.push(
  p([
    new TextRun({ text: "El notebook completo, con la práctica ejecutada, está disponible en el siguiente repositorio: ", font: FONT, size: SIZE }),
    new ExternalHyperlink({ link: REPO_URL, children: [new TextRun({ text: REPO_URL, font: FONT, size: SIZE, style: "Hyperlink" })] }),
    new TextRun({ text: ".", font: FONT, size: SIZE }),
  ], { indent: true, after: 200 }),
);

children.push(heading("Referencias"));
children.push(
  new Paragraph({
    spacing: { line: 480, after: 150 },
    indent: { hanging: 720 },
    children: [new TextRun({ text: "Vaswani, A., Shazeer, N., Parmar, N., Uszkoreit, J., Jones, L., Gomez, A. N., Kaiser, Ł., & Polosukhin, I. (2017). Attention is all you need. Advances in Neural Information Processing Systems, 30.", font: FONT, size: SIZE })],
  }),
  new Paragraph({
    spacing: { line: 480, after: 150 },
    indent: { hanging: 720 },
    children: [new TextRun({ text: "Wolf, T., Debut, L., Sanh, V., Chaumond, J., Delangue, C., Moi, A., Cistac, P., Rault, T., Louf, R., Funtowicz, M., Davison, J., Shleifer, S., von Platen, P., Ma, C., Jernite, Y., Plu, J., Xu, C., Le Scao, T., Gugger, S., … Rush, A. M. (2020). Transformers: State-of-the-art natural language processing. Proceedings of the 2020 Conference on Empirical Methods in Natural Language Processing: System Demonstrations, 38–45. https://doi.org/10.18653/v1/2020.emnlp-demos.6", font: FONT, size: SIZE })],
  }),
);

const doc = new Document({
  sections: [
    {
      properties: {},
      headers: {
        default: new Header({
          children: [new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [new TextRun({ children: [PageNumber.CURRENT], font: FONT, size: 20 })],
          })],
        }),
      },
      children,
    },
  ],
});

Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync("Informe_Transformers.docx", buf);
  console.log("Generado.");
});
