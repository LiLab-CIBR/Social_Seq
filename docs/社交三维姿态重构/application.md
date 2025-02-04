# 社交三维姿态重构
![pipeline](/assets/images/rat_social_pose_pipeline.jpg)
原始的多视角视频，经过`分割`, `关键点重构` 和 `平滑` 之后，获取稳定的3D姿态坐标。

## 原始视频
视频来自 OBS Studio 录制的9视角相机视频。多相机画面经过了时间同步，误差在1帧及以内，可以忽略。

![pipeline](/assets/images/rat_raw_video.jpg)

## 分割
使用Mask-RCNN模型，识别黑、白鼠的身份，并分割像素区域。

![pipeline](/assets/images/rat_mask_video.jpg)

## 关键点重构
执行 DANNCE 关键点预测 + 神经网络平滑，获取3D姿态。

![pipeline](/assets/images/rat_pose_video.jpg)

