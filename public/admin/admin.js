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

$('.sentRecipientsContainer').text(0);
function getStatus() {
    axios.get('/status')
        .then(res => {
            $('.sentRecipientsContainer').text(res.data.currentmail);
            console.log(res)
        })
        .catch(error => {
            console.error('Помилка при отриманні статусу:', error);
        });
}

// let hours = 0;
// let minutes = 0;
// let seconds = 0;
$(`#sendMessage`).click(() => {
    let massage = $(`#messageText`).val();
    $(`#messageText`).val(``);
    $(`.notification`).text(`The shipment is underway!`);
    $(`.notificationContainer`).css(`display`, `flex`);
    $(`.notificationContainer`).css(`border`, `1px solid #eab665`);
    $(`.notificationContainer`).css(`box-shadow`, `0 0 5px 1px #b3b2b2`);
    $(`.durationScreen`).css(`display`, `flex`);
    $(`.notificationTextContainer`).css(`display`, `none`);
    $(`.totalRecipientsContainer`).text(numberFollower);

    // let totalSecond = numberFollower;
    // function convertSecondsToTime(totalSecond){
    //     hours = Math.floor(totalSecond / 3600);
    //     minutes = Math.floor((totalSecond % 3600) / 60);
    //     seconds = totalSecond % 60;
    
    //     let formattedHours = hours < 10 ? '0' + hours : hours;
    //     let formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    //     let formattedSeconds = seconds < 10 ? '0' + seconds : seconds;
    
    //     $(`.hour`).text(formattedHours);
    //     $(`.minute`).text(formattedMinutes);
    //     $(`.second`).text(formattedSeconds);    
    // }

    // convertSecondsToTime(totalSecond);

    // let timeStatus = setInterval(() => {
    //     totalSecond--
    //     convertSecondsToTime(totalSecond);
    // }, 1000);;

    let status = setInterval(getStatus, 500);
    axios.post(`/sendMessage`, { massage })
        .then(res => {
            if (res.status == 200) {
                clearInterval(status);
                $(`.notification`).text(`The shipment is complete!`);
                $(`#spinner`).css(`display`, `none`);
                $(`.notificationTextContainer`).css(`display`, `flex`);
                $(`.notificationContainer`).css(`border`, `1px solid #40ab40`);
                $(`.notificationContainer`).css(`box-shadow`, `0 0 5px 1px #40ab40`);
                $(`.notificationContainer`).css(`animation`, `1.7s ease forwards draw`);
                $(`.durationScreen`).css(`display`, `none`);
                setTimeout(() => {
                    $(`.notificationContainer`).css(`display`, `none`);
                    $(`.notification`).text(``);
                }, 3000);
            }
            console.log(res);
        })
});