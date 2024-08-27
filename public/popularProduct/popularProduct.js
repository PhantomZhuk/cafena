let menuOpen = false;

$(`.fa-bars`).click(() => {
    if (menuOpen == false) {
        $(`.menuConatiner`).css(`display`, `flex`);
        menuOpen = true;
    } else {
        $(`.menuConatiner`).css(`display`, `none`);
        menuOpen = false;
    }
});

$(document).on('mouseenter', '.coffeeContainer', function () {
    $(this).find('.btnContainer').css('display', 'flex');
});

$(document).on('mouseleave', '.coffeeContainer', function () {
    $(this).find('.btnContainer').css('display', 'none');
});

function loadingProducts() {
    axios.get(`/api/goods`)
        .then(res => {
            const data = res.data;

            for (el of data) {
                if (el.category == "popular") {
                    $(`.popularCoffeeContainer`).append(
                        `
                        <div class="coffeeContainer">
                            <img src="./${el.img}" alt="coffee">
                            <h2>${el.name}</h2>
                            <div class="coffeePrise">$${el.price}</div>
                            <div class="btnContainer">
                                <button id="${el.id}" class="btnBuy">Buy</button>
                            </div>
                    </div>
                    `
                    )
                }
            }
        })
}

loadingProducts();

$(`.fa-basket-shopping`).click(() => {
    $(`.cartContainer`).css(`display`, `flex`);
});

$(`.fa-xmark`).click(() => {
    $(`.cartContainer`).css(`display`, `none`);
});

function updateCart() {
    axios.get(`/api/goods/unformalizedOrders`)
        .then(res => {
            const data = res.data;
            $('.productContainer').empty();

            data.forEach(el => {
                $('.productContainer').append(
                    `
                    <div class="productInCart">
                        <img src="./${el.img}" alt="photo">
                        <div class="textContainer">
                            <h4 class="name">${el.name}</h4>
                            <div class="bottomBlock">
                                <div class="quantityProductContainer">
                                    <div class="btnPlusProduct"><i class="fa-solid fa-plus" id="plus${el.id}"></i></div>
                                    <div class="quantityProduct" id="quantityProduct${el.id}">${el.quantity}</div>
                                    <div class="btnMinusProduct"><i class="fa-solid fa-minus" id="minus${el.id}"></i></div>
                                </div>
                                <p class="price">${el.price * el.quantity}$</p>
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

updateCart();

$(`.popularCoffeeContainer`).click((e) => {
    const productId = e.target.id;
    const quantity = 1;

    axios.post(`/api/goods/order`, { productId, quantity })
        .then(res => {
            console.log(res.data.message);
            return axios.get(`/api/goods/unformalizedOrders`);
        })
        .then(res => {
            updateCart();
        })
        .catch(err => {
            console.error('Error processing the order:', err);
        });
});

$('.productContainer').on('click', '.fa-minus', (e) => {
    let productId = $(e.target).attr('id').replace('minus', '');
    let quantityElement = $(e.target).closest('.productContainer').find(`#quantityProduct${productId}`);
    let quantity = parseInt(quantityElement.text());

    if (quantity > 0) {
        axios.post(`/api/goods/order/reduceNumber`, { productId, quantity: 1 })
            .then(res => {
                if (quantity - 1 === 0) {
                    quantityElement.closest('.productInCart').remove();
                } else {
                    quantityElement.text(quantity - 1);
                }
                console.log(res.data.message);
                updateCart();
            })
            .catch(err => {
                console.error('Error reducing quantity:', err);
            });
    }
});

$('.productContainer').on('click', '.fa-plus', (e) => {
    let productId = $(e.target).attr('id').replace('plus', '');
    let quantityElement = $(e.target).closest('.productContainer').find(`#quantityProduct${productId}`);
    let quantity = parseInt(quantityElement.text());

    axios.post(`/api/goods/order`, { productId, quantity: 1 })
        .then(res => {
            quantityElement.text(quantity + 1);
            console.log(res.data.message);
            updateCart();
        })
        .catch(err => {
            console.error('Error adding quantity:', err);
        });
});

$(`#buyBtn`).click(() => {
    $(`.orderVerificationPopup`).css(`display`, `flex`);
    $(`.wrap`).css(`filter`, `blur(5px)`);
    $(`#emailIn`).focus();
});

$(`#sendEmailBtn`).click(() => {
    let email = $(`#emailIn`).val();
    let emailRegex = /([a-z\d]{3,64})+@([a-z]{3,255})+\.[a-z]{2,63}/;
    if (emailRegex.test(email)) {
        axios.post(`/api/goods/order/confirm`, { email })
            .then(res => {
                console.log(res.data.message);
                return axios.get(`/api/goods/unformalizedOrders`);
            })
            .then(res => {
                updateCart();
            })
            .catch(err => {
                console.error('Error confirming orders:', err);
            });

        $(`.orderVerificationPopup`).css(`animation`, `1.7s ease forwards draw`);
        $(`.animate`).css(`display`, `flex`);
        $(`.emailInputContainer`).css(`display`, `none`);

        setTimeout(() => {
            $(`.orderVerificationPopup`).css(`display`, `none`);
            $(`.orderVerificationPopup`).css(`animation`, `none`);
            $(`.emailInputContainer`).css(`display`, `flex`);
            $(`.animate`).css(`display`, `none`);
            $(`.wrap`).css(`filter`, `blur(0px)`);
        }, 1700);
    } else {
        $(`#emailIn`).css(`border`, `2px solid red`);
        $(`.notification`).text(`Your email isn't correct.`);
        $(`.notificationContainer`).css(`display`, `flex`);
        setTimeout(() => {
            $(`.notificationContainer`).css(`display`, `none`);
            $(`#emailIn`).css(`border`, `none`);
            $(`.notification`).text(``);
        }, 3000);
    }
});

$(`#adminBtn`).dblclick(()=>{
    window.location.href = `/admin`;
});

$(`#subscribeBtn`).click(() => {
    let emailRegex = /([a-z\d]{3,64})+@([a-z]{3,255})+\.[a-z]{2,63}/;
    let email = $(`#emailSubscriber`).val();
    if (emailRegex.test(email)) {
        let data = {
            email
        }

        $(`#emailSubscriber`).val(``);

        axios.post(`/subscribe`, data)
            .then(res => {
                console.log(res.data);
            })
    } else {
        $(`#emailSubscriber`).css(`border`, `2px solid red`);
        $(`.notification`).text(`Your email isn't correct.`);
        $(`.notificationContainer`).css(`display`, `flex`);
        setTimeout(() => {
            $(`.notificationContainer`).css(`display`, `none`);
            $(`#emailSubscriber`).css(`border`, `none`);
            $(`.notification`).text(``);
        }, 3000);
    }
});