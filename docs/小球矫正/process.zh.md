# 代码流程

多相机模型的标定。输入是视频文件，输出是标定结果。

```bash
#!/bin/bash
conda activate mmdet
vfile='/PATH_to_ball/BALL____2024-01-22_14-34-01.mp4'
LILAB_DIR=/home/liying_lab/chenxf/ml-project/LILAB-py/lilab

bash $LILAB_DIR/multiview_scripts_dev/p_calibration.sh $vfile carl
```
其中 `vfile` 是 OBS Studio 软件录制的视频文件路径，`carl` 是相机标定参数。脚本会自动解析视频，并生成标定结果。
常用的 相机标定参数包括：

* `ana`: 大鼠行为间1
* `bob`: 大鼠行为间2 / 小桶
* `carl`: 大鼠行为间2 / 中&大桶。