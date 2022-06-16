$(document).ready(function() {
	let $fullImg = $('#full-img');
	let new_aspect = Number(Math.round($fullImg.width()/$fullImg.height() + 'e' + 4)+'e-'+4);
	let current_aspect = parseFloat($('#current-aspect').text());
	$('#aspect-input').val(new_aspect);
	if (new_aspect !== current_aspect) {
		$('form').submit();
	} else {
		$('#update-image').remove();
	}
}); 