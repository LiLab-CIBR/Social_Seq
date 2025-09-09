
## Patch:  Linux Host Docker (If need)
Why patch: This docker image is build in Windows host, somehow, have problems in linux host. 

If you server is Linux.

```
$ nvidia-smi  #should see the GPUs, errors `not found libnvidia-ml.so.1` should patch.
```

So that you can try this patch.
```bash
cd /usr/lib/x86_64-linux-gnu
ln -sf libnvidia-ml.so.5* libnvidia-ml.so.1  
ln -sf libnvidia-ml.so.5* libnvidia-ml.so
ln -sf libcuda.so.5* libcuda.so.1   #optional
ln -sf libcudadebugger.so.5* libcudadebugger.so.1   #optional
ldconfig
```

You can check if torch is working properly
```
python -c "import torch; print(torch.zeros(3,3).cuda())"
```

## Patch: LILAB-pkg (If need)
Why patch: The docker is not support NVIDIA Video Decoder/Encoder. But the main LILAB-pkg use the NVIDIA Video packages. So the docker should downgrade to the CPU video package.

Whenever you update the LILAB-pkg from github, do this patch.

```bash
cp -r /root/Downloads/pipeline/LILAB-pkg-patch-for-docker/* ~/LILAB-pkg/
```

## Host Port 8080 Already in Use
If you encounter the error "Error starting userland proxy: listen tcp 0.0.0.0:8080: bind: address already in use" when running the following command, it means that port 8080 on the host is already occupied.
```
docker run --rm -it -p 8080:8080 ...
```

You need to modify the port mapping to another port (e.g., 8081, http://localhost:8081/), for example:
```
docker run --rm -it -p 8081:8080 ...
```

## Forward Remote Server Port 8080 to Local
You can skip this step if you are using Windows Docker.

**Why forwarding is needed?**
Typically, the client computer running the web interface (e.g., IP 10.50.7.103) and the remote server (e.g., IP 10.50.60.6) are on different machines. Due to Chrome's restrictions, although vs-code-server (http://10.50.60.6:8080) can be accessed, advanced features (file browsing, Jupyter, etc.) are not permitted.

**Solution**
Not recommended: Configure HTTPS upgrade, i.e., (https://10.50.60.6:8080), but this requires configuring SSL certificates on the remote server, which is cumbersome.

Recommended: Forward the website port (http://10.50.60.6:8080) to the local machine. Forward the remote server's port 8080 (http://10.50.60.6:8080) to the local machine (http://localhost:8080, i.e., http://10.50.7.103:8080). Chrome browser can then access it normally. This is because Chrome has no restrictions on accessing localhost.

```
ssh -L 8080:10.50.60.6:8080 username@10.50.60.6
```

**Operating Steps**
Windows client computers can perform the following operations. Remember to replace the IP addresses with the actual server address and port.

| Client Operating System | Server Firewall Port 8080 | Proxy Method |
| --- | ---| --- |
| Windows | Allow | netsh interface portproxy add v4tov4 listenaddress=127.0.0.1 listenport=8080 connectaddress=10.50.60.6 connectport=8080 |
| Linux | Allow | socat TCP-LISTEN:8080,bind=127.0.0.1,fork TCP:10.50.60.6:8080 |
| General (SSH Tunnel) | Closed | ssh -L 8080:10.50.60.6:8080 username@10.50.60.6 |
