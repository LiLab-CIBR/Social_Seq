# Overview of Ball Calibration
*Refer to “[PIPELINE PLAYGROUND > Install & Run](../../安装示例流程代码/pipeline_playground_installation/)”， and test the codes。*

The ball calibration process was developed using a ball, achieving fast and accurate multi-camera calibration. For details, you can also refer to [multiview_ball_calib](https://github.com/chenxinfeng4/multiview_ball_calib). Here, we only present the general process.

<div style="display: flex; justify-content: space-between; align-items: center;">
<div style="flex: 1; margin-right: 5px; min-width: 0;">
<video autoplay muted loop playsinline style="width: 100%; height: auto;">
<source src="../../../assets/videos/ball_move.mp4" type="video/mp4">
Your browser does not support the video tag.
</video>
</div>
<div style="flex: 1; margin-left: 5px; min-width: 0;">
<img src="../../../assets/images/cameras_3d_show.jpg" alt="3D camera space" style="width: 100%; height: auto;">
</div>
</div>
![transform](../../../assets/images/transform_2D_3D.jpg)

## Why Use a Ball for Calibration
Calculating the extrinsic parameters (position and rotation angle) of multiple cameras is essential for establishing an accurate 3D coordinate model. Traditional checkerboard extrinsic calibration methods require multiple cameras to simultaneously capture the front pattern of the checkerboard, but in a surround multi-camera configuration, there are viewing angle limitations. The application efficiency of checkerboards is low, while using a ball is more efficient.
