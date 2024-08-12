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

    axios.post(`http://localhost:3000/subscribe`, data)
        .then(res => {
            console.log(res);
            window.location.href = `http://localhost:3000/home`;
        })
});