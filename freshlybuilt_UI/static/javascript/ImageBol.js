// Variables for Preview
const wrapper=document.querySelector(".wrapper");
const fileName=document.querySelector(".file-name");
const cancelBtn=document.querySelector("#cancel-btn");
const defaultBtn = document.querySelector("#original-image");
const cameraBtn = document.querySelector("#camera-btn");
const uploadBtn = document.querySelector("#upload-btn");
const img = document.querySelector("#img1");
let regExp= /[ 0-9a-zA-Z\^\&\'\@\{\}\[\]\,\$\=\!\-\#\(\)\.\%\+\~\_ ]+$/;
// Variables for Audio
var songs = [];
var songTitle = document.getElementById("songTitle");
var fillBar = document.getElementById("fill");
var song = new Audio();
    var currentSong = 0;  
    var currentTime = song.currentTime;  
    // Preview
    /**
     * Activate camera or upload button to take image input
     * @param {String} clicked_id id of the clicked HTML attribute
     */
    function defaultBtnActive(clicked_id){
       if(clicked_id=='camera-btn'){
           defaultBtn.setAttribute('capture','environment');
       }
       defaultBtn.click();
    }
    defaultBtn.addEventListener("change", function(){
      const file=this.files[0];
      if(file){
        const reader= new FileReader();
        reader.onload=function(){
          const result= reader.result;
          img.src=result;
          wrapper.classList.add("active");
        }
        cancelBtn.addEventListener("click", function(){
          img.src="";
           wrapper.classList.remove("active");
        });  
        reader.readAsDataURL(file);
      }
      if(this.value){
        let valueStore=this.value.match(regExp);
        fileName.textContent= valueStore; 
        }
    });
// Audio player
        window.onload = playSong;   
        function playSong(){
			song.src = "static/audio/"+songs[currentSong];  
            songTitle.textContent = songs[currentSong]; 
            song.currentTime=currentTime;
            song.play();    

        }
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


//upload and scan image
$(document).ready(function (e) {
    $('form').on('submit',(function(e) {
        
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
                $("#img1").attr('style','opacity:0.3');
                $("#loader").show();
               },
            success:function(data){
                $('#img1').attr("src","static/image/scanned/"+data.image);
                $('#audioDownload').attr('href',"static/audio/"+data.text);
                $('#audioDownload').attr('download',data.text);
				songs[0]=data.text
				playSong();
				$("#play img").attr("src","static/images/Pause.png");
				//song.src="static/audio/"+data.text;
				//song.play()
            },
            complete:function(data){
                // Hide image container
                $("#img1").attr('style','opacity:1');
                $("#loader").hide();
               },
            error: function(data){
                //$('#errorAlert').text('Oops!! Something went wrong!!').show();
                alert('Oops!! Soething went wrong!!')
            }

        });
    }));

});




