# Code Process
> Developer: xxx
> Maintainer: xxx

Calibration of multi-camera models. The input is a video file, and the output is the calibration result.

```bash
#!/bin/bash
conda activate mmdet
vfile='/PATH_to_ball/BALL____2024-01-22_14-34-01.mp4'
LILAB_DIR=/home/liying_lab/chenxf/ml-project/LILAB-py/lilab

bash $LILAB_DIR/multiview_scripts_dev/p_calibration.sh $vfile carl
```
Here, `vfile` is the path to the video file recorded by OBS Studio software, and `carl` is the camera calibration parameter. The script will automatically parse the video and generate the calibration result.
Commonly used camera calibration parameters include:

* `ana`: Rat behavior room 1
* `bob`: Rat behavior room 2 / Small bucket
* `carl`: Rat behavior room 2 / Medium & Large bucket.