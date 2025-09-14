# Create Social Clustering Template from Scratch
## From Keypoint Files + Videos to Social Features and Behavior Labels
After performing "Social 3D Pose Reconstruction", you should have "*smoothed_foot.matcalibpkl" keypoint files and "*_sktdraw_smoothed_foot.mp4" video files.

Copy all these video and data files to a folder. Execute the following commands to sequentially `calculate social features - enrich close-range social interactions and split segments - Seq2Seq model to extract spatiotemporal features of social behavior - social clustering - render videos`.

Please run this code line by line.

```bash
#!/bin/bash
conda activate OpenLabCluster

# Path where the code is stored (by Tao Xianming)
cd /DATA/taoxianming/rat/script/openlabcluster/pc_feats41_DecSeqCluster_better_20231102

pathFeats=/mnt/liying.cibr.ac.cn_Data_Temp/multiview_9/chenxf/Shank3HETxWT_202309/MM_FF

# Do not use cloud storage for ResPath, as the files are too fragmented and slow to access
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

This will generate `*_sequences.pkl` and `*_bio_labels.npz` behavior video label files; and `FWPCA*_blackFirst/svm_clu*_400p.mp4` video files corresponding to each behavior category.

## Plotting & Calculating Active-Passive Consistency
Please run this code line by line.

```bash
#!/bin/bash
conda activate mmdet
cd /mnt/liying.cibr.ac.cn_Data_Temp/multiview_9/chenxf/00_BehaviorAnalysis-seq2seq/SexAge/Day55_Mix_analysis/SexAgeDay55andzzcWTinAUT_MMFF/result32/

## 1. Merge files to generate clippredpkl file
python -m lilab.openlabcluster_postprocess.s1_merge_3_file . 

## 2. UMAP of Embedding and Kmeans boundary
python -m lilab.openlabcluster_postprocess.s2_decisionBoundary_masaik_plot *.clippredpkl

## 3A. Kmeans hierarchical clustering
# Preparation work. First, give each cluster a name. Open the script and paste the category names into the script; run it. Finally, the category names will be added to *.clippredpkl.
# python -m lilab.openlabcluster_postprocess.s3a_cluster_givename_mergefile *.clippredpkl 

## 3B. Or temporarily not standardize class names
python -m lilab.openlabcluster_postprocess.s3a_cluster_givename_mergefile *.clippredpkl --auto-label

## 4. Then run the hierarchical clustering plot
python -m lilab.openlabcluster_postprocess.s3b_hiecluster_plot *.clippredpkl &
python -m lilab.openlabcluster_postprocess.s3b_hiecluster_plot_pro *.clippredpkl &

## 5. Definition of Mirror or Mutual categories
python -m lilab.openlabcluster_postprocess.s3c_mirror_mutual_matrix_plot *.clippredpkl

## 6. Optional. Merge labels. For example, active-passive, or adjacent classes in the dendrogram. [Optional, not recommended]
# Preparation work. Open the script and write the mergeable categories in the script; run it. Finally, the merged category names will be added to *.clippredpkl.
# python -m lilab.openlabcluster_postprocess.s3a2_cluster_nodemerge *.clippredpkl

## 7. Optional plotting. Moseq-like Motif plotting
# Need to find the original keypoint coordinate files (stored in the SmoothFootPkl_DIR folder) to plot. Run the following code. In the same directory, a motifshowmulti result folder will be generated.
SmoothFootPkl_DIR=/A/B/C
python -m lilab.openlabcluster_postprocess.s4_moseq_like_motif_plot *.clippredpkl $SmoothFootPkl_DIR
```

## Using Active-Passive Consistency to Optimize Clustering with Active-Learning

```bash
conda activate mmdet

# Change directory to the kmeans clustering result path
cd /mnt/liying.cibr.ac.cn_Data_Temp/multiview_9/chenxf/00_BehaviorAnalysis-seq2seq/SexAge/Day55_Mix_analysis/SexAgeDay55andzzcWTinAUT_MMFF/result32/

#1. Recalculate mirror and export mirror category matrix heatmap & mirror table
python -m lilab.OpenLabCluster_train.a0_mirror_mutual_matrix_plot *.clippredpkl

#2. Filter representative segments to become new clippredpkl
python -m lilab.OpenLabCluster_train.a1_mirror_mutual_filt_clippredpkl *.clippredpkl
cd ./representitive_*_filt_perc*

#3. Previous unsupervised conventional analysis process -- check plots
#3-1. UMAP of Embedding and Kmeans boundary
python -m lilab.openlabcluster_postprocess.s2_decisionBoundary_masaik_plot *.clippredpkl
#3-2. Then run hierarchical clustering plot
python -m lilab.openlabcluster_postprocess.s3b_hiecluster_plot_pro *.clippredpkl
#3-3. Definition of Mirror or Mutual categories
python -m lilab.openlabcluster_postprocess.s3c_mirror_mutual_matrix_plot *.clippredpkl

#B1. Create openlabcluster semi_seq2seq project, copy from seq2seq
conda activate OpenLabCluster

PROJECT_SEQ2SEQ=/DATA/taoxianming/rat/data/Mix_analysis/SexAgeDay55andzzcWTinAUT_MMFF/result32_k36/feats32-2024-04-11
PROJECT_REPR=/mnt/liying.cibr.ac.cn_Data_Temp/multiview_9/chenxf/00_BehaviorAnalysis-seq2seq/SexAge/Day55_Mix_analysis/SexAgeDay55andzzcWTinAUT_MMFF/result32_k36

PROJECT_SEMISEQ2SEQ=`python -m lilab.OpenLabCluster_train.a2_semiseqseq_data_prepare $PROJECT_REPR  $PROJECT_SEQ2SEQ`
cd $PROJECT_SEMISEQ2SEQ
#B2. Initialize seq2seq
python -m lilab.OpenLabCluster_train.a3_semiseqseq_init_train_seqseq $PROJECT_SEMISEQ2SEQ --epoch 3

#First iteration, from seq2seq to semiseq2seq
# PROJECT_SEMISEQ2SEQ=/DATA/taoxianming/rat/data/Mix_analysis/SexAgeDay55andzzcWTinAUT_MMFF/result32/semiseq2seq_iter0
# PROJECT_REPR=/mnt/liying.cibr.ac.cn_Data_Temp/multiview_9/chenxf/00_BehaviorAnalysis-seq2seq/SexAge/Day55_Mix_analysis/SexAgeDay55andzzcWTinAUT_MMFF/result32/representitive_*_filt_perc*
PROJECT_SEMISEQ2SEQ=/DATA/taoxianming/rat/data/Mix_analysis/SexAgeDay55andzzcWTinAUT_MMFF/result32_k36/semiseq2seq_iter1
python -m lilab.OpenLabCluster_train.a5b_export_latent_repr  $PROJECT_REPR  $PROJECT_SEMISEQ2SEQ  --modeltype SemiSeq2SeqLite  #--modeltype SemiSeq2SeqLite is default not selected

# Train label recognition using SemiSeq2Seq model
python -m lilab.OpenLabCluster_train.a4_semiseqseq_train $PROJECT_SEMISEQ2SEQ --epoch 5 --iter-now 0 --modeltype SemiSeq2SeqLite
# Predict labels of all segments based on SemiSeq2Seq model
python -m lilab.OpenLabCluster_train.a5_export_latent_iter_repr $PROJECT_REPR $PROJECT_SEMISEQ2SEQ --epoch 5 --iter 0 --modeltype SemiSeq2SeqLite
# Generate new dataset from representative labels filtered from segment set
python -m lilab.OpenLabCluster_train.a2a_clippredfile_refine $PROJECT_SEMISEQ2SEQ/output/semisupervise-decSeq-iter0-epoch5/*.clippredpkl $PROJECT_REPR/*.clippredpkl
python -m lilab.OpenLabCluster_train.a2b_iter_data_prepare $PROJECT_REPR $PROJECT_SEMISEQ2SEQ --epoch 5 --iter-from 0 #create new data for iter1


#Start iteration
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

# 4. End of iteration, plotting
ITER=3
EPOCH=6

#Plot 400p
conda activate mmdet
DIR_400p=/DATA/taoxianming/rat/data/Mix_analysis/SexAgeDay55andzzcWTinAUT_MMFF/data
python -m lilab.OpenLabCluster_train.a6b_clippredpkl_2_cluster400p $PROJECT_SEMISEQ2SEQ/output/semisupervise-decSeq-iter$ITER-epoch$EPOCH/*.clippredpkl $DIR_400p 

#clippredpkl to seqencepkl
python -m lilab.OpenLabCluster_train.a6_clippredpkl_2_seqencepkl $PROJECT_SEMISEQ2SEQ/output/semisupervise-decSeq-iter$ITER-epoch$EPOCH/*.clippredpkl
#Calculate chi dbi clustering metrics
ls $PROJECT_SEMISEQ2SEQ/output/*/*.clippredpkl | xargs -n 1 -P 8 -I {} python -m lilab.OpenLabCluster_train.b1_chi_dbi {} --PCA 12

# Refer to clustering videos and active-passive consistency to rename. Open the script and modify the category names
ls $PROJECT_SEMISEQ2SEQ/output/semi*/*.clippredpkl | xargs -n 1 -P 8 -I {} python -m lilab.OpenLabCluster_train.t1_cluster_name_rename {}

##Predict dataset and generate to Data.H5 file
##Need to change feature_length: 32 (number of features) and cla_dim: - 36 num_class: - 36 (final cluster count of training set) in config.yaml file
conda activate OpenLabCluster
ITER=3
EPOCH=5

PROJECT_SEQ2SEQ=/DATA/taoxianming/rat/data/Mix_analysis/SexAgeDay55andzzcWTinAUT_MMFF/result32_k36/semiseq2seq_iter1
PROJECT_REPR=/mnt/liying.cibr.ac.cn_Data_Temp/multiview_9/chenxf/00_BehaviorAnalysis-seq2seq/SexAge/Day55_Mix_analysis/SexAgeDay55andzzcWTinAUT_MMFF/result32/representitive_k36_filt_perc65
CLIPPREDPKL=$PROJECT_SEQ2SEQ/output/semisupervise-decSeq-iter$ITER-epoch$EPOCH/*.clippredpkl
python -m lilab.OpenLabCluster_train.a5_export_latent_iter_repr $PROJECT_REPR $PROJECT_SEQ2SEQ --epoch 3 --iter 3
python -m lilab.OpenLabCluster_train.a6_clippredpkl_2_seqencepkl $CLIPPREDPKL
# python -m lilab.OpenLabCluster_train.t1_cluster_name_rename $CLIPPREDPKL

#3. Previous unsupervised conventional analysis process -- check plots
python -m lilab.openlabcluster_postprocess.s2_decisionBoundary_masaik_plot $CLIPPREDPKL
python -m lilab.openlabcluster_postprocess.s3b_hiecluster_plot_pro $CLIPPREDPKL
python -m lilab.openlabcluster_postprocess.s3c_mirror_mutual_matrix_plot $CLIPPREDPKL

#Merge active-passive and re-cluster [optional]
python -m lilab.OpenLabCluster_train.t2_halfmirror_hierachy $CLIPPREDPKL
```