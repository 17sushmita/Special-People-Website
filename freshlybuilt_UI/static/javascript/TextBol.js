// Variables for Preview
let regExp= /[ 0-9a-zA-Z\^\&\'\@\{\}\[\]\,\$\=\!\-\#\(\)\.\%\+\~\_ ]+$/;
// Variables for Audio
var songs = [];
var songTitle = document.getElementById("songTitle");
var fillBar = document.getElementById("fill");
var song = new Audio();
    var currentSong = 0;  
    var currentTime = song.currentTime;  
    
// Audio player
window.onload = playSong; 
/**
 * Play the Audio from current time of Audio and update Audio file name
 */  
function playSong(){
	song.src = "static/audio/"+songs[currentSong];  
    songTitle.textContent = songs[currentSong]; 
    song.currentTime=currentTime;
    song.play();    

}
/**
 * Play or Pause the Audio
 */
function playOrPauseSong(){
	if(song.paused){
		song.play();
		$("#play img").attr("src","static/images/Pause.png");
	}
	else{
		song.pause();
		$("#play img").attr("src","static/images/Play.png");
	}
}
song.addEventListener('timeupdate',function(){ 
	var	position = song.currentTime / song.duration;
	fillBar.style.width = position * 100 +'%';
});
/**
 * Seek Audio to 5 seconds ahead from the current time of Audio
 */
function next(){
    //currentSong++;
    currentTime+=5;
    /*
    if(currentSong > 2){
	    currentSong = 0;
	}*/
	playSong();
	$("#play img").attr("src","static/images/Pause.png");
}
/**
 * Seek Audio to 5 seconds back from current time of Audio
 */
function pre(){
    //currentSong--;
    currentTime-=5;
    /*
    if(currentSong < 0){
		currentSong = 2;
	}*/
	playSong();
	$("#play img").attr("src","static/images/Pause.png");
}


// Convert text to audio
$(document).ready(function(){
    $('#text-bol-form').on('submit',(function(e) {
            e.preventDefault();
            var formData = new FormData(this);
    
            $.ajax({
                type:'POST',
                url: $(this).attr('action'),
                data:formData,
                cache:false,
                contentType: false,
                processData: false,
                beforeSend: function(){
                    // Show image container
                    $("#text").hide();
                    $('#loader').show();
                },
                success:function(data){
                    $('#audioDownload').attr('href',"static/audio/"+data.audio);
                    $('#audioDownload').attr('download',data.audio);
                    songs[0]=data.audio
                    playSong();
                    $("#play img").attr("src","static/images/Pause.png");
                    //song.src="static/audio/"+data.text;
                    //song.play()
                },
                complete:function(data){
                    // Hide image container
                    $("#text").show();
                    $('#loader').hide();
                   },
                error: function(data){
                    //$('#errorAlert').text('Oops!! Something went wrong!!').show();
                    alert('Oops!! Soething went wrong!!')
                }
            });
        
        }));
    });



