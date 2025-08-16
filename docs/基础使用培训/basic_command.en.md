# Some Basic Skills
* Use `htop` to check CPU and memory usage
* Use `nv` command to check GPU usage.

Add the following commands to `~/.bashrc`, then restart the terminal.

```bash
# Use `nv` command to check GPU usage
alias nv='watch -n 1 nvidia-smi'

# Use specific GPUs (0,1,2,3), other GPUs are not used
# $choosecuda 0,1,2,3   $choosecuda 3
function choosecuda {
    if [ -z "$1" ]; then num=0; else num="$1" ; fi
    CUDA_VISIBLE_DEVICES=$num
    export CUDA_VISIBLE_DEVICES
}

# Use killcuda to forcibly release GPU memory usage of the current account
# $killcuda
alias killcuda="ps -o pid= -u $(whoami) | \
grep -wFf  <( nvidia-smi -q -x | grep pid | sed -e 's/<pid>//g' -e 's/<\/pid>//g' -e 's/^[[:space:]]*//' | sort | uniq ) | \
xargs kill -9 "

# Use killcuda2 to forcibly release GPU memory usage of all accounts
# $sudo killcuda2
alias killcuda2="fuser -v /dev/nvidia-uvm  2> /dev/null | xargs kill -9 "

# Find files containing specific keywords in Python files in the current folder
# $findgrep WORDS
alias findgrep='find . -name "*.py" -type f -exec echo "{}" \; | xargs grep -n '
```

* `choosecuda` is used to select GPU IDs.
* `killcuda` and `killcuda2` are used to release GPU usage.

!!! Warning "Warning"
    Before using GPU, first check the GPU usage with the `nv` command, and use `choosecuda` to select idle GPUs. If a GPU has high memory usage but low computing utilization, use `killcuda` to release it. `choosecuda` is only temporarily effective for the current terminal, and will be invalid after terminal restart or across terminals.

* `findgrep` is used to search for keywords in Python code

* Mount the Synology cloud disk path to the server. Replace `username` with the Synology username and `uid` with the server account username. The Synology user password will be required.

```bash
sudo mkdir /mnt/liying.cibr.ac.cn_usb3  #Create folder

# Mount the Synology path to the server
sudo mount -t cifs -o \
 vers=2.0,username=chenxinfeng \
 //liying.cibr.ac.cn/usbshare3-2 \
 /mnt/liying.cibr.ac.cn_usb3/ -o \
 uid=chenxinfeng,file_mode=0766,dir_mode=0777
```

!!! Warning "Warning"
    file_mode=0766,dir_mode=0777 permissions are too broad, giving all users modification permissions for Synology files. This may pose a risk to Synology files. If permissions are too tight, mounting may not work smoothly. Please control file_mode and dir_mod permissions as needed.