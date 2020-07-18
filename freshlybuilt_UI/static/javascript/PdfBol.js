const wrapper=document.querySelector(".wrapper");
const fileName=document.querySelector(".file-name");
const cancelBtn=document.querySelector("#cancel-btn");
const defaultBtn = document.querySelector("#pdf-file");
const uploadBtn = document.querySelector("#upload-btn");
const canvas = document.querySelector("#pdf_renderer");
let regExp= /[ 0-9a-zA-Z\^\&\'\@\{\}\[\]\,\$\=\!\-\#\(\)\.\%\+\~\_ ]+$/;
// Variables for Audio
var songs = [];
var songTitle = document.getElementById("songTitle");
var fillBar = document.getElementById("fill");
var song = new Audio();
    var currentSong = 0;  
    var currentTime = song.currentTime;  
    /**
     * Activates the input file tag on clicking Upload Button from sidebar
     */
    function defaultBtnActive(){
       defaultBtn.click();
    }

  
// PDF preview
var myState = {
    pdf: null,
    currentPage: 1,
    zoom: 1
}
document.querySelector("#pdf-file").addEventListener('change', function() {
    // user selected file
    var file = this.files[0];
    pdf_url = URL.createObjectURL(file);
    pdfjsLib.getDocument({url: pdf_url}).then((pdf) => {
    myState.pdf = pdf; 
    render();
});
cancelBtn.addEventListener("click", function(){
    defaultBtn.value="";
    canvas.setAttribute('hidden','hidden');
     wrapper.classList.remove("active");
  });
if(this.value){
    let valueStore=this.value.match(regExp);
    fileName.textContent= valueStore; 
    }

});

/**
 * render the current page of PDF to canvas
 */
function render() {

    myState.pdf.getPage(myState.currentPage).then((page) => {
 
        var canvas = document.getElementById("pdf_renderer");
        canvas.removeAttribute('hidden');

        var ctx = canvas.getContext('2d');
         
        var viewport = page.getViewport(canvas.width / page.getViewport(1.0).width);
        canvas.width = viewport.width;
        canvas.height = viewport.height; 
        page.render({
            canvasContext: ctx,
            viewport: viewport
        });
        wrapper.classList.add("active");
        var x = document.getElementById("navigation-controls");

        x.style.display = "block";
          
        
    });
}


document.getElementById('go_previous').addEventListener('click', (e) => {
    if(myState.pdf == null || myState.currentPage == 1) return;
        myState.currentPage -= 1;
        document.getElementById("current_page").value = myState.currentPage;
        render();

});

document.getElementById('go_next').addEventListener('click', (e) => {
    if(myState.pdf == null || myState.currentPage >= myState.pdf._pdfInfo.numPages) 
        return;
                
    myState.currentPage += 1;
    document.getElementById("current_page").value = myState.currentPage;
    render();
});

document.getElementById('current_page').addEventListener('keypress', (e) => {
    if(myState.pdf == null) return;
         
    // Get key code
    var code = (e.keyCode ? e.keyCode : e.which);
         
    // If key code matches that of the Enter key
    if(code == 13) {
        var desiredPage = document.getElementById('current_page').valueAsNumber;
                                 
        if(desiredPage >= 1 && desiredPage <= myState.pdf._pdfInfo.numPages) {
            myState.currentPage = desiredPage;
            document.getElementById("current_page").value = desiredPage;
            render();
        }
    }
});


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
                $("#pdf_renderer").hide();
                $("#loader").show();
               },
            success:function(data){
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
                $("#pdf_renderer").show();
                $("#loader").hide();
               },
            error: function(data){
                //$('#errorAlert').text('Oops!! Something went wrong!!').show();
                alert('Oops!! Something went wrong!!')
            }

        });
    }));

});
