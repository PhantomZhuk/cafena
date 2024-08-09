$(`#lognUp`).click(()=>{
    $(`.lognUpContainer`).css(`display`, `flex`);
    $(`.lognInContainer`).css(`display`, `none`);
    $(`#lognUp`).addClass(`chosen`);
    $(`#lognIn`).removeClass(`chosen`);
});

$(`#lognIn`).click(()=>{
    $(`.lognUpContainer`).css(`display`, `none`);
    $(`.lognInContainer`).css(`display`, `flex`);
    $(`#lognUp`).removeClass(`chosen`);
    $(`#lognIn`).addClass(`chosen`);
});