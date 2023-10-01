function checkPassword () {
	const password = document.getElementById('password')! as HTMLInputElement;
	const submit = document.getElementById('submit')! as HTMLButtonElement;

	if (!password.value.length) {
		submit.disabled = true;
		submit.classList.add('disabled');
		submit.classList.remove('enabled');
		password.classList.remove('weak', 'average', 'strong');
	} else if (password.value.length < 5) {
		submit.disabled = true;
		submit.classList.add('disabled');
		submit.classList.remove('enabled');
		password.classList.add('weak');
		password.classList.remove('average', 'strong');
	} else if (password.value.length < 10) {
		submit.disabled = false;
		submit.classList.add('enabled');
		submit.classList.remove('disabled');
		password.classList.add('average');
		password.classList.remove('weak', 'strong');
	} else {
		submit.disabled = false;
		submit.classList.add('enabled');
		submit.classList.remove('disabled');
		password.classList.add('strong');
		password.classList.remove('average', 'weak');
	}
}
