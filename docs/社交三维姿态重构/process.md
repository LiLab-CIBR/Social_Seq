# 代码流程
> 开发者：xxx
> 维护：xxx

## 分割多动物
<div class="image-row">
    <img src="/assets/images/rat_raw_video.jpg" alt="Raw Video">
    <img src="/assets/images/rat_mask_video.jpg" alt="Mask Video">
    <img src="/assets/images/rat_voxel_video.jpg" alt="Voxel Video">
</div>

```bash
# %% batch
# step0
# conda activate mmdet
source activate mmdet
vdir=`w2l '\\liying.cibr.ac.cn\Data_Temp\Chenxinfeng\multiview_9\chenxf\00_BehaviorAnalysis-seq2seq\SexMating'`

# 选择当天的小球矫正文件（多相机模型文件），使数据具有3D信息。
ball=`w2l "\\liying.cibr.ac.cn\Data_Temp\Chenxinfeng\multiview_9\chenxf\carl\2023-10-14-\ball_2023-10-23_13-18-10.calibpkl"`
config=/home/liying_lab/chenxinfeng/DATA/CBNetV2/mask_rcnn_r101_fpn_2x_coco_bwrat_816x512_cam9.py
python -m lilab.mmdet_dev_multi.s1_mmdet_videos2segpkl_dilate_toCUDA $vdir --pannels carl --config $config #--maxlen 9000
python -m lilab.mmdet_dev.s3_segpkl_dilate2videoseg_canvas_mask $vdir --maxlen 9000 # check video
# step2 com3d and create voxbox
ls $vdir/*.segpkl | xargs -n 1 -I {} -P 4 python -m lilab.mmdet_dev.s4_segpkl_put_com3d_pro {} --calibpkl "$ball"

# 绘制体素空间的视频（可选，不推荐）
ls $vdir/*.segpkl | sed 's/.segpkl/.mp4/' | xargs -n 1 -P 8 -I {} python -m lilab.mmdet_dev.s4_segpkl_com3d_to_video {} --vox_size 230  # check video
```
其中 `volsize` 表示大鼠体素空间的边长，例如 `xx_vol230.0.mp4`表示边长为230mm。边长根据大鼠年龄和性别而定，推荐值如下：

|         | Male | Female |
| ------- | ---- | ------ |
| DAY35   | 160  | 160    |
| DAY50   | 190  | 180    |
| DAY75   | 220  | 200    |
| DAY成年 | 230  | 210    |

最后得到一系列视频和文件，包括：

* `xx_mask.mp4` - 分割图像
* `xx_vol230.0.mp4` - voxel 体素空间
* `xx.segpkl` - 分割的Mask 二进制数据

验证：打开 `xx_mask.mp4` 视频，查看分割是否正确。打开 `xx_vol230.0.mp4` 视频，查看 voxel 体素尺寸是否匹配。

!!! Note "提示"
    一次性不要跑太多视频。先跑几个视频试试看。效果佳，则可以接着运行剩下的视频。如果效果不佳，则要更新模型后，再重新跑视频。

!!! error "错误"
    如果开 `xx_mask.mp4` 视频分割效果差，则需要重修分割标注，更新模型。见数据与模型更新章节。如果 `xx_vol230.0.mp4` 体素方格偏差较大，说明小球矫正的文件有错误，需要从新矫正。

## 预测关键点
<div class="image-row">
    <!-- <img src="/assets/images/rat_raw_video.jpg" alt="Raw Video"> -->
    <img src="/assets/images/rat_pose_video.jpg" alt="Mask Video">
    <!-- <img src="/assets/images/rat_voxel_video.jpg" alt="Voxel Video"> -->
</div>

```bash
#!/bin/bash
conda activate mmdet

cd /home/liying_lab/chenxinfeng/DATA/dannce/demo/rat14_1280x800x9_mono_young

# 1. 准备数据
volsize_vfiles="
280 280 /mnt/liying.cibr.ac.cn_Data_Temp/multiview_9/zhongzhenchao/CNTNAP2_KO/cntnap2pnd75room2/a/2023-12-21_15-42-11D1bC1w.segpkl
280 280 /mnt/liying.cibr.ac.cn_Data_Temp/multiview_9/zhongzhenchao/CNTNAP2_KO/cntnap2pnd75room2/a/2023-12-21_15-16-15C1bD1w.segpkl
280 280 /mnt/liying.cibr.ac.cn_Data_Temp/multiview_9/zhongzhenchao/CNTNAP2_KO/cntnap2pnd75room2/a/2023-12-21_14-32-25A1bB1w.segpkl
280 280 /mnt/liying.cibr.ac.cn_Data_Temp/multiview_9/zhongzhenchao/CNTNAP2_KO/cntnap2pnd75room2/a/2023-12-21_14-54-14B1bA1w.segpkl
280 280 /mnt/liying.cibr.ac.cn_Data_Temp/multiview_9/zhongzhenchao/CNTNAP2_KO/cntnap2pnd75room2/a/2023-12-20_16-45-22D1bB2w.segpkl
"

volsize_vfiles=$(echo "$volsize_vfiles" | grep -v '^[[:space:]]*$') #echo "$volsize_vfiles"
vfiles=$(echo "$volsize_vfiles" | awk '{print $3}')                 #echo "$vfiles"

# 2. 用DANNCE 预测得到3D姿态
echo "$volsize_vfiles" | sed 's/.segpkl/.mp4/' | cat -n |
    xargs -P 4 -l bash -c '/home/liying_lab/chenxinfeng/.conda/envs/mmdet/bin/dannce-predict-video-trt ../../configs/dannce_rat14_1280x800x9_max_config.yaml --vol-size-list $1 $2 --video-file $3 --gpu-id $(($0%3))'
# xargs -P 2 表示使用2个GPU，配合 choosecuda 0,1,2,3 确认使用gpu数量


# 3. 绘制“未平滑”的姿态轨迹 （可选）
# echo "$vfiles" | sed 's/.segpkl/.matcalibpkl/' | xargs -P 6 -l -r bash -c 'python -m lilab.mmpose.s3_matcalibpkl_2_video2d $0 --iview 3'

# 4. 绘制平滑后的姿态轨迹
echo "$vfiles" | sed 's/.segpkl/.matcalibpkl/' | xargs -l -P 6 -r python -m lilab.smoothnet.s1_matcalibpkl2smooth_foot_dzy
echo "$vfiles" | sed 's/.segpkl/.smoothed_foot.matcalibpkl/' | xargs -P 6 -l -r bash -c 'python -m lilab.mmpose.s3_matcalibpkl_2_video2d $0 --iview 3 --postfix smoothed_foot '

# 4B 将两个视角串连绘制 （可选）
# echo "$vfiles" | sed 's/.segpkl/.smoothed_foot.matcalibpkl/' | xargs -P 8 -l -r bash -c 'python -m lilab.mmpose.s3_matcalibpkl_2_video2d_2view $0 --postfix smoothed_foot'

# 5 创建400p 缩略视频文件（可选）
# bash /home/liying_lab/chenxinfeng/ml-project/LILAB-py/lilab/openlabcluster_postprocess/create_400p.sh \
#    /mnt/liying.cibr.ac.cn_Data_Temp/multiview_9/zhongzhenchao/CNTNAP2_KO/cntnap2pnd75room2/a
```

其中 `volsize_vfiles` 表示一个视频的配置信息，分别是黑鼠的voxelsize(280), 白鼠的voxelsize(280) 和视频同名的分割文件 `*.segpkl`。用两个不同的voxel，可以区分不同体型的鼠，例如雌性与雄性。

!!! Warning "警告"
    太小的voxelsize 可能采集的大鼠图像不完整，让关键点越界。太大的voxelsize可能采集的大鼠图像太模糊，降低精度。

得到结果：

* `xx.smoothed_foot.matcalibpkl` - 两只鼠的3D关键点序列。
* `xx_3_sktdraw_smoothed_foot.mp4` - 两只鼠的3D关键点视频。
* `xx_400p.mp4` - smoothed_foot.mp4 文件的 400x400 分辨率压缩，减少文件大小和响应速度。

验证：打开 `xx_3_sktdraw_smoothed_foot.mp4` 视频，查看关键点位置是否正确。保存好`xx.smoothed_foot.matcalibpkl`，这是包含社交三维姿态坐标的重要文件。

!!! error "错误"
    如果开 `xx_3_sktdraw_smoothed_foot.mp4` 视频分割效果差，可以检查偏差对应时刻的分割视频，意见检查小球矫正文件。DANNCE模型一般来说非常稳定，MASK-RCNN 分割模型容易收到环境光和背景影响，需要经常加训。见数据与模型更新章节。

