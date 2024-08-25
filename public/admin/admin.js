$(`#adminBtn`).click(() => {
    window.location.href = `http://localhost:3000`;
});

$(`#ordersBtn`).click(() => {
    $(`.OredrsContainer`).css(`display`, `flex`);
    $(`.followersContainer`).css(`display`, `none`);
});

$(`#followersBtn`).click(() => {
    $(`.OredrsContainer`).css(`display`, `none`);
    $(`.followersContainer`).css(`display`, `flex`);
});

$(`#followersList`).click(() => {
    $(`.followersList`).css(`display`, `flex`);
    $(`.sendMessageContactor`).css(`display`, `none`);
});

$(`#clearingFollowers`).click(() => {
    $(`.followersList`).css(`display`, `none`);
    $(`.sendMessageContactor`).css(`display`, `flex`);
});

function updateOrderCart() {
    axios.get(`/api/goods/orders`)
        .then(res => {
            const data = res.data;
            $('.OredrsContainer').empty();

            data.forEach(el => {
                $('.OredrsContainer').append(
                    `
                    <div class="userOrderContainer">
    <div class="userHeader">
        <h2>${el.email}</h2>
    </div>
    <div class="mainOrderContainer">
        <div class="productInCart">
            <div class="imgContainer">
                <img src="./${el.img}" alt="photo">
            </div>
            <div class="textContainer">
                <h4 class="name">${el.name}</h4>
                <div class="bottomBlock">
                    <div class="quantityProduct" id="quantityProduct${el.id}">${el.quantity} Qty</div>
                    <p class="price">${el.price} $</p>
                </div>
            </div>
        </div>
    </div>
</div>
                    `
                );
            });
        })
        .catch(err => {
            console.error('Error updating cart:', err);
        });
}

updateOrderCart();

let numberFollower = 0;

function updateFolowerCart() {
    axios.get(`http://localhost:3000/followerList`)
        .then(res => {
            $(`.followersList`).empty();
            for (let el of res.data) {
                numberFollower++
                $(`#numberFollower`).text(numberFollower)
                $(`.followersList`).append(`
                    <div class="followerContainer">
                        <h2>${el.email}</h2>
                        <p>${el.time}</p>
                        <div class="deleteFollowerBtn" id="delete${el.email}">
                            <i class="fa-solid fa-trash-can"></i>
                        </div>
                    </div>
        `)
            }
        })
}

updateFolowerCart()

$(`.wrap`).click((e) => {
    let id = $(e.target).attr('id');
    
    if (id && id.includes('delete')) {
        let email = id.replace('delete', '').trim();
        
        axios.post(`http://localhost:3000/deleteFollower`, { email })
            .then(res => {
                console.log(res.data.message);
                updateFolowerCart();
            })
            .catch(err => {
                console.error('Error deleting follower:', err);
            });
    }
});
