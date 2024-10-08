$(`#lognUp`).click(() => {
    $(`.lognUpContainer`).css(`display`, `flex`);
    $(`.lognInContainer`).css(`display`, `none`);
    $(`#lognUp`).addClass(`chosen`);
    $(`#lognIn`).removeClass(`chosen`);
});

$(`#lognIn`).click(() => {
    $(`.lognUpContainer`).css(`display`, `none`);
    $(`.lognInContainer`).css(`display`, `flex`);
    $(`#lognUp`).removeClass(`chosen`);
    $(`#lognIn`).addClass(`chosen`);
});

$(`#lognUpBtn`).click(() => {
    let data = {
        login: $(`#loginUp`).val(),
        email: $(`#emailUp`).val(),
        password: $(`#passwordUp`).val(),
    }

    $(`#loginUp`).val(``);
    $(`#emailUp`).val(``);
    $(`#passwordUp`).val(``);

    axios.post(`/signup`, data)
        .then(res => {
            console.log(res);
            window.location.href = `/profile`;
        })
});

$(`#lognInBtn`).click(() => {
    let data = {
        email: $(`#emailIn`).val(),
        password: $(`#passwordIn`).val(),
    }

    $(`#emailIn`).val(``);
    $(`#passwordIn`).val(``);

    axios.post(`/signin`, data)
        .then(res => {
            console.log(res);
            if (res.data == false) {
                alert(`Користувача не знайдено`)
            } else if (res.data == true) {
                window.location.href = `/profile`;
            }
        })
});