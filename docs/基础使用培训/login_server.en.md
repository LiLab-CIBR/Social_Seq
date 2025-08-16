# Connect to the Server
## Detailed Server Specifications
The lab has a server and a test machine. The server is dedicated to data analysis. Do not install software packages privately to avoid damaging its environment.
To learn basic Linux commands, you can use the test machine.

|          | Server (High Performance, Inspur)       | Test Machine (Temporary Use)             |
| -------- | -------------------------------- | ------------------------------ |
| Purpose     | Running models, processes, and data analysis         | Testing code and web services             |
| Location     | Information Center B Area, Basement Level 2         | Lab             |
| Address     | ssh chenxinfeng@`10.50.60.6`     | -   |
| System     | Ubuntu 18.04                     | -      |
| Basic Commands | sudo apt install PACKAGE         | -|
| Memory     | 256 GB                           | -|
| Storage     | 1 TB SSD + 8 TB HDD               | -    |
| CPU      | Intel Silver 4314, 32 cores 64 threads | - |
| GPU      | 4 NVIDIA RTX3090 (24 GB VRAM) | -  |
| Docker   | Supported                             | -|

## Logging into the Server (/Test Machine)
The server supports `Remote Desktop`, `ssh`, and `vscode` login methods. `vscode` is recommended.


### 1. Using `vscode` [Most Recommended]
Go to the official website [Download VSCODE](https://code.visualstudio.com/Download) and install it. Then install the `Remote - SSH` plugin. Use the plugin to access the remote server. Navigate to the project directory on the server and install the `Python` and `Jupyter` plugins.

!!! Warning "Warning"
    When logging into a remote SSH for the first time with VSCODE, it will automatically download software and configure the environment on the server. Please be patient. VSCODE updates frequently, which can cause the `Python` and `Jupyter` environments to become outdated. If this happens, update VSCODE and restart the software. You can disable VSCODE auto-updates in the settings.

!!! Error "Error"
    Older WINDOWS computers have system issues that cause VSCODE's SSH connection to keep spinning or fail. Please download the latest software from the OPEN-SSH official website and add it to the search directory, replacing the original SSH.

### 2. Using ssh
On a Windows client computer, hold down the `Win R` shortcut key, enter `cmd` in the **Run** window that pops up. In the terminal command window that appears, enter the following command and input the password.
```bash
ssh chenxinfeng@10.50.60.6
```

!!! Tips "Tips"
    If you want to log in without a password, you can search the internet for "ssh passwordless login".

### 3. Using Remote Desktop Login [Avoid]
On a Windows client computer, hold down the `Win R` shortcut key, enter `mstc` in the **Run** window that pops up. The Remote Desktop login window will appear.
Enter the server's IP address and **Connect**. Then enter the username and password.

![img](../../../assets/images/ubuntu_remote_desktop.jpg)

In general scenarios, VSCODE is recommended as the server connection tool. It is also recommended to install AI programming assistants like `CodeGeeX` in VSCODE (registration required).

|          | Suitable Scenarios       | Disadvantages             |
| -------- | ------------------------- | --------------- |
| VSCODE  | Text and code editing, jupyter analysis and plotting        | Frequent updates, complicated environment configuration, consumes server performance   |
| SSH     | Running temporary scripts or modifying environment         | Poor visualization            |
| Remote Desktop  | Graphical interface programs    | Laggy, limited by network quality  |