let menuOpen = false;

$(`.fa-bars`).click(() => {
    if (menuOpen == false) {
        $(`.menuConatiner`).css(`display`, `flex`);
        menuOpen = true;
    } else {
        $(`.menuConatiner`).css(`display`, `none`);
        menuOpen = false;
    }
});

$('#login, #email, #password').prop('disabled', true);

$('#unlockLogin').on('click', function () {
    $('#login').prop('disabled', false);
    $('#login').focus();
});

$('#unlockPassword').on('click', function () {
    $('#password').prop('disabled', false);
    $('#password').focus();
    $('#password').attr('type', 'text');
});

axios.get('/userData')
.then(res => {
    $('#login').val(res.data.login);
    $('#email').val(res.data.email);
    $('#password').val(res.data.password);
})
.catch(error => {
    console.error('Error fetching user data:', error);
});
