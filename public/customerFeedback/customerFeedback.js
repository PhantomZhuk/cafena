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