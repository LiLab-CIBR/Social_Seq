
## Patch:  Linux Host Docker (If need)
Why patch: This docker image is build in Windows host, somehow, have problems in linux host. 

If you server is Linux.

```
$ nvidia-smi  #should see the GPUs, errors `not found libnvidia-ml.so.1` should patch.
```

So that you can try this patch.
```bash
cd /usr/lib/x86_64-linux-gnu
ln -s libnvidia-ml.so.5* libnvidia-ml.so.1  
ln -s libnvidia-ml.so.5* libnvidia-ml.so  #optional
ln -s libcuda.so.5* libcuda.so.1   #optional
ln -s libcudadebugger.so.5* libcudadebugger.so.1   #optional
```


## Patch: LILAB-pkg (If need)
Why patch: The docker is not support NVIDIA Video Decoder/Encoder. But the main LILAB-pkg use the NVIDIA Video packages. So the docker should downgrade to the CPU video package.

Whenever you update the LILAB-pkg from github, do this patch.

```bash
cp -r /root/Downloads/pipeline/LILAB-pkg-patch-for-docker ~/LILAB-pkg/
```
