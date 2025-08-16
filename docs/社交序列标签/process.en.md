```bash
conda activate OpenLabCluster
PROEJECT_DIR=/mnt/liying.cibr.ac.cn_Data_Temp_ZZC/2024-ChR2rat/2410shank3/400p

# Calculate body length and sniffzone for each animal in each video
# Generate 'bodylength.pkl', 'rawfeat.pkl'
python -m lilab.lstm_bhv_bodylennorm_classify.s0_prepare_body_length $PROEJECT_DIR   #--skip-frames 1800
python -m lilab.lstm_bhv_bodylennorm_classify.s01_matcalibpkl2rawfeatpkl $PROEJECT_DIR

# Normalize by 95% quantile of speed
# Generate rawfeat_norm.pkl
python -m lilab.lstm_bhv_bodylennorm_classify.s02_rawfeatpkl_to_norm $PROEJECT_DIR #--setspeed 0.05 #--skip-frames 1800

# Starting from 3D keypoints, add body length information to calculate behavior classification
# --use-normed uses speed-normalized features
# Generate out_semiseq2seq_norm/lstm_offline.clippredpkl
python -m lilab.lstm_bhv_bodylennorm_classify.s1_matcalibpkl2clippredpkl_semiseq2seq $PROEJECT_DIR --use-normed 

# Dense prediction 10Hz, stride=3
# python -m lilab.lstm_bhv_bodylennorm_classify.s1_matcalibpkl2clippredpkl_semiseq2seq $PROEJECT_DIR --use-normed --stride 3


# Only look at video segments with mirror consistency, representative
# Generate out_semiseq2seq_norm/representitive_k36_filt_perc*/*.clippredpkl and .seqencepkl
conda activate mmdet
python -m lilab.OpenLabCluster_train.a6_clippredpkl_2_seqencepkl $PROEJECT_DIR/out_semiseq2seq_norm/*.clippredpkl

python -m lilab.OpenLabCluster_train.a1_mirror_mutual_filt_clippredpkl $PROEJECT_DIR/out_semiseq2seq_norm/lstm_offline.clippredpkl --already-mirrored
python -m lilab.OpenLabCluster_train.a6_clippredpkl_2_seqencepkl $PROEJECT_DIR/out_semiseq2seq_norm/representitive_k36_filt_perc*/*.clippredpkl --autoEnd

# Draw video segments for each category [optional]
# python -m lilab.OpenLabCluster_train.a6b_clippredpkl_2_cluster400p  \
#     $PROEJECT_DIR/out_semiseq2seq_norm/representitive_k36_filt_perc*/Representive_K36.clippredpkl \
#     $PROEJECT_DIR
```