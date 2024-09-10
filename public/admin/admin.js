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
            const uniquePhones = [...new Set(data.map(order => order.phone))];
            for (let phone of uniquePhones) {
                $('.OredrsContainer').append(
                    `
                    <div class="userOrderContainer">
                        <div class="userHeader">
                            <h2>${phone}</h2>
                        </div>
                        <div class="mainOrderContainer" id="ordersFor_${phone.replace(/[\s()\-+]/g, '_')}">
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
    const uniquePhones = [...new Set(data.map(order => order.phone))];

    for (let phone of uniquePhones) {
        const ordersForPhone = data.filter(order => order.phone === phone);
        const phoneContainer = $(`#ordersFor_${phone.replace(/[\s()\-+]/g, '_')}`);

        for (let el of ordersForPhone) {
            phoneContainer.append(
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

$('.sentRecipientsContainer').text(0);
function getStatus() {
    axios.get('/status')
        .then(res => {
            $('.sentRecipientsContainer').text(res.data.currentmail);
        })
        .catch(error => {
            console.error('Помилка при отриманні статусу:', error);
        });
}

$(`#sendMessage`).click(() => {
    let massage = $(`#messageText`).val();

    $(`.notificationContainer`).css(`display`, `flex`);
    $(`.notification`).text(`The shipment is underway!`);
    $(`.notificationContainer`).css(`border`, `1px solid #eab665`);
    $(`.notificationContainer`).css(`box-shadow`, `0 0 5px 1px #b3b2b2`);
    $(`.totalRecipientsContainer`).text(numberFollower);
    $(`.durationScreen`).css(`display`, `flex`);
    $(`.notificationTextContainer`).css(`display`, `none`);
    $(`.notificationContainer`).css(`animation`, `none`);
    $('.sentRecipientsContainer').text(0);
    let status = setInterval(getStatus, 500);
    axios.post(`/sendMessage`, { massage })
        .then(res => {
            if (res.status == 200) {
                clearInterval(status);
                $(`.notification`).text(`The shipment is complete!`);
                $(`.durationScreen`).css(`display`, `none`);
                $(`.notificationTextContainer`).css(`display`, `flex`);
                $(`.notificationContainer`).css(`border`, `1px solid #40ab40`);
                $(`.notificationContainer`).css(`box-shadow`, `0 0 5px 1px #40ab40`);
                $(`.notificationContainer`).css(`animation`, `3s ease forwards draw`);
                setTimeout(() => {
                    $(`.notificationContainer`).css(`display`, `none`);
                }, 3000);
            }
            console.log(res);
        })
});