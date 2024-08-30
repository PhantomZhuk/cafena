$(`#adminBtn`).click(() => {
    window.location.href = `/`;
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

function updateOrderMainCart() {
    axios.get(`/api/goods/orders`)
        .then(res => {
            const data = res.data;
            $('.OredrsContainer').empty();
            const uniqueEmails = [...new Set(data.map(order => order.email))];
            for (let email of uniqueEmails) {
                $('.OredrsContainer').append(
                    `
                    <div class="userOrderContainer">
                        <div class="userHeader">
                            <h2>${email}</h2>
                        </div>
                        <div class="mainOrderContainer" id="ordersFor_${email.replace(/[@.]/g, '_')}">
                        </div>
                    </div>
                    `
                );
            }
            updateOrderCart(data);
        })
        .catch(err => {
            console.error('Error updating cart:', err);
        });
}

function updateOrderCart(data) {
    const uniqueEmails = [...new Set(data.map(order => order.email))];

    for (let email of uniqueEmails) {
        const ordersForEmail = data.filter(order => order.email === email);
        const emailContainer = $(`#ordersFor_${email.replace(/[@.]/g, '_')}`);

        for (let el of ordersForEmail) {
            emailContainer.append(
                `
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
                `
            );
        }
    }
}

updateOrderMainCart();

let numberFollower = 0;
$(`#numberFollower`).text(numberFollower)

function updateFolowerCart() {
    axios.get(`/followerList`)
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

        numberFollower--
        $(`#numberFollower`).text(numberFollower)

        axios.post(`/deleteFollower`, { email })
            .then(res => {
                console.log(res.data.message);
                updateFolowerCart();
            })
            .catch(err => {
                console.error('Error deleting follower:', err);
            });
    }
});


$(`#sendMessage`).click(() => {
    let massage = $(`#messageText`).val();
    console.log(massage)
    $(`.notification`).text(`Триває відправка`);
    $(`.notificationContainer`).css(`display`, `flex`);
    axios.post(`/sendMessage`, { massage })
        .then(res => {
            if (res.status == 200) {
                $(`.notification`).text(`Відправку завершено!`);
                $(`.notificationContainer`).css(`background-color`, `green`);
                $(`#spinner`).css(`display`, `none`);
                setTimeout(() => {
                    $(`.notificationContainer`).css(`display`, `none`);
                    $(`.notification`).text(``);
                }, 3000);
            }
            console.log(res);
        })
});