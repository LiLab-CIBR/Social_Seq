# 代码流程
> 开发者：xxx
> 维护：xxx

## 鼠身体区域预测
![mice_body_mask](/assets/images/mice_body_mask.jpg)

```bash
conda activate mmdet

# 进入工作目录
# cdw2l '\\liying.cibr.ac.cn\Data_Temp\Chenxinfeng\wpp'
cd /mnt/liying.cibr.ac.cn_wpp/

# 执行脚本，在当前目录下寻找所有的mp4文件，并预测
python -m lilab.mmdet_single.s1_mmdet_videos2pkl_single . \
    --config /home/liying_lab/chenxinfeng/DATA/CBNetV2/mask_rcnn_r101_fpn_2x_coco_onemice_816x512.py \
    --checkpoint /home/liying_lab/chenxinfeng/DATA/CBNetV2/work_dirs/mask_rcnn_r101_fpn_2x_coco_onemice_816x512/latest.trt
```

其中 `/mnt/liying.cibr.ac.cn_wpp/` 是待处理的视频的存放文件夹，需要用户更换。`mask_rcnn_r101_fpn_2x_coco_onemice_816x512.py` 是一个分割模型的配置文件，`latest.trt` 是模型的权重文件，建议用户不要更换。

!!!Note
    一次性不要跑太多视频。先跑几个视频试试看。效果佳，则可以接着运行剩下的视频。如果效果不佳，则要更新模型后，再重新跑视频。

!!! warning
    请正确填入工作路径。可以先用 `ls /mnt/liying.cibr.ac.cn_wpp/` 命令确认路径。如果无法使用 `cdw2l` 到工作目录，说明该群晖云盘的路径未被 mount，请联系管理员。

## 鼠头区域预测
头部区域重点显示
![mice_head_mask](/assets/images/mice_head_mask.jpg)
```bash
conda activate mmdet

# 进入工作目录
cd /mnt/liying.cibr.ac.cn_wpp/

# 执行脚本，在当前目录下寻找所有的mp4文件，并预测
python -m lilab.mmdet_single.s1_mmdet_videos2pkl_single . \
    --config /home/liying_lab/chenxinfeng/DATA/CBNetV2/mask_rcnn_r101_fpn_2x_coco_onemicehead_816x512.py \
    --checkpoint /home/liying_lab/chenxinfeng/DATA/CBNetV2/work_dirs/mask_rcnn_r101_fpn_2x_coco_onemicehead_816x512/latest.trt
```

