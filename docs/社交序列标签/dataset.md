# 从零制作社交聚类的模板
## 从关键点文件+视频到社交特征和行为标签
在进行“社交三维姿态重构”之后，应该会有 “*smoothed_foot.matcalibpkl” 关键点文件和“*_sktdraw_smoothed_foot.mp4” 视频文件。

将所有这两类视频和数据文件拷贝到一个文件夹中。执行下面命令，将逐次 `计算社交特征 - 富集近距离社交并拆分片段 - Seq2Seq模型抽提社交的时空特征 - 社交Cluster - 绘制视频`。

请将该代码逐行运行。

```bash
#!/bin/bash
conda activate OpenLabCluster

# 代码存放的路径 （by陶现明）
cd /DATA/taoxianming/rat/script/openlabcluster/pc_feats41_DecSeqCluster_better_20231102

pathFeats=/mnt/liying.cibr.ac.cn_Data_Temp/multiview_9/chenxf/Shank3HETxWT_202309/MM_FF

# ResPath 不要用云盘，文件太琐碎，使用云盘慢
bhvResPath=~/DATA/Shank3HETxWT_202309_MM_FF_openlabcluster
today=2023-11-09  ##always date format
mkdir -p $bhvResPath

## create 400p
bash /home/liying_lab/chenxinfeng/ml-project/LILAB-py/lilab/openlabcluster_postprocess/create_400p.sh $pathFeats

## Calculate raw features
python 01_1_feats41fromPoints-IDswitch_mp.py $pathFeats

## minmax and get close segments
python 01_2_featsMM_clipsInCloseSegs_mp.py $pathFeats

python 02_1_prepare_featureFiles_forOpenLabCluster.py $pathFeats $bhvResPath

## split train:test=9:1
python 02_2_makeProject_trainTest.py $bhvResPath $today

## training Seq2Seq
gpuID=0
python 02_3_seq2seq_training-decSeq.py $bhvResPath $gpuID $today

## behavior clustering
python 03_1_decSeqFeats_PCA-balanceCluster.py $bhvResPath $today

## Dec features in space, colored by cluster NO
python 03_2_plot_decSeqFeatsPCS-trajectoryColorByLabels.py $bhvResPath $today

## plot mp4 videos of each behavior cluster
python 04_1_plot_decSeqCluster-Videos.py $pathFeats $bhvResPath $today

## get behavior cluster sequence of each video
python 04_2_getBhvClusterSeqs_eachVideo.py $pathFeats $bhvResPath $today
```

得到 `*_sequences.pkl` 和 `*_bio_labels.npz` 两个行为视频标签文件;`FWPCA*_blackFirst/svm_clu*_400p.mp4` 每类行为对应的视频文件。

## 绘图 & 计算主被动一致性
请将该代码逐行运行。

```bash
#!/bin/bash
conda activate mmdet
cd /mnt/liying.cibr.ac.cn_Data_Temp/multiview_9/chenxf/00_BehaviorAnalysis-seq2seq/SexAge/Day55_Mix_analysis/SexAgeDay55andzzcWTinAUT_MMFF/result32/

## 1. 合并文件，生成 clippredpkl 文件
python -m lilab.openlabcluster_postprocess.s1_merge_3_file . 

## 2. Embedding 的 UMAP 与 Kmeans 边界
python -m lilab.openlabcluster_postprocess.s2_decisionBoundary_masaik_plot *.clippredpkl

## 3A. Kmeans 层次聚类
# 准备工作。首先先给每个cluster取名字. 打开该脚本，把 类别名称 贴在脚本中；运行。最终，类别名称就添加到来 *.clippredpkl。
# python -m lilab.openlabcluster_postprocess.s3a_cluster_givename_mergefile *.clippredpkl 

## 3B. 或者暂时不标准类命
python -m lilab.openlabcluster_postprocess.s3a_cluster_givename_mergefile *.clippredpkl --auto-label

## 4. 然后运行层次聚类的画图
python -m lilab.openlabcluster_postprocess.s3b_hiecluster_plot *.clippredpkl &
python -m lilab.openlabcluster_postprocess.s3b_hiecluster_plot_pro *.clippredpkl &

## 5. Mirror 或 Mutual 类别的界定
python -m lilab.openlabcluster_postprocess.s3c_mirror_mutual_matrix_plot *.clippredpkl

## 6.可以合并标签。比如主被动，比如树状图相邻的类。[可选，不建议]
# 准备工作。打开该脚本，把可以合并的类别 写在脚本中；运行。最终，类别名称的合并就添加到来 *.clippredpkl。
# python -m lilab.openlabcluster_postprocess.s3a2_cluster_nodemerge *.clippredpkl

## 7. 可选绘图。Moseq-like Motif 的绘制
# 需要找到原始的关键点坐标文件（都存放在SmoothFootPkl_DIR文件夹），才能绘制。运行下面代码。在同级目录下，会生成 motifshowmulti 的结果文件夹。
SmoothFootPkl_DIR=/A/B/C
python -m lilab.openlabcluster_postprocess.s4_moseq_like_motif_plot *.clippredpkl $SmoothFootPkl_DIR
```

## 利用主被动一致性，采用 Active-Learning 优化聚类

```bash
conda activate mmdet

# 更换目录到 kmeans 聚类结果路径
cd /mnt/liying.cibr.ac.cn_Data_Temp/multiview_9/chenxf/00_BehaviorAnalysis-seq2seq/SexAge/Day55_Mix_analysis/SexAgeDay55andzzcWTinAUT_MMFF/result32/

#1. 重新计算镜像，并导出镜像类别矩阵热图 & 镜像表
python -m lilab.OpenLabCluster_train.a0_mirror_mutual_matrix_plot *.clippredpkl

#2. 筛选 representitives 片段，成为新的 clippredpkl
python -m lilab.OpenLabCluster_train.a1_mirror_mutual_filt_clippredpkl *.clippredpkl
cd ./representitive_*_filt_perc*

#3. 之前无监督的常规分析流程 -- 画图检查一遍
#3-1. Embedding 的 UMAP 与 Kmeans 边界
python -m lilab.openlabcluster_postprocess.s2_decisionBoundary_masaik_plot *.clippredpkl
#3-2. 然后运行层次聚类的画图
python -m lilab.openlabcluster_postprocess.s3b_hiecluster_plot_pro *.clippredpkl
#3-3. Mirror 或 Mutual 类别的界定
python -m lilab.openlabcluster_postprocess.s3c_mirror_mutual_matrix_plot *.clippredpkl

#B1. 创建 openlabcluster semi_seq2seq 项目，从seq2seq里面拷贝出来
conda activate OpenLabCluster

PROJECT_SEQ2SEQ=/DATA/taoxianming/rat/data/Mix_analysis/SexAgeDay55andzzcWTinAUT_MMFF/result32_k36/feats32-2024-04-11
PROJECT_REPR=/mnt/liying.cibr.ac.cn_Data_Temp/multiview_9/chenxf/00_BehaviorAnalysis-seq2seq/SexAge/Day55_Mix_analysis/SexAgeDay55andzzcWTinAUT_MMFF/result32_k36

PROJECT_SEMISEQ2SEQ=`python -m lilab.OpenLabCluster_train.a2_semiseqseq_data_prepare $PROJECT_REPR  $PROJECT_SEQ2SEQ`
cd $PROJECT_SEMISEQ2SEQ
#B2. 初始化 seq2seq
python -m lilab.OpenLabCluster_train.a3_semiseqseq_init_train_seqseq $PROJECT_SEMISEQ2SEQ --epoch 3

#第一次迭代，从seq2seq 到semiseq2seq
# PROJECT_SEMISEQ2SEQ=/DATA/taoxianming/rat/data/Mix_analysis/SexAgeDay55andzzcWTinAUT_MMFF/result32/semiseq2seq_iter0
# PROJECT_REPR=/mnt/liying.cibr.ac.cn_Data_Temp/multiview_9/chenxf/00_BehaviorAnalysis-seq2seq/SexAge/Day55_Mix_analysis/SexAgeDay55andzzcWTinAUT_MMFF/result32/representitive_*_filt_perc*
PROJECT_SEMISEQ2SEQ=/DATA/taoxianming/rat/data/Mix_analysis/SexAgeDay55andzzcWTinAUT_MMFF/result32_k36/semiseq2seq_iter1
python -m lilab.OpenLabCluster_train.a5b_export_latent_repr  $PROJECT_REPR  $PROJECT_SEMISEQ2SEQ  --modeltype SemiSeq2SeqLite  #--modeltype SemiSeq2SeqLite 默认不选

# 使用 SemiSeq2Seq 模型训练标签识别
python -m lilab.OpenLabCluster_train.a4_semiseqseq_train $PROJECT_SEMISEQ2SEQ --epoch 5 --iter-now 0 --modeltype SemiSeq2SeqLite
# 根据 SemiSeq2Seq 模型预测所有片段的标签
python -m lilab.OpenLabCluster_train.a5_export_latent_iter_repr $PROJECT_REPR $PROJECT_SEMISEQ2SEQ --epoch 5 --iter 0 --modeltype SemiSeq2SeqLite
# 从片段集中筛选出的 representative 标签，生成新的数据集
python -m lilab.OpenLabCluster_train.a2a_clippredfile_refine $PROJECT_SEMISEQ2SEQ/output/semisupervise-decSeq-iter0-epoch5/*.clippredpkl $PROJECT_REPR/*.clippredpkl
python -m lilab.OpenLabCluster_train.a2b_iter_data_prepare $PROJECT_REPR $PROJECT_SEMISEQ2SEQ --epoch 5 --iter-from 0 #create new data for iter1


#开始iter
python -m lilab.OpenLabCluster_train.a4_semiseqseq_train $PROJECT_SEMISEQ2SEQ --epoch 5 --iter-now 1 --modeltype SemiSeq2SeqLite
python -m lilab.OpenLabCluster_train.a5_export_latent_iter_repr $PROJECT_REPR $PROJECT_SEMISEQ2SEQ --epoch 5 --iter 1 --modeltype SemiSeq2SeqLite
python -m lilab.OpenLabCluster_train.a2a_clippredfile_refine $PROJECT_SEMISEQ2SEQ/output/semisupervise-decSeq-iter1-epoch5/*.clippredpkl $PROJECT_SEMISEQ2SEQ/output/semisupervise-decSeq-iter0-epoch5/*.clippredpkl
python -m lilab.OpenLabCluster_train.a2b_iter_data_prepare $PROJECT_REPR $PROJECT_SEMISEQ2SEQ --epoch 5 --iter-from 1 #create new data for iter2

python -m lilab.OpenLabCluster_train.a4_semiseqseq_train $PROJECT_SEMISEQ2SEQ --epoch 5 --iter-now 2 --modeltype SemiSeq2SeqLite
python -m lilab.OpenLabCluster_train.a5_export_latent_iter_repr $PROJECT_REPR $PROJECT_SEMISEQ2SEQ --epoch 5 --iter 2 --modeltype SemiSeq2SeqLite
python -m lilab.OpenLabCluster_train.a2a_clippredfile_refine $PROJECT_SEMISEQ2SEQ/output/semisupervise-decSeq-iter2-epoch5/*.clippredpkl $PROJECT_SEMISEQ2SEQ/output/semisupervise-decSeq-iter1-epoch5/*.clippredpkl
python -m lilab.OpenLabCluster_train.a2b_iter_data_prepare $PROJECT_REPR $PROJECT_SEMISEQ2SEQ --epoch 5 --iter-from 2 #create new data for iter3

python -m lilab.OpenLabCluster_train.a4_semiseqseq_train $PROJECT_SEMISEQ2SEQ --epoch 5 --iter-now 3 --modeltype SemiSeq2SeqLite
python -m lilab.OpenLabCluster_train.a5_export_latent_iter_repr $PROJECT_REPR $PROJECT_SEMISEQ2SEQ --epoch 5 --iter 3 --modeltype SemiSeq2SeqLite
python -m lilab.OpenLabCluster_train.a2a_clippredfile_refine $PROJECT_SEMISEQ2SEQ/output/semisupervise-decSeq-iter3-epoch5/*.clippredpkl $PROJECT_SEMISEQ2SEQ/output/semisupervise-decSeq-iter2-epoch5/*.clippredpkl
python -m lilab.OpenLabCluster_train.a2b_iter_data_prepare $PROJECT_REPR $PROJECT_SEMISEQ2SEQ --epoch 5 --iter-from 3 #create new data for iter3

# 4. 迭代结束，画图
ITER=3
EPOCH=6

#画400p
conda activate mmdet
DIR_400p=/DATA/taoxianming/rat/data/Mix_analysis/SexAgeDay55andzzcWTinAUT_MMFF/data
python -m lilab.OpenLabCluster_train.a6b_clippredpkl_2_cluster400p $PROJECT_SEMISEQ2SEQ/output/semisupervise-decSeq-iter$ITER-epoch$EPOCH/*.clippredpkl $DIR_400p 

#clippredpkl 转 seqencepkl
python -m lilab.OpenLabCluster_train.a6_clippredpkl_2_seqencepkl $PROJECT_SEMISEQ2SEQ/output/semisupervise-decSeq-iter$ITER-epoch$EPOCH/*.clippredpkl
#计算 chi dbi 聚类度量
ls $PROJECT_SEMISEQ2SEQ/output/*/*.clippredpkl | xargs -n 1 -P 8 -I {} python -m lilab.OpenLabCluster_train.b1_chi_dbi {} --PCA 12

# 参考聚类视频和主被动一致性，给予重新命令。打开脚本，修改其中类别名字
ls $PROJECT_SEMISEQ2SEQ/output/semi*/*.clippredpkl | xargs -n 1 -P 8 -I {} python -m lilab.OpenLabCluster_train.t1_cluster_name_rename {}

##预测数据集，生成到 Data.H5 文件即可
##需要更改config.yaml文件中 feature_length: 32（feature个数）,cla_dim: - 36 num_class: - 36(训练集最终cluster数)
conda activate OpenLabCluster
ITER=3
EPOCH=5

PROJECT_SEQ2SEQ=/DATA/taoxianming/rat/data/Mix_analysis/SexAgeDay55andzzcWTinAUT_MMFF/result32_k36/semiseq2seq_iter1
PROJECT_REPR=/mnt/liying.cibr.ac.cn_Data_Temp/multiview_9/chenxf/00_BehaviorAnalysis-seq2seq/SexAge/Day55_Mix_analysis/SexAgeDay55andzzcWTinAUT_MMFF/result32/representitive_k36_filt_perc65
CLIPPREDPKL=$PROJECT_SEQ2SEQ/output/semisupervise-decSeq-iter$ITER-epoch$EPOCH/*.clippredpkl
python -m lilab.OpenLabCluster_train.a5_export_latent_iter_repr $PROJECT_REPR $PROJECT_SEQ2SEQ --epoch 3 --iter 3
python -m lilab.OpenLabCluster_train.a6_clippredpkl_2_seqencepkl $CLIPPREDPKL
# python -m lilab.OpenLabCluster_train.t1_cluster_name_rename $CLIPPREDPKL

#3. 之前无监督的常规分析流程 -- 画图检查一遍
python -m lilab.openlabcluster_postprocess.s2_decisionBoundary_masaik_plot $CLIPPREDPKL
python -m lilab.openlabcluster_postprocess.s3b_hiecluster_plot_pro $CLIPPREDPKL
python -m lilab.openlabcluster_postprocess.s3c_mirror_mutual_matrix_plot $CLIPPREDPKL

#合并主被动，再聚类 [可选]
python -m lilab.OpenLabCluster_train.t2_halfmirror_hierachy $CLIPPREDPKL
```