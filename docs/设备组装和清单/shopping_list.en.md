# Equipment Assembly and List
Includes camera experimental box, experimental computer, and analysis server.

![OBS Studio](../../../assets/images/Fig_setup_computers.jpg)


<div class="video-item">
    <p class="video-legend">Video: Multi-camera behavioral recording setup</p>
    <video controls muted playsinline class="responsive-video" data-src="../../../assets/hls_videos/VideoS1_multicam_24092111/playlist.m3u8"></video>
</div>


## Camera Experimental Box
---
The table below lists all cameras and materials used in the camera experimental box.

| Name | Parameters | Quantity | Purchase Link |
| --- | --- | --- | --- |
| K1S293 Camera | 1280x800 resolution, 120fps, black and white | 9 | [Taobao Purchase Link](https://item.taobao.com/item.htm?abbucket=16&id=673966141469&mi_id=0000013g7j7UpaJ64Exz65IlngXWkLZ9sfelfsEn2X13zX8&ns=1&skuId=4847993832885&spm=a21n57.1.hoverItem.2&utparam=%7B%22aplus_abtest%22%3A%22f141c2e8af0beb2b17c50d6928369058%22%7D&xxc=taobaoSearch) |
| Aluminum Profile Bracket | Hexagonal, double-layer bracket | 1 | Self-processing - |
| PTZ and Slider | 9 units | 9 | [Taobao Purchase Link](https://detail.tmall.com/item.htm?ali_refid=a3_420434_1006%3A1235740172%3AH%3Ay5eWtaTmsQXaYHDf3rdNpw%3D%3D%3Acddb45a6e952fea324f7f8ca9b58a747&ali_trackid=282_cddb45a6e952fea324f7f8ca9b58a747&id=618612474440&mi_id=00000WXWJPD9KZGe1JIPbpopt1j0eW1dCgR9iqFt5cqPX7I&mm_sceneid=1_0_473760138_0&priceTId=214784b117552392607548476e139d&skuId=4589499395015&spm=a21n57.1.hoverItem.19&utparam=%7B%22aplus_abtest%22%3A%224f075094f900fbfd5878013dac96718e%22%7D&xxc=ad_ztc) |
| Red Light Illumination LED | Ambient light illumination | 6 | [Taobao Purchase Link](https://detail.tmall.com/item.htm?abbucket=16&id=894491969439&mi_id=0000gIiVlXkfMSs1hqx-2s6runtTm23KD83tPFYnpdfCihI&ns=1&priceTId=2147808d17552395078942562e1572&sku_properties=1627207%3A26922829615&spm=a21n57.1.hoverItem.2&utparam=%7B%22aplus_abtest%22%3A%22b7a00053266c2f6523b7c342bd40fbe4%22%7D&xxc=taobaoSearch) |
| Aluminum Oxide Calibration Board | Chessboard, camera calibration; Model GP290 12x9 | 1 |[Taobao Purchase Link](https://item.taobao.com/item.htm?abbucket=0&id=558737448467&ns=1&spm=a21n57.1.0.0.2699523cr0RQDF) |
| Metal Ball | For camera extrinsic calibration, diameter <2 cm | 1 | Any source |
| Acrylic Light Shield | Used to block background clutter and prevent image interference. Size according to experimental requirements. | 7 | [Taobao Purchase Link](https://item.taobao.com/item.htm?id=623132143028&spm=tbpc.boughtlist.suborder_itemtitle.1.5cb72e8dIZHSFZ) |

!!! note "Tips"
    - The appropriate focal length of the camera lens needs to be tested by yourself. Factors such as camera distance and experimental arena size will affect the choice of focal length.
    - It is recommended to let the camera manufacturer provide different software identifiers (different names) for each camera.
    - Sliders are not that necessary, as the field of view can be adjusted by focal length. However, the camera gimbal head is necessary to adjust the camera angle.
    - Red light illumination LEDs are placed at the 6 corners of around the arena for even illumination. Otherwise, a single light source can easily cause image shadows, leading to reduced accuracy in subsequent image analysis. The light intensity is controled to achieve a final illumination of about 20 lux.

!!! error "Error"
    Do not connect cameras directly to the computer's USB port, as the motherboard's USB bandwidth is severely limited and cannot connect multiple cameras simultaneously. Please use a professional-grade PCIE-USB expansion card (U3412U)!!

## Experimental Computer Hardware Configuration
Used for collecting multi-camera video data and recording videos using OBS Studio.

| Name | Model | Notes |
| ---- | ---- | ---- | 
| Operating System | Windows 10 | - |
| CPU | Intel Core i7-12700 | - |
| GPU | NVIDIA RTX 3060 | OBS Studio calls its HEVC video encoder |
| Memory | 32GB DDR4 3200MHz | - |
| Storage | SSD 1TB; HDD 8TB | - |
| PCIE-USB Expansion Card | Shenzhen Susuyou Technology [U3412U](https://item.taobao.com/item.htm?abbucket=16&id=658885755395&mi_id=0000iSwRLbEyAYBCJVYfM0f7ww3y3O_0bG8EWEWZGVaHbrs&ns=1&priceTId=2147836c17552404402055026e123c&skuId=4746490928189&spm=a21n57.1.hoverItem.2&utparam=%7B%22aplus_abtest%22%3A%22bc9d0ba5e6325e017beba457917b9061%22%7D&xxc=taobaoSearch), 6-port USB | Highly recommended, quantity x2 |


## Cloud Computing Platform Hardware Configuration
Used for training models, inference models; data analysis, visualization; cloud computing platform for closed-loop behavioral intervention.

| Name | Model | Notes |
| ---- | ---- | ---- | 
| Manufacturer | Inspur | - |
| Operating System | Ubuntu 18.04 | - |
| CPU | Intel Xeon 4314 dual | Dual CPU |
| GPU | NVIDIA RTX 3090 | Quantity x4 |
| Memory | 256GB DDR4 3200MHz | - |
| Storage | SSD 1TB; HDD 8TB | - |


## (Optional) Cloud Storage Hardware (NAS) Configuration
Used for storing large amounts of experimental video data and analysis results, and supporting simultaneous access by multiple users.

| Name | Model | Notes |
| ---- | ---- | ---- | 
| Synology 1 | DS2419+, 96 TB| - |
| Synology 2 | RS2821RP+, 200 TB | - |

<script src="https://cdnjs.cloudflare.com/ajax/libs/hls.js/1.5.8-0.canary.10141/hls.light.min.js"></script>
<script src="../../../assets/js/hls.js"></script>
<script src="../../../assets/js/video-player.js"></script>
