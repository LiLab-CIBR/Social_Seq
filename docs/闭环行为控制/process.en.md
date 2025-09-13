# Code Process
> Developer: Chenxinfeng, update 2025-08-16

The general code process for closed-loop behavior control is as follows:

![Closed-loop behavior control code process](../../../assets/images/Fig7_closed-loop_code_illustration.jpg)

The corresponding code operations are as follows:

## 1. Start virtual camera for timestamp marking

Operate on the DAQ PC, which runs Windows. OBS Studio version 29.1. OBS needs to add a virtual camera ("OBS Virtual Camera"), and the Python code will output time codes (e.g., 163) to this camera frame. The time code value is determined by the PC clock and updated every 33ms (30fps to match the video frame rate). The current clock value is also stored on the server `10.50.7.109:20173` for other devices to access to get the current time code.

Download from github, [`virtual_LED.py`🔗](https://github.com/chenxinfeng4/social-seq-live-client-GUI/blob/main/pyvirtualcam_LED/virtual_LED.py).

Execute this script in the terminal to start the virtual camera and start the socket service.

```bash
python3 virtual_LED.py
```

!!! note "Tip"
    It is recommended to save it as a windows bat file and double-click to run directly. This script also has the function of lighting up the virtual LED color, which can be used for video event tagging, such as for optogenetic Laser trigger event tagging. For details, please refer to 【#7】 GUI code.

!!! warning "Note"
    You need to install the dependent libraries yourself. Let the DAQ PC firewall open 20173.


## 2. Update camera and rat model in code

Users need to provide the latest multi-camera model file and rat social keypoint model file, and update them in the code. The former is used for 3D reconstruction; the latter is used to calculate the body length of rats of the same age, which is convenient for behavior feature normalization. Usually, the `Rat Social Keypoint Model` file contains the `Multi-Camera Model`, so let the multi-camera model equal the `Rat Social Keypoint Model`.

Modify `CALIBPKL` in `lilab/label_live/usv_yolo_seg_dannce_unit_test.py` to the multi-camera model path, and `model_smooth_matcalibpkl` to the rat social keypoint model path.

```python
# PATH_TO_LILAB/lilab/label_live/usv_yolo_seg_dannce_unit_test.py
CALIBPKL = '/mnt/liying.cibr.ac.cn_Data_Temp_ZZC2/2506batch-chr2/test/ball/2025-06-13_10-16-58_ball.calibpkl'
model_smooth_matcalibpkl = '/DATA/zhongzhenchao/2501chr2-shank3/all400p/2025-01-05_15-04-37_l7_sm1_pm6.smoothed_foot.matcalibpkl'

model_smooth_matcalibpkl = CALIBPKL = '/a/b/c.matcalibpkl'
```

## 3. Start result server daemon

```bash
source activate mmdet # activate the conda environment
python -m lilab.label_live.socketServer
```

!!! warning "Note"
    Pay attention to the Cloud Server firewall and open port 8002. If the port is occupied, it is often because the previous Python program did not close normally. Please close the program that occupies this port first, or execute `lsof -i:8002` to view the process that occupies this port, and then kill the process (`kill -9 process number`). Wait for 10 seconds and restart the program. Try multiple times.


## 4. Start media server daemon Mediamtx

Start Mediamtx on Cloud Server to receive OBS streaming and forward it to clients.

```bash
docker run --rm -it -p 8554:8554 bluenviron/mediamtx
```

!!! warning "Note"
    Pay attention to the Cloud Server firewall and open port 8554.

## 5. Start OBS video stream

Start OBS on DAQ PC and stream to Cloud Server's Mediamtx.

I have configured OBS, and you can start the streaming configuration through the following simple operation:

- Select, menu>Profile>Social-seq-live streaming 
- Select, menu>Scene Collection>Social-seq-live-push

Then click the "Start Recording" button (note not "Start Live Streaming") to start streaming. If no error prompt pops up within 20 seconds, the streaming is successful.

For a new DAQ PC, you need to reconfigure OBS. The specific steps are as follows:

![OBS Configuration](../../../assets/images/Fig7_closed-loop_OBS.jpg)

!!! info "Tip"
    Resolution and encoding method are important parameters that affect streaming delay, especially the project's 3840x2400 is a high resolution. This RTSP parameter setting has been tested in various ways, with low delay and good picture quality. Other video streaming projects can refer to this parameter setting.

!!! warning "Note"
    Pay attention to OBS's streaming address, which needs to fill in the Cloud Server's IP address, should be `rtsp://10.50.60.6:8554/mystream_9cam`. You can use tools such as VLC or ffplay to test whether the stream can be played normally. The computer's performance determines the smoothness of the streaming. If the computer's performance is poor, the streaming may not be smooth or there may be stuttering. In addition, the bitrate needs to be set low at 8Mbps, otherwise the streaming delay will be high.



## 6. Start behavior recognition pipeline code

Start the behavior recognition program on Cloud Server to receive OBS streaming, recognize behaviors, and store the recognition result labels (Syllable ID) in the Result server daemon.

```bash
source activate mmdet  # activate the conda environment
PATH=/usr/bin:$PATH python -m lilab.label_live.usv_yolo_seg_dannce_unit_test
```

!!! warning "Note"
    Pay attention to check for error messages. Make sure OBS has started streaming normally and the streaming address is correct.

!!! warning "Note"
    Check the terminal output frame rate (30fps) and delay (<10 frames). The display iteration should be about 30its/s, and the delay frame count should be within 6-10. Too high a delay frame (>30 frames) will seriously reduce the accuracy of closed-loop stimulation. The empirical reason is 1. The DAQ PC performance is too poor and needs to restart the OBS software (usually); or 2. Someone is using Cloud Server, preempting CPU and GPU resources, then clear these users' resources (communicate in advance).

## 7. Start Social-seq-live GUI

Go to github to download [Social-seq-live](https://github.com/chenxinfeng4/social-seq-live-client-GUI) code and install the dependent packages.

```cmd
python main.py   # GUI program, "closed-loop control" experimental group
python main_exclude.py   # GUI program, "open-loop control" control group
```

!!! warning "Note"
    Note that the GUI programs for the "closed-loop control" experimental group and the "open-loop control" control group are different. The operation steps are the same. Closed-loop control automatically starts stimulation after recognizing behavior. Open-loop control needs to exclude target behavior and give stimulation randomly.


Then select the corresponding GUI program and start it. After connecting to **Cloud Server** and **Arduino**, behavior recognition and optogenetic control will start automatically.

- In the GUI, check the appropriate target behaviors, such as "pouncing", "pinning", "chasing", etc.
- Fill in the IP address of **Cloud Server** and click the "Connect" button to connect to the Result server daemon.
- Select the **Arduino** serial port and click the "Connect" button to connect to Arduino. (*Arduino needs to initialize the burning code, refer to 【#9】*)

## 8. Start ffmpeg code to dump video to file

After the animal experiment starts, the video needs to be recorded. Since the original OBS recording function has been occupied, the video can only be recorded on Cloud Server.

Save the following code as the RT_record.sh file of **Cloud Server**. After each animal experiment starts, run it. It will save a video file in the /DATA/chenxinfeng directory. The file name is the current time, such as 2025-01-01_12-00-00.mp4.

```bash
#!/bin/bash
# Save as RT_record file
filename=`date --date='2.2 seconds' +"%Y-%m-%d_%H-%M-%S"`
/home/liying_lab/chenxinfeng/.conda/envs/mmdet/bin/ffmpeg.bak -rtsp_transport tcp -t 00:15:06 -i rtsp://10.50.60.6:8554/mystream_9cam  -ss 00:00:02.2 -c:v hevc_nvenc  -b:v 10M -maxrate:v 20M  -preset:v p4 /DATA/chenxinfeng/${filename}.mp4
```

## 9. Arduino Laser pulse

Go to github to download [Arduino Laser pulse](https://github.com/chenxinfeng4/social-seq-live-client-GUI/blob/main/seqlive_board/seqlive_board.ino) code and burn it.

```bash
const int PinNum = 6;             // the number of the LED pin
const float duration = 1.0;         // time for running, unit = sec.
const float Hz = 40;              // frequency, unit = Hz.
const float Duty = 0.2;           // duty, unit = 0~1.
```
This code indicates that Arduino's D6 pin is connected to the laser's trigger pin. The single stimulation time is 1.0 seconds, the laser frequency is 40Hz, and the duty cycle is 0.2 (5ms).

## Close OBS and GUI

After the experiment ends, restore OBS configuration, close OBS software; close Social seq live GUI. On Cloude Server, close **pipeline**.