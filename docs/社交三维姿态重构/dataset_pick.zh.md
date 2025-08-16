# 数据集制作时
## 1. 分割图片选取
方法1，只挑选错误帧打标，这样效率比较高。使用Potplayer 播放 `*_mask.mp4`，截图错误帧，进行截取，存放至统一位置。分错误视角并根据左上角帧数找回源视频。
方法2，随机抽取指定数目的帧并随机截取一个视角，效率比较低。
可以参考：
/home/liying_lab/chenxinfeng/ml-project/LILAB-py/lilab/outlier_refine/process_mmdet_dzy.sh

## 1. 图片打标
淘宝

