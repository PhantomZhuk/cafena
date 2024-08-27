let menuOpen = false;

$(`.fa-bars`).click(()=>{
    if(menuOpen == false){
        $(`.menuConatiner`).css(`display`, `flex`);
        menuOpen = true;
    }else {
        $(`.menuConatiner`).css(`display`, `none`);
        menuOpen = false;
    }
});

$(`#adminBtn`).dblclick(()=>{
    window.location.href = `/admin`;
});

$(`#subscribeBtn`).click(() => {
    let emailRegex = /([a-z\d]{3,64})+@([a-z]{3,255})+\.[a-z]{2,63}/;
    let email = $(`#emailSubscriber`).val();
    if (emailRegex.test(email)) {
        let data = {
            email
        }

        $(`#emailSubscriber`).val(``);

        axios.post(`/subscribe`, data)
            .then(res => {
                console.log(res.data);
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
});