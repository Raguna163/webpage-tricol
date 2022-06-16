$(document).ready(function() {
	$('#new-comment').click(function() {
		$('#comment-modal').modal('show');
		$('#comment-modal input').focus();
	});

	$('.collapse-replies').on('click', function() {
		$(this).parentsUntil('.comments').find('.comments').toggleClass('collapsed');
		$(this).find('i').toggleClass('down').toggleClass('up');
		$(this).find('span').toggle();
	});

	$('.reply-comment').click(function() {
	  let $this = $('#reply-modal');
	  let replyAction = $this.find('form').attr('action') + $(this).data('id');
	  $this.find('span').text($(this).data('author'));
	  $this.find('form').attr('action', replyAction);
	  $this.modal('show');
	  $this.find('input').focus();
	});
}); 