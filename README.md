# Transformers aplicados a clasificación de sentimientos (NLP)

![Python](https://img.shields.io/badge/Python-3.x-blue)
![Transformers](https://img.shields.io/badge/HuggingFace-Transformers-yellow)
![Colab](https://img.shields.io/badge/Google%20Colab-ready-yellow)

Práctica con un modelo **Transformer preentrenado** (DistilBERT afinado para análisis de sentimientos) usando la librería `transformers` de Hugging Face, aplicado a clasificación de sentimientos sobre un conjunto de oraciones en inglés.

> Trabajo académico — actividad **R2-A6-S12: Informe y mapa mental – Transformers (Deep Learning)**, asignatura Inteligencia Artificial - Conceptos, CADI, Universidad de Cundinamarca.

[![Abrir en Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/JSBeltran93/transformers-nlp-sentimientos/blob/main/Transformers_NLP.ipynb)

## Nota sobre la práctica

Se usó `distilbert-base-uncased-finetuned-sst-2-english`, un modelo preentrenado disponible públicamente en Hugging Face, accedido a través del pipeline de alto nivel `sentiment-analysis`. No se entrenó ningún modelo desde cero: el objetivo de la práctica es aplicar y analizar el comportamiento de un Transformer ya afinado para una tarea concreta de NLP.

## Tabla de contenido

- [Objetivo](#objetivo)
- [Contenido del repositorio](#contenido-del-repositorio)
- [Resultados](#resultados)
- [Cómo ejecutarlo](#cómo-ejecutarlo)
- [Autor](#autor)

## Objetivo

Aplicar un modelo Transformer preentrenado a una tarea de NLP, observando:

- Cómo el pipeline de Hugging Face tokeniza y clasifica texto usando el mecanismo de atención.
- El comportamiento del modelo frente a oraciones con sentimiento claro vs. un caso neutro/ambiguo.
- Los límites de un modelo afinado sobre un dataset binario (sin clase "neutral").

## Contenido del repositorio

```
.
├── Transformers_NLP.ipynb   # Notebook con la práctica ejecutada
├── mapa_mental.png          # Mapa mental de los conceptos de Transformers
└── README.md
```

## Resultados

Ver el informe PDF para el detalle completo. En resumen: las oraciones con sentimiento claro se clasificaron correctamente con una confianza de 99.52%-99.98%; la oración neutra se clasificó como NEGATIVE con 99.52% de confianza, ilustrando cómo un clasificador binario fuerza una respuesta incluso ante un caso ambiguo.

## Cómo ejecutarlo

**Opción 1: Google Colab**

Abrir con el badge de arriba, o manualmente: `Archivo → Abrir notebook → GitHub`.

**Opción 2: Entorno local**
```bash
pip install transformers torch
jupyter notebook Transformers_NLP.ipynb
```

## Autor

**Joan Schneider Beltrán Delgado**
Especialización en Inteligencia Artificial, Universidad de Cundinamarca
