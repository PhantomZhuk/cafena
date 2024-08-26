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

$(`#subscribeBtn`).click(() => {
    let data = {    
        email: $(`#emailSubscriber`).val(),
    }

    $(`#emailSubscriber`).val(``);

    axios.post(`/subscribe`, data)
        .then(res => {
            console.log(res.data);
        })
});

$(`#adminBtn`).dblclick(()=>{
    window.location.href = `/admin`;
});