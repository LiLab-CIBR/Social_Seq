# 论文图表复现
"Chen X.F., Tao X.M., Zhong Z.C., Zhu F.Y., Zhang Y.Q., Wang Y.Z., Wang M., Sun L., Li Y.X., Ouyang Y., Ding Z.Y., An M., Zhao Y.Y., Zhou J.F., Zhang R., Xiong W., Ji N., Li Y., 2026. Sub-second dopaminergic reinforcement orchestrates juvenile social play and is disrupted in Shank3 deficiency. In preparation"

**作者**: 陈昕枫（2025-08-09）。**修订**: 陶现明（2025-08-15）、陈昕枫（2026-08-07）。

## 图表总览
运行本仓库中的代码，即可复现论文中的全部图表，下方为复现结果的示例。支持 Windows、Linux 和 macOS 系统。

![Fig1_S1](assets/Fig1_S1.webp)
![Fig2_S2](assets/Fig2_S2.webp)
![Fig3_S3](assets/Fig3_S3.webp)
![Fig4_S4](assets/Fig4_S4.webp)
![Fig5_S5](assets/Fig5_S5.webp)
![Fig6_S6](assets/Fig6_S6.webp)
![Fig7_S7](assets/Fig7_S7.webp)


## 1. 代码与数据下载

数据免费开放下载（文件名：`Social_Seq_DATA.rar`，大小约 4.1 GB），可通过 [Mendeley Data🔗](https://data.mendeley.com/datasets/8w3b9xybzg) 或 [百度云🔗](https://pan.baidu.com/s/1vg79XEUFDD-SLJz3Es0pdg?pwd=5maf) 获取。下载完成后，解压文件并将文件夹重命名为 `Figshare`。

代码免费开放下载，见 [https://github.com/LiLab-CIBR/Social_Seq-Paper-Figure-Replication](https://github.com/LiLab-CIBR/Social_Seq-Paper-Figure-Replication)。

数据与代码的目录结构一一对应。请将数据文件夹中 `Fig*/data/*` 下的内容手动复制到代码文件夹中对应的位置。

## 2. 安装（推荐使用 AI 助手）

可以使用 OpenCode / Codex / Claude 等 AI 编程助手，输入下面的提示词，即可自动完成安装并生成所有图表。

![OpenCode](assets/images/OpenCode.webp)

输入完整提示词：

> 请根据 `"https://lilab-cibr.github.io/Social_Seq/assets/figure_reproduce/AGENTS.md"` 指南，安装并运行项目，生成所有图表。我的数据位于 `"C:\<<<<路径xxxx>>>>\Social_Seq_DATA-v20260809.zip"`，请使用国内镜像源，否则安装速度会很慢。


## 3. 手动安装（不推荐）

手动安装的具体步骤可参考 "https://github.com/LiLab-CIBR/Social_Seq-Paper-Figure-Replication"，大致流程如下。

首先，使用 `uv` 工具**安装依赖环境**。

```bash
git clone https://github.com/LiLab-CIBR/Social_Seq-Paper-Figure-Replication .  # 将代码下载到当前文件夹

python3 -m pip install uv          # uv 是一个轻量级的 Python 包管理器，类似于 conda

uv sync --index-url https://pypi.tuna.tsinghua.edu.cn/simple  # 中国大陆用户可选用清华镜像源，否则安装速度会很慢
uv run python --version  # 验证 Python 版本（应为 3.12）
```

> **注意**: 请勿同时使用 `uv` 和 `conda`，否则会导致包安装冲突。运行以下命令前，请先执行 `conda deactivate`。

**安装自定义依赖包**
```bash
uv pip install git+https://github.com/chenxinfeng4/multiview_calib.git
uv pip install git+https://github.com/chenxinfeng4/LILAB-py.git ../LILAB-py
```

### 生成单个图表：Fig1D.pdf
也可以逐个运行 `Fig*/Fig*.py` 脚本生成单个图表。
```bash
uv run python Fig1_S1/Fig1D.py   # 结果保存到 Fig1_S1/result/Fig1D.pdf
```
> **提示**: 如果运行报错，请确认所有数据文件均已正确下载。

### 一条命令生成所有图表
```bash
uv run python main.py test
```
将生成 Fig1*.pdf、FigS1*.pdf、Fig2*.pdf 等图表，并保存到对应的文件夹中：`Fig*/result/*.pdf`，例如 `Fig1_S1/result/Fig1G.pdf`。

### 清理所有结果，恢复初始状态

```bash
uv run python main.py clean
```

或手动删除所有结果文件：
```bash
rm Fig*/result/*pdf Fig*/result/*pkl Fig*/result/*png
```
