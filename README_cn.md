# Social-Seq 项目 🐭

语言🌐：中文🇨🇳 | [**English**](README.md)

欢迎来到 Social-Seq 项目！这是一个用于解析动物密切接触时的多动物分类、三维姿态重构、社交类别识别、社交序列标签。通过构造实时闭环光遗传干预系统，该项目有望用于治疗孤独症（ASD）社交障碍。✨


<font color="red"><a href="https://lilab-cibr.github.io/Social_Seq/"><b>代码下载、文档和安装说明</b> 🔗</a></font>

<div align="center">
  <a href="https://lilab-cibr.github.io/Social_Seq/">
    <img src="docs/assets/images/figure_abstract.jpg" width="500" alt="摘要图">
  </a>
</div>


## 项目概述 📖

Social-Seq 项目旨在通过计算机视觉和机器学习技术，分析动物（特别是大鼠）在社交互动中的行为模式。项目包含从硬件系统安装到行为分析的完整流程，能够实现高精度的三维姿态重建和自动化行为分类。


### 1. 设备组装和数据采集 📷
采集高质量、高同步性的多视角视频，确保行为分析的数据质量。


![Fig1. 硬件系统安装](docs/assets/images/fig1_setup.jpg)


### 2. 社交三维姿态重构 ✨
实现两只大鼠的分割、关键点预测和平滑处理，获取稳定的3D姿态坐标。

![社交姿态重构流程](docs/assets/images/rat_social_pose_pipeline.jpg)

### 3. 社交行为标签识别 🏷️
获取大鼠社交一致性的36类行为标签，通过特征设计、聚类和一致性优化实现自动化行为分类。


![社交特征设计](docs/assets/images/fig2_behaviorAtlas.jpg)


### 4. 社交差异分析 📈
基于行为标签的分布，分析不同造模大鼠的行为差异。

![社交差异分析](docs/assets/images/Fig5_shank3_behavior_change.jpg)


### 5. 闭环行为控制 ⚡️
使用光遗传技术实现行为控制，通过实时行为分析，实现精准行为控制。

<div align="center">
  <img src="docs/assets/images/Fig7_closed-loop.jpg" width="500" alt="行为控制">
</div>

## 应用价值 💎

- **孤独症研究** 👶：为孤独症社交障碍的治疗提供技术支持
- **行为学分析** 📊：自动化、高精度的行为分类和分析
- **神经科学研究** 🧠：深入理解动物社交行为的神经机制

## 代码发布 📅
最后更新时间 2025-9-14，作者 ChenXinfeng

## 引用 📚
Xinfeng Chen; Xianming Tao; Zhenchao Zhong; Yuanqing Zhang; Yixuan Li; Ye Ouyang; Zhaoyi Ding; Min An; Miao Wang; Ying Li* (2025). Decoding the Valence of Developmental Social Behavior: Dopamine Governs Social Motivation Deficits in Autism. In preparation.

陈昕枫 (2025). 基于深度学习的动物自由社交行为分析研究. 博士论文，北京大学.

## 通讯作者 📬
李莹 (liying), 北京脑科学与类脑研究所, 北京, 中国