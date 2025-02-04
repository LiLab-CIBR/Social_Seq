
```bash
conda activate OpenLabCluster
PROEJECT_DIR=/mnt/liying.cibr.ac.cn_Data_Temp_ZZC/2024-ChR2rat/2410shank3/400p

# 动物在每个video里面算体长，算sniffzone
# 得到 'bodylength.pkl', 'rawfeat.pkl'
python -m lilab.lstm_bhv_bodylennorm_classify.s0_prepare_body_length $PROEJECT_DIR   #--skip-frames 1800
python -m lilab.lstm_bhv_bodylennorm_classify.s01_matcalibpkl2rawfeatpkl $PROEJECT_DIR

# 按速度 95% 分位数归一化
# 得到 rawfeat_norm.pkl
python -m lilab.lstm_bhv_bodylennorm_classify.s02_rawfeatpkl_to_norm $PROEJECT_DIR #--setspeed 0.05 #--skip-frames 1800

# 从3D关键点出发，加上体长信息，算出行为分类
# --use-normed 使用速度归一化后的特征
# 得到 out_semiseq2seq_norm/lstm_offline.clippredpkl
python -m lilab.lstm_bhv_bodylennorm_classify.s1_matcalibpkl2clippredpkl_semiseq2seq $PROEJECT_DIR --use-normed 

# 密集预测 10Hz, stride=3
# python -m lilab.lstm_bhv_bodylennorm_classify.s1_matcalibpkl2clippredpkl_semiseq2seq $PROEJECT_DIR --use-normed --stride 3


# 只看镜像一致性的视频片段，representative
# 得到 out_semiseq2seq_norm/representitive_k36_filt_perc*/*.clippredpkl 和 .seqencepkl
conda activate mmdet
python -m lilab.OpenLabCluster_train.a6_clippredpkl_2_seqencepkl $PROEJECT_DIR/out_semiseq2seq_norm/*.clippredpkl

python -m lilab.OpenLabCluster_train.a1_mirror_mutual_filt_clippredpkl $PROEJECT_DIR/out_semiseq2seq_norm/lstm_offline.clippredpkl --already-mirrored
python -m lilab.OpenLabCluster_train.a6_clippredpkl_2_seqencepkl $PROEJECT_DIR/out_semiseq2seq_norm/representitive_k36_filt_perc*/*.clippredpkl --autoEnd

# 画出每个类别的视频片段 [可选]
# python -m lilab.OpenLabCluster_train.a6b_clippredpkl_2_cluster400p  \
#     $PROEJECT_DIR/out_semiseq2seq_norm/representitive_k36_filt_perc*/Representive_K36.clippredpkl \
#     $PROEJECT_DIR
```