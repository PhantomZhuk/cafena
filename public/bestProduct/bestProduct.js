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

function loadingProducts() {
    axios.get(`/api/goods`)
        .then(res => {
            const data = res.data;

            for (el of data) {
                if (el.category == "best") {
                    $(`.cardContainer`).append(
                        `
                        <div class="card">
                    <div class="imgBox">
                        <img src="./img/${el.filename}" alt="photo">
                    </div>
                    <div class="rating">Rating: <svg width="17" height="16" viewBox="0 0 17 16" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M13.319 15.0629C13.3867 15.0575 13.4486 15.0237 13.4893 14.9701C13.5299 14.9166 13.5455 14.8484 13.5319 14.7827L12.4454 9.56824L16.4255 5.9817H16.4253C16.4946 5.91995 16.5207 5.8237 16.4918 5.736C16.4631 5.64829 16.3849 5.58539 16.2919 5.57537L10.9362 4.98131L8.71215 0.136812L8.71232 0.136976C8.67372 0.0535408 8.58947 0 8.49667 0C8.40388 0 8.31962 0.0535408 8.28102 0.136976L6.05702 4.98147L0.70125 5.57553V5.57537C0.608455 5.58539 0.530276 5.64829 0.501533 5.736C0.472791 5.8237 0.498741 5.91995 0.568049 5.9817L4.54809 9.56824L3.46163 14.7827H3.46146C3.44208 14.8729 3.47805 14.966 3.55328 15.0204C3.62866 15.0749 3.72934 15.0805 3.81048 15.035L8.49688 12.4039L13.1833 15.035C13.2248 15.0575 13.2723 15.0674 13.3194 15.0629H13.319ZM12.9616 14.3708L8.61285 11.9304C8.54076 11.8901 8.45239 11.8901 8.38029 11.9304L4.03152 14.3708L5.03863 9.53473H5.03847C5.05555 9.45326 5.02747 9.36901 4.96473 9.31349L1.27127 5.98188L6.24148 5.43268C6.32426 5.42414 6.39653 5.37306 6.43151 5.29817L8.49666 0.79803L10.5618 5.29817C10.5968 5.37306 10.6691 5.42398 10.7518 5.43268L15.7221 5.98188L12.0286 9.31349C11.9659 9.36901 11.9378 9.45326 11.9549 9.53473L12.962 14.3708H12.9616Z"
                                fill="#EAB665" />
                        </svg><svg width="17" height="16" viewBox="0 0 17 16" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M13.319 15.0629C13.3867 15.0575 13.4486 15.0237 13.4893 14.9701C13.5299 14.9166 13.5455 14.8484 13.5319 14.7827L12.4454 9.56824L16.4255 5.9817H16.4253C16.4946 5.91995 16.5207 5.8237 16.4918 5.736C16.4631 5.64829 16.3849 5.58539 16.2919 5.57537L10.9362 4.98131L8.71215 0.136812L8.71232 0.136976C8.67372 0.0535408 8.58947 0 8.49667 0C8.40388 0 8.31962 0.0535408 8.28102 0.136976L6.05702 4.98147L0.70125 5.57553V5.57537C0.608455 5.58539 0.530276 5.64829 0.501533 5.736C0.472791 5.8237 0.498741 5.91995 0.568049 5.9817L4.54809 9.56824L3.46163 14.7827H3.46146C3.44208 14.8729 3.47805 14.966 3.55328 15.0204C3.62866 15.0749 3.72934 15.0805 3.81048 15.035L8.49688 12.4039L13.1833 15.035C13.2248 15.0575 13.2723 15.0674 13.3194 15.0629H13.319ZM12.9616 14.3708L8.61285 11.9304C8.54076 11.8901 8.45239 11.8901 8.38029 11.9304L4.03152 14.3708L5.03863 9.53473H5.03847C5.05555 9.45326 5.02747 9.36901 4.96473 9.31349L1.27127 5.98188L6.24148 5.43268C6.32426 5.42414 6.39653 5.37306 6.43151 5.29817L8.49666 0.79803L10.5618 5.29817C10.5968 5.37306 10.6691 5.42398 10.7518 5.43268L15.7221 5.98188L12.0286 9.31349C11.9659 9.36901 11.9378 9.45326 11.9549 9.53473L12.962 14.3708H12.9616Z"
                                fill="#EAB665" />
                        </svg><svg width="17" height="16" viewBox="0 0 17 16" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M13.319 15.0629C13.3867 15.0575 13.4486 15.0237 13.4893 14.9701C13.5299 14.9166 13.5455 14.8484 13.5319 14.7827L12.4454 9.56824L16.4255 5.9817H16.4253C16.4946 5.91995 16.5207 5.8237 16.4918 5.736C16.4631 5.64829 16.3849 5.58539 16.2919 5.57537L10.9362 4.98131L8.71215 0.136812L8.71232 0.136976C8.67372 0.0535408 8.58947 0 8.49667 0C8.40388 0 8.31962 0.0535408 8.28102 0.136976L6.05702 4.98147L0.70125 5.57553V5.57537C0.608455 5.58539 0.530276 5.64829 0.501533 5.736C0.472791 5.8237 0.498741 5.91995 0.568049 5.9817L4.54809 9.56824L3.46163 14.7827H3.46146C3.44208 14.8729 3.47805 14.966 3.55328 15.0204C3.62866 15.0749 3.72934 15.0805 3.81048 15.035L8.49688 12.4039L13.1833 15.035C13.2248 15.0575 13.2723 15.0674 13.3194 15.0629H13.319ZM12.9616 14.3708L8.61285 11.9304C8.54076 11.8901 8.45239 11.8901 8.38029 11.9304L4.03152 14.3708L5.03863 9.53473H5.03847C5.05555 9.45326 5.02747 9.36901 4.96473 9.31349L1.27127 5.98188L6.24148 5.43268C6.32426 5.42414 6.39653 5.37306 6.43151 5.29817L8.49666 0.79803L10.5618 5.29817C10.5968 5.37306 10.6691 5.42398 10.7518 5.43268L15.7221 5.98188L12.0286 9.31349C11.9659 9.36901 11.9378 9.45326 11.9549 9.53473L12.962 14.3708H12.9616Z"
                                fill="#EAB665" />
                        </svg><svg width="17" height="16" viewBox="0 0 17 16" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M13.319 15.0629C13.3867 15.0575 13.4486 15.0237 13.4893 14.9701C13.5299 14.9166 13.5455 14.8484 13.5319 14.7827L12.4454 9.56824L16.4255 5.9817H16.4253C16.4946 5.91995 16.5207 5.8237 16.4918 5.736C16.4631 5.64829 16.3849 5.58539 16.2919 5.57537L10.9362 4.98131L8.71215 0.136812L8.71232 0.136976C8.67372 0.0535408 8.58947 0 8.49667 0C8.40388 0 8.31962 0.0535408 8.28102 0.136976L6.05702 4.98147L0.70125 5.57553V5.57537C0.608455 5.58539 0.530276 5.64829 0.501533 5.736C0.472791 5.8237 0.498741 5.91995 0.568049 5.9817L4.54809 9.56824L3.46163 14.7827H3.46146C3.44208 14.8729 3.47805 14.966 3.55328 15.0204C3.62866 15.0749 3.72934 15.0805 3.81048 15.035L8.49688 12.4039L13.1833 15.035C13.2248 15.0575 13.2723 15.0674 13.3194 15.0629H13.319ZM12.9616 14.3708L8.61285 11.9304C8.54076 11.8901 8.45239 11.8901 8.38029 11.9304L4.03152 14.3708L5.03863 9.53473H5.03847C5.05555 9.45326 5.02747 9.36901 4.96473 9.31349L1.27127 5.98188L6.24148 5.43268C6.32426 5.42414 6.39653 5.37306 6.43151 5.29817L8.49666 0.79803L10.5618 5.29817C10.5968 5.37306 10.6691 5.42398 10.7518 5.43268L15.7221 5.98188L12.0286 9.31349C11.9659 9.36901 11.9378 9.45326 11.9549 9.53473L12.962 14.3708H12.9616Z"
                                fill="#EAB665" />
                        </svg><svg width="17" height="16" viewBox="0 0 17 16" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M13.319 15.0629C13.3867 15.0575 13.4486 15.0237 13.4893 14.9701C13.5299 14.9166 13.5455 14.8484 13.5319 14.7827L12.4454 9.56824L16.4255 5.9817H16.4253C16.4946 5.91995 16.5207 5.8237 16.4918 5.736C16.4631 5.64829 16.3849 5.58539 16.2919 5.57537L10.9362 4.98131L8.71215 0.136812L8.71232 0.136976C8.67372 0.0535408 8.58947 0 8.49667 0C8.40388 0 8.31962 0.0535408 8.28102 0.136976L6.05702 4.98147L0.70125 5.57553V5.57537C0.608455 5.58539 0.530276 5.64829 0.501533 5.736C0.472791 5.8237 0.498741 5.91995 0.568049 5.9817L4.54809 9.56824L3.46163 14.7827H3.46146C3.44208 14.8729 3.47805 14.966 3.55328 15.0204C3.62866 15.0749 3.72934 15.0805 3.81048 15.035L8.49688 12.4039L13.1833 15.035C13.2248 15.0575 13.2723 15.0674 13.3194 15.0629H13.319ZM12.9616 14.3708L8.61285 11.9304C8.54076 11.8901 8.45239 11.8901 8.38029 11.9304L4.03152 14.3708L5.03863 9.53473H5.03847C5.05555 9.45326 5.02747 9.36901 4.96473 9.31349L1.27127 5.98188L6.24148 5.43268C6.32426 5.42414 6.39653 5.37306 6.43151 5.29817L8.49666 0.79803L10.5618 5.29817C10.5968 5.37306 10.6691 5.42398 10.7518 5.43268L15.7221 5.98188L12.0286 9.31349C11.9659 9.36901 11.9378 9.45326 11.9549 9.53473L12.962 14.3708H12.9616Z"
                                fill="#EAB665" />
                        </svg></div>
                    <h2>${el.name}</h2>
                    <div class="priceAndBtnContainer">
                        <p class="price">Price: <span>$${el.price}</span></p> 
                        <button id="${el._id}" class="btnBuy">Buy</button>
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

let cart = ($.cookie(`cart`) && JSON.parse($.cookie(`cart`))) || [];
$.cookie(`cart`, JSON.stringify(cart), { path: '/' });

function updateCart() {
    for (let el of cart) {
        $('.productContainer').append(
            `
            <div class="productInCart">
                <img src="./img/${el.filename}" alt="photo">
                <div class="textContainer">
                    <h4 class="name">${el.name}</h4>
                    <div class="bottomBlock">
                        <div class="quantityProductContainer">
                            <div class="btnPlusProduct"><i class="fa-solid fa-plus" id="plus${el._id}"></i></div>
                            <div class="quantityProduct" id="quantityProduct${el._id}">${el.quantity}</div>
                            <div class="btnMinusProduct"><i class="fa-solid fa-minus" id="minus${el._id}"></i></div>
                        </div>
                        <p class="price" id="price${el._id}">${el.price * el.quantity}$</p>
                    </div>
                </div>
            </div>
            `
        );
    }
}

updateCart();

$(`.cardContainer`).click((e) => {
    let ID = e.target.id;
    let quantity = 1;

    axios.get(`/api/goods`)
        .then(res => {
            const data = res.data;
            for (let el of data) {
                if (el.category == "best" && ID == el._id) {
                    const exists = cart.find(item => item.id === ID);

                    if (exists) {
                        exists.quantity += 1;
                        $(`#quantityProduct${ID}`).text(exists.quantity);
                        $(`#price${ID}`).text(exists.price * exists.quantity + ` $`);
                    } else {
                        cart.push({
                            filename: el.filename,
                            name: el.name,
                            price: el.price,
                            id: ID,
                            quantity: quantity
                        });

                        $('.productContainer').append(
                            `
                            <div class="productInCart" id="${el._id}">
                                <img src="./img/${el.filename}" alt="photo">
                                <div class="textContainer">
                                    <h4 class="name">${el.name}</h4>
                                    <div class="bottomBlock">
                                        <div class="quantityProductContainer">
                                            <div class="btnPlusProduct"><i class="fa-solid fa-plus" id="plus${el._id}"></i></div>
                                            <div class="quantityProduct" id="quantityProduct${el._id}">${quantity}</div>
                                            <div class="btnMinusProduct"><i class="fa-solid fa-minus" id="minus${el._id}"></i></div>
                                        </div>
                                        <p class="price" id="price${el._id}">${el.price * quantity} $</p>
                                    </div>
                                </div>
                            </div>
                            `
                        );
                        $(`.notification`).text(`Product added to cart!`);
                        $(`.notificationContainer`).css(`display`, `flex`);
                        setTimeout(() => {
                            $(`.notification`).text(``);
                            $(`.notificationContainer`).css(`display`, `none`);
                        }, 3000);
                    }
                    $.cookie(`cart`, JSON.stringify(cart), { path: '/' });
                }
            }
        })
});


$('.productContainer').on('click', '.fa-minus', (e) => {
    let productId = $(e.target).attr('id').replace('minus', '');
    let quantityElement = $(e.target).closest('.productContainer').find(`#quantityProduct${productId}`);
    let quantity = parseInt(quantityElement.text());

    if (quantity > 0) {
        for (let el of cart) {
            if (el.id == productId) {
                if (quantity - 1 === 0) {
                    cart.splice(cart.indexOf(el), 1);
                    $.cookie(`cart`, JSON.stringify(cart), { path: '/' });
                    quantityElement.closest('.productInCart').remove();
                } else {
                    quantityElement.text(quantity - 1);
                    el.quantity = quantity - 1;
                    $.cookie(`cart`, JSON.stringify(cart), { path: '/' });
                    $(`#price${el.id}`).text(el.price * el.quantity + `$`);
                }
                break;
            }
        }
    }
});

$('.productContainer').on('click', '.fa-plus', (e) => {
    let productId = $(e.target).attr('id').replace('plus', '');
    let quantityElement = $(e.target).closest('.productContainer').find(`#quantityProduct${productId}`);
    let quantity = parseInt(quantityElement.text());

    for (let el of cart) {
        if (el.id == productId) {
            quantityElement.text(quantity + 1);
            el.quantity = quantity + 1;
            $.cookie(`cart`, JSON.stringify(cart), { path: '/' });
            $(`#price${el.id}`).text(el.price * el.quantity + `$`);
            break;
        }
    }
});

$(`#buyBtn`).click(() => {
    let phone = $(`#telInput`).val();
    let userName = $(`#nameInput`).val();
    let telRegex = /(\+380)\d{9}/
    let isValidName = /[a-zA-Zа-яА-ЯіІїЇєЄґҐ'`-]{2,50}/
    if (isValidName.test(userName)) {
        if (telRegex.test(phone)) {
            axios.post(`/api/goods/createOrder`, { userName, phone, status: `unconfirmed`, orders: cart })
                .then(res => {
                    console.log(res.data.message);
                    cart = [];
                    $('.productContainer').empty();
                    $.cookie(`cart`, JSON.stringify(cart), { path: '/' });
                    updateCart();
                })
                .catch(err => {
                    console.error('Error confirming orders:', err);
                });
            $(`#telInput`).val(``)
            $(`#nameInput`).val(``)
            $(`.orderVerificationPopup`).css(`display`, `flex`);
            $(`.orderVerificationPopup`).css(`animation`, `1.7s ease forwards draw`);
            setTimeout(() => {
                $(`.orderVerificationPopup`).css(`animation`, `none`);
                $(`.orderVerificationPopup`).css(`display`, `none`);
            }, 1700);
        } else {
            $(`#telInput`).css(`border`, `2px solid red`);
            $(`.notification`).text(`Your phone number is incorrect.`);
            $(`.notificationContainer`).css(`display`, `flex`);
            setTimeout(() => {
                $(`.notificationContainer`).css(`display`, `none`);
                $(`#telInput`).css(`border`, `none`);
                $(`#telInput`).css(`border-bottom`, `1.5px solid #232020`);
                $(`.notification`).text(``);
            }, 3000);
        }
    } else {
        $(`#nameInput`).css(`border`, `2px solid red`);
        $(`.notification`).text(`Your name is incorrect.`);
        $(`.notificationContainer`).css(`display`, `flex`);
        setTimeout(() => {
            $(`.notificationContainer`).css(`display`, `none`);
            $(`#nameInput`).css(`border`, `none`);
            $(`#nameInput`).css(`border-bottom`, `1.5px solid #232020`);
            $(`.notification`).text(``);
        }, 3000);
    }
});

$(`#adminBtn`).dblclick(() => {
    window.location.href = `/admin`;
});

let email;
$(`#subscribeBtn`).click(() => {
    if ($(`#emailSubscriber`).hasClass(`email`)) {
        let emailRegex = /([a-z\d]{3,64})+@([a-z]{3,255})+\.[a-z]{2,63}/;
        email = $(`.email`).val();
        if (emailRegex.test(email)) {
            $(`#emailSubscriber`).val(``);
            axios.post(`/sendConfirmationEmail`, { email })
                .then(res => {
                    console.log(res.data.message);
                    if (res.data.message == `Code sent`) {
                        $('#emailSubscriber').removeClass('email');
                        $('#emailSubscriber').addClass('code');
                        $('#emailSubscriber').attr("placeholder", "Enter the code sent to your email.");
                        $(`.notification`).text(`The code was sent to your email!`);
                        $(`.notificationContainer`).css(`display`, `flex`);
                        setTimeout(() => {
                            $(`.notificationContainer`).css(`display`, `none`);
                            $(`#emailSubscriber`).css(`border`, `none`);
                            $(`.notification`).text(``);
                        }, 3000);
                    } else if (res.data.message == `This email already exists`) {
                        $(`#emailSubscriber`).css(`border`, `2px solid red`);
                        $(`.notification`).text(`This email is already signed!`);
                        $(`.notificationContainer`).css(`display`, `flex`);
                        setTimeout(() => {
                            $(`.notificationContainer`).css(`display`, `none`);
                            $(`#emailSubscriber`).css(`border`, `none`);
                            $(`.notification`).text(``);
                        }, 3000);
                    }
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
    } else if ($(`#emailSubscriber`).hasClass(`code`)) {
        $('#emailSubscriber').attr("placeholder", "Enter your email.");
        let code = $(`.code`).val();
        $('#emailSubscriber').addClass('email');
        $('#emailSubscriber').removeClass('code');
        $(`#emailSubscriber`).val(``);
        axios.post(`/subscribe`, { email, code })
            .then(res => {
                console.log(res.data.massage);
                if (res.data.massage == `data saved`) {
                    $(`.notification`).text(`You have subscribed to the newsletter.`);
                    $(`.notificationContainer`).css(`display`, `flex`);
                    setTimeout(() => {
                        $(`.notificationContainer`).css(`display`, `none`);
                        $(`.notification`).text(``);
                    }, 3000);
                } else {
                    $(`#emailSubscriber`).css(`border`, `2px solid red`);
                    $(`.notification`).text(`Code isn't correct.`);
                    $(`.notificationContainer`).css(`display`, `flex`);
                    setTimeout(() => {
                        $(`.notificationContainer`).css(`display`, `none`);
                        $(`#emailSubscriber`).css(`border`, `none`);
                        $(`.notification`).text(``);
                    }, 3000);
                }
            })
    }
});