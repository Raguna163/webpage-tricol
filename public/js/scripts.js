$(document).ready(function() {
	/* GLOBAL SCRIPTS */
	//Semantic triggers
	$('.ui.sticky').sticky({offset: 25, context: "#stuck"});
	$('.dropdown').dropdown();
	$('.message .close').on('click', function() {
	    $(this).closest('.message').transition('vertical flip');
	});

	//Show preview of file
	$('#file-input').change(function () {
		if (this.files && this.files[0]) {
			var reader = new FileReader();
		    reader.onload = function(e) {
		    	$('#preview-img').attr('src', e.target.result).on('load', function() {
			    	$('#preview-text').text(`Image Selected: ${this.width} - ${this.height} - ${this.width/this.height}`);
		      	});
		    } 
		    reader.readAsDataURL(this.files[0]);
		  }
	});
 
	$('#vid-file-input').change(function(e) {
		if (this.files) {
			$('#preview-vid').attr('src', URL.createObjectURL(e.target.files[0]));
			$('#preview-vid-text').text("Video Selected!");
		}
	});
	
	$('.submit-delete').on('click', function(){
		console.log($(this));
		$(this).next('form').submit();
	});
});