const semantic_colours = ['black','red','orange','yellow','olive','green','teal','blue','violet','purple','pink','brown','grey'];

$(document).ready(function() {
	$('#colour-select').change(function() {
		$('.container').removeClass(semantic_colours).addClass($(this).val());
		$('button').removeClass(semantic_colours).addClass($(this).val());
	});

	//Show preview of file
	$('#avatar-input').change(function () {
		if (this.files && this.files[0]) {
			var reader = new FileReader();
			reader.onload = function(e) {
				$('#preview-img').attr('src', e.target.result).on('load', function() {
					$('#preview-text').text("Image Selected");
				});
			} 
			reader.readAsDataURL(this.files[0]);
		}
		let new_val = $(this).val().split('\\')[2].split('.')[0]
		$('#user-name').val(new_val);
		$('#pass-word').val(new_val.toLowerCase());
		$('#pass-words').val(new_val.toLowerCase());
	});
 
	$('.ui.form')
	.form({
		inline: true,
		fields: {
			name: {
				identifier: 'username',
				rules: [{ type: 'empty', prompt : 'Please enter a username!' }]
			},
			country: {
				identifier: 'country',
				rules: [{ type: 'empty', prompt: 'Please select a country' }]
			},
			colour: {
				identifier: 'colour',
				rules: [{ type: 'empty', prompt: 'Please select a colour' }]
			},
			gender: {
				identifier: 'gender',
				rules: [{ type: 'empty', prompt: 'Please select a gender' }]
			},
			username: {
				identifier: 'username',
				rules: [{ type: 'empty', prompt : 'Please enter a username' }]
			},
			password: {
				identifier: 'password',
				rules: [
					{ type: 'empty', prompt: 'Please enter a password' },
					{ type: 'match[passwords]', prompt: 'Passwords do not match!'}
				]
			},
			passwords: {
				identifier: 'passwords',
				rules: [
					{ type: 'empty', prompt: 'Please enter a password'},
					{ type: 'match[password]', prompt: 'Passwords do not match!'}
				]
			},
			terms: {
				identifier: 'terms',
				rules: [
				{
					type   : 'checked',
					prompt : 'You must agree to the terms and conditions'
				}
				]
			}
		}
	});
});