# ball视频的扩增训练

### 截图

在pot player中进行截取，存放至统一位置
### 找回源视频截图
/home/liying_lab/chenxinfeng/ml-project/LILAB-py/lilab/outlier_refine/process_ball_dzy.sh



### 打标

使用labelme进行打标。这是个 labelme 标注后的 json 文件示例。
```
{
  "version": "4.2.5",
  "flags": {},
  "shapes": [
    {
      "label": "ball",
      "points": [
        [
          226.4642857142857,
          410.74999999999994
        ]
      ],
      "group_id": null,
      "shape_type": "point",
      "flags": {}
    }
  ],
  "imagePath": "2024-02-27_21-59-28ball_bob_room2_pannel8_002675.jpg",
  "imageData": null,
  "imageHeight": 800,
  "imageWidth": 1280
}
```
!!! warning "重要警告"
    请使用labelme的`point`类型，而不是`rectangle`类型，因为point类型可以更精确地标注小球的位置。标签命名为`ball`，请确保在打标时使用正确的标签名称。

### 把数据文件夹改名后放入指定位置
/home/liying_lab/chenxinfeng/DATA/mmpose/data/ball

### labelme格式转换
python -m lilab.cvutils.labelme_to_cocokeypoints_ball $LABEL_IMG_DIR

### 训练
/home/liying_lab/chenxinfeng/DATA/mmpose/res50_coco_ball_512x320_cam9.py
修改代码，将新增的数据文件夹和json文件地址添加进新的dict

```bash
cd /home/liying_lab/chenxinfeng/DATA/mmpose
python tools/train.py res50_coco_ball_512x320_cam9.py
```

### 模型加速
/home/liying_lab/chenxinfeng/ml-project/LILAB-py/lilab/mmpose_dev/convert_model.sh
修改对应的模型文件名到变量中



### 确认
/home/liying_lab/chenxinfeng/DATA/mmpose/work_dirs
中是否存在新的json等，以及latest.*的更新时间



### 重新从头运行小球定位代码
/home/liying_lab/chenxinfeng/ml-project/LILAB-py/lilab/multiview_scripts_dev/calibration.sh
