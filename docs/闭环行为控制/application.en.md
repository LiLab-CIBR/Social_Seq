# Closed-loop Behavior Control ⚡️

<div class="video-item">
    <p class="video-legend">Video: Closed-loop behavior-triggered optogenetic stimulation</p>
    <video controls muted playsinline style="width: 480px;" data-src="../../../assets/hls_videos/VideoS6_closed-loop_250430/playlist.m3u8"></video>
</div>

<br>

Achieve precise behavior control using optogenetic technology and form a closed-loop feedback system through real-time behavior analysis.

- ❓ **Challenge**: Real-time behavior recognition involves heavy computational load, making it difficult to deploy complete models in experimental environments; small models on edge devices lack accuracy; non-specific dopamine stimulation has limited effects on improving autism behaviors.
- 💡 **Solution**: Use cloud computing for behavior recognition, uploading experimental videos to the cloud platform for processing and returning results. Reduce latency through model lightweighting and GPU pipeline parallel optimization, and establish an autism behavior-optogenetic reinforcement learning paradigm to provide specific dopamine light stimulation when play behavior is recognized.
- 🎉 **Effect**: Behavior recognition delay is only 266ms with an accuracy rate of 80%. Specific optogenetic reinforcement learning significantly improves play behavior in autism rats (*Shank3* <sup>+/-</sup>), enhancing social abilities and reducing non-social behaviors.

<div align="center">
  <img src="../../../assets/images/Fig7_closed-loop.jpg" width="500" alt="Behavior Control">
</div>


## Design Principles and Precision Measurement

Deploy the behavior recognition model in the cloud to achieve closed-loop behavior control through real-time video stream uploading. The model is lightweighted and optimized with GPU pipeline parallelization to reduce computational latency. The optogenetic laser is controlled by an Arduino board to emit pulse light stimulation at 40Hz.

In the experimental design, the experimental group receives dopamine release light stimulation when *Shank3* <sup>+/-</sup> rats actively play; the control group receives random light stimulation under non-play behavior conditions, keeping the total amount of light stimulation consistent.

Test results (n=32 videos) show that the experimental group gives light during play over 90%, while the control group is less than 10%. The experimental group allocates more light stimulation to play-related social behaviors, while the control group allocates more to non-social behaviors. This shows the precision of closed-loop behavior control. Eventually, improved play behavior and social abilities in *Shank3* <sup>+/-</sup> rats were observed.

<div align="center">
  <img src="../../../assets/images/Fig7_closed-loop_precision.jpg" width="500" alt="Behavior Control Precision">
</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/hls.js/1.5.8-0.canary.10141/hls.light.min.js"></script>
<script src="../../../assets/js/hls.js"></script>
<script src="../../../assets/js/video-player.js"></script>
