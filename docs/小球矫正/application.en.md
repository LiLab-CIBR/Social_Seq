# Overview of Ball Calibration
The ball calibration process was developed using a ball, achieving fast and accurate multi-camera calibration. For details, you can also refer to [multiview_ball_calib](https://github.com/chenxinfeng4/multiview_ball_calib). Here, we only present the general process.

![ball move](https://github.com/chenxinfeng4/multiview_ball_calib/raw/main/src_images/ball_move.gif)
![3D camera space](https://github.com/chenxinfeng4/multiview_ball_calib/raw/main/src_images/cameras_3d_show.jpg)
![transform](https://github.com/chenxinfeng4/multiview_ball_calib/raw/main/src_images/transform_2D_3D.jpg)

## Why Use a Ball for Calibration
Calculating the extrinsic parameters (position and rotation angle) of multiple cameras is essential for establishing an accurate 3D coordinate model. Traditional checkerboard extrinsic calibration methods require multiple cameras to simultaneously capture the front pattern of the checkerboard, but in a surround multi-camera configuration, there are viewing angle limitations. The application efficiency of checkerboards is low, while using a ball is more efficient.

## Experimental Procedure
Create a metal target ball with a diameter of 1.5 cm, suspended by a short rod. Before the experiment, place a checkerboard on the ground at the center of the recording environment to align the coordinate system. Initially, place the target ball away from the checkerboard to avoid occlusion. Then, start recording and traverse the ball around the rat's activity space for 2 minutes. Use OBS Studio software to capture multi-view videos, ensuring the ball's motion trajectory covers the spatial positions that need calibration.

!!! warning "Important Warning"
    The ball's diameter affects calibration accuracy. It is recommended to use a metal target ball with a diameter of 1.5 cm. The ball's movement speed should not be too fast, otherwise motion blur will occur, affecting calibration accuracy.
    

## Video Analysis with Code
```bash
#!/bin/bash
conda activate mmdet
vfile='/PATH_to_ball/BALL____2024-01-22_14-34-01.mp4'
LILAB_DIR=/home/liying_lab/chenxf/ml-project/LILAB-py/lilab

bash $LILAB_DIR/multiview_scripts_dev/p_calibration.sh $vfile carl
```

Where `vfile` is the video file path recorded by OBS Studio software, and `carl` is the camera calibration parameter. The script will automatically analyze the video and generate calibration results.
Common camera calibration parameters include:
- `ana`: Rat Behavior Room 1
- `bob`: Rat Behavior Room 2 / Small Bucket
- `carl`: Rat Behavior Room 3 / Medium & Large Bucket.

!!! warning "Important Warning"
    Please check the correct camera calibration parameters, which store the pre-"calibrated memory". Each multi-camera system's memory differs significantly. Do not confuse them, otherwise it will lead to inaccurate calibration results.

## Calibration Result Display
Check the green prediction points' fit with the ball in the generated `*ball_keypoint.mp4`. The generated `*.calibpkl` is the multi-camera model file used for subsequent 3D reconstruction.

![ball_keypoint](../../../assets/images/ball_calibrated.jpg)

## Calibration Accuracy Evaluation
Check the code execution output. The `Reprojection errors` represent the reprojection error, which is the distance between the predicted point and the actual point. The smaller the error, the higher the calibration accuracy. Typically, it is allowed within `4.0+-2.0` pixels.

![ball_keypoint](../../../assets/images/ball_calibrated_precision.jpg)

!!! error "Error"
    If the output error pixel is too large when running p_calibration.sh/the green points in the keypoint video cannot correctly follow the ball, it indicates incorrect calibration. This could be due to a large deviation in 2D ball recognition. Re-labeling is required, see "Ball Augmentation Training".