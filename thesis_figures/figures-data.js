/* ============================================================
   Data for all 25 thesis figures (v3.1 native-paradox).
   Structure per figure:
     id, section ("Resultados"|"Análisis"|"Discusión"),
     title, reading (how-to-read guide), caption, source, data
   Source of truth: https://github.com/alejo14171/thesis-web-learning
   Data refreshed: 2026-04-21 (v3.1 pipeline: +1:30_native scenario, PyG 2.7 fixes)
   ============================================================ */

window.THESIS_FIGS = [

/* ======================= RESULTADOS ======================= */
{
  id:"R1", section:"Resultados · Desempeño predictivo",
  title:"Tasa de aprobación del filtro de calidad por escenario de desbalance",
  reading:"Cada barra representa cuántas de las 12 configuraciones (4 arquitecturas × 3 balanceos) superaron el filtro mínimo de validación en ese escenario forzado. El escenario nativo 1:30 se analiza aparte (R7, A11, A12).",
  caption:"La tasa de aprobación sigue una curva no monótona: asciende de <b>25 % en 1:1 a 67 % en 1:10</b>, luego cae a <b>42 % en 1:50 y sólo 8 % en 1:100</b>. El desbalance moderado (1:10) es el régimen más favorable para entrenamiento; el extremo (1:100) colapsa casi la totalidad del espacio de configuraciones.",
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
  reading:"Cada barra indica, sobre 15 posibles (5 escenarios × 3 balanceos — incluyendo el nativo 1:30), cuántas configuraciones de esa arquitectura pasaron el filtro. La inclusión del escenario nativo en v3.1 expande el denominador respecto de v3.0.",
  caption:"La jerarquía se mantiene tras incorporar el escenario nativo: <b>GraphSAGE aprueba el 73 %</b> (11/15) frente al <b>7 % de GCN</b> (1/15). GAT alcanza el 47 % (7/15) y TAGCN el 27 % (4/15). GraphSAGE sigue siendo la arquitectura más consistente como entrenable.",
  source:"thesis_figures/results/R2_pass_rate_by_arch.data.csv",
  chart:"bars_h",
  data:[
    {label:"GCN",       rate:0.0667, passed:1,  total:15, danger:true},
    {label:"TAGCN",     rate:0.2667, passed:4,  total:15},
    {label:"GAT",       rate:0.4667, passed:7,  total:15},
    {label:"GraphSAGE", rate:0.7333, passed:11, total:15, highlight:true}
  ],
  xAxisLabel:"Tasa de aprobación", yAxisLabel:"Arquitectura"
},

{
  id:"R3", section:"Resultados · Desempeño predictivo",
  title:"Tasa de aprobación del filtro de calidad por técnica de balanceo",
  reading:"Cada barra compara, sobre 20 posibles (5 escenarios × 4 arquitecturas — incluyendo el nativo 1:30), cuántas configuraciones aprobaron el filtro según la técnica de balanceo empleada.",
  caption:"<b>Focal loss (45 %)</b> supera a <b>class weighting (40 %)</b>, ambos por encima de la línea base <b>sin balanceo (30 %)</b>. La mejora respecto de v3.0 en focal loss se explica por el buen comportamiento del escenario nativo con esa técnica. El balanceo sigue siendo condición necesaria pero no suficiente: reduce el colapso pero no neutraliza el desbalance extremo.",
  source:"thesis_figures/results/R3_pass_rate_by_balancing.data.csv",
  chart:"bars_h",
  data:[
    {label:"Sin balanceo",        rate:0.30,   passed:6, total:20},
    {label:"Class weighting",     rate:0.40,   passed:8, total:20},
    {label:"Focal loss",          rate:0.45,   passed:9, total:20, highlight:true}
  ],
  xAxisLabel:"Tasa de aprobación", yAxisLabel:"Balanceo"
},

{
  id:"R4", section:"Resultados · Desempeño predictivo",
  title:"Mapa de calor de F1 de validación — arquitectura × escenario",
  reading:"Cada celda muestra la media de F1 de validación (mejor balanceo) para esa combinación arquitectura–escenario forzado. Más oscuro = mejor desempeño. La columna 1:10 concentra los valores altos. El escenario nativo 1:30 se visualiza por separado en A12 y D6.",
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
  title:"Concordancia entre F1 y MCC sobre las 60 configuraciones",
  reading:"Cada punto es una configuración (arquitectura × escenario × balanceo). Los puntos sobre la diagonal son los que aprobaron el filtro (F1>0.30, MCC>0.27); los grises quedaron por debajo del umbral. v3.1 agrega 12 configs adicionales del escenario nativo 1:30.",
  caption:"F1 y MCC se correlacionan fuertemente (<b>r ≈ 0.97</b>): ambas métricas identifican las mismas configuraciones viables, validando el criterio del filtro dual. Las <b>23 configuraciones aprobadas</b> (17 forzadas + 6 nativas) se agrupan en el cuadrante superior derecho; el resto queda concentrado cerca del origen.",
  source:"thesis_figures/results/R5_val_f1_vs_mcc_scatter.data.csv",
  chart:"scatter_filter",
  xAxisLabel:"F1 de validación", yAxisLabel:"MCC de validación",
  thresholdX:0.30, thresholdY:0.27
},

{
  id:"R6", section:"Resultados · Desempeño predictivo",
  title:"Las 23 configuraciones que aprobaron el filtro — F1, MCC y Spearman de GNNExplainer",
  reading:"Cada fila es una configuración que pasó el filtro, ordenada por Spearman descendente. Las columnas muestran en paralelo el desempeño predictivo (F1, MCC) y la estabilidad del explicador (Spearman). Las configuraciones del escenario nativo 1:30 están marcadas aparte y aparecen hacia el centro–final del ranking.",
  caption:"El valor máximo de Spearman corresponde a <b>TAGCN · 1:50 · focal loss (0.789)</b> y <b>GAT · 1:50 · focal loss (0.782)</b>. Alto F1 no implica alta estabilidad: <b>GraphSAGE · 1:10 · focal loss</b> alcanza F1=0.53 pero Spearman=0.30, mientras <b>TAGCN · 1:50 · focal loss</b> tiene F1=0.31 y Spearman=0.79. Las configuraciones nativas aparecen con Spearman bajo — el <b>paradoja nativa</b>.",
  source:"thesis_figures/results/R6_configs_summary_table.data.csv",
  chart:"ranked_table",
  rows:[
    {s:"1:50",         a:"TAGCN",    b:"focal_loss",      f1:0.3097, mcc:0.2971, sp:0.7894, hl:true},
    {s:"1:50",         a:"GAT",      b:"focal_loss",      f1:0.4199, mcc:0.4006, sp:0.7819, hl:true},
    {s:"1:10",         a:"GAT",      b:"none",            f1:0.4595, mcc:0.4436, sp:0.7164},
    {s:"1:10",         a:"GraphSAGE",b:"none",            f1:0.4714, mcc:0.4538, sp:0.6947},
    {s:"1:10",         a:"GAT",      b:"focal_loss",      f1:0.3261, mcc:0.3205, sp:0.6541},
    {s:"1:10",         a:"TAGCN",    b:"focal_loss",      f1:0.3077, mcc:0.2955, sp:0.6312},
    {s:"1:50",         a:"GAT",      b:"class_weighting", f1:0.3150, mcc:0.2944, sp:0.6164},
    {s:"1:1",          a:"GraphSAGE",b:"none",            f1:0.3623, mcc:0.4020, sp:0.5897},
    {s:"1:10",         a:"GCN",      b:"class_weighting", f1:0.3148, mcc:0.3103, sp:0.4842},
    {s:"1:10",         a:"GraphSAGE",b:"class_weighting", f1:0.4785, mcc:0.4672, sp:0.4198},
    {s:"1:1",          a:"GAT",      b:"class_weighting", f1:0.3150, mcc:0.2955, sp:0.4047},
    {s:"1:50",         a:"GraphSAGE",b:"focal_loss",      f1:0.5226, mcc:0.5115, sp:0.3947, hl:true},
    {s:"1:50",         a:"GraphSAGE",b:"class_weighting", f1:0.5166, mcc:0.5067, sp:0.3832},
    {s:"1:30 nativo",  a:"GraphSAGE",b:"none",            f1:0.3593, mcc:0.4050, sp:0.3624, native:true},
    {s:"1:10",         a:"TAGCN",    b:"none",            f1:0.3774, mcc:0.3679, sp:0.3487},
    {s:"1:10",         a:"GraphSAGE",b:"focal_loss",      f1:0.5295, mcc:0.5196, sp:0.3010, hl:true},
    {s:"1:30 nativo",  a:"GAT",      b:"none",            f1:0.3070, mcc:0.2842, sp:0.2912, native:true},
    {s:"1:30 nativo",  a:"GAT",      b:"focal_loss",      f1:0.3232, mcc:0.3029, sp:0.2759, native:true},
    {s:"1:1",          a:"GraphSAGE",b:"class_weighting", f1:0.3434, mcc:0.3834, sp:0.2731},
    {s:"1:100",        a:"GraphSAGE",b:"class_weighting", f1:0.4380, mcc:0.4409, sp:0.2389, danger:true},
    {s:"1:30 nativo",  a:"GraphSAGE",b:"class_weighting", f1:0.5262, mcc:0.5136, sp:0.1209, native:true},
    {s:"1:30 nativo",  a:"TAGCN",    b:"focal_loss",      f1:0.4302, mcc:0.4316, sp:0.0595, native:true, danger:true},
    {s:"1:30 nativo",  a:"GraphSAGE",b:"focal_loss",      f1:0.5254, mcc:0.5130, sp:0.0154, native:true, danger:true}
  ]
},

{
  id:"R7", section:"Resultados · Desempeño predictivo",
  title:"Tasa de aprobación bajo escenario nativo (1:30) por arquitectura",
  reading:"Cada barra indica cuántas configuraciones de esa arquitectura aprobaron el filtro al entrenar con la distribución nativa de Elliptic (sin forzar ratio). Sobre 3 posibles por arquitectura (las 3 técnicas de balanceo).",
  caption:"<b>GraphSAGE aprueba las 3 configuraciones (100 %)</b>, confirmando la competencia de la arquitectura cuando se entrena con la distribución natural del dataset — consistente con Weber 2019. <b>GCN falla en las 3 (0 %)</b>, alineando con la debilidad de GCN vanilla reportada en literatura. GAT (67 %) y TAGCN (33 %) se sitúan en el rango intermedio.",
  source:"thesis_figures/results/R7_native_pass_rate_by_arch.data.csv",
  chart:"bars_h",
  data:[
    {label:"GCN",       rate:0.00, passed:0, total:3, danger:true},
    {label:"TAGCN",     rate:0.3333, passed:1, total:3},
    {label:"GAT",       rate:0.6667, passed:2, total:3},
    {label:"GraphSAGE", rate:1.00, passed:3, total:3, highlight:true}
  ],
  xAxisLabel:"Tasa de aprobación · escenario nativo 1:30", yAxisLabel:"Arquitectura"
},

/* ======================= ANÁLISIS ======================= */
{
  id:"A1", section:"Análisis · Estabilidad explicativa",
  title:"Distribución de Spearman por explicador",
  reading:"Cada punto es una configuración aprobada; se agrupan por explicador. Línea horizontal gruesa = mediana. Con las 6 configuraciones nativas añadidas, GNNExplainer presenta más dispersión hacia valores bajos; PGExplainer colapsa a cero universalmente; GNNShap muestra bimodalidad.",
  caption:"<b>GNNExplainer</b> sigue siendo el único explicador operativamente útil (mediana 0.39, rango 0.02–0.79). <b>PGExplainer se degenera sistemáticamente (Spearman = 0)</b> en las 23 configuraciones evaluadas — caracterizado como bug documentado en PyG 2.7 (ver A9). <b>GNNShap</b> oscila entre 0 y 0.33 con mediana 0.21, evidenciando varianza muestral elevada.",
  source:"thesis_figures/analysis/A1_spearman_distribution_by_explainer.data.csv",
  chart:"strip_by_explainer",
  explainers:[
    {name:"GNNExplainer", median:0.3947, values:[0.0154,0.0595,0.1209,0.2389,0.2731,0.2759,0.2912,0.3010,0.3487,0.3624,0.3832,0.3947,0.4047,0.4198,0.4842,0.5897,0.6164,0.6312,0.6541,0.6947,0.7164,0.7819,0.7894]},
    {name:"GNNShap",      median:0.2070, values:[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0973,0.1000,0.1649,0.2000,0.2070,0.2632,0.2886,0.2994,0.3333,0.3333,0.3333,0.3333,0.3333,0.3333,0.3333,0.3333]},
    {name:"PGExplainer",  median:0.0,    values:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]}
  ],
  yAxisLabel:"Spearman medio"
},

{
  id:"A2", section:"Análisis · Estabilidad explicativa",
  title:"Estabilidad (Spearman) por escenario con intervalos min–max",
  reading:"Cada punto es la media de Spearman para ese escenario forzado; las barras verticales unen el mínimo y máximo observados. Restringido a los 4 escenarios forzados originales (1:1, 1:10, 1:50, 1:100); el escenario nativo se compara en A11.",
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
  title:"Estabilidad por arquitectura (incluyendo escenario nativo)",
  reading:"Cada barra es la media de Spearman entre todas las configuraciones aprobadas de esa arquitectura (23 configs en total, 17 forzadas + 6 nativas). El número pequeño indica cuántas configuraciones la componen.",
  caption:"<b>GAT (0.534)</b> y <b>GCN (0.484)</b> presentan la mayor estabilidad explicativa promedio, pese a no ser los líderes en F1. <b>GraphSAGE (0.345)</b>, dominante en desempeño, cae al último puesto en estabilidad — la inclusión del escenario nativo acentúa la disociación precisión–auditabilidad observada en v3.0.",
  source:"thesis_figures/analysis/A3_spearman_by_architecture.data.csv",
  chart:"bars_h_n",
  data:[
    {label:"GraphSAGE", rate:0.3449, n:11},
    {label:"TAGCN",     rate:0.4572, n:4},
    {label:"GCN",       rate:0.4842, n:1},
    {label:"GAT",       rate:0.5344, n:7, highlight:true}
  ],
  xMax:0.8, xAxisLabel:"Spearman medio", yAxisLabel:"Arquitectura"
},

{
  id:"A4", section:"Análisis · Estabilidad explicativa",
  title:"Cuadrantes precisión × estabilidad — 4 arquitecturas",
  reading:"Eje X = F1 medio; eje Y = Spearman medio (sobre las 23 configs aprobadas, incluyendo nativo). Las líneas punteadas dividen los cuadrantes. La esquina superior derecha (alto en ambas) es la zona deseable para despliegue auditable.",
  caption:"Ninguna arquitectura ocupa simultáneamente los cuartiles altos de ambas dimensiones. <b>GraphSAGE</b> lidera precisión (F1=0.46) pero baja en estabilidad (Spearman=0.34); <b>GAT</b> ofrece la mejor estabilidad (Spearman=0.53) al precio de menor F1 (0.35). La brecha entre precisión y estabilidad se acentúa respecto de v3.0.",
  source:"thesis_figures/analysis/A4_accuracy_vs_stability_scatter.data.csv",
  chart:"quadrants",
  data:[
    {label:"GCN",       x:0.3148, y:0.4842},
    {label:"GraphSAGE", x:0.4612, y:0.3449},
    {label:"GAT",       x:0.3522, y:0.5344, highlight:true},
    {label:"TAGCN",     x:0.3563, y:0.4572}
  ],
  xMin:0.25, xMax:0.55, yMin:0.25, yMax:0.70,
  xDiv:0.40, yDiv:0.45,
  xAxisLabel:"F1 de validación (medio)", yAxisLabel:"Spearman (medio)"
},

{
  id:"A5", section:"Análisis · Estabilidad explicativa",
  title:"Mapa de calor — Spearman · escenario × arquitectura",
  reading:"Cada celda muestra el Spearman medio de las configuraciones aprobadas sobre los 4 escenarios forzados. Las celdas vacías indican que ninguna configuración de esa combinación superó el filtro. El escenario nativo se visualiza en A12.",
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
  reading:"Se evalúa Jaccard sobre los subgrafos extraídos por GNNExplainer y PGExplainer sobre múltiples semillas, en las 23 configuraciones aprobadas (46 pares configuración×explicador en total).",
  caption:"<b>Los 46 pares arrojan Jaccard = 1.0</b>: los subgrafos explicativos son idénticos entre réplicas. El resultado es interpretado como <b>artefacto métrico</b> — con <code>edge_mask_type=&quot;object&quot;</code> y topK=20 en un grafo de 234k edges, la selección es determinística. La señal real de estabilidad se recoge en <b>Spearman sobre rankings de pesos</b>, que sí captura variabilidad relativa.",
  source:"thesis_figures/analysis/A6_jaccard_distribution.data.csv",
  chart:"jaccard_histogram"
},

{
  id:"A7", section:"Análisis · Estabilidad explicativa",
  title:"Kruskal–Wallis · distribución de Spearman por escenario forzado",
  reading:"Boxplot por escenario forzado: la caja marca los cuartiles, la línea interior la mediana, los puntos los valores individuales. El test Kruskal–Wallis evalúa si las distribuciones difieren significativamente. Restringido a escenarios forzados (el nativo se analiza separado en A11).",
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
  reading:"Cada barra muestra la d de Cohen entre dos escenarios forzados. Magnitud: |d|<0.2 despreciable, 0.2–0.5 pequeña, 0.5–0.8 mediana, >0.8 grande. Dirección negativa = el segundo escenario tiene mayor Spearman.",
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
  title:"Degeneración sistemática de PGExplainer — bug documentado en PyG 2.7",
  reading:"Las 23 configuraciones aprobadas, todas con Spearman de PGExplainer exactamente igual a 0. Comparación con GNNExplainer (mismas configuraciones) como línea de referencia. Incluye las 6 configuraciones del escenario nativo 1:30.",
  caption:"PGExplainer produce el mismo ranking para todas las muestras en <b>100 %</b> de las 23 configuraciones — caracterizado como <b>bug en PyG 2.7</b>: <code>edge_size=0.05</code> default causa mode collapse universal (mask→0). Fix empírico: <code>edge_size=0.005</code> + <code>temp=[1.0, 1.0]</code> con gradient clipping. El fix funciona en Cora pero persisten 99 % NaN epochs en Elliptic — sugiere overflow adicional en los embeddings GNN.",
  source:"thesis_figures/analysis/A9_pgexplainer_degeneration.data.csv",
  chart:"pg_degeneration",
  data:[
    {label:"1:10·GCN·cw",                ex:0.4842, pg:0},
    {label:"1:10·GraphSAGE·cw",          ex:0.4198, pg:0},
    {label:"1:10·GraphSAGE·fl",          ex:0.3010, pg:0},
    {label:"1:10·GraphSAGE·none",        ex:0.6947, pg:0},
    {label:"1:1·GraphSAGE·cw",           ex:0.2731, pg:0},
    {label:"1:1·GraphSAGE·none",         ex:0.5897, pg:0},
    {label:"1:50·GraphSAGE·cw",          ex:0.3832, pg:0},
    {label:"1:50·GraphSAGE·fl",          ex:0.3947, pg:0},
    {label:"1:100·GraphSAGE·cw",         ex:0.2389, pg:0},
    {label:"1:10·GAT·fl",                ex:0.6541, pg:0},
    {label:"1:10·TAGCN·fl",              ex:0.6312, pg:0},
    {label:"1:10·TAGCN·none",            ex:0.3487, pg:0},
    {label:"1:50·TAGCN·fl",              ex:0.7894, pg:0},
    {label:"1:10·GAT·none",              ex:0.7164, pg:0},
    {label:"1:1·GAT·cw",                 ex:0.4047, pg:0},
    {label:"1:50·GAT·cw",                ex:0.6164, pg:0},
    {label:"1:50·GAT·fl",                ex:0.7819, pg:0},
    {label:"1:30·GAT·fl (nativo)",       ex:0.2759, pg:0, native:true},
    {label:"1:30·GAT·none (nativo)",     ex:0.2912, pg:0, native:true},
    {label:"1:30·GraphSAGE·cw (nativo)", ex:0.1209, pg:0, native:true},
    {label:"1:30·GraphSAGE·fl (nativo)", ex:0.0154, pg:0, native:true},
    {label:"1:30·GraphSAGE·none (nat.)", ex:0.3624, pg:0, native:true},
    {label:"1:30·TAGCN·fl (nativo)",     ex:0.0595, pg:0, native:true}
  ]
},

{
  id:"A10", section:"Análisis · Estabilidad explicativa",
  title:"Top-10 configuraciones por Spearman de GNNExplainer (escenarios forzados)",
  reading:"Ranking descendente, restringido al subconjunto de escenarios forzados. La configuración ganadora combina TAGCN + focal loss + desbalance 1:50; la segunda sustituye TAGCN por GAT con el mismo patrón. Ninguna configuración nativa entra en el top-10 — se analizan aparte en A11.",
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

{
  id:"A11", section:"Análisis · Paradoja nativa",
  title:"Spearman nativo vs. escenarios forzados — la paradoja 1:30",
  reading:"Cada barra muestra el Spearman medio del explicador GNNExplainer sobre las configuraciones aprobadas en ese escenario. La barra en color acento corresponde al escenario nativo (distribución natural de Elliptic, ~1:30); las demás son escenarios con ratio forzado. Las líneas verticales indican la desviación estándar.",
  caption:"<b>El escenario nativo 1:30 exhibe la menor estabilidad (Spearman medio 0.188, n=6)</b> — por debajo incluso del extremo 1:100 (0.239) y muy lejos del pico en 1:50 forzado (0.593). Este resultado es contraintuitivo: el ratio natural del dataset <b>NO</b> produce las explicaciones más estables. Hipótesis: la heterogeneidad natural de Elliptic (sin balanceo artificial) induce mayor variabilidad estructural en los subgrafos explicativos.",
  source:"thesis_figures/analysis/A11_spearman_native_vs_forced.data.csv",
  chart:"native_vs_forced",
  data:[
    {label:"1:1",             mean:0.4225, std:0.1299, n:3},
    {label:"1:10",            mean:0.5313, std:0.1529, n:8},
    {label:"1:30 · NATIVO",   mean:0.1876, std:0.1288, n:6, native:true, danger:true},
    {label:"1:50",            mean:0.5931, std:0.1778, n:5, highlight:true},
    {label:"1:100",           mean:0.2389, std:0.0,    n:1}
  ],
  yAxisLabel:"Spearman medio (± std)", xAxisLabel:"Escenario"
},

{
  id:"A12", section:"Análisis · Paradoja nativa",
  title:"Mapa de calor nativo — arquitectura × explicador",
  reading:"Filtrado al escenario nativo 1:30. Cada celda muestra el Spearman medio de esa combinación arquitectura × explicador. Sólo aparecen las 3 arquitecturas que aprobaron alguna config en nativo (GAT, GraphSAGE, TAGCN). GCN no aparece porque 0/3 aprobaron (ver R7).",
  caption:"En el régimen nativo, <b>GraphSAGE con GNNExplainer alcanza el pico local (0.362)</b> — confirmando que GraphSAGE es la arquitectura más competente en la distribución natural. <b>PGExplainer colapsa a cero</b> en las tres arquitecturas (mismo bug PyG 2.7 caracterizado en A9). <b>GNNShap</b> se estabiliza en ~0.33 para GAT y TAGCN, y cae a 0.289 en GraphSAGE — patrón opuesto al de GNNExplainer en las mismas celdas.",
  source:"thesis_figures/analysis/A12_native_heatmap.data.csv",
  chart:"heatmap",
  rows:["GAT","GraphSAGE","TAGCN"],
  cols:["GNNExplainer","PGExplainer","GNNShap"],
  data:[
    [0.2912, 0.0, 0.3333],
    [0.3624, 0.0, 0.2886],
    [0.0595, 0.0, 0.3333]
  ],
  colorMin:0.0, colorMax:0.40,
  xAxisLabel:"Explicador", yAxisLabel:"Arquitectura"
},

/* ======================= DISCUSIÓN ======================= */
{
  id:"D1", section:"Discusión · Estado del arte",
  title:"Comparación con el estado del arte sobre Elliptic",
  reading:"Cada barra es un resultado publicado o de esta tesis. El color distingue origen (nuestro vs externo). La nota al lado precisa el protocolo usado, clave para leer la comparación. La comparación es orientativa, no directa.",
  caption:"Los trabajos con <b>split temporal</b> (Pareja 2020) o <b>clasificación a nivel subgrafo</b> (Bellei 2024) superan significativamente nuestros F1 en val. La tesis <b>no compite por F1 máximo</b>: privilegia estabilidad explicativa sobre predicción absoluta. Los hallazgos de estabilidad (Spearman 0.24–0.79) sí son consistentes con literatura reciente (Agarwal 2022: 0.30–0.80).",
  source:"thesis_figures/discussion/D1_sota_comparison.data.csv",
  chart:"sota_bars",
  data:[
    {label:"Bellei 2024 — SAGE+GAT Elliptic2 (test)",    f1:0.93, tag:"external", note:"Subgraph classification"},
    {label:"Pareja 2020 — EvolveGCN (test)",             f1:0.89, tag:"external", note:"GNN temporal"},
    {label:"arXiv 2025 — GraphSAGE+GraphNorm (val)",     f1:0.85, tag:"external", note:"Warm-start + normalización"},
    {label:"Weber 2019 — RandomForest (test)",           f1:0.79, tag:"external", note:"Baseline no-GNN"},
    {label:"Esta tesis — GraphSAGE mejor (val)",         f1:0.53, tag:"ours",     note:"Escenario 1:10 forzado", highlight:true},
    {label:"Weber 2019 — GCN (test)",                    f1:0.41, tag:"external", note:"Grafo estático, split temporal"},
    {label:"Esta tesis — GCN mejor (val)",               f1:0.31, tag:"ours",     note:"Colapsa bajo desbalance"}
  ]
},

{
  id:"D2", section:"Discusión · Implicaciones arquitectónicas",
  title:"Cuadrantes precisión–estabilidad — visión operativa",
  reading:"Replica A4 como marco de decisión. Los cuatro cuadrantes marcan perfiles de uso: superior derecho = despliegue auditable; superior izquierdo = auditable pero poco preciso; inferior derecho = preciso pero opaco.",
  caption:"<b>Ningún arquetipo domina en ambos ejes.</b> La decisión operativa depende del uso: si la prioridad es <b>despliegue regulado</b>, GAT es preferible; si la prioridad es <b>desempeño bruto</b>, GraphSAGE. Esta matriz sustenta la recomendación formal de D4.",
  source:"thesis_figures/discussion/D2_accuracy_stability_quadrants.data.csv",
  chart:"quadrants_labeled",
  data:[
    {label:"GCN",       x:0.3148, y:0.4842},
    {label:"GraphSAGE", x:0.4612, y:0.3449},
    {label:"GAT",       x:0.3522, y:0.5344, highlight:true},
    {label:"TAGCN",     x:0.3563, y:0.4572}
  ],
  xMin:0.25, xMax:0.55, yMin:0.25, yMax:0.70,
  xDiv:0.40, yDiv:0.45,
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
  reading:"Una línea por explicador. El eje X recorre los escenarios forzados de desbalance creciente; el eje Y es el Spearman medio. Nótese el pico no monótono de GNNExplainer y la constancia de las otras dos.",
  caption:"<b>GNNExplainer</b> pica en 1:50 (0.59) y colapsa en 1:100 (0.24): hay un <b>régimen óptimo</b>, no una degradación lineal. <b>GNNShap</b> crece hasta 0.33 en 1:100 pero desde valores bajos. <b>PGExplainer</b> permanece en cero en los 4 escenarios, confirmando el modo de falla sistemático caracterizado como bug de PyG 2.7.",
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
  caption:"<b>GAT</b> es la arquitectura más versátil (suma 15), seguida de <b>GraphSAGE</b> (14) y <b>TAGCN</b> (13). Para <b>cumplimiento regulatorio</b> y <b>desbalance extremo</b>, la recomendación converge en <b>GAT o TAGCN</b>. Para flujos de alta velocidad prima la <b>inferencia rápida</b>, donde GraphSAGE y GCN lideran.",
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
},

{
  id:"D6", section:"Discusión · Paradoja nativa vs. literatura",
  title:"Resultados nativos vs. baselines de literatura sobre Elliptic",
  reading:"Comparación directa contra baselines publicados para el régimen nativo. Barras 'ours' corresponden al mejor F1 de validación por arquitectura en el escenario 1:30 nativo. Baselines externos reportan F1 en test sobre Elliptic original o su extensión Elliptic2.",
  caption:"<b>Nuestro mejor nativo — GraphSAGE val F1 = 0.526</b> — es <b>competitivo con Weber 2019 GCN val (0.628)</b>, validando la competencia de la arquitectura cuando se entrena con distribución natural. La brecha con SOTA moderno (Bellei 2024: 0.93, arXiv 2025: 0.85) se debe a: (i) arquitecturas estáticas (sin EvolveGCN temporal); (ii) clasificación a nivel nodo (no subgrafo como Elliptic2); (iii) ausencia de tweaks modernos (GraphNorm, Xavier, warm-start). La tesis elige intencionalmente arquitecturas simples para aislar el efecto del imbalance en estabilidad XAI.",
  source:"thesis_figures/discussion/D6_native_vs_literature.data.csv",
  chart:"sota_bars",
  data:[
    {label:"Bellei 2024 — Elliptic2 SAGE+GAT (test)",   f1:0.93, tag:"external", note:"Subgraph-level"},
    {label:"Pareja 2020 — EvolveGCN (test)",            f1:0.89, tag:"external", note:"Temporal"},
    {label:"arXiv 2025 — GraphSAGE+GraphNorm (val)",    f1:0.85, tag:"external", note:"Warm-start moderno"},
    {label:"Weber 2019 — RandomForest (test)",          f1:0.79, tag:"external", note:"No-GNN baseline"},
    {label:"Weber 2019 — GCN (test)",                   f1:0.63, tag:"external", note:"GCN nativo"},
    {label:"Ours — GraphSAGE nativo (val)",             f1:0.53, tag:"ours",     note:"Mejor native GNN nuestro", highlight:true},
    {label:"Ours — TAGCN nativo (val)",                 f1:0.43, tag:"ours",     note:"Segundo nativo"},
    {label:"Ours — GAT nativo (val)",                   f1:0.32, tag:"ours",     note:"Tercero nativo"},
    {label:"Ours — GCN nativo (val)",                   f1:0.21, tag:"ours",     note:"No pasó filtro"}
  ]
}

];
