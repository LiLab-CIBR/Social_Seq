// 检查浏览器是否原生支持HLS
function playVideo(videoElement) {
    var playlistUrl = videoElement.getAttribute('data-src');
    
    if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
        // Safari浏览器原生支持HLS
        videoElement.src = playlistUrl;
    } else if (Hls.isSupported()) {
        // 浏览器不支持原生HLS，使用hls.js
        var hls = new Hls({
            // 配置选项以提高兼容性
            enableWorker: true,
            lowLatencyMode: true,
            backBufferLength: 90
        });
        hls.loadSource(playlistUrl);
        hls.attachMedia(videoElement);
    }
}

// 页面加载完成后初始化视频播放
document.addEventListener('DOMContentLoaded', function() {
    // 获取所有视频元素
    var videoElements = document.querySelectorAll('video[data-src]');
    
    // 为每个视频元素初始化播放器
    videoElements.forEach(function(videoElement) {
        playVideo(videoElement);
    });
});