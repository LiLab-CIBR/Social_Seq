## 数据集制作&模型更新
> 开发者：xxx
> 维护：xxx

使用 labelme 标注。

请逐步执行以下命令：
```bash
# 1. 数据制备： label to coco
# su chenxinfeng
conda activate DEEPLABCUT

# 将labelme数据标注的文件夹项目重命名。
## 注意事项1：文件夹不要有中文，打标的图片不要有中文
## 注意事项2：打标的图片数量 n>20 为了保证训练效果
LABEL_ME_POJECT=/mnt/liying.cibr.ac.cn_wpp/labelimages
NEW_NAME=/mnt/liying.cibr.ac.cn_wpp/mice_816x512_20241211

mv $LABEL_ME_POJECT $NEW_NAME

# 将labelme数据标注的文件夹项目转换为coco数据集格式。
# 注意事项：类别的名字要去 MMDET_DATA_TARGET 里面看，不要自己乱写。
python -m lilab.cvutils.labelme_to_coco $NEW_NAME

# 将coco数据集拆分训练集和验证集。 -s 参数表示训练集的比例，0.8 或 0.9为常用。
python -m lilab.cvutils.coco_split -s 0.9 ${NEW_NAME}_trainval.json

# 拷贝打标数据集到 mmdet 的数据集目录下
MMDET_DATA_TARGET=/home/liying_lab/chenxinfeng/DATA/CBNetV2/data/mice_head
cp -r ${NEW_NAME}_trainval.json ${NEW_NAME}_train.json ${NEW_NAME}_val.json \
    mice_816x512_20241211        $MMDET_DATA_TARGET/

# 2. 模型训练
conda activate mmpose
cd /home/liying_lab/chenxinfeng/DATA/CBNetV2/

# 修改配置文件，使用vscode打开。
# 修改其中的 `data` 字段，指向刚刚拷贝的coco数据集目录。
CONFIG=$PWD/mask_rcnn_r101_fpn_2x_coco_onemicehead_816x512.py
echo $CONFIG

# 使用多 GPU 或单 GPU 训练模型
# tools/dist_train.sh $CONFIG 4
python tools/train.py $CONFIG

# 3. 模型加速
python -m lilab.mmdet_dev.convert_mmdet2trt $CONFIG

# 4. 查看模型是否更新成功
ls -lh work_dirs/mask_rcnn_r101_fpn_2x_coco_onemicehead_816x512/latest.*
```