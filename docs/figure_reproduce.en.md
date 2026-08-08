# Paper Code Reproduction
"Chen X.F., Tao X.M., Zhong Z.C., Zhu F.Y., Zhang Y.Q., Wang Y.Z., Wang M., Sun L., Li Y.X., Ouyang Y., Ding Z.Y., An M., Zhao Y.Y., Zhou J.F., Zhang R., Xiong W., Ji N., Li Y., 2026. Sub-second dopaminergic reinforcement orchestrates juvenile social play and is disrupted in Shank3 deficiency. In preparation"

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

The data are openly available for download at `Social_Seq_DATA.rar` ([Mendeley Data🔗](https://data.mendeley.com/datasets/8w3b9xybzg) or [BaiduYun🔗](https://pan.baidu.com/s/1AOTVayg2qMhh3KGjDtZh1Q?pwd=6mc3), **4.1 GB**).
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
unrar x Social_Seq_DATA*.rar Figshare/  # Extract the data to Figshare
cd Figshare
git clone https://github.com/LiLab-CIBR/Social_Seq-Paper-Figure-Replication . # Download the code

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

## Generate a Single Figure: Fig1D.pdf
You can run the code in `Fig*/Fig*.py` one by one to generate figures.
```bash
uv run python Fig1_S1/Fig1D.py   # The result is saved to Fig1_S1/result/Fig1D.pdf
```
> **Note**: If any error occurs, please ensure that all data files have been downloaded correctly.

## Generate All Figures with One Command
```bash
uv run python main.py test
```
Figures such as Fig1*.pdf, FigS1*.pdf, Fig2*.pdf, ... will be generated and saved in the corresponding folders: Fig*/result/*.pdf, e.g., Fig1_S1/result/Fig1G.pdf.

## Clean All Results, Reset
```bash
#1. Delete all result data
uv run python main.py clean

#2. Or manually delete all result data
rm Fig*/result/*pdf Fig*/result/*pkl Fig*/result/*png
```