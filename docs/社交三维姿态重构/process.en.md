# Code Process

## Splitting Multiple Animals
<div class="image-row">
    <img src="../../../assets/images/rat_raw_video.jpg" alt="Raw Video">
    <img src="../../../assets/images/rat_mask_video.jpg" alt="Mask Video">
    <img src="../../../assets/images/rat_voxel_video.jpg" alt="Voxel Video">
</div>

```bash
# %% batch
# step0
# conda activate mmdet
source activate mmdet
vdir=`w2l '\liying.cibr.ac.cn\Data_Temp\Chenxinfeng\multiview_9\chenxf\00_BehaviorAnalysis-seq2seq\SexMating'`

# Select the ball calibration file (multi-camera model file) of the day to make the data have 3D information.
ball=`w2l "\\liying.cibr.ac.cn\Data_Temp\Chenxinfeng\multiview_9\chenxf\carl\2023-10-14-\ball_2023-10-23_13-18-10.calibpkl"`
config=/home/liying_lab/chenxinfeng/DATA/CBNetV2/mask_rcnn_r101_fpn_2x_coco_bwrat_816x512_cam9.py
python -m lilab.mmdet_dev_multi.s1_mmdet_videos2segpkl_dilate_toCUDA $vdir --pannels carl --config $config #--maxlen 9000
python -m lilab.mmdet_dev.s3_segpkl_dilate2videoseg_canvas_mask $vdir --maxlen 9000 # check video
# step2 com3d and create voxbox
ls $vdir/*.segpkl | xargs -n 1 -I {} -P 4 python -m lilab.mmdet_dev.s4_segpkl_put_com3d_pro {} --calibpkl "$ball"

# Draw voxel space video (optional, not recommended)
ls $vdir/*.segpkl | sed 's/.segpkl/.mp4/' | xargs -n 1 -P 8 -I {} python -m lilab.mmdet_dev.s4_segpkl_com3d_to_video {} --vox_size 230  # check video
```
Where `volsize` represents the side length of the rat's voxel space. For example, `xx_vol230.0.mp4` indicates a side length of 230mm. The side length varies according to the rat's age and gender. The recommended values are as follows:

|         | Male | Female |
| ------- | ---- | ------ |
| DAY35   | 190  | 190    |
| DAY50   | 230  | 220    |
| DAY75   | 250  | 240    |
| DAY adult | 260  | 240    |

Finally, a series of videos and files are obtained, including:

* `xx_mask.mp4` - Segmentation image
* `xx_vol230.0.mp4` - Voxel space
* `xx.segpkl` - Segmented Mask binary data

Verification: Open the `xx_mask.mp4` video to check if the segmentation is correct. Open the `xx_vol230.0.mp4` video to check if the voxel size matches.

!!! Note "Tip"
    Don't run too many videos at once. First, run a few videos to test. If the effect is good, you can continue running the remaining videos. If the effect is poor, you need to update the model and re-run the videos.

!!! error "Error"
    If the segmentation effect of `xx_mask.mp4` video is poor, you need to re-annotate the segmentation and update the model. See the data and model update section. If the voxel grid deviation of `xx_vol230.0.mp4` is large, it indicates that the ball calibration file is incorrect and needs to be recalibrated.

## Predict Key Points
<div class="image-row">
    <!-- <img src="/assets/images/rat_raw_video.jpg" alt="Raw Video"> -->
    <img src="../../../assets/images/rat_pose_video.jpg" alt="Mask Video">
    <!-- <img src="/assets/images/rat_voxel_video.jpg" alt="Voxel Video"> -->
</div>

```bash
#!/bin/bash
conda activate mmdet

cd /home/liying_lab/chenxinfeng/DATA/dannce/demo/rat14_1280x800x9_mono_young

# 1. Prepare data
volsize_vfiles="
280 280 /mnt/liying.cibr.ac.cn_Data_Temp/multiview_9/zhongzhenchao/CNTNAP2_KO/cntnap2pnd75room2/a/2023-12-21_15-42-11D1bC1w.segpkl
280 280 /mnt/liying.cibr.ac.cn_Data_Temp/multiview_9/zhongzhenchao/CNTNAP2_KO/cntnap2pnd75room2/a/2023-12-21_15-16-15C1bD1w.segpkl
280 280 /mnt/liying.cibr.ac.cn_Data_Temp/multiview_9/zhongzhenchao/CNTNAP2_KO/cntnap2pnd75room2/a/2023-12-21_14-32-25A1bB1w.segpkl
280 280 /mnt/liying.cibr.ac.cn_Data_Temp/multiview_9/zhongzhenchao/CNTNAP2_KO/cntnap2pnd75room2/a/2023-12-21_14-54-14B1bA1w.segpkl
280 280 /mnt/liying.cibr.ac.cn_Data_Temp/multiview_9/zhongzhenchao/CNTNAP2_KO/cntnap2pnd75room2/a/2023-12-20_16-45-22D1bB2w.segpkl
"

volsize_vfiles=$(echo "$volsize_vfiles" | grep -v '^[[:space:]]*$') #echo "$volsize_vfiles"
vfiles=$(echo "$volsize_vfiles" | awk '{print $3}')                 #echo "$vfiles"

# 2. Use DANNCE to predict 3D pose, nGPU=4
echo "$volsize_vfiles" | sed 's/.segpkl/.mp4/' | cat -n |
    xargs -P 4 -l bash -c 'python -m dannce.cli_trt ../../configs/dannce_rat14_1280x800x9_max_config.yaml --vol-size-list $1 $2 --video-file $3 --gpu-id $(($0%4))'
# xargs -P 2 means using 2 GPUs,配合 choosecuda 0,1,2,3 to confirm the number of GPUs used


# 3. Draw "unsmoothed" pose trajectories (optional)
# echo "$vfiles" | sed 's/.segpkl/.matcalibpkl/' | xargs -P 6 -l -r bash -c 'python -m lilab.mmpose.s3_matcalibpkl_2_video2d $0 --iview 3'

# 4. Draw smoothed pose trajectories
echo "$vfiles" | sed 's/.segpkl/.matcalibpkl/' | xargs -l -P 6 -r python -m lilab.smoothnet.s1_matcalibpkl2smooth_foot_dzy
echo "$vfiles" | sed 's/.segpkl/.smoothed_foot.matcalibpkl/' | xargs -P 6 -l -r bash -c 'python -m lilab.mmpose.s3_matcalibpkl_2_video2d $0 --iview 3 --postfix smoothed_foot '

# 4B Concatenate two views for drawing (optional)
# echo "$vfiles" | sed 's/.segpkl/.smoothed_foot.matcalibpkl/' | xargs -P 8 -l -r bash -c 'python -m lilab.mmpose.s3_matcalibpkl_2_video2d_2view $0 --postfix smoothed_foot'

# 5 Create 400p thumbnail video files (optional)
# bash /home/liying_lab/chenxinfeng/ml-project/LILAB-py/lilab/openlabcluster_postprocess/create_400p.sh \
#    /mnt/liying.cibr.ac.cn_Data_Temp/multiview_9/zhongzhenchao/CNTNAP2_KO/cntnap2pnd75room2/a
```

Where `volsize_vfiles` represents the configuration information of a video, which are the voxel size of the black rat (280), the voxel size of the white rat (280), and the segmentation file `*.segpkl` with the same name as the video. Using two different voxels can distinguish rats of different body types, such as females and males.

!!! Warning "Warning"
    Too small a voxel size may result in incomplete rat images, causing keypoints to go out of bounds. Too large a voxel size may result in blurred rat images, reducing accuracy.

Results obtained:

* `xx.smoothed_foot.matcalibpkl` - 3D keypoint sequences of two rats.
* `xx_3_sktdraw_smoothed_foot.mp4` - 3D keypoint video of two rats.
* `xx_400p.mp4` - 400x400 resolution compressed version of the smoothed_foot.mp4 file, reducing file size and response speed.

Verification: Open the `xx_3_sktdraw_smoothed_foot.mp4` video to check if the keypoint positions are correct. Save `xx.smoothed_foot.matcalibpkl` as it is an important file containing social 3D pose coordinates.

!!! error "Error"
    If the segmentation effect of the `xx_3_sktdraw_smoothed_foot.mp4` video is poor, you can check the segmentation video at the corresponding moment of the deviation and check the ball calibration file. The DANNCE model is generally very stable, while the MASK-RCNN segmentation model is easily affected by ambient light and background and needs to be frequently retrained. See the data and model update section.