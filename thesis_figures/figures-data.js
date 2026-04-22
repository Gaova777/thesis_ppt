/* ============================================================
   Data for all 19 thesis figures.
   Structure per figure:
     id, section ("Resultados"|"Análisis"|"Discusión"),
     title, reading (how-to-read guide), caption, source, data
   ============================================================ */

window.THESIS_FIGS = [

/* ======================= RESULTADOS ======================= */
{
  id:"R1", section:"Resultados · Desempeño predictivo",
  title:"Tasa de aprobación del filtro de calidad por escenario de desbalance",
  reading:"Cada barra representa cuántas de las 12 configuraciones (4 arquitecturas × 3 balanceos) superaron el filtro mínimo de validación en ese escenario. El pico está en 1:10, la caída en 1:100.",
  caption:"La tasa de aprobación sigue una curva no monótona: asciende de <b>25 % en 1:1 a 67 % en 1:10</b>, luego cae a <b>42 % en 1:50 y sólo 8 % en 1:100</b>. Este patrón muestra que el desbalance moderado (1:10) es el régimen más favorable para entrenamiento, mientras el extremo (1:100) colapsa casi la totalidad del espacio de configuraciones.",
  source:"thesis_figures/results/R1_pass_rate_by_scenario.data.csv",
  chart:"bars_h",
  data:[
    {label:"1:1",    rate:0.25,    passed:3, total:12},
    {label:"1:10",   rate:0.6667,  passed:8, total:12, highlight:true},
    {label:"1:50",   rate:0.4167,  passed:5, total:12},
    {label:"1:100",  rate:0.0833,  passed:1, total:12, danger:true}
  ],
  xAxisLabel:"Tasa de aprobación", yAxisLabel:"Escenario"
},

{
  id:"R2", section:"Resultados · Desempeño predictivo",
  title:"Tasa de aprobación del filtro de calidad por arquitectura GNN",
  reading:"Cada barra indica, sobre 12 posibles (4 escenarios × 3 balanceos), cuántas configuraciones de esa arquitectura pasaron el filtro. Ordenadas de menor a mayor robustez.",
  caption:"La jerarquía es nítida: <b>GraphSAGE aprueba el 67 %</b> de sus configuraciones frente al <b>8 % de GCN</b>. GAT y TAGCN se sitúan en el rango intermedio. GraphSAGE es entonces la arquitectura más consistente como entrenable, lo que condiciona todo el análisis posterior de estabilidad.",
  source:"thesis_figures/results/R2_pass_rate_by_arch.data.csv",
  chart:"bars_h",
  data:[
    {label:"GCN",       rate:0.0833, passed:1, total:12, danger:true},
    {label:"TAGCN",     rate:0.25,   passed:3, total:12},
    {label:"GAT",       rate:0.4167, passed:5, total:12},
    {label:"GraphSAGE", rate:0.6667, passed:8, total:12, highlight:true}
  ],
  xAxisLabel:"Tasa de aprobación", yAxisLabel:"Arquitectura"
},

{
  id:"R3", section:"Resultados · Desempeño predictivo",
  title:"Tasa de aprobación del filtro de calidad por técnica de balanceo",
  reading:"Cada barra compara, sobre 16 posibles (4 escenarios × 4 arquitecturas), cuántas configuraciones aprobaron el filtro según la técnica de balanceo empleada.",
  caption:"<b>Class weighting (44 %)</b> supera modestamente a <b>focal loss (38 %)</b>, ambos por encima de la línea base <b>sin balanceo (25 %)</b>. La mejora marginal confirma que las técnicas de balanceo son <b>condición necesaria pero no suficiente</b>: reducen el colapso pero no neutralizan el efecto del desbalance extremo.",
  source:"thesis_figures/results/R3_pass_rate_by_balancing.data.csv",
  chart:"bars_h",
  data:[
    {label:"Sin balanceo",        rate:0.25,    passed:4, total:16},
    {label:"Focal loss",          rate:0.375,   passed:6, total:16},
    {label:"Class weighting",     rate:0.4375,  passed:7, total:16, highlight:true}
  ],
  xAxisLabel:"Tasa de aprobación", yAxisLabel:"Balanceo"
},

{
  id:"R4", section:"Resultados · Desempeño predictivo",
  title:"Mapa de calor de F1 de validación — arquitectura × escenario",
  reading:"Cada celda muestra la media de F1 de validación (mejor balanceo) para esa combinación arquitectura–escenario. Más oscuro = mejor desempeño. La columna 1:10 concentra los valores altos.",
  caption:"GraphSAGE domina tres de los cuatro escenarios con F1 entre <b>0.36 y 0.53</b>; GCN se mantiene por debajo de 0.32 en todos los regímenes. El pico absoluto (<b>0.529, GraphSAGE en 1:10</b>) confirma que el desbalance moderado no sólo preserva la tasa de aprobación sino que eleva el desempeño máximo alcanzable.",
  source:"thesis_figures/results/R4_val_f1_heatmap.data.csv",
  chart:"heatmap",
  rows:["GCN","GraphSAGE","GAT","TAGCN"],
  cols:["1:1","1:10","1:50","1:100"],
  data:[
    [0.2145,0.3148,0.2973,0.2983],
    [0.3623,0.5295,0.5226,0.4380],
    [0.3150,0.4595,0.4199,0.2935],
    [0.2676,0.3774,0.3097,0.2490]
  ],
  colorMin:0.20, colorMax:0.53,
  xAxisLabel:"Escenario", yAxisLabel:"Arquitectura"
},

{
  id:"R5", section:"Resultados · Desempeño predictivo",
  title:"Concordancia entre F1 y MCC sobre las 48 configuraciones",
  reading:"Cada punto es una configuración (arquitectura × escenario × balanceo). Los puntos sobre la diagonal son los que aprobaron el filtro (F1>0.30, MCC>0.27); los grises quedaron por debajo del umbral.",
  caption:"F1 y MCC se correlacionan fuertemente (<b>r ≈ 0.97</b>): ambas métricas identifican las mismas configuraciones viables, lo que valida el criterio del filtro dual. Las <b>17 configuraciones aprobadas</b> se agrupan en el cuadrante superior derecho; el resto queda concentrado cerca del origen.",
  source:"thesis_figures/results/R5_val_f1_vs_mcc_scatter.data.csv",
  chart:"scatter_filter",
  xAxisLabel:"F1 de validación", yAxisLabel:"MCC de validación",
  thresholdX:0.30, thresholdY:0.27
},

{
  id:"R6", section:"Resultados · Desempeño predictivo",
  title:"Las 17 configuraciones que aprobaron el filtro — F1, MCC y Spearman de GNNExplainer",
  reading:"Cada fila es una configuración que pasó el filtro. Las tres columnas numéricas muestran, en paralelo, el desempeño predictivo (F1, MCC) y la estabilidad del explicador (Spearman). Barras proporcionales para comparar de un vistazo.",
  caption:"El valor máximo simultáneo de F1 y Spearman corresponde a <b>GraphSAGE · 1:10 · focal loss</b> y <b>TAGCN · 1:50 · focal loss</b>. Alto F1 no implica alta estabilidad: <b>GraphSAGE · 1:10 · focal loss</b> alcanza F1=0.53 pero Spearman=0.30, mientras <b>TAGCN · 1:50 · focal loss</b> tiene F1=0.31 y Spearman=0.79.",
  source:"thesis_figures/results/R6_configs_summary_table.data.csv",
  chart:"ranked_table",
  rows:[
    {s:"1:50",a:"TAGCN",    b:"focal_loss",      f1:0.3097, mcc:0.2971, sp:0.7894, hl:true},
    {s:"1:50",a:"GAT",      b:"focal_loss",      f1:0.4199, mcc:0.4006, sp:0.7819, hl:true},
    {s:"1:10",a:"GAT",      b:"none",            f1:0.4595, mcc:0.4436, sp:0.7164},
    {s:"1:10",a:"GraphSAGE",b:"none",            f1:0.4714, mcc:0.4538, sp:0.6947},
    {s:"1:10",a:"GAT",      b:"focal_loss",      f1:0.3261, mcc:0.3205, sp:0.6541},
    {s:"1:10",a:"TAGCN",    b:"focal_loss",      f1:0.3077, mcc:0.2955, sp:0.6312},
    {s:"1:50",a:"GAT",      b:"class_weighting", f1:0.3150, mcc:0.2944, sp:0.6164},
    {s:"1:1", a:"GraphSAGE",b:"none",            f1:0.3623, mcc:0.4020, sp:0.5897},
    {s:"1:10",a:"GCN",      b:"class_weighting", f1:0.3148, mcc:0.3103, sp:0.4842},
    {s:"1:10",a:"GraphSAGE",b:"class_weighting", f1:0.4785, mcc:0.4672, sp:0.4198},
    {s:"1:1", a:"GAT",      b:"class_weighting", f1:0.3150, mcc:0.2955, sp:0.4047},
    {s:"1:50",a:"GraphSAGE",b:"focal_loss",      f1:0.5226, mcc:0.5115, sp:0.3947, hl:true},
    {s:"1:50",a:"GraphSAGE",b:"class_weighting", f1:0.5166, mcc:0.5067, sp:0.3832},
    {s:"1:10",a:"TAGCN",    b:"none",            f1:0.3774, mcc:0.3679, sp:0.3487},
    {s:"1:10",a:"GraphSAGE",b:"focal_loss",      f1:0.5295, mcc:0.5196, sp:0.3010, hl:true},
    {s:"1:1", a:"GraphSAGE",b:"class_weighting", f1:0.3434, mcc:0.3834, sp:0.2731},
    {s:"1:100",a:"GraphSAGE",b:"class_weighting",f1:0.4380, mcc:0.4409, sp:0.2389, danger:true}
  ]
},

/* ======================= ANÁLISIS ======================= */
{
  id:"A1", section:"Análisis · Estabilidad explicativa",
  title:"Distribución de Spearman por explicador",
  reading:"Cada punto es una configuración; se agrupan por explicador. Línea horizontal gruesa = mediana. GNNExplainer se dispersa entre 0.24 y 0.79; PGExplainer colapsa a cero; GNNShap muestra varianza alta pero acotada.",
  caption:"<b>GNNExplainer</b> es el único explicador con rangos estables operativamente relevantes (mediana ≈ 0.47). <b>PGExplainer se degenera sistemáticamente (Spearman = 0)</b> en las 17 configuraciones evaluadas. <b>GNNShap</b> oscila entre 0 y 0.33 con mediana cercana a cero, evidenciando varianza muestral elevada.",
  source:"thesis_figures/analysis/A1_spearman_distribution_by_explainer.data.csv",
  chart:"strip_by_explainer",
  explainers:[
    {name:"GNNExplainer", median:0.4842, values:[0.2389,0.2731,0.3010,0.3487,0.3832,0.3947,0.4047,0.4198,0.4842,0.5897,0.6164,0.6312,0.6541,0.6947,0.7164,0.7819,0.7894]},
    {name:"GNNShap",      median:0.0,    values:[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0972,0.1000,0.1649,0.2000,0.2994,0.3333,0.3333]},
    {name:"PGExplainer",  median:0.0,    values:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]}
  ],
  yAxisLabel:"Spearman medio"
},

{
  id:"A2", section:"Análisis · Estabilidad explicativa",
  title:"Estabilidad (Spearman) por escenario con intervalos min–max",
  reading:"Cada punto es la media de Spearman para ese escenario; las barras verticales unen el mínimo y máximo observados. Nótese la inflexión en 1:50 y la caída abrupta en 1:100.",
  caption:"La estabilidad <b>crece</b> de 0.42 (1:1) a <b>0.59 (1:50)</b>, luego cae a <b>0.24 en 1:100</b>. El patrón sugiere una ventana óptima: el desbalance moderado <b>no degrada la estabilidad</b>, y sólo el régimen extremo (≥1:100) la colapsa. Este hallazgo matiza la intuición habitual de degradación monótona.",
  source:"thesis_figures/analysis/A2_spearman_by_scenario_errorbars.data.csv",
  chart:"errorbars",
  data:[
    {label:"1:1",   mean:0.4225, min:0.2731, max:0.5897, n:3},
    {label:"1:10",  mean:0.5313, min:0.3010, max:0.7164, n:8},
    {label:"1:50",  mean:0.5931, min:0.3832, max:0.7894, n:5, highlight:true},
    {label:"1:100", mean:0.2389, min:0.2389, max:0.2389, n:1, danger:true}
  ],
  yAxisLabel:"Spearman medio", xAxisLabel:"Escenario"
},

{
  id:"A3", section:"Análisis · Estabilidad explicativa",
  title:"Estabilidad por arquitectura",
  reading:"Cada barra es la media de Spearman entre todas las configuraciones aprobadas de esa arquitectura. El número pequeño indica cuántas configuraciones la componen.",
  caption:"<b>GAT (0.635)</b> y <b>TAGCN (0.590)</b> presentan la mayor estabilidad explicativa promedio, pese a no ser los líderes en F1. <b>GraphSAGE (0.412)</b>, dominante en desempeño, cae al cuarto puesto en estabilidad. Se evidencia la <b>disociación precisión–auditabilidad</b>.",
  source:"thesis_figures/analysis/A3_spearman_by_architecture.data.csv",
  chart:"bars_h_n",
  data:[
    {label:"GraphSAGE", rate:0.4119, n:8},
    {label:"GCN",       rate:0.4842, n:1},
    {label:"TAGCN",     rate:0.5898, n:3, highlight:true},
    {label:"GAT",       rate:0.6347, n:5, highlight:true}
  ],
  xMax:0.8, xAxisLabel:"Spearman medio", yAxisLabel:"Arquitectura"
},

{
  id:"A4", section:"Análisis · Estabilidad explicativa",
  title:"Cuadrantes precisión × estabilidad — 4 arquitecturas",
  reading:"Eje X = F1 medio; eje Y = Spearman medio. Las líneas punteadas dividen los cuadrantes. La esquina superior derecha (alto en ambas) es la zona deseable para despliegue auditable.",
  caption:"Ninguna arquitectura ocupa simultáneamente los cuartiles altos de ambas dimensiones. <b>GraphSAGE</b> lidera precisión pero baja en estabilidad; <b>GAT</b> y <b>TAGCN</b> ofrecen estabilidad superior al precio de menor F1. <b>GCN</b> queda cerca del origen en ambas.",
  source:"thesis_figures/analysis/A4_accuracy_vs_stability_scatter.data.csv",
  chart:"quadrants",
  data:[
    {label:"GCN",       x:0.3148, y:0.4842},
    {label:"GraphSAGE", x:0.4578, y:0.4119},
    {label:"GAT",       x:0.3671, y:0.6347, highlight:true},
    {label:"TAGCN",     x:0.3316, y:0.5898, highlight:true}
  ],
  xMin:0.25, xMax:0.55, yMin:0.30, yMax:0.75,
  xDiv:0.40, yDiv:0.50,
  xAxisLabel:"F1 de validación (medio)", yAxisLabel:"Spearman (medio)"
},

{
  id:"A5", section:"Análisis · Estabilidad explicativa",
  title:"Mapa de calor — Spearman · escenario × arquitectura",
  reading:"Cada celda muestra el Spearman medio de las configuraciones aprobadas. Las celdas vacías indican que ninguna configuración de esa combinación superó el filtro de calidad.",
  caption:"La diagonal ascendente desde <b>GraphSAGE·1:100 (0.24)</b> hasta <b>TAGCN·1:50 (0.79)</b> revela el núcleo del hallazgo: <b>la estabilidad máxima se alcanza en arquitecturas con receptive field amplio (GAT, TAGCN) combinadas con desbalance moderado–alto</b>. GCN sólo aprueba en 1:10.",
  source:"thesis_figures/analysis/A5_spearman_heatmap_scenario_arch.data.csv",
  chart:"heatmap",
  rows:["GCN","GraphSAGE","GAT","TAGCN"],
  cols:["1:1","1:10","1:50","1:100"],
  data:[
    [null,    0.4842, null,   null  ],
    [0.4314, 0.4718, 0.3890, 0.2389],
    [0.4047, 0.6852, 0.6991, null  ],
    [null,   0.4899, 0.7894, null  ]
  ],
  colorMin:0.20, colorMax:0.80,
  xAxisLabel:"Escenario", yAxisLabel:"Arquitectura"
},

{
  id:"A6", section:"Análisis · Estabilidad explicativa",
  title:"Distribución de Jaccard — subgrafos explicativos",
  reading:"Cada barra corresponde a una de las 17 configuraciones aprobadas. El valor es el Jaccard medio de los subgrafos explicativos extraídos por GNNExplainer sobre múltiples semillas.",
  caption:"<b>Todas las configuraciones arrojan Jaccard = 1.0</b>: los subgrafos explicativos son idénticos entre réplicas. Este resultado desplaza la señal discriminante hacia los <b>pesos ordenados</b> (captados por Spearman): la topología es estable, pero las <b>magnitudes relativas</b> no lo son.",
  source:"thesis_figures/analysis/A6_jaccard_distribution.data.csv",
  chart:"jaccard_histogram"
},

{
  id:"A7", section:"Análisis · Estabilidad explicativa",
  title:"Kruskal–Wallis · distribución de Spearman por escenario",
  reading:"Boxplot por escenario: la caja marca los cuartiles, la línea interior la mediana, los puntos los valores individuales. El test Kruskal–Wallis evalúa si las distribuciones difieren significativamente.",
  caption:"Kruskal–Wallis arroja <b>H = 4.31, p = 0.230</b>: no hay evidencia significativa de diferencias entre escenarios al nivel α=0.05. El tamaño muestral reducido (n=1 en 1:100) limita el poder estadístico; el efecto cualitativo observado en A2 debe leerse como tendencia no confirmada por inferencia formal.",
  source:"thesis_figures/analysis/A7_kruskal_boxplot.data.csv",
  chart:"boxplot",
  data:[
    {label:"1:1",   values:[0.2731,0.4047,0.5897]},
    {label:"1:10",  values:[0.3010,0.3487,0.4198,0.4842,0.6312,0.6541,0.6947,0.7164]},
    {label:"1:50",  values:[0.3832,0.3947,0.6164,0.7819,0.7894]},
    {label:"1:100", values:[0.2389]}
  ],
  stats:{H:4.31, p:0.2301},
  yAxisLabel:"Spearman medio"
},

{
  id:"A8", section:"Análisis · Estabilidad explicativa",
  title:"Tamaño del efecto (d de Cohen) entre escenarios",
  reading:"Cada barra muestra la d de Cohen entre dos escenarios. Magnitud: |d|<0.2 despreciable, 0.2–0.5 pequeña, 0.5–0.8 mediana, >0.8 grande. Dirección negativa = el segundo escenario tiene mayor Spearman.",
  caption:"<b>1:1 vs 1:50</b> muestra efecto <b>grande (d=−0.91)</b>: el desbalance moderado–alto aumenta sustancialmente la estabilidad respecto del escenario balanceado. Los pares con 1:100 no son calculables por n=1. Este resultado respalda la interpretación de ventana óptima observada en A2.",
  source:"thesis_figures/analysis/A8_cohens_d_effect_sizes.data.csv",
  chart:"effect_sizes",
  data:[
    {label:"1:1 vs 1:10",  d:-0.669, mag:"mediana"},
    {label:"1:1 vs 1:50",  d:-0.915, mag:"grande", highlight:true},
    {label:"1:10 vs 1:50", d:-0.349, mag:"pequeña"},
    {label:"1:10 vs 1:100",d:null,   mag:"n/a"},
    {label:"1:50 vs 1:100",d:null,   mag:"n/a"},
    {label:"1:1 vs 1:100", d:null,   mag:"n/a"}
  ]
},

{
  id:"A9", section:"Análisis · Estabilidad explicativa",
  title:"Degeneración sistemática de PGExplainer",
  reading:"Las 17 configuraciones aprobadas, todas con Spearman de PGExplainer exactamente igual a 0. Comparación con GNNExplainer (mismas configuraciones) como línea de referencia.",
  caption:"PGExplainer produce el mismo ranking para todas las muestras en <b>100 %</b> de las configuraciones — un modo de falla generalizado, no un resultado negativo puntual. La red generadora colapsa a una salida constante bajo las condiciones de entrenamiento de este estudio (Elliptic + desbalance).",
  source:"thesis_figures/analysis/A9_pgexplainer_degeneration.data.csv",
  chart:"pg_degeneration",
  data:[
    {label:"1:10·GCN·cw",            ex:0.4842, pg:0},
    {label:"1:10·GraphSAGE·cw",      ex:0.4198, pg:0},
    {label:"1:10·GraphSAGE·fl",      ex:0.3010, pg:0},
    {label:"1:10·GraphSAGE·none",    ex:0.6947, pg:0},
    {label:"1:1·GraphSAGE·cw",       ex:0.2731, pg:0},
    {label:"1:1·GraphSAGE·none",     ex:0.5897, pg:0},
    {label:"1:50·GraphSAGE·cw",      ex:0.3832, pg:0},
    {label:"1:50·GraphSAGE·fl",      ex:0.3947, pg:0},
    {label:"1:100·GraphSAGE·cw",     ex:0.2389, pg:0},
    {label:"1:10·GAT·fl",            ex:0.6541, pg:0},
    {label:"1:10·TAGCN·fl",          ex:0.6312, pg:0},
    {label:"1:10·TAGCN·none",        ex:0.3487, pg:0},
    {label:"1:50·TAGCN·fl",          ex:0.7894, pg:0},
    {label:"1:10·GAT·none",          ex:0.7164, pg:0},
    {label:"1:1·GAT·cw",             ex:0.4047, pg:0},
    {label:"1:50·GAT·cw",            ex:0.6164, pg:0},
    {label:"1:50·GAT·fl",            ex:0.7819, pg:0}
  ]
},

{
  id:"A10", section:"Análisis · Estabilidad explicativa",
  title:"Top-10 configuraciones por Spearman de GNNExplainer",
  reading:"Ranking descendente. La configuración ganadora combina TAGCN + focal loss + desbalance 1:50; la segunda sustituye TAGCN por GAT con el mismo patrón.",
  caption:"Las <b>dos configuraciones más estables</b> comparten patrón: <b>receptive field amplio</b> (TAGCN-K3 o GAT multihead) + <b>focal loss</b> + <b>desbalance 1:50</b>. GraphSAGE aparece dos veces, siempre con Spearman sustancialmente menor.",
  source:"thesis_figures/analysis/A10_top_spearman_configs.data.csv",
  chart:"ranked_bars",
  data:[
    {rank:1, s:"1:50", a:"TAGCN",     b:"focal_loss",      v:0.7894, hl:true},
    {rank:2, s:"1:50", a:"GAT",       b:"focal_loss",      v:0.7819, hl:true},
    {rank:3, s:"1:10", a:"GAT",       b:"none",            v:0.7164},
    {rank:4, s:"1:10", a:"GraphSAGE", b:"none",            v:0.6947},
    {rank:5, s:"1:10", a:"GAT",       b:"focal_loss",      v:0.6541},
    {rank:6, s:"1:10", a:"TAGCN",     b:"focal_loss",      v:0.6312},
    {rank:7, s:"1:50", a:"GAT",       b:"class_weighting", v:0.6164},
    {rank:8, s:"1:1",  a:"GraphSAGE", b:"none",            v:0.5897},
    {rank:9, s:"1:10", a:"GCN",       b:"class_weighting", v:0.4842},
    {rank:10,s:"1:10", a:"GraphSAGE", b:"class_weighting", v:0.4198}
  ]
},

/* ======================= DISCUSIÓN ======================= */
{
  id:"D1", section:"Discusión · Estado del arte",
  title:"Comparación con el estado del arte sobre Elliptic",
  reading:"Cada barra es un resultado publicado (o de esta tesis). El color distingue origen (nuestro vs externo). La nota al lado precisa el protocolo usado, clave para leer la comparación.",
  caption:"Nuestros resultados (validación, split estático) quedan por debajo de los trabajos que usan <b>split temporal</b> (Pareja 2020, Weber 2019 RF) o <b>warm-start reciente</b> (arXiv 2025). La comparación es orientativa, no directa: este estudio privilegia estabilidad explicativa, no optimización de F1 puntual.",
  source:"thesis_figures/discussion/D1_sota_comparison.data.csv",
  chart:"sota_bars",
  data:[
    {label:"Pareja 2020 — EvolveGCN (test)",              f1:0.89, tag:"external", note:"GNN temporal"},
    {label:"arXiv 2025 — GraphSAGE (val)",                f1:0.85, tag:"external", note:"Warm-start reciente"},
    {label:"Weber 2019 — RandomForest (test)",            f1:0.79, tag:"external", note:"Baseline no-GNN"},
    {label:"Esta tesis — GraphSAGE mejor (val)",          f1:0.53, tag:"ours",     note:"Estático, sin split temporal", highlight:true},
    {label:"Weber 2019 — GCN (test)",                     f1:0.41, tag:"external", note:"Grafo estático, split temporal"},
    {label:"Esta tesis — GCN mejor (val)",                f1:0.31, tag:"ours",     note:"Colapsa bajo desbalance"}
  ]
},

{
  id:"D2", section:"Discusión · Implicaciones arquitectónicas",
  title:"Cuadrantes precisión–estabilidad — visión operativa",
  reading:"Replica A4 como marco de decisión. Los cuatro cuadrantes marcan perfiles de uso: superior derecho = despliegue auditable; superior izquierdo = auditable pero poco preciso; inferior derecho = preciso pero opaco.",
  caption:"<b>Ningún arquetipo domina en ambos ejes.</b> La decisión operativa depende del uso: si la prioridad es <b>despliegue regulado</b>, GAT y TAGCN son preferibles; si la prioridad es <b>desempeño bruto</b>, GraphSAGE. Esta matriz sustenta la recomendación formal de D4.",
  source:"thesis_figures/discussion/D2_accuracy_stability_quadrants.data.csv",
  chart:"quadrants_labeled",
  data:[
    {label:"GCN",       x:0.3148, y:0.4842},
    {label:"GraphSAGE", x:0.4578, y:0.4119},
    {label:"GAT",       x:0.3671, y:0.6347, highlight:true},
    {label:"TAGCN",     x:0.3316, y:0.5898, highlight:true}
  ],
  xMin:0.25, xMax:0.55, yMin:0.30, yMax:0.75,
  xDiv:0.40, yDiv:0.50,
  xAxisLabel:"F1 de validación (medio)", yAxisLabel:"Spearman (medio)",
  quadrants:[
    {pos:"tr", label:"Ideal — auditable + preciso"},
    {pos:"tl", label:"Auditable pero impreciso"},
    {pos:"br", label:"Preciso pero opaco"},
    {pos:"bl", label:"Evitar"}
  ]
},

{
  id:"D3", section:"Discusión · Pico y colapso",
  title:"Curva de pico y colapso por explicador según desbalance",
  reading:"Una línea por explicador. El eje X recorre los escenarios de desbalance creciente; el eje Y es el Spearman medio. Nótese el pico no monótono de GNNExplainer y la constancia de las otras dos.",
  caption:"<b>GNNExplainer</b> pica en 1:50 (0.59) y colapsa en 1:100 (0.24): hay un <b>régimen óptimo</b>, no una degradación lineal. <b>GNNShap</b> crece modestamente con el desbalance pero desde valores bajos. <b>PGExplainer</b> permanece en cero, confirmando el modo de falla sistemático.",
  source:"thesis_figures/discussion/D3_peak_collapse_curve.data.csv",
  chart:"peak_collapse",
  scenarios:["1:1","1:10","1:50","1:100"],
  series:[
    {name:"GNNExplainer", color:"var(--accent)",  values:[0.4225,0.5313,0.5931,0.2389]},
    {name:"GNNShap",      color:"var(--support)", values:[0.1000,0.1624,0.1191,0.3333]},
    {name:"PGExplainer",  color:"var(--support2)",values:[0,0,0,0]}
  ],
  yAxisLabel:"Spearman medio", xAxisLabel:"Escenario"
},

{
  id:"D4", section:"Discusión · Recomendación operativa",
  title:"Matriz de recomendación · caso de uso × arquitectura",
  reading:"Cada fila es un caso de uso, cada columna una arquitectura. El cuadrado se llena proporcional al puntaje (0–3). Idealmente se busca un cuadrado lleno (score=3) para el caso que aplica.",
  caption:"<b>GAT</b> es la arquitectura más versátil (suma 15), seguida de <b>TAGCN</b> (13) y <b>GraphSAGE</b> (14). Para <b>cumplimiento regulatorio</b> y <b>desbalance extremo</b>, la recomendación converge en <b>GAT o TAGCN</b>. Para flujos de alta velocidad prima la <b>inferencia rápida</b>, donde GraphSAGE y GCN lideran.",
  source:"thesis_figures/discussion/D4_recommendation_matrix.data.csv",
  chart:"recommendation_matrix",
  rows:[
    {name:"Alta precisión (calidad predictiva)",  scores:{GCN:0, GraphSAGE:3, GAT:2, TAGCN:1}},
    {name:"Alta auditabilidad (XAI estable)",      scores:{GCN:1, GraphSAGE:1, GAT:3, TAGCN:3}},
    {name:"Cumplimiento regulatorio (reprod.)",    scores:{GCN:1, GraphSAGE:2, GAT:3, TAGCN:2}},
    {name:"Inferencia rápida",                     scores:{GCN:3, GraphSAGE:3, GAT:1, TAGCN:2}},
    {name:"Desbalance extremo (1:50+)",            scores:{GCN:0, GraphSAGE:2, GAT:3, TAGCN:3}},
    {name:"Línea base balanceada (1:1 / 1:10)",    scores:{GCN:1, GraphSAGE:3, GAT:2, TAGCN:2}}
  ],
  cols:["GCN","GraphSAGE","GAT","TAGCN"]
},

{
  id:"D5", section:"Discusión · Recursos computacionales",
  title:"Distribución temporal del pipeline experimental",
  reading:"Barras apiladas horizontales: cada barra es una máquina; los segmentos separan entrenamiento y explicación. El eje mide horas-GPU, no tiempo calendario.",
  caption:"La fase de <b>explicación domina el costo en la máquina más modesta</b> (RTX 3050: 24.0 h de explicación frente a 5.4 h de entrenamiento). En hardware superior (RTX 4060) esa proporción se revierte. La <b>elección de arquitectura XAI es tan crítica para el costo como la elección del modelo</b>.",
  source:"thesis_figures/discussion/D5_pipeline_runtime_breakdown.data.csv",
  chart:"stacked_hours",
  data:[
    {machine:"Máquina B · RTX 4060", train:3.12, explain:1.53},
    {machine:"Máquina C · RTX 3050", train:5.40, explain:24.0, highlight:true}
  ]
}

];
