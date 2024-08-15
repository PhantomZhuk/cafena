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

$(`.coffeeContainer1`).hover(()=>{
        $(`.btnContainer1`).css(`display`, `flex`)
},
()=>{
    $(`.btnContainer1`).css(`display`, `none`)
})

$(`.coffeeContainer2`).hover(()=>{
    $(`.btnContainer2`).css(`display`, `flex`)
},
()=>{
$(`.btnContainer2`).css(`display`, `none`)
})

$(`.coffeeContainer3`).hover(()=>{
    $(`.btnContainer3`).css(`display`, `flex`)
},
()=>{
$(`.btnContainer3`).css(`display`, `none`)
})

$(`.coffeeContainer4`).hover(()=>{
    $(`.btnContainer4`).css(`display`, `flex`)
},
()=>{
$(`.btnContainer4`).css(`display`, `none`)
})

$(`.coffeeContainer5`).hover(()=>{
    $(`.btnContainer5`).css(`display`, `flex`)
},
()=>{
$(`.btnContainer5`).css(`display`, `none`)
})

$(`.coffeeContainer6`).hover(()=>{
    $(`.btnContainer6`).css(`display`, `flex`)
},
()=>{
$(`.btnContainer6`).css(`display`, `none`)
})