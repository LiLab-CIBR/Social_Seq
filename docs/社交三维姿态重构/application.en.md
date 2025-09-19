# Social 3D Pose Reconstruction
*Refer to “[PIPELINE PLAYGROUND > Install & Run](../../安装示例流程代码/pipeline_playground_installation/)”， and test the codes。*

![pipeline](../../../assets/images/rat_social_pose_pipeline.jpg)
Raw multi-view videos, after `segmentation`, `keypoint reconstruction` and `smoothing`, obtain stable 3D pose coordinates.


<div class="video-item">
    <p class="video-legend">Video: Multi-animal 3D pose tracking using appearance-based segmentation</p>
    <video controls muted playsinline style="width: 480px;" data-src="../../../assets/hls_videos/VideoS3_3D_pose_24090417/playlist.m3u8"></video>
</div>

<br>

## Raw Video
The video comes from OBS Studio recorded 9-view camera video. The multi-camera images have been time-synchronized, with an error of 1 frame or less, which can be ignored.

![pipeline](../../../assets/images/rat_raw_video.jpg)

## Segmentation
Using the Mask-RCNN model, the identity of black and white rats is recognized, and the pixel area is segmented.

![pipeline](../../../assets/images/rat_mask_video.jpg)

## Keypoint Reconstruction
Execute DANNCE keypoint prediction + neural network smoothing to obtain 3D pose.

![pipeline](../../../assets/images/rat_pose_video.jpg)

<script src="https://cdnjs.cloudflare.com/ajax/libs/hls.js/1.5.8-0.canary.10141/hls.light.min.js"></script>
<script src="../../../assets/js/hls.js"></script>
<script src="../../../assets/js/video-player.js"></script>
