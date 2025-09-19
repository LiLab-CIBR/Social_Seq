# 社交三维姿态重构
*参考 “[安装示例代码 > 游乐场](../../安装示例流程代码/pipeline_playground_installation/)”，运行完整代码。*

![pipeline](../../assets/images/rat_social_pose_pipeline.jpg)
原始的多视角视频，经过`分割`, `关键点重构` 和 `平滑` 之后，获取稳定的3D姿态坐标。

<div class="video-item">
    <p class="video-legend">视频: 社交三维姿态重构——通过分割+关键点+平滑</p>
    <video controls muted playsinline class="responsive-video" data-src="../../assets/hls_videos/VideoS3_3D_pose_24090417/playlist.m3u8"></video>
</div>

<br>

## 原始视频
视频来自 OBS Studio 录制的9视角相机视频。多相机画面经过了时间同步，误差在1帧及以内，可以忽略。

![pipeline](../../assets/images/rat_raw_video.jpg)

## 分割
使用Mask-RCNN模型，识别黑、白鼠的身份，并分割像素区域。

![pipeline](../../assets/images/rat_mask_video.jpg)

## 关键点重构
执行 DANNCE 关键点预测 + 神经网络平滑，获取3D姿态。

![pipeline](../../assets/images/rat_pose_video.jpg)

<script src="https://cdnjs.cloudflare.com/ajax/libs/hls.js/1.5.8-0.canary.10141/hls.light.min.js"></script>
<script src="../../assets/js/hls.js"></script>
<script src="../../assets/js/video-player.js"></script>
