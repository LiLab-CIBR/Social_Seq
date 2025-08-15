# 设备组装和清单
包含相机实验箱，实验电脑，分析服务器。

<div align="center">
  <img src="../../assets/images/Fig_setup_computers.jpg" width="500" alt="ball_keypoint">
</div>

视频教程：xxx

## 相机实验箱
---
表格中列出了相机实验箱中使用的所有相机和材料。

| 名称 | 参数 | 数量 | 购买链接 |
| --- | --- | --- | --- |
| K1S293 相机 | 1280x800分辨率，120fps，黑白 | 9 | [淘宝购买链接](https://item.taobao.com/item.htm?abbucket=16&id=673966141469&mi_id=0000013g7j7UpaJ64Exz65IlngXWkLZ9sfelfsEn2X13zX8&ns=1&skuId=4847993832885&spm=a21n57.1.hoverItem.2&utparam=%7B%22aplus_abtest%22%3A%22f141c2e8af0beb2b17c50d6928369058%22%7D&xxc=taobaoSearch) |
| 铝型材支架 | 六边形，双层支架 | 1 | 自行加工- |
| 云台和滑轨 | 9个 | 9 | [淘宝购买链接](https://detail.tmall.com/item.htm?ali_refid=a3_420434_1006%3A1235740172%3AH%3Ay5eWtaTmsQXaYHDf3rdNpw%3D%3D%3Acddb45a6e952fea324f7f8ca9b58a747&ali_trackid=282_cddb45a6e952fea324f7f8ca9b58a747&id=618612474440&mi_id=00000WXWJPD9KZGe1JIPbpopt1j0eW1dCgR9iqFt5cqPX7I&mm_sceneid=1_0_473760138_0&priceTId=214784b117552392607548476e139d&skuId=4589499395015&spm=a21n57.1.hoverItem.19&utparam=%7B%22aplus_abtest%22%3A%224f075094f900fbfd5878013dac96718e%22%7D&xxc=ad_ztc) |
| 红光照明LED | 环境光照明 | 6 | [淘宝购买链接](https://detail.tmall.com/item.htm?abbucket=16&id=894491969439&mi_id=0000gIiVlXkfMSs1hqx-2s6runtTm23KD83tPFYnpdfCihI&ns=1&priceTId=2147808d17552395078942562e1572&sku_properties=1627207%3A26922829615&spm=a21n57.1.hoverItem.2&utparam=%7B%22aplus_abtest%22%3A%22b7a00053266c2f6523b7c342bd40fbe4%22%7D&xxc=taobaoSearch) |
| 氧化铝标定板 |  棋盘，相机标定；型号GP290 12x9 | 1 |[淘宝购买链接](https://item.taobao.com/item.htm?abbucket=0&id=558737448467&ns=1&spm=a21n57.1.0.0.2699523cr0RQDF) |
| 金属小球 | 用于相机外参标定，直径 <2 cm | 1 | 随便找 |
| 亚克力遮光板 | 用于遮挡背景杂物，防止图像干扰。尺寸根据实验需求。 | 7 | [淘宝购买链接](https://item.taobao.com/item.htm?id=623132143028&spm=tbpc.boughtlist.suborder_itemtitle.1.5cb72e8dIZHSFZ) |

注意事项：
- 相机的镜头合适焦距需要自己测试，相机远近、试验箱大小等因素会影响焦距选择。
- 建议让相机厂家给每个相机不同的软件标志符（不同命名），方便区分。
- 滑轨不是那么必要，因为可以用焦距来调整相机拍摄视野。但是云台是必要的，因为需要调整相机的角度。
- 红光照明LED放在支架6个角落上，均匀照明。否则单一光源容易导致图像阴影，导致后续动物分析精度下降。灯光强度较高，需要用遮挡一部分，使得最后的光照在20lux左右。
- 相机不要直连电脑的USB口，因为主板的USB带宽严重受限，不能同时连多相机。请使用专业级PCIE-USB拓展卡（U3412U）！！

## 实验电脑硬件配置
用于采集多相机视频数据，并使用OBS Studio进行视频录制。

| 名称 | 型号 | 备注 |
| ---- | ---- | ---- | 
| 操作系统 | Windows 10 | - |
| CPU | Intel Core i7-12700 | - |
| GPU | NVIDIA RTX 3060 | OBS Studio调用其 HEVC 视频编码器 |
| 内存 | 32GB DDR4 3200MHz | - |
| 存储 | SSD 1TB; HDD 8TB | - |
| PCIE-USB 拓展卡 | 深圳市速速优科技[U3412U](https://item.taobao.com/item.htm?abbucket=16&id=658885755395&mi_id=0000iSwRLbEyAYBCJVYfM0f7ww3y3O_0bG8EWEWZGVaHbrs&ns=1&priceTId=2147836c17552404402055026e123c&skuId=4746490928189&spm=a21n57.1.hoverItem.2&utparam=%7B%22aplus_abtest%22%3A%22bc9d0ba5e6325e017beba457917b9061%22%7D&xxc=taobaoSearch)， 6口USB | 强烈推荐，数量x2 |


## 云计算平台硬件配置
用于训练模型，推理模型；数据分析，可视化；闭环行为干预的云计算平台。

| 名称 | 型号 | 备注 |
| ---- | ---- | ---- | 
| 厂家  | 浪潮 | - |
| 操作系统 | Ubuntu 18.04 | - |
| CPU | Intel Xeon 4314 dual | 双路CPU |
| GPU | NVIDIA RTX 3090 | 数量x4 |
| 内存 | 256GB DDR4 3200MHz | - |
| 存储 | SSD 1TB; HDD 8TB | - |


## （可选）云存储硬件（NAS）配置
用于存储大量实验视频数据和分析结果，并支持多用户同时访问。

| 名称 | 型号 | 备注 |
| ---- | ---- | ---- | 
| 群辉1 | DS2419+， 96 TB| - |
| 群辉2 | RS2821RP+， 200 TB | - |
