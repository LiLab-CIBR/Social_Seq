# Social 3D Pose Reconstruction
![pipeline](../../../assets/images/rat_social_pose_pipeline.jpg)
Raw multi-view videos, after `segmentation`, `keypoint reconstruction` and `smoothing`, obtain stable 3D pose coordinates.

## Raw Video
The video comes from OBS Studio recorded 9-view camera video. The multi-camera images have been time-synchronized, with an error of 1 frame or less, which can be ignored.

![pipeline](../../../assets/images/rat_raw_video.jpg)

## Segmentation
Using the Mask-RCNN model, the identity of black and white rats is recognized, and the pixel area is segmented.

![pipeline](../../../assets/images/rat_mask_video.jpg)

## Keypoint Reconstruction
Execute DANNCE keypoint prediction + neural network smoothing to obtain 3D pose.

![pipeline](../../../assets/images/rat_pose_video.jpg)