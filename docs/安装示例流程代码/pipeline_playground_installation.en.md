# Welcome to SocialSeq playground, let's quickly install and play.
SocialSeq is a comprehensive toolbox for pose estimation and behavior recognition of animals (particularly rodents) performing free social behaviors.

## Content
This repository contains the "SocialSeq" pipeline playground, designed to help users understand the functionality and logic of the SocialSeq framework through a series of demonstration data processing tasks. The complete pipeline includes model packaging, raw data processing, and result visualization, allowing you to explore:

**Use the web browser** to edit and run the social-seq playground.

![img](../../../assets/images/web-gui.jpg)

## Key Features

- **Ball Calibration for Multi-Camera System**: 
- **Social 3D Pose Estimation**: 
- **Sequence Labeling**: 


## System Requirements

SocialSeq has been tested on the following configurations:

- **Windows 10** (with WSL2) + AMD64 + NVIDIA RTX4090
- **Ubuntu** + AMD64 + NVIDIA A100
- **Ubuntu** + AMD64 + NVIDIA RTX3090

Prerequisites, **docker** and **nvidia driver** should be installed.
```bash
$ docker --version  # Docker version should be >= 24.0.6
$ nvidia-smi        # NVIDIA driver version should be >= 550.54
```

## Installation

You need to set up Docker and download the models and data files:

| Name | Type | Download link |
| --- | --- | ---|
| lilab_socialseq_pipeline_cuda_vscode_amd64_20250903.tar | docker image | 百度云(准备中) |
| lilab_socialseq_pipeline_code_with_data_20250903.zip | docker image | 百度云(准备中) |

```bash
$ cd SOCIAL_SEQ_DOWNLOAD_PATH
$ docker load -i ./lilab_socialseq_pipeline_cuda_vscode_amd64_2025*.tar
$ docker images | grep lilab      # resulting in an image file named 'lilab*'

$ unzip lilab_socialseq_pipeline_code_with_data_20250903.zip -d ./pipeline  # Unzip file
$ ls ./pipeline/1-Ball_Calibration   # Check path

$ docker run --rm -it -p 8080:8080 \
    -e PASSWORD=2025cxf  \
    -v ./pipeline:/root/Downloads/pipeline  \
    lilab/socialseq:codeserver-cuda-tensorrt-torch-tensorflow-mmdet-mmpose-dannce-yolo-20250903 \
    /app/code-server/bin/code-server
```

Navigate to `http://localhost:8080` and enter the PASSWORD `2025cxf` to access the VS Code server environment where you can view, edit, and run SocialSeq code.

> If you're running Docker on a remote server, you should forward port 8080 to your local machine. See the [bug fix documentation] for more information.

#### Environment Verification

In the Docker VS Code server environment at `http://localhost:8080`:

```bash
$ nvidia-smi  # within docker container, should display GPU information
```

> If you encounter errors like `not found libnvidia-ml.so.1`, refer to the [bug fix documentation].

### Model Initialization

Convert deep learning models to TensorRT for improved performance. Since TensorRT models are bound to specific systems and hardware, this step must be performed on each new machine.

> Note: This step only needs to be performed once per machine.

```bash
$ bash /root/Downloads/pipeline/model_dannce/convert_dannce_hdf5_to_tensorrt.sh
$ bash /root/Downloads/pipeline/model_mask_rcnn_r101_fpn_2x_coco_bwrat_816x512_cam9/convert_mmdet_model_to_tensorrt.sh
$ bash /root/Downloads/pipeline/model_mmpose/convert_mmpose_model_to_tensorrt.sh
$ bash /root/Downloads/pipeline/model_YOLOv8/convert_yolov8seg_to_tensorrt.sh
```

After running these commands, you will generate:

- `model_mmpose/latest.full.engine`
- `DANNCE/train_results/MAX/latest.engine`
- `model_YOLOv8/last.full.engine`
- `model_mask_rcnn_r101_fpn_2x_coco_bwrat_816x512_cam9/latest.trt`

All set! You're now ready to run the SocialSeq pipeline with demo data.

## Quick Start

Once you've completed the installation steps above, you can begin running the SocialSeq pipeline components using the instructions in the following sections.

## Pipeline Components

### 1. Ball Calibration
Using a ball as a calibration target provides better visibility than a chessboard, enabling faster extrinsic calibration of multi-camera systems. For detailed information, refer to the [documentation](../../%E5%B0%8F%E7%90%83%E7%9F%AB%E6%AD%A3/application/).


```bash
$ bash /root/Downloads/pipeline/1-Ball_Calibration/run_task.sh
```


### 2. Social 3D Pose (SOCIAL)
Processing multi-camera animal videos through Mask R-CNN for animal identification and segmentation, followed by DANNCE for 3D pose keypoint inference, and SmoothNet for motion keypoint smoothing. This results in accurate, occlusion-resistant social 3D poses. For detailed information, refer to the [documentation](../../%E5%B0%8F%E7%90%83%E7%9F%AB%E6%AD%A3/application/).


```bash
$ bash /root/Downloads/pipeline/2-Social_3D_Pose/run_task_segmentation.sh   # Mask R-CNN for ID segmentation
$ bash /root/Downloads/pipeline/2-Social_3D_Pose/run_task_keypoint.sh       # DANNCE and SmoothNet for 3D pose reconstruction
```


### 3. Sequence Labeling (SEQ)
Extracting social-related features from 3D poses and segmenting them (0.8 seconds per segment). Using a Seq2seq-FCN model to classify each video segment, resulting in consistent social sequence labels. For detailed information, refer to the [documentation](../../%E7%A4%BE%E4%BA%A4%E5%BA%8F%E5%88%97%E6%A0%87%E7%AD%BE/application/).

```bash
$ bash /root/Downloads/pipeline/3-Sequence_Labeling/run_task.sh
```

### 4. Closed-Loop Control (LIVE)** (Coming Soon): 
Establishing a real-time behavior analysis system with closed-loop feedback. This will involve multi-camera perception and recognition of animal social behaviors to establish optogenetic conditional stimulation.
