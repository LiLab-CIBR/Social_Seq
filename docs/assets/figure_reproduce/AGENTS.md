# Agent Guide: Install and Run

This document explains how an AI agent (or any automated assistant) can set up the environment, place the source data, and run the figure-generation code in this repository. The human-facing usage is in [README.md](README.md); follow this file when automating the process.

## Repository layout

- `Fig1_S1/ ... Fig7_S7/` — one folder per main figure. Each contains:
  - `Fig*.py` / `FigS*.py` — scripts that generate the figure PDF/PNG/HTML files.
  - `result/` — generated outputs (created automatically by `main.py`, committed outputs may exist).
  - `data/` — **input source data** (MUST be populated from the downloaded bundle; see below).
  - `DOWNLOAD_DATA.txt` — a tree listing of the exact files expected under `data/` for that figure.
- `main.py` — orchestrator: `python main.py test` runs every figure script and checks outputs; `python main.py clean` removes results.
- `pyproject.toml` — Python project definition (UV-based, Python >= 3.12).
- `Social_Seq_DATA-v*/` — the extracted data bundle (after download), one sibling structure mirroring `Fig*/data`.
- `output/` — scratch output (may be created and deleted during runs).

## Flow overview

1. Clone the repo.
2. Set up the Python environment with `uv`.
3. Install the two custom GitHub packages.
4. **Check** whether the data is already installed; **install it only if missing** (the user downloads the bundle, then the agent extracts/merges it into `Fig*/data/`).
5. Run single figures, or `python main.py test` for everything.

---

## Step 1 — Clone

```bash
git clone https://github.com/LiLab-CIBR/Social_Seq-Paper-Figure-Replication.git <dir>
cd <dir>
```

> **Network fallback:** if `github.com` is unreachable (common in China), mirror the URLs below. See [Network mirrors](#network-mirrors).

## Step 2 — Environment setup (UV)

**Important:** do NOT mix `uv` with conda. If a conda environment is active, run `conda deactivate` first (or `source deactivate`).

```bash
python3 -m pip install uv

# Default index:
uv sync

# Optional for users in China (much faster):
uv sync --index-url https://pypi.tuna.tsinghua.edu.cn/simple

# Verify — should print Python 3.12.x
uv run python --version
```

`uv sync` reads `pyproject.toml`, creates the `.venv`, and installs all pinned third-party deps (matplotlib, pandas, scipy, seaborn, umap-learn, scikit-posthocs, etc.).

## Step 3 — Install custom packages (UV)

```bash
uv pip install git+https://github.com/chenxinfeng4/multiview_calib.git
uv pip install git+https://github.com/chenxinfeng4/LILAB-py.git

# Verify both installed:
uv run python -m lilab.multiview_scripts_dev.p1_checkboard_global -h
```

The figure scripts `import lilab.*` / `multiview_calib.*`, so these must succeed before any figure runs.

> **Network fallback:** if `github.com` is unreachable for these `git+https://` installs, use the Gitee URLs below. See [Network mirrors](#network-mirrors).

## Step 4 — Source data: check, then install (download/extract/merge)

The code **requires** the raw data (~4.1 GB); it is NOT committed to git. An agent should **check first, install only if missing** — never re-download or re-extract data that is already in place.

### 4a. Check whether the data is already installed

Before doing anything, test that one **typical marker file** exists in each figure's `data/` folder. Run this check first:

```bash
for f in \
  Fig1_S1/data/smoothnet_residual.pkl \
  Fig2_S2/data/rawfeat_norm.pkl \
  Fig3_S3/data/Representive_K36.clippredpkl \
  Fig4_S4/data/clipfair_umapbalance.clippredpkl \
  Fig5_S5/data/norm_k36_MLP_embedding_to_d2.pkl \
  Fig6_S6/data/Liquid_DA/zscore_data_water.csv \
  Fig7_S7/data/df_rat_info_OL_and_CL.pkl ; do
    test -e "$f" && echo "OK  $f" || echo "MISSING  $f"
done
```

- **If every line prints `OK`**, the data is already installed correctly — **skip the rest of Step 4** and go straight to [Step 5 — Run figures](#step-5--run-figures).
- **If any line prints `MISSING`**, the data is not (fully) installed yet. Continue with 4b → 4c → 4d below, then re-run the check to confirm it now prints all `OK`.
- You may also spot-check an entire figure against its full manifest in `Fig*/DOWNLOAD_DATA.txt` (one per figure; e.g. `Fig1_S1/data/raw_mAP_mask.pkl`, `Fig1_S1/data/smooth_joint_pkl/*`, ...).

### 4b. Download the bundle (done by the user)

**The download is done by the user, not the agent.** The agent does not provide a download service for this ~4.1 GB bundle. The source `Social_Seq_DATA.rar` is available from:

- Baidu Pan (pwd `5maf`): https://pan.baidu.com/s/1vg79XEUFDD-SLJz3Es0pdg?pwd=5maf
- Mendeley Data: https://data.mendeley.com/datasets/8w3b9xybzg

Ask the user to:
1. Download `Social_Seq_DATA*.rar` (it may be named `Social_Seq_DATA.rar`, `Social_Seq_DATA-v20260809.rar`, etc. — detect whatever matches `Social_Seq_DATA*.rar`).
2. Optionally extract it into a folder `Social_Seq_DATA*/` that contains `Fig1_S1/ ... Fig7_S7/`, each with a `data/` subtree.

The user then tells the agent the **final location** of either the `.rar` **file** or the already-extracted `Social_Seq_DATA*/` **folder** (for example, placed in the repository root, or at an arbitrary path the user specifies). The agent proceeds only once the item's final address is provided/known.

### 4c. Extract the bundle (agent-assisted)

If the user provided an **extracted folder** (`Social_Seq_DATA*/`), skip extraction and go straight to [4d](#4d-merge-the-extracted-data-into-figdata).

If the user provided a `.rar` **file** and it is not yet extracted, the agent extracts it into the same directory as the archive. The result is a folder `Social_Seq_DATA*/` containing each `Fig*/data/` subtree.

Agent-side example with `unar` (handles `.rar` well):

```bash
# Locate the archive (e.g. in the repo root)
RAR=$(ls Social_Seq_DATA*.rar 2>/dev/null | head -1)
test -n "$RAR" || { echo "No Social_Seq_DATA*.rar found in current dir"; exit 1; }

# Already extracted? skip if `Social_Seq_DATA*/` already exists
if compgen -G "Social_Seq_DATA*/" >/dev/null; then
    echo "Already extracted: $(ls -d Social_Seq_DATA*/)"; exit 0
fi

# Extract (uses unar if available, else unrar / 7z)
unar "$RAR" -o ./ || unrar x "$RAR" ./ || 7z x "$RAR"
```

> If the archive or extracted folder lives at a non-default path, point `RAR` (or `SRC` in 4d) at the actual location the user reported instead of the repo root.

### 4d. Merge the extracted data into `Fig*/data/`

After extraction, copy each figure's `data/` subtree from the bundle into the repo:

```bash
SRC=$(ls -d Social_Seq_DATA*/ | head -1)   # e.g. Social_Seq_DATA-v20260809/
for fig in Fig1_S1 Fig2_S2 Fig3_S3 Fig4_S4 Fig5_S5 Fig6_S6 Fig7_S7; do
    cp -r "$SRC/$fig/data/." "$fig/data/"
done
```

Equivalently, place the extracted bundle such that the repo's `Fig*/` sit alongside its `data/` (the scripts resolve `Fig*/data/...` relative to the repo root).

### 4e. Verify

Re-run the [4a check](#4a-check-whether-the-data-is-already-installed). Every marker file must now print `OK`. For full confidence, per figure, compare the actual `Fig*/data/` against its `DOWNLOAD_DATA.txt` tree.

**If any figure later fails with "file not found"/assertion errors, the first thing to check is that its `data/` folder is fully populated and matches `DOWNLOAD_DATA.txt`.**

## Step 5 — Run figures

### Single figure

```bash
uv run python Fig1_S1/Fig1D.py     # output -> Fig1_S1/result/Fig1D.pdf
```

Any `Fig*/Fig*.py` or `Fig*/FigS*.py` can be run this way. Outputs land in the sibling `result/` folder.

### Clean previous results (optional)

```bash
uv run python main.py clean
# manual equivalent:
rm Fig*/result/*pdf Fig*/result/*pkl Fig*/result/*png
```

### All figures (recommended)

```bash
uv run python main.py test
```

`main.py test` runs every figure script in order, then checks that each expected output file was produced. It prints a green/red summary and exits `0` on full success, `1` if any figure failed or produced a missing output. Expected outputs for each script are enumerated in the `test_cases` list inside `main.py`.

---

## Troubleshooting an agent should know

| Symptom                                                       | Likely cause                       | Fix                                                                                                                                 |
| ------------------------------------------------------------- | ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `uv` / `uv sync` errors                                   | conda env active                   | `conda deactivate`, then retry                                                                                                    |
| `ModuleNotFoundError: lilab` / `multiview_calib`          | Step 3 skipped                     | re-run the two `uv pip install git+...` and the `-h` verify                                                                     |
| 4a check prints `MISSING ...`                               | data bundle not installed yet      | follow Step 4b→4d (download `Social_Seq_DATA*.rar`, extract to `Social_Seq_DATA*/`, merge into `Fig*/data/`), then re-run 4a |
| `FileNotFoundError` / assertion on data load                | figure `data/` not populated     | complete Step 4 merge; compare against `DOWNLOAD_DATA.txt`                                                                        |
| Wrong Python version                                          | `.venv` stale                    | remove `.venv` and re-run `uv sync`                                                                                             |
| Missing output after a run                                    | script errored, or data incomplete | scroll the script output, fix data, re-run the single `Fig*.py`                                                                   |
| `git clone` / `uv pip install git+...` hangs or times out | `github.com` unreachable (China) | retry with the Gitee mirror URL (see[Network mirrors](#network-mirrors))                                                               |

## Command cheat-sheet

```bash
conda deactivate                                   # if a conda env is active
python3 -m pip install uv
uv sync --index-url https://pypi.tuna.tsinghua.edu.cn/simple   # or without index-url
uv pip install git+https://github.com/chenxinfeng4/multiview_calib.git
uv pip install git+https://github.com/chenxinfeng4/LILAB-py.git
# data: first CHECK (4a marker test) — only if missing: place Social_Seq_DATA*.rar in repo root,
# extract it, then merge into Fig*/data (Step 4b→4d); re-run the check after.
uv run python Fig1_S1/Fig1D.py                    # single figure
uv run python main.py test                        # all figures + verification
```

## Network mirrors

If `github.com` is unreachable (common in China), replace the GitHub URLs with the Gitee mirrors below. If the first attempt fails, retry automatically with the mirror.

### Clone the repository

| Original (GitHub)                                                         | Mirror (Gitee)                                                      |
| ------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| `https://github.com/LiLab-CIBR/Social_Seq-Paper-Figure-Replication.git` | `https://gitee.com/lilab/Social_Seq-Paper-Figure-Replication.git` |

```bash
# Original
git clone https://github.com/LiLab-CIBR/Social_Seq-Paper-Figure-Replication.git <dir>
# Gitee fallback
git clone https://gitee.com/lilab/Social_Seq-Paper-Figure-Replication.git <dir>
```

### Install the two custom packages

| Package         | Original (GitHub)                                           | Mirror (Gitee)                                      |
| --------------- | ----------------------------------------------------------- | --------------------------------------------------- |
| multiview_calib | `git+https://github.com/chenxinfeng4/multiview_calib.git` | `git+https://gitee.com/lilab/multiview_calib.git` |
| LILAB-py        | `git+https://github.com/chenxinfeng4/LILAB-py.git`        | `git+https://gitee.com/lilab/LILAB-py.git`        |

```bash
# Original
uv pip install git+https://github.com/chenxinfeng4/multiview_calib.git
uv pip install git+https://github.com/chenxinfeng4/LILAB-py.git

# Gitee fallback
uv pip install git+https://gitee.com/lilab/multiview_calib.git
uv pip install git+https://gitee.com/lilab/LILAB-py.git
```

After either install path, always verify with:

```bash
uv run python -m lilab.multiview_scripts_dev.p1_checkboard_global -h
```

**Best practice for an agent:** clone/install from GitHub first. If the command times out, errors, or fails to resolve, re-run the same command using its Gitee mirror instead.
