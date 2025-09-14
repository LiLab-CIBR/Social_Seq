OBS Software Installation
---
Video tutorial: xxx


<div align="center">
  <img src="../../../assets/images/OBS_software.jpg" width="500" alt="ball_keypoint">
</div>


The system uses OBS Studio (version **29.0**) for video recording. OBS is widely used in the field of video live streaming and recording due to its excellent configurability, stability, and open-source characteristics. The software supports multiple input sources, including images, text, browser windows, cameras, and microphones, **effectively simplifying the complexity of multi-camera synchronous recording**. Its multi-threaded load optimization and GPU video encoding/decoding provide **excellent performance**. In this platform, OBS provides a comprehensive and flexible video recording solution with real-time preview, multi-camera layout, resolution adjustment, and programming interfaces. The specific configuration of OBS is detailed in the table below.

> OBS version 29.0, download address: https://obsproject.com/download


| Object | Main Function | Parameters |
|------------|----------------------------------------------------|------------------------------------------------------------------------------------------|
| Sources > Add > Video Capture Device | Add 9 K1S293 cameras | In the resolution dropdown list for individual cameras, select 1280×800, frame rate as highest (i.e., 120fps), and frame encoding as MJPEG |                                  |
| Settings > Output > Recording | Recording file format | Type as standard; filename without spaces; output container as MP4; encoder as NVIDIA NVENC HEVC; bitrate as 30 Mbps; preset as high quality.|
| Settings > Video | Canvas resolution and frame rate | Canvas resolution 3840×2400, which is the pixel sum after stitching 9 cameras; no scaling; frame rate 30 fps.|
| Menu > Tools > WebSocket Server | External code control of OBS recording switch | Port number 4455; no password (uncheck authentication box); recommended to use with F2 Synchronization Assistant|


In the specific configuration process of OBS software, the following technical details should be focused on:

1. When adding multi-camera video streams to the OBS canvas, stretching or cropping of camera views should be avoided to prevent image data loss and ensure accurate positioning of subsequent multi-camera image reading.
2. Multi-camera images should be tightly arranged in the OBS canvas, and camera numbering should follow the order from left to right, top to bottom.
3. Some cameras capture upside-down images, which need to be corrected by 180° rotation in OBS software, but do not use mirroring.

After completing the above configuration, recording can be started through the OBS interface to synchronously record behavior experiment videos from 9 cameras. Typically, a 15-minute experiment video is about 3.4GB. Players like Potplayer or VLC can be used to conveniently view the videos.