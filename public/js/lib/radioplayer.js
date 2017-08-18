$(function(){ 
	var audioElement = document.createElement('audio');
	//audio(src='https://majestic.wavestreamer.com:1831/;')#radio
	audioElement.setAttribute("src", "https://majestic.wavestreamer.com:1831/;")

	var isPlaying = false;
    
    audioElement.addEventListener('ended', function() {
        this.play();
    }, false);
    
    audioElement.addEventListener("canplay",function(){
        
    });
    
    audioElement.addEventListener("timeupdate",function(){
   		/*$.ajax({
   			url: "https://majestic.wavestreamer.com:1831/currentsong?sid=1",
   			type: "GET",
   			headers: {
            	'Access-Control-Allow-Origin': '*',
            	'Content-Type': 'text/plain;charset=utf-8'
            }
   		}).done(function( data ) {
    		console.log(data);
  		});*/
    });
    
    $('#play').click(function() {
    	if(isPlaying){
    		audioElement.pause();
        	$("#play").text("▶");
        	isPlaying = false;
    	}else{
    		audioElement.play();
        	$("#play").text("❚❚");
        	isPlaying = true;
    	}
    });
}); 