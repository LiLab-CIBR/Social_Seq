
## 补丁：Linux 主机 Docker（如有需要）
为何需要补丁：此 Docker 镜像在 Windows 主机上构建，在 Linux 主机上运行时可能会出现问题。

如果你的服务器是 Linux 系统：

```
$ nvidia-smi  # 正常情况下应能看到 GPU 信息，若出现“not found libnvidia-ml.so.1”错误，则需要应用补丁。
```

此时，你可以尝试如下补丁操作：
```bash
cd /usr/lib/x86_64-linux-gnu
ln -s libnvidia-ml.so.5* libnvidia-ml.so.1  
ln -s libnvidia-ml.so.5* libnvidia-ml.so  # 可选
ln -s libcuda.so.5* libcuda.so.1   # 可选
ln -s libcudadebugger.so.5* libcudadebugger.so.1   # 可选
```



## 补丁: LILAB-pkg (如有需要)
为何需要补丁：该 Docker 不支持 NVIDIA 视频解码器 / 编码器，而主要的 LILAB-pkg 会用到 NVIDIA 视频包，因此需要将 Docker 中的相关包降级为 CPU 视频包。

每当你从 GitHub 上更新 LILAB-pkg 后，都需要执行此补丁操作：

```bash
cp -r /root/Downloads/pipeline/LILAB-pkg-patch-for-docker ~/LILAB-pkg/
```