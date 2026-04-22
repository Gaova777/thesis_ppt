# Figures — per-figure documentation

This file documents every figure in `thesis_figures/`. Each entry includes
the section it supports, a description, key numbers, interpretation and
cross-refs.

---

## R1 — Pass rate by scenario

**Section**: Results  
**Type**: Bar chart  
**Data file**: `results/R1_pass_rate_by_scenario.data.csv`

Shows the fraction of configs that passed the val quality gate (F1 ≥ 0.30, MCC ≥ 0.15) per imbalance scenario.

**Key numbers**:
- 1:1 → 3/12 (25%)
- 1:10 → 8/12 (67%) — sweet spot
- 1:50 → 5/12 (42%)
- 1:100 → 1/12 (8%) — extreme collapse

**Interpretation**: 1:10 is the "sweet spot" where models learn best; 1:100 is nearly fatal — only 1 config learned (GraphSAGE + class_weighting).

**Related**: R2, R3 (other pass-rate breakdowns), A2 (Spearman shows similar pattern).

---

## R2 — Pass rate by architecture

**Section**: Results  
**Type**: Horizontal bar chart  
**Data file**: `results/R2_pass_rate_by_arch.data.csv`

Pass rate per architecture across all 12 (scenario × balancing) cells.

**Key numbers**:
- GraphSAGE → 8/12 (67%)
- GAT → 5/12 (42%)
- TAGCN → 3/12 (25%)
- GCN → 1/12 (8%)

**Interpretation**: Inductive message passing (GraphSAGE) generalises best on Elliptic; vanilla GCN underperforms. Note this is **learnability**, not explainability — A3 shows the opposite ranking.

**Related**: R1, A3 (stability flips the ranking).

---

## R3 — Pass rate by balancing

**Section**: Results  
**Type**: Bar chart  
**Data file**: `results/R3_pass_rate_by_balancing.data.csv`

Pass rate per balancing strategy.

**Key numbers**:
- none → 4/16
- class_weighting → 7/16
- focal_loss → 6/16

**Interpretation**: Both class weighting and focal loss clearly improve over baseline, with class weighting slightly ahead overall. Focal loss dominates at the hardest imbalances.

**Related**: R1, R2.

---

## R4 — Val F1 heatmap (architecture × scenario)

**Section**: Results  
**Type**: Heatmap  
**Data file**: `results/R4_val_f1_heatmap.data.csv`

Maximum val F1 across balancing strategies for every (arch, scenario) cell. White border = at least one config in that cell passed the gate.

**Interpretation**: Dark cells on the right column (1:100) show the universal collapse. GraphSAGE row is brightest overall.

**Related**: R1, R2, A5.

---

## R5 — Val F1 vs Val MCC scatter

**Section**: Results  
**Type**: Scatter plot  
**Data file**: `results/R5_val_f1_vs_mcc_scatter.data.csv`

All 48 trained configs on (val MCC, val F1) plane. Color = architecture, shape = balancing. Dashed lines mark the quality-gate thresholds; upper-right quadrant = pass region.

**Interpretation**: F1 and MCC rank configurations almost identically (points cluster along the diagonal). 17 configs land in the pass region. GCN points concentrate in the lower-left failure region.

**Related**: R4, R6.

---

## R6 — Passing configurations summary table

**Section**: Results  
**Type**: Rendered table (PNG)  
**Data file**: `results/R6_configs_summary_table.data.csv`

All 17 passing configs with scenario, arch, balancing, val F1, val MCC, test PR-AUC, and (when available) GNNExplainer Spearman.

**Interpretation**: Provides the ground-truth list used throughout the Analysis section. Useful reference for authors / reviewers.

**Related**: Anchor for A1–A10.

---

## A1 — Spearman distribution by explainer

**Section**: Analysis  
**Type**: Strip plot with mean lines  
**Data file**: `analysis/A1_spearman_distribution_by_explainer.data.csv`

Every passing config plotted as a point per explainer. Horizontal lines mark the explainer mean.

**Key numbers**: PGExplainer mean = 0.000 (all 17 points collapse to 0); GNNExplainer mean ≈ 0.50; GNNShap scattered but bounded.

**Interpretation**: PGExplainer is clearly degenerate; GNNExplainer is the most consistent stable explainer overall.

**Related**: A6, A9.

---

## A2 — Spearman by scenario with error bars (money chart)

**Section**: Analysis  
**Type**: Line + error bars  
**Data file**: `analysis/A2_spearman_by_scenario_errorbars.data.csv`

GNNExplainer Spearman mean per scenario, with min–max as error bars and sample counts annotated.

**Key numbers**:
- 1:1 → 0.42 (n=3)
- 1:10 → 0.53 (n=8)
- 1:50 → 0.59 (n=5) — PEAK
- 1:100 → 0.24 (n=1) — COLLAPSE

**Interpretation**: Explainer stability is non-monotonic in imbalance — it climbs until 1:50 then plummets. This is the thesis' central finding.

**Related**: A7, A8, D3.

---

## A3 — Spearman by architecture

**Section**: Analysis  
**Type**: Bar chart  
**Data file**: `analysis/A3_spearman_by_architecture.data.csv`

Mean GNNExplainer Spearman per architecture, sorted descending.

**Key numbers**: GAT = 0.635, TAGCN = 0.590, GCN = 0.484, GraphSAGE = 0.412.

**Interpretation**: Attention (GAT) and topology-aware (TAGCN) architectures yield more stable explanations. Inverse ordering to R2 — confirms the accuracy-vs-stability tension.

**Related**: R2, A4, D2.

---

## A4 — Accuracy vs stability scatter

**Section**: Analysis  
**Type**: Scatter + trend line  
**Data file**: `analysis/A4_accuracy_vs_stability_scatter.data.csv`

Per architecture: mean val F1 on passing configs vs mean GNNExplainer Spearman.

**Interpretation**: Clear negative slope; rank correlation ≈ −0.20. GraphSAGE lives top-right on accuracy but bottom on stability. Shaded band highlights the "stable XAI" region.

**Related**: A3, D2.

---

## A5 — Spearman heatmap (arch × scenario)

**Section**: Analysis  
**Type**: Heatmap  
**Data file**: `analysis/A5_spearman_heatmap_scenario_arch.data.csv`

Per-cell mean GNNExplainer Spearman. Peak cell (1:50 × TAGCN = 0.789) is highlighted with a green border.

**Interpretation**: The diagonal-ish pattern confirms that the peak is jointly produced by arch AND scenario, not one alone.

**Related**: A2, A3, R4.

---

## A6 — Jaccard distribution

**Section**: Analysis  
**Type**: Histogram  
**Data file**: `analysis/A6_jaccard_distribution.data.csv`

All Jaccard values from all explainers, binned.

**Key numbers**: 100% of GNNExplainer + PGExplainer runs (34/34) sit at Jaccard = 1.000.

**Interpretation**: For Jaccard to be informative, the top-k sets must vary across replicas. These explainers are deterministic given the trained model, so Jaccard collapses to 1. Spearman is the only discriminative stability metric for this study.

**Related**: A1, A9.

---

## A7 — Kruskal–Wallis boxplot

**Section**: Analysis  
**Type**: Box plot + statistical test  
**Data file**: `analysis/A7_kruskal_boxplot.data.csv`

Boxplot of GNNExplainer Spearman across the 4 scenarios, with Kruskal–Wallis H-statistic and p-value annotated.

**Key numbers**: H ≈ 4.31, p ≈ 0.23 (not significant at α=0.05 given small n in extreme scenarios).

**Interpretation**: Visual trend (peak-collapse) is strong but statistical power is limited because only n=1 passing config at 1:100. More runs per cell would be needed to confirm.

**Related**: A2, A8.

---

## A8 — Cohen's d effect sizes

**Section**: Analysis  
**Type**: Horizontal bar with magnitude colors  
**Data file**: `analysis/A8_cohens_d_effect_sizes.data.csv`

Pairwise Cohen's d between scenarios (GNNExplainer Spearman).

**Key numbers**: 1:1 vs 1:50 ≈ −0.92 (large), 1:1 vs 1:10 ≈ −0.67 (medium), 1:10 vs 1:50 ≈ −0.35 (small).

**Interpretation**: Effect sizes support the peak claim even though Kruskal–Wallis is n-limited. Larger imbalance (up to 1:50) substantially increases Spearman.

**Related**: A2, A7.

---

## A9 — PGExplainer universal degeneration

**Section**: Analysis  
**Type**: Bar chart (17 zero bars + GNNExplainer reference line)  
**Data file**: `analysis/A9_pgexplainer_degeneration.data.csv`

One bar per PGExplainer run, all at Spearman = 0; horizontal line = GNNExplainer mean.

**Interpretation**: PGExplainer learned a degenerate mask in every config — compare to GNNExplainer's 0.5 baseline. This is not a per-config bug; it is a universal behavior in this setup.

**Related**: A1, A6.

---

## A10 — Top 10 Spearman configs

**Section**: Analysis  
**Type**: Horizontal bar (ranked)  
**Data file**: `analysis/A10_top_spearman_configs.data.csv`

Top 10 configurations ranked by GNNExplainer Spearman, colored by architecture.

**Key numbers**: Peak 1:50_TAGCN_focal_loss = 0.789; runner-up 1:50_GAT_focal_loss = 0.782.

**Interpretation**: Attention-based architectures (GAT, TAGCN) dominate the leaderboard; focal_loss appears in both top slots. A concrete recipe for stable XAI on Elliptic.

**Related**: A3, A5, D4.

---

## D1 — State of the art comparison

**Section**: Discussion  
**Type**: Horizontal bar  
**Data file**: `discussion/D1_sota_comparison.data.csv`

Reported F1 (val or test) for this thesis' best runs vs published baselines.

**Key numbers**:
- Weber 2019 GCN test = 0.41
- Weber 2019 RandomForest test = 0.79
- Pareja 2020 EvolveGCN test = 0.89
- arXiv:2602.23599 GraphSAGE val = 0.85
- This thesis GraphSAGE val best = 0.53
- This thesis GCN val best = 0.31

**Interpretation**: Our static GNNs under-perform temporal architectures. The focus here is stability of XAI on realistic imbalance regimes, not F1 maximisation.

**Related**: R5.

---

## D2 — Accuracy × Stability quadrants

**Section**: Discussion  
**Type**: 2×2 quadrant scatter  
**Data file**: `discussion/D2_accuracy_stability_quadrants.data.csv`

Per-architecture (mean val F1, mean Spearman) plotted with labelled quadrants.

**Interpretation**: No architecture lands in the top-right ("accurate + stable"). Tradeoff regime: pick depending on downstream needs (D4).

**Related**: A3, A4, D4.

---

## D3 — Peak-collapse curve

**Section**: Discussion  
**Type**: Line chart (3 explainers)  
**Data file**: `discussion/D3_peak_collapse_curve.data.csv`

Mean Spearman per scenario for GNNExplainer, GNNShap and PGExplainer overlaid.

**Interpretation**: GNNExplainer and GNNShap share the peak-collapse pattern; PGExplainer is flat at 0. Strong evidence that the peak-collapse phenomenon is intrinsic to the model/imbalance regime, not explainer-specific.

**Related**: A2.

---

## D4 — Architecture recommendation matrix

**Section**: Discussion  
**Type**: Heatmap  
**Data file**: `discussion/D4_recommendation_matrix.data.csv`

Use case × architecture recommendation strength (0 = avoid, 3 = strong).

**Interpretation**: GraphSAGE wins accuracy; GAT/TAGCN win explainability and extreme imbalance. Single actionable summary for practitioners.

**Related**: A3, D2.

---

## D5 — Pipeline runtime breakdown

**Section**: Discussion  
**Type**: Stacked bar  
**Data file**: `discussion/D5_pipeline_runtime_breakdown.data.csv`

Hours spent in Train vs Explain on each machine.

**Key numbers**:
- Machine B (4060): Train 3.1 h, Explain 1.5 h (total 4.6 h)
- Machine C (3050): Train 5.4 h, Explain 24.0 h (total 29.4 h)

**Interpretation**: GAT attention cost dominates explain phase on Machine C. Future work should either shard GAT across more GPUs or restrict to structural explainers.

**Related**: D4.

---

# v3.1 Additional Figures — Native Scenario & PyG Fixes

Added 2026-04-21 in response to academic investigation of PGExplainer/Jaccard findings.

## R7 — Native 1:30 pass rate by architecture

**Section**: Results
**Type**: Bar chart
**Data file**: `results/R7_native_pass_rate_by_arch.data.csv`

Passing rate per architecture when trained on Elliptic's NATIVE imbalance (~1:30) instead of forced scenarios. Allows comparison with Weber 2019 baseline.

**Key numbers**:
- GCN: 0/3 (0%) — native training insufficient, consistent with Weber GCN weakness
- GraphSAGE: 3/3 (100%) — all pass
- GAT: 2/3 (67%)
- TAGCN: 1/3 (33%)

**Interpretation**: Native scenario with proper balancing validates model competence. GraphSAGE particularly strong at native ratio, confirming architecture choice.

## A11 — Spearman native vs forced scenarios

**Section**: Analysis
**Type**: Bar chart with error bars
**Data file**: `analysis/A11_spearman_native_vs_forced.data.csv`

Compares GNNExplainer Spearman across scenarios, with native 1:30 inserted between 1:10 and 1:50.

**Key numbers** (mean Spearman):
- 1:1: 0.422 (n=3)
- 1:10: 0.531 (n=8)
- **1:30_native: 0.159 (n=6) — LOWER than expected**
- 1:50: 0.593 (n=5) — peak
- 1:100: 0.239 (n=1)

**Interpretation**: Surprisingly, native scenario has LOWER XAI stability than controlled scenarios. Possible reason: controlled scenarios enforce consistency via balancing, while native's natural heterogeneity produces more varied explanations. **Novel finding** — challenges assumption that "native is always best".

## A12 — Native heatmap (architecture × explainer)

**Section**: Analysis
**Type**: Heatmap
**Data file**: `analysis/A12_native_heatmap.data.csv`

Per (arch, explainer) Spearman for native 1:30 only.

**Interpretation**: At native ratio, GAT shows more stable explanations than GraphSAGE — confirming the accuracy-stability tradeoff cross-scenarios.

## D6 — Native vs literature SOTA

**Section**: Discussion
**Type**: Horizontal bar chart
**Data file**: `discussion/D6_native_vs_literature.data.csv`

Compares our native-scenario F1 values with published literature baselines (Weber 2019, Pareja 2020, Bellei 2024, arXiv:2602.23599).

**Our best native**: GraphSAGE F1=0.526 (val) — below SOTA (Bellei 0.93) but **competitive with Weber 2019 baseline (0.628)** validating model competence at native imbalance.

**Interpretation**: The gap to modern SOTA (0.85+) is due to lacking:
- Temporal architectures (EvolveGCN)
- Subgraph-level classification (Elliptic2)
- GraphNorm + Xavier initialization tweaks

Our methodology is sound for XAI stability study; absolute prediction is not the focus.

---

## PyG 2.7 PGExplainer Bug Documentation

The investigation in section 5 of `docs/literature_review.md` identified 2 bugs in PyG 2.7's PGExplainer implementation:

**Bug #1**: `edge_size=0.05` (default) causes mode collapse. Fix: `edge_size=0.005`.
**Bug #2**: `temp=[5.0, 2.0]` causes overflow on large graphs. Fix: `temp=[1.0, 1.0]` + gradient clipping.

See `docs/CONCLUSIONES_v3.1.md` section 2 for full details. Fixes applied in `src/explainability/explainer_runner.py`.
