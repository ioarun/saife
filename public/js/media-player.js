var video = document.querySelector('.video')
var juice = document.querySelector('.orange-juice')
var btnPlayPause = document.getElementById('play-pause')
var btnReplay = document.getElementById('replay')
var btnFullScreen = document.getElementById('fullscreen')
var videoScreen = document.getElementsByClassName('c-video')

$('#video').on('loadstart', function (event) {
    $(this).addClass('loading');
  });
  $('#video').on('canplay', function (event) {
    $(this).removeClass('loading');
    $(this).attr('poster', '');
  });
  
function togglePlayPause(){
	if(video.paused){
		btnPlayPause.className = 'fa fa-pause-circle';
		video.play();
	}
	else{
		btnPlayPause.className = 'fa fa-play-circle';
		video.pause();
	}
}

function Replay(){
	video.pause();
    video.currentTime = '0';
    video.play();
}

function toggleFullScreen() {
	if (document.fullscreenEnabled) {
		// supported
		console.log("Fullscreen allowed!");

		if (!document.fullscreenElement) {
			document.querySelector("#c-video").requestFullscreen();
			btnFullScreen.className = "fas fa-compress-arrows-alt";
		} 
		else {
			if (document.exitFullscreen) {
				btnFullScreen.className = "fas fa-expand";
				document.exitFullscreen();
			}
		}
	  }
	  else {
		console.log("Fullscreen not allowed!");
	}
}	

btnPlayPause.onclick = function() {
	togglePlayPause();
}

btnReplay.onclick = function () {
	Replay();
}

btnFullScreen.onclick = function() {
	toggleFullScreen();
}

video.addEventListener('timeupdate', function(){
	var juicePos = video.currentTime / video.duration;
	juice.style.width = juicePos * 100 + "%";
})

