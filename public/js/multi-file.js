// MULTI-FILE JS
$(document).ready(function() {
	//Multiple file upload
	$('#multi-file-input').change(function () {
		$('button').addClass('loading');
		if (this.files) {
			let $mpi = $('#multi-preview-img');
			$mpi.children().remove();
			$.each(this.files, (i, file) => {
			    var reader = new FileReader();
			    reader.onload = event => {
			    	let $imgObj = $('<img>', {src: event.target.result, class: "ui two wide column" });
			    	$mpi.append($imgObj);
			    } 
			    reader.readAsDataURL(file);
		    });
		}
		$('button').removeClass('loading');
	});
});