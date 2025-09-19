# 什么是 SocialSeq 游乐场

SocialSeq 游乐场（Pipeline Playground）是一个基于 Docker 打包的代码环境，旨在通过演示数据的处理过程帮助用户理解 SocialSeq 框架的功能和逻辑。

使用**网页浏览器**探索 SocialSeq 游乐场：

![img](../../assets/images/web-gui.jpg)

!!! note "注意"
    游乐场仅用于演示 SocialSeq 框架各模型的**推理过程**，不包含模型训练。后续的数据分析请参考上一章节 [**文章图表复现**](../figure_reproduce.zh.md)。

## 系统要求

SocialSeq 已在以下配置上进行了测试：

- **Windows 10**（带 WSL2）+ x86_64 + NVIDIA RTX4090
- **Debian 11** + x86_64 + NVIDIA A100
- **Ubuntu 20.04** + x86_64 + NVIDIA RTX3090

需要安装 **Docker** 和 **NVIDIA 驱动**：

```bash
$ docker --version  # Docker 版本应 >= 24.0.6
$ nvidia-smi        # NVIDIA 驱动版本应 >= 550.54
```

## 安装指南

您需要安装 Docker 并下载[模型和数据文件🔗](https://pan.baidu.com/s/1LKJx-wtOSx2FvIgiMVrNPg?pwd=c8du)：

| 名称 | 类型 |
| --- | --- |
| lilab_socialseq_pipeline_cuda_vscode_<br>amd64_20250903.tar | Docker 镜像 (**11.5 GB**) |
| lilab_socialseq_pipeline_code_with_<br>data_20250903.zip  | 代码与数据 (**1.6 GB**) |

```bash
$ cd SOCIAL_SEQ_DOWNLOAD_PATH
$ docker load -i ./lilab_socialseq_pipeline_cuda_vscode_amd64_2025*.tar
$ docker images | grep lilab      # 结果将得到一个名为 'lilab*' 的镜像文件

$ unzip lilab_socialseq_pipeline_code_with_data_2025*.zip -d ./pipeline  # 解压文件
$ ls ./pipeline/1-Ball_Calibration   # 检查路径

$ docker run --rm -it -p 8080:8080 \
    --gpus all \
    --name lilab_socialseq \
    -e PASSWORD=2025cxf  \
    -v ./pipeline:/root/Downloads/pipeline  \
    lilab/socialseq:codeserver-cuda-tensorrt-torch-tensorflow-mmdet-mmpose-dannce-yolo-20250903 \
    /app/code-server/bin/code-server
```

导航到 `http://localhost:8080` 并输入密码 `2025cxf` 以访问 VS Code 服务器环境，在那里您可以查看、编辑和运行 SocialSeq 代码。

> 如果您在远程服务器上运行 Docker，应将 8080 端口转发到本地机器。有关更多信息，请参见 [错误修复](./bug_fix.zh.md)。

或者通过 Docker 终端进入容器：

```bash
$ docker exec -it lilab_socialseq bash
```

## 环境验证

在 `http://localhost:8080` 的 Docker VS Code 服务器环境中：

```bash
$ nvidia-smi  # 在 Docker 容器内，应显示 GPU 信息
```

!!! error "错误"
    如果遇到类似 `not found libnvidia-ml.so.1` 的错误，这是正常现象，因为 Docker 的 NVIDIA 驱动在 Windows 和 Linux 下路径不同。解决方法请参见 [错误修复](./bug_fix.zh.md)。

## 模型初始化

将深度学习模型转换为 TensorRT 以提高性能。由于 TensorRT 模型绑定到特定的系统和硬件，此步骤必须在每台新机器上执行。

!!! note "注意"
    此步骤每台机器只需执行一次。转换过程将花费约 20 分钟。

```bash
bash /root/Downloads/pipeline/model_dannce/convert_dannce_hdf5_to_tensorrt.sh

bash /root/Downloads/pipeline/model_mask_rcnn_r101_fpn_2x_coco_bwrat_816x512_cam9/convert_mmdet_model_to_tensorrt.sh

bash /root/Downloads/pipeline/model_mmpose/convert_mmpose_model_to_tensorrt.sh

bash /root/Downloads/pipeline/model_YOLOv8/convert_yolov8seg_to_tensorrt.sh

# 给 LILAB-pkg 包打补丁
cp -r /root/Downloads/pipeline/LILAB-pkg-patch-for-docker/* ~/LILAB-pkg/
```

运行这些命令后，您将生成以下文件：

- `model_mmpose/latest.full.engine`
- `model_dannce/DANNCE/train_results/MAX/latest.engine`
- `model_YOLOv8/last.full.engine`
- `model_mask_rcnn_r101_fpn_2x_coco_bwrat_816x512_cam9/latest.trt`

全部设置完成！您现在可以使用演示数据运行 SocialSeq 游乐场了。

## 🚀 快速开始

完成上述安装步骤后，您可以开始运行游乐场。

### 1. 小球矫正
使用球作为校准目标比棋盘提供更好的可见性，能够更快地进行多摄像机系统的外部校准。详细信息请参见 [文档](../../%E5%B0%8F%E7%90%83%E7%9F%AB%E6%AD%A3/application/)。

```bash
bash /root/Downloads/pipeline/1-Ball_Calibration/run_task.sh
```

### 2. 社交三维姿态计算 (SOCIAL)
通过 Mask R-CNN 处理多摄像机动物视频进行动物识别和分割，然后使用 DANNCE 进行 3D 姿态关键点推断，使用 SmoothNet 进行动作关键点平滑。详细信息请参见 [文档]({{ home }}/en/%E5%B0%8F%E7%90%83%E7%9F%AB%E6%AD%A3/application/)。

```bash
bash /root/Downloads/pipeline/2-Social_3D_Pose/run_task_segmentation.sh   # Mask R-CNN 用于 ID 分割
bash /root/Downloads/pipeline/2-Social_3D_Pose/run_task_keypoint.sh       # DANNCE 和 SmoothNet 用于 3D 姿态重建
```

### 3. 社交序列标签 (SEQ)
从 3D 姿态中提取社交相关特征并对其进行分段（每段 0.8 秒）。使用 Seq2seq-FCN 模型对每个视频片段进行分类，产生一致的社交序列标签。详细信息请参见 [文档](../../%E7%A4%BE%E4%BA%A4%E5%BA%8F%E5%88%97%E6%A0%87%E7%AD%BE/application/)。

```bash
bash /root/Downloads/pipeline/3-Sequence_Labeling/run_task.sh
```

### 4. 闭环行为控制 (LIVE)
建立具有闭环反馈的实时行为分析系统。这将涉及多摄像机感知和识别动物社交行为，以建立光遗传学条件刺激。

*尚未加入游乐场，准备中*
