# Paper Code Reproduction
"(2025) Decoding the Valence of Developmental Social Behavior: Dopamine Governs Social Motivation Deficits in Autism. In preparation"

**Author**: Chen Xinfeng, 2025-08-09. **Modified**: Tao Xianming, 2025-08-15. Chen Xinfeng, 2026-08-07.

## Figures Gallery
Run the code in this repository to reproduce the figures in the paper.
![Fig1_S1](assets/Fig1_S1.webp)
![Fig2_S2](assets/Fig2_S2.webp)
![Fig3_S3](assets/Fig3_S3.webp)
![Fig4_S4](assets/Fig4_S4.webp)
![Fig5_S5](assets/Fig5_S5.webp)
![Fig6_S6](assets/Fig6_S6.webp)
![Fig7_S7](assets/Fig7_S7.webp)


## Code and Data Download
The data and code have been open-sourced, with the link: [Figshare_DATA_20250818.zip🔗](https://pan.baidu.com/s/1YNHOnwKm2-YS8ZePG0TTOA?pwd=j6ab) (**1.0 GB**).
After downloading, unzip it into a folder named `Figshare`.

The data are openly available for download at [Figshare_DATA_20250818.zip🔗](https://pan.baidu.com/s/1YNHOnwKm2-YS8ZePG0TTOA?pwd=j6ab) (**1.0 GB**).
After downloading, extract the archive into a folder and name it Figshare.

Source code is publicly available at [https://github.com/LiLab‑CIBR/Social_Seq‑Paper‑Figure‑Replication](https://github.com/LiLab-CIBR/Social_Seq-Paper-Figure-Replication).

The directory structures of the **data** and **code** are one‑to‑one matched. Manually **copy individual contents** from `Fig*/data/*` in the data folder into the corresponding code folder.

## Installation
Supports Windows, Linux, and MacOS systems.

First, **install the dependency environment** using `uv`.

!!! warning "Warning"
    Do not use `uv` and `conda` simultaneously, as this will cause package installation conflicts. Before running the following codes, please run `conda deactivate` first.

```bash
# Before running the following code, please download the FIGSHARE code and data.
unzip Figshare_DATA_2025*.zip -d Figshare
cd Figshare

python3 -m pip install uv          # UV is a lightweight Python package manager, similar to conda.

uv sync  # Download the required packages and dependencies.
uv run python --version  # Verify the Python version (should be 3.12)
```

**Install Custom Packages**
```
uv pip install git+https://github.com/chenxinfeng4/multiview_calib.git

git clone https://github.com/chenxinfeng4/LILAB-py.git ../LILAB-py
uv pip install -e ../LILAB-py

uv run python -m lilab.multiview_scripts_dev.p1_checkboard_global -h   # Verify the installation
```

## Generate a Single Figure: Fig1C.pdf
You can run the code in `Fig*/Fig*.py` one by one to generate figures.
```bash
uv run python Fig1_S1/Fig1C.py   # The result is saved to Fig1_S1/result/Fig1C.pdf
```
> **Note**: If any error occurs, please ensure that all data files have been downloaded correctly.

## Generate All Figures with One Command
```bash
uv run python main.py test
```
Figures such as Fig1*.pdf, FigS1*.pdf, Fig2*.pdf, ... will be generated and saved in the corresponding folders: Fig*/result/*.pdf, e.g., Fig1_S1/result/Fig1E.pdf.

## Clean All Results, Reset
```bash
#1. Delete all result data
uv run python main.py clean

#2. Or manually delete all result data
rm Fig*/result/*pdf Fig*/result/*pkl Fig*/result/*png
```