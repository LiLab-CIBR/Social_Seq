# 小球矫正概述
*参考 "[安装示例代码 > 游乐场](../../安装示例流程代码/pipeline_playground_installation/)"，运行完整代码。*

<div class="video-item">
    <p class="video-legend">视频: 多相机小球外参矫正</p>
    <video controls muted playsinline style="width: 480px;" data-src="../../assets/hls_videos/VideoS2_calibrateion_24081618/playlist.m3u8"></video>
</div>

<br>
使用小球开发的小球标定流程，实现了快速精准的多相机标定。详细内容也可以参考 [multiview_ball_calib](https://github.com/chenxinfeng4/multiview_ball_calib)。这里只介绍大致的流程。



<div style="display: flex; justify-content: space-between; align-items: center;">
    <div style="flex: 1; margin-right: 5px; min-width: 0;">
        <video autoplay muted loop playsinline style="width: 100%; height: auto;">
        <source src="../../assets/videos/ball_move.mp4" type="video/mp4">
        您的浏览器不支持视频标签。
        </video>
    </div>
    <div style="flex: 1; margin-left: 5px; min-width: 0;">
        <img src="../../assets/images/cameras_3d_show.jpg" alt="3D camera space" style="width: 100%; height: auto;">
    </div>
</div>
![transform](../../assets/images/transform_2D_3D.jpg)

## 为什么需要用小球来标定
多相机外参的计算（位置和旋转角度）对于建立准确的三维坐标模型是必需的。传统的棋盘外参标定方法要求多个相机能够同时拍摄到棋盘的正面图案，但在环绕式多相机配置中，存在视角限制。因此棋盘的应用效率较低，而使用小球的效率更高。

具体的标定流程请参考下一章节。

<script src="https://cdnjs.cloudflare.com/ajax/libs/hls.js/1.5.8-0.canary.10141/hls.light.min.js"></script>
<script src="../../assets/js/hls.js"></script>
<script src="../../assets/js/video-player.js"></script>
