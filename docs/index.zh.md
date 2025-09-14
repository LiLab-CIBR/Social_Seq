# 欢迎来到 Social-Seq 项目

这是 Social-Seq 项目的一些说明文档。使用 Social-seq 解析动物密切接触时的三维姿态，社交类别，以及社交背后的情绪状态。通过构造实时行为分类系统，有望治疗孤独症（ASD）社交障碍。


- 项目文档 📚：[https://lilab-cibr.github.io/Social_Seq/](https://lilab-cibr.github.io/Social_Seq/)

<div align="center">
  <img src="assets/images/figure_abstract.jpg" width="500" alt="抽象图">
</div>
<br>

## 包含内容
* [**文章图表复现**](./figure_reproduction): 下载代码以复现论文中的图表。
* [**安装示例流程代码**](./安装示例流程代码/pipeline_playground_installation/): 通过 Docker 镜像，快速安装运行项目核心代码。
* [**设备组装和清单**](./设备组装和清单/shopping_list): 组装多相机系统，获取设备清单和服务器配置。
* [**小球矫正**](./小球矫正/application): 标定多相机系统的空间坐标系。
* [**社交三维姿态计算(SOCIAL)**](./社交三维姿态重构/application): 使用Mask R-CNN, DANNCE, SmoothNet 分割大鼠轮廓，获取社交三维姿态。
* [**社交序列标签(SEQ)**](./社交序列标签/application): 获取大鼠社交一致性的36类行为标签。
* [**闭环行为控制(LIVE)**](./闭环行为控制/application): 实时识别的社交标签触发光遗传条件刺激，强化 ASD 大鼠社交行为。

## 代码发布 📅
最后更新时间 2025-9-14，作者 陈昕枫。

## 引用 📚
Xinfeng Chen*; Xianming Tao*; Zhenchao Zhong*; Yuanqing Zhang; Yixuan Li; Ye Ouyang; Zhaoyi Ding; Min An; Miao Wang; Ying Li# (2025). Decoding the Valence of Developmental Social Behavior: Dopamine Governs Social Motivation Deficits in Autism. *Under review*.

陈昕枫 (2025). 基于深度学习的动物自由社交行为分析研究. 博士论文，北京大学.

## 开源许可证
本项目采用 MIT 许可证开源。您可以在遵守许可证条款的前提下自由使用、修改和分发本项目的代码。

## 通讯作者 📬
- 李莹：liying
