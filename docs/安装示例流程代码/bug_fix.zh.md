
## 补丁：Linux 主机 Docker（如有需要）
为何需要补丁：此 Docker 镜像在 Windows 主机上构建，在 Linux 主机上运行时可能会出现问题。

如果你的服务器是 Linux 系统：

```
$ nvidia-smi  # 正常情况下应能看到 GPU 信息，若出现"not found libnvidia-ml.so.1"错误，则需要应用补丁。
```

此时，你可以进入docker容器，尝试以下补丁操作：
```bash
cd /usr/lib/x86_64-linux-gnu
ln -sf libnvidia-ml.so.5* libnvidia-ml.so.1  
ln -sf libnvidia-ml.so.5* libnvidia-ml.so
ln -sf libcuda.so.5* libcuda.so.1   # 可选
ln -sf libcudadebugger.so.5* libcudadebugger.so.1   # 可选
ldconfig
```

可以检查 torch 是否正常工作
```
python -c "import torch; print(torch.zeros(3,3).cuda())"
```

## 补丁: LILAB-pkg (如有需要)
为何需要补丁：该 Docker 不支持 NVIDIA 视频解码器/编码器，而主要的 LILAB-pkg 会用到 NVIDIA 视频包，因此需要将 Docker 中的相关包降级为 CPU 视频包。

每当你从 GitHub 上更新 LILAB-pkg 后，都需要执行此补丁操作：

```bash
cp -r /root/Downloads/pipeline/LILAB-pkg-patch-for-docker/* ~/LILAB-pkg/
```

## 主机8080端口已被占用
如果运行下面命令时出现 "Error starting userland proxy: listen tcp 0.0.0.0:8080: bind: address already in use" 错误，说明主机8080端口已被占用。
```
docker run --rm -it -p 8080:8080 ...
```

则需要将端口映射修改为其他端口（如8081，http://localhost:8081/），例如：
```
docker run --rm -it -p 8081:8080 ...
```


## 远程服务器8080端口转发到本地
如果你使用的是 Windows Docker，可以跳过此步骤。

**为什么需要转发？**
通常情况下，运行 web 界面的客户端电脑（例如，IP 10.50.7.103）和远程服务器（例如，IP 10.50.60.6）位于不同机器上。由于 Chrome 的限制，虽然可以访问 vs-code-server（http://10.50.60.6:8080），但高级功能（文件浏览、Jupyter 等）无法使用。

**解决方法**
推荐：将远程服务器的 8080 端口（http://10.50.60.6:8080）转发到本地（http://localhost:8080，即 http://10.50.7.103:8080），Chrome 浏览器即可正常访问。这是因为 Chrome 对 localhost 的访问没有限制。

不推荐：配置升级 HTTPS 协议，即（https://10.50.60.6:8080），但这需要在远程服务器上配置 SSL 证书，过程较为繁琐。

```
ssh -L 8080:10.50.60.6:8080 username@10.50.60.6
```

**操作步骤**
Windows 客户端电脑可执行以下操作，注意替换 IP 地址为实际的服务器地址和端口。

| 客户端操作系统 | 服务器防火墙 8080 端口 | 代理方法 |
| --- | ---| --- |
| Windows | 已放行 | netsh interface portproxy add v4tov4 listenaddress=127.0.0.1 listenport=8080 connectaddress=10.50.60.6 connectport=8080 |
| Linux | 已放行 | socat TCP-LISTEN:8080,bind=127.0.0.1,fork TCP:10.50.60.6:8080 |
| 通用（SSH打洞） | 封闭 | ssh -L 8080:10.50.60.6:8080 username@10.50.60.6 |
