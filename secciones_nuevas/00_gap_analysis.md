# Análisis de brechas — tesis de maestría v3.1

Este documento compara la tabla de contenidos del PDF actual (`tesis_ultima_version.pdf`, 57 páginas, generado el 2026-04-24) con (i) la tabla de contenidos propuesta por el anteproyecto firmado por el director y (ii) el cuerpo de hallazgos consolidados en el repositorio `thesis-web-learning` (docs v3.1, 25 figuras, 25 CSV, literature review de 15 referencias). Su propósito es delimitar de forma exacta qué se debe escribir, qué no se debe tocar, y qué secciones existentes podrían requerir una actualización editorial menor antes de cerrar el documento.

El trabajo de redacción posterior a este análisis procederá únicamente sobre las brechas totalmente ausentes. Las secciones marcadas como "requiere actualización" se dejan señaladas para decisión del autor; no se modifican por iniciativa propia.

## (a) TOC actual del PDF

La numeración y los títulos están transcritos exactamente como aparecen en el documento compilado.

1. INTRODUCCIÓN — capítulo completo, pp. 1–10
   - 1.1 Planteamiento y Contexto del Problema
   - 1.2 Revisión de Literatura y Estado del Arte
   - 1.3 Brecha de Investigación
   - 1.4 Formulación del Problema
   - 1.5 Objetivos (General y Específicos)
   - 1.6 Justificación (Económica y Operativa, Tecnológica, Científica y Social)
   - 1.7 Alcance y Limitaciones
   - 1.8 Estructura de la Tesis

2. MARCO CONTEXTUAL — capítulo completo, pp. 11–20
   - 2.1 El Lavado de Dinero como Fenómeno Financiero Global
   - 2.2 Marco Regulatorio Internacional Anti-Lavado de Activos
   - 2.3 Sistemas Tradicionales de Monitoreo de Transacciones
   - 2.4 Criptomonedas y Delincuencia Financiera
   - 2.5 Tipologías de Lavado de Dinero en Criptomonedas
   - 2.6 Desafíos de la Detección de Fraude Financiero en el Ecosistema Cripto
   - 2.7 Del Monitoreo Basado en Reglas hacia Enfoques Estructurales

3. FUNDAMENTOS DE IA PARA DETECCIÓN DE FRAUDE FINANCIERO — capítulo completo, pp. 21–32
   - 3.1 Del Aprendizaje Automático al Aprendizaje Profundo
   - 3.2 Graph Neural Networks: Fundamentos Conceptuales
   - 3.3 Arquitecturas GNN Evaluadas
   - 3.4 El Desafío de la Explicabilidad en GNNs
   - 3.5 Estrategias de Mitigación del Desbalance de Clases
   - 3.6 Formalización de Métricas de Evaluación
   - 3.7 Preparación para el Diseño Experimental

4. METODOLOGÍA — capítulo completo, pp. 33–42
   - 4.1 Conjunto de Datos: Elliptic Bitcoin Dataset
   - 4.2 Construcción de los Escenarios de Desbalance (1:1, 1:10, 1:50, 1:100)
   - 4.3 Arquitecturas GNN Evaluadas (GCN, GraphSAGE, GAT, TAGCN)
   - 4.4 Técnicas de Mitigación del Desbalance (sin balanceo, class weighting, focal loss)
   - 4.5 Métodos de Explicabilidad (GNNExplainer, PGExplainer, GNNShap)
   - 4.6 Protocolo de Evaluación de Estabilidad (test estocástico, perturbación)
   - 4.7 Métricas de Evaluación (predictivas, estabilidad)
   - 4.8 Optimización de Hiperparámetros (Optuna/TPE)
   - 4.9 Infraestructura Computacional y Distribución de la Carga
   - 4.10 Análisis Estadístico (ANOVA Factorial, Tukey HSD, matriz de recomendación)
   - 4.11 Síntesis del Diseño Metodológico

5. RESULTADOS — p. 43, solo títulos, sin contenido narrativo
   - 5.1 Análisis Exploratorio de Datos
   - 5.2 Descripción del Pipeline Experimental
   - 5.3 Escenarios de Desbalance
   - 5.4 Resultados de Rendimiento Predictivo
   - 5.5 Resultados de Estabilidad Explicativa
   - 5.6 Análisis Factorial
   - 5.7 Síntesis de Resultados

6. DISCUSIÓN — p. 44, solo títulos, sin contenido narrativo
   - 6.1 Degradación de la Estabilidad Explicativa bajo Desbalance
   - 6.2 Resiliencia Arquitectónica: GCN vs. GraphSAGE vs. GAT vs. TAGCN
   - 6.3 Impacto de las Estrategias de Balanceo sobre la Explicabilidad
   - 6.4 Comparación entre Explicadores: GNNExplainer, PGExplainer y GNNShap
   - 6.5 Hacia una Tríada Óptima
   - 6.6 Implicaciones para la Industria AML
   - 6.7 Limitaciones del Estudio

7. CONCLUSIONES — p. 45, solo títulos, sin contenido narrativo
   - 7.1 Respuestas a los Objetivos de Investigación (4 subsecciones)
   - 7.2 Contribuciones Principales
   - 7.3 Limitaciones Identificadas

8. PERSPECTIVAS FUTURAS Y ANEXOS — p. 46, solo títulos, sin contenido narrativo
   - 8.1 Perspectivas Futuras (6 subsecciones: extensión a otros datasets, GraphSMOTE, arquitecturas dinámicas, métricas adicionales, integración operativa, explicabilidad interactiva)
   - Anexos (no detallados)

Referencias — pp. 47–49, 36 entradas bibliográficas.

## (b) TOC objetivo

La propuesta objetivo preserva la numeración y los títulos actuales del PDF y se limita a llenar los capítulos vacíos (5–8). La estructura elegida para cada capítulo proviene del anteproyecto y de los objetivos específicos firmados por el director, no de una reorganización propia.

El anteproyecto establece cuatro objetivos específicos que esta tesis debe responder de forma explícita: (i) cuantificar la degradación de la estabilidad bajo desbalance progresivo, (ii) comparar la robustez de las cuatro arquitecturas GNN en estabilidad de explicaciones, (iii) evaluar el impacto de las técnicas de balanceo sobre la explicabilidad, y (iv) construir una matriz de recomendación sobre la tríada arquitectura–explicador–balanceo. Cada uno de estos cuatro objetivos tiene una subsección dedicada en el esqueleto actual del Capítulo 7 (7.1.1 a 7.1.4), lo que indica alineamiento entre el plan original y el documento en curso. El TOC objetivo respeta esa alineación.

Las siete subsecciones del Capítulo 5 tal como están planteadas en el PDF cubren el barrido de rendimiento predictivo y estabilidad que exige el anteproyecto. Se conservan sin modificar. Lo mismo aplica al Capítulo 6: las siete subsecciones cubren los cuatro ejes de discusión (desbalance, arquitectura, balanceo, explicador), la tríada óptima (6.5), las implicaciones para la industria AML (6.6) y las limitaciones (6.7). Lo mismo para los Capítulos 7 y 8.

Cambio único propuesto al esqueleto: el Capítulo 8 actualmente mezcla "Perspectivas Futuras" con "Anexos" en un solo título. Se propone separar los Anexos en una sección `Anexos` numerada después del Capítulo 8 o incorporarlos al final, sin renumerar el resto del documento. Este cambio se presenta como recomendación; la decisión queda en manos del autor.

## (c) Diff — qué está, qué falta, qué puede requerir actualización

### Secciones totalmente ausentes (a redactar)

Las cuatro secciones siguientes figuran en el índice con título pero carecen de cualquier contenido narrativo. Son el objeto principal del trabajo de redacción.

1. Capítulo 5 — RESULTADOS. Todas las subsecciones (5.1 a 5.7) están vacías. Se deben reportar los resultados predictivos y de estabilidad de las 60 configuraciones del diseño factorial (48 forzadas del pipeline v3 + 12 del escenario nativo agregado en v3.1), con sus 7 figuras (R1–R7) y las síntesis estadísticas asociadas. El capítulo debe cubrir el análisis factorial (ANOVA) y el filtro de calidad sobre validación.

2. Capítulo 6 — DISCUSIÓN. Todas las subsecciones (6.1 a 6.7) están vacías. Se debe elaborar la interpretación de los resultados, el contraste con el estado del arte (Weber 2019, Pareja 2020, Bellei 2024, Agarwal 2022, GNNX-Bench 2024), las implicaciones operativas y regulatorias, y las limitaciones internas del estudio. Las figuras D1–D6 pertenecen a este capítulo, así como la mayor parte de las figuras A1–A12 que soportan los argumentos de estabilidad.

3. Capítulo 7 — CONCLUSIONES. Todas las subsecciones (7.1 a 7.3) están vacías. El capítulo debe responder explícitamente a los cuatro objetivos específicos del anteproyecto, enunciar las contribuciones principales (tradeoff accuracy–estabilidad, patrón de pico y colapso, caracterización del bug PyG 2.7, paradoja del escenario nativo) y delimitar las limitaciones asumidas.

4. Capítulo 8 — PERSPECTIVAS FUTURAS. Las seis subsecciones del plan de trabajo futuro están enunciadas pero sin texto. Deben desarrollarse como líneas de investigación derivadas del estudio, con referencias técnicas concretas cuando aplique.

### Secciones parcialmente escritas (no aplica)

No existen secciones intermedias. Los Capítulos 1 a 4 están completos en prosa; los Capítulos 5 a 8 están vacíos en cuerpo. No hay un estado intermedio que requiera completar al interior de un capítulo existente.

### Secciones que probablemente requieren actualización por hallazgos v3.1 (marcadas para decisión del autor)

Las siguientes secciones del PDF están escritas pero el alcance experimental del pipeline v3.1 introduce elementos que, si se desea mantener coherencia total entre método y resultados, podrían requerir una revisión editorial. No se tocan en esta fase de redacción.

1. Sección 4.2 — Construcción de los Escenarios de Desbalance. El PDF describe cuatro escenarios (1:1, 1:10, 1:50, 1:100). El pipeline v3.1 añadió un quinto escenario: ratio nativo aproximado 1:30, que preserva la distribución original de Elliptic. Este escenario se introdujo post-análisis con el propósito de comparar directamente con Weber 2019 y produjo el hallazgo de la paradoja nativa (A11, A12). Decisión pendiente: mencionar los cinco escenarios en 4.2 o dejar el quinto como subsección adicional en el Capítulo 5 (por ejemplo, 5.3.x).

2. Sección 4.5.3 — Configuración de PGExplainer. El PDF describe la configuración estándar (30 épocas, lr=0,003). El pipeline v3.1 identificó dos bugs silenciosos en PyTorch Geometric 2.7 que invalidaban PGExplainer con valores por defecto (`edge_size=0.05` causa mode collapse; `temp=[5.0,2.0]` causa overflow numérico) y documentó fixes parciales (`edge_size=0.005`, `temp=[1.0,1.0]`, gradient clipping). Decisión pendiente: agregar la caracterización del bug a 4.5.3 como subsección de configuración realmente aplicada, o reportarlo únicamente en Resultados/Discusión como hallazgo metodológico emergente.

3. Sección 4.7.1 — Métricas Predictivas. El PDF describe F1, MCC y PR-AUC como métricas de rendimiento y menciona en 4.10.3 umbrales de aceptación F1≥0,80 y MCC≥0,70 para la matriz de recomendación. Los resultados efectivos del pipeline v3.1 arrojan valores máximos de F1 validación de 0,53 y MCC de 0,46, que no alcanzan esos umbrales. El repositorio documenta un filtro de calidad operativo más laxo (F1≥0,30, MCC≥0,15) usado para separar configuraciones aprendidas de configuraciones colapsadas. Decisión pendiente: reconciliar los umbrales de 4.10.3 con el filtro efectivo del pipeline, o mantener los umbrales originales como criterio ideal y reportar el filtro operacional como parte del Capítulo 5.

4. Sección 1.3 — Brecha de Investigación. La brecha original se define como ausencia de evaluación sistemática de estabilidad XAI en Elliptic bajo desbalance. El pipeline v3.1 añade dos contribuciones novel no anticipadas: (i) caracterización de bugs de PyG 2.7 y (ii) paradoja del escenario nativo. Decisión pendiente: ampliar 1.3 para incluir estas contribuciones o reservarlas para las Conclusiones (7.2 Contribuciones Principales).

5. Capítulo de Referencias. Las 36 entradas actuales cubren la mayor parte del material necesario. El material v3.1 introduce al menos cuatro referencias que podrían no estar presentes (Bellei 2024 Elliptic2, Chen 2025 MDST-GNN, Longa 2023 survey temporal, arXiv:2602.23599 warm-start priors, Agarwal 2022 GraphXAI). Se consolidarán todas las citas usadas en las secciones nuevas en el archivo `99_referencias.md` y se identificarán allí cuáles son adiciones respecto al listado actual.

## (d) Plan de escritura propuesto

### Orden de redacción y dependencias

Los cuatro capítulos se redactan secuencialmente porque cada uno depende del anterior. Esta secuencia refleja la progresión argumental del documento y minimiza revisiones retroactivas.

1. Capítulo 5 — RESULTADOS. Es la base del documento: cifras, figuras, contrastes factoriales. No depende de nada más allá del método ya escrito. Se entrega primero.

2. Capítulo 6 — DISCUSIÓN. Interpreta los resultados del Capítulo 5 y los contrasta con la literatura del Capítulo 1. Depende directamente del Capítulo 5 para las cifras concretas y de las Secciones 1.2 y 2 para los contrastes externos.

3. Capítulo 7 — CONCLUSIONES. Sintetiza resultados (Capítulo 5) y argumentos (Capítulo 6) en función de los objetivos del Capítulo 1. Depende de los dos capítulos anteriores.

4. Capítulo 8 — PERSPECTIVAS FUTURAS. Proyecta líneas a partir de las limitaciones de 6.7 y 7.3. Depende del diagnóstico de limitaciones del Capítulo 6 y 7.

Una vez redactados los cuatro capítulos, se consolida `99_referencias.md` y se produce un índice final del orden de archivos.

### Figuras a producir y a reutilizar

El repositorio mantiene 25 figuras ya diseñadas como SVG reproducibles por el módulo `thesis_figures/figures-render.js`. Todas tienen CSV fuente en `thesis_figures/{results,analysis,discussion}/*.data.csv`. La estrategia es reutilizar estas 25 figuras generando su versión PNG a 300 DPI para embeber en los capítulos de Markdown.

| ID | Título breve | Capítulo destino | Fuente CSV |
|----|--------------|------------------|------------|
| R1 | Pass-rate por escenario | 5.4.1 | `results/R1_pass_rate_by_scenario.data.csv` |
| R2 | Pass-rate por arquitectura | 5.4.2 | `results/R2_pass_rate_by_arch.data.csv` |
| R3 | Pass-rate por técnica de balanceo | 5.4.3 | `results/R3_pass_rate_by_balancing.data.csv` |
| R4 | Heatmap F1 val (arquitectura × escenario) | 5.4.1 | `results/R4_val_f1_heatmap.data.csv` |
| R5 | Scatter F1 vs MCC (60 configs) | 5.4.1 | `results/R5_val_f1_vs_mcc_scatter.data.csv` |
| R6 | Tabla de configuraciones aprobadas | 5.5 / 5.7 | `results/R6_configs_summary_table.data.csv` |
| R7 | Pass-rate bajo escenario nativo 1:30 | 5.4.2 o 5.3.x | `results/R7_native_pass_rate_by_arch.data.csv` |
| A1 | Distribución Spearman por explicador | 5.5.1 | `analysis/A1_spearman_distribution_by_explainer.data.csv` |
| A2 | Spearman por escenario con IC (curva central) | 5.5.1 / 6.1 | `analysis/A2_spearman_by_scenario_errorbars.data.csv` |
| A3 | Spearman por arquitectura | 5.5.1 / 6.2 | `analysis/A3_spearman_by_architecture.data.csv` |
| A4 | Cuadrantes precisión × estabilidad | 5.6 / 6.5 | `analysis/A4_accuracy_vs_stability_scatter.data.csv` |
| A5 | Heatmap Spearman (escenario × arquitectura) | 5.6 | `analysis/A5_spearman_heatmap_scenario_arch.data.csv` |
| A6 | Histograma Jaccard | 5.5.3 / 6.4 | `analysis/A6_jaccard_distribution.data.csv` |
| A7 | Boxplot Kruskal–Wallis por escenario | 5.6 | `analysis/A7_kruskal_boxplot.data.csv` |
| A8 | Tamaños de efecto Cohen d | 5.6 | `analysis/A8_cohens_d_effect_sizes.data.csv` |
| A9 | Degeneración PGExplainer | 6.4 | `analysis/A9_pgexplainer_degeneration.data.csv` |
| A10 | Top-10 configs por Spearman | 5.7 / 6.5 | `analysis/A10_top_spearman_configs.data.csv` |
| A11 | Spearman nativo vs forzado | 5.5.1 / 6.1 | `analysis/A11_spearman_native_vs_forced.data.csv` |
| A12 | Heatmap nativo (arquitectura × explicador) | 5.5.1 / 6.2 | `analysis/A12_native_heatmap.data.csv` |
| D1 | Comparación con estado del arte | 6.6 | `discussion/D1_sota_comparison.data.csv` |
| D2 | Cuadrantes por arquitectura | 6.2 / 6.5 | `discussion/D2_accuracy_stability_quadrants.data.csv` |
| D3 | Curva de pico y colapso | 6.1 | `discussion/D3_peak_collapse_curve.data.csv` |
| D4 | Matriz de recomendación técnica | 6.5 / 7.1.4 | `discussion/D4_recommendation_matrix.data.csv` |
| D5 | Distribución temporal del pipeline | 5.2.2 / 6.6 | `discussion/D5_pipeline_runtime_breakdown.data.csv` |
| D6 | Nativo vs baselines de literatura | 6.6 | `discussion/D6_native_vs_literature.data.csv` |

Figuras nuevas a crear: ninguna. Las 25 figuras existentes cubren los hallazgos a reportar. Si durante la redacción aparece una necesidad de visualización no cubierta por el conjunto actual, se solicitará validación antes de crearla.

### Estrategia para generar PNG

Opción propuesta: exportar las figuras ya diseñadas en `Figuras Tesis.html` a PNG individuales mediante Playwright (misma herramienta usada para el deck) a resolución 1280×904 @ 2x, rasterizadas a PNG. El script se ejecuta una sola vez y produce `secciones_nuevas/figuras/{R1,R2,…,D6}.png`.

### Consultas pendientes antes de iniciar la redacción

Antes de producir la primera sección solicito decisión explícita sobre los puntos siguientes. Cada uno afecta el contenido de varios capítulos y prefiero clarificarlos todos antes de escribir.

1. ¿El escenario nativo 1:30 se reporta únicamente en Resultados/Discusión como hallazgo emergente, o se quiere que el Capítulo 5 mencione los cinco escenarios desde el inicio y se acepte la pequeña inconsistencia con la Sección 4.2 del método escrito? Mi recomendación es la primera opción (reportarlo como finding emergente, citando que el quinto escenario se añadió en la iteración v3.1 del pipeline para habilitar la comparación con Weber 2019). Esto permite no tocar el Capítulo 4.

2. ¿Se mantiene el umbral de la matriz de recomendación (F1≥0,80, MCC≥0,70, Jaccard≥0,70) tal como está descrito en 4.10.3, reportando en Resultados que ninguna configuración alcanza ese umbral y que se usó un filtro de calidad operacional (F1≥0,30, MCC≥0,15) como criterio alterno? Mi recomendación es sí, mantener el umbral original como criterio ideal y explicar la adopción del filtro operacional como resultado emergente. Alternativa: relajar el umbral de 4.10.3 al filtro operacional, lo que requeriría edición del Capítulo 4.

3. ¿La caracterización del bug PyG 2.7 PGExplainer se presenta como contribución metodológica en la Sección 7.2 (Contribuciones Principales) o se discute transversalmente en 5.5.1 y 6.4 sin elevarla al nivel de contribución formal? Mi recomendación es presentarla como contribución en 7.2 porque es un hallazgo reproducible y verificable que beneficia a otros investigadores.

4. ¿La paradoja nativa (Spearman 0,159 en 1:30 nativo vs. 0,593 en 1:50 forzado) se presenta como finding principal junto con el pico-colapso, o como un matiz metodológico sobre la interpretación del "escenario realista"? Mi recomendación es como finding principal porque desafía la hipótesis implícita de literatura de que "entrenar en distribución nativa produce las explicaciones más robustas".

5. Formato de citación final: ¿se mantiene el estilo numérico con corchetes (`[N]`) que usa el PDF actual en los capítulos escritos, o se adopta el estilo autor-año `(Weber et al., 2019)` solicitado en tu brief? El brief solicita autor-año, pero el PDF existente usa numérico. Si se adopta autor-año en las secciones nuevas, la tesis final tendrá dos estilos conviviendo a menos que se convierta el resto. Mi recomendación: autor-año en las secciones nuevas tal como pediste y dejar el refactor del resto como decisión del autor.

6. Entrega de figuras: ¿PNG a 300 DPI embebidos directamente en el Markdown es aceptable, o prefieres que deje los archivos SVG originales como fallback adicional?

Una vez resueltas estas seis consultas, procedo con la redacción del Capítulo 5.
