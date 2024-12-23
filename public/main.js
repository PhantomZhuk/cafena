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

let email;
$(`#subscribeBtn`).click(() => {
    if ($(`#emailSubscriber`).hasClass(`email`)) {
        let emailRegex = /([a-z\d]{3,64})+@([a-z]{3,255})+\.[a-z]{2,63}/;
        email = $(`.email`).val();
        if (emailRegex.test(email)) {
            $(`#emailSubscriber`).val(``);
            axios.post(`/sendConfirmationEmail`, { email })
                .then(res => {
                    console.log(res.data.message);
                    if (res.data.message == `Email sent successfully`) {
                        $('#emailSubscriber').removeClass('email');
                        $('#emailSubscriber').addClass('code');
                        $('#emailSubscriber').attr("placeholder", "Enter the code sent to your email.");
                        $(`.notification`).text(`The code was sent to your email!`);
                        $(`.notificationContainer`).css(`display`, `flex`);
                        setTimeout(() => {
                            $(`.notificationContainer`).css(`display`, `none`);
                            $(`#emailSubscriber`).css(`border`, `none`);
                            $(`.notification`).text(``);
                        }, 3000);
                    } else if (res.data.message == `Failed to send email`) {
                        $(`#emailSubscriber`).css(`border`, `2px solid red`);
                        $(`.notification`).text(`This email is already signed!`);
                        $(`.notificationContainer`).css(`display`, `flex`);
                        setTimeout(() => {
                            $(`.notificationContainer`).css(`display`, `none`);
                            $(`#emailSubscriber`).css(`border`, `none`);
                            $(`.notification`).text(``);
                        }, 3000);
                    }
                })
        } else {
            $(`#emailSubscriber`).css(`border`, `2px solid red`);
            $(`.notification`).text(`Your email isn't correct.`);
            $(`.notificationContainer`).css(`display`, `flex`);
            setTimeout(() => {
                $(`.notificationContainer`).css(`display`, `none`);
                $(`#emailSubscriber`).css(`border`, `none`);
                $(`.notification`).text(``);
            }, 3000);
        }
    } else if ($(`#emailSubscriber`).hasClass(`code`)) {
        $('#emailSubscriber').attr("placeholder", "Enter your email.");
        let code = $(`.code`).val();
        $('#emailSubscriber').addClass('email');
        $('#emailSubscriber').removeClass('code');
        $(`#emailSubscriber`).val(``);
        axios.post(`/subscribe`, { email, code })
            .then(res => {
                console.log(res.data.message);
                if (res.data.message == `data saved`) {
                    $(`.notification`).text(`You have subscribed to the newsletter.`);
                    $(`.notificationContainer`).css(`display`, `flex`);
                    setTimeout(() => {
                        $(`.notificationContainer`).css(`display`, `none`);
                        $(`.notification`).text(``);
                    }, 3000);
                } else {
                    $(`#emailSubscriber`).css(`border`, `2px solid red`);
                    $(`.notification`).text(`Code isn't correct.`);
                    $(`.notificationContainer`).css(`display`, `flex`);
                    setTimeout(() => {
                        $(`.notificationContainer`).css(`display`, `none`);
                        $(`#emailSubscriber`).css(`border`, `none`);
                        $(`.notification`).text(``);
                    }, 3000);
                }
            })
    }
});

$(`#adminBtn`).dblclick(() => {
    window.location.href = `/admin`;
});