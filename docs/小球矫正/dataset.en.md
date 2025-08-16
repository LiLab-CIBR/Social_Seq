# Ball Video Augmentation Training

### Screenshot

Capture screenshots in pot player and store them in a unified location.

### Retrieve Source Video Screenshots
/home/liying_lab/chenxinfeng/ml-project/LILAB-py/lilab/outlier_refine/process_ball_dzy.sh



### Labeling

Use labelme for labeling. This is an example of a labelme annotated json file.
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
!!! warning "Important Warning"
    Please use labelme's `point` type, not `rectangle` type, as the point type can more accurately label the ball's position. The label should be named `ball`. Please ensure the correct label name is used during labeling.

### Rename the Data Folder and Place it in the Specified Location
/home/liying_lab/chenxinfeng/DATA/mmpose/data/ball

### labelme Format Conversion
python -m lilab.cvutils.labelme_to_cocokeypoints_ball $LABEL_IMG_DIR

### Training
/home/liying_lab/chenxinfeng/DATA/mmpose/res50_coco_ball_512x320_cam9.py
Modify the code to add the new data folder and json file address to the new dict.

```bash
cd /home/liying_lab/chenxinfeng/DATA/mmpose
python tools/train.py res50_coco_ball_512x320_cam9.py
```

### Model Acceleration
/home/liying_lab/chenxinfeng/ml-project/LILAB-py/lilab/mmpose_dev/convert_model.sh
Modify the corresponding model filename to the variable.



### Confirmation
Check if there are new json files, etc. in /home/liying_lab/chenxinfeng/DATA/mmpose/work_dirs and the update time of latest.*



### Re-run the Ball Positioning Code from Scratch
/home/liying_lab/chenxinfeng/ml-project/LILAB-py/lilab/multiview_scripts_dev/calibration.sh
