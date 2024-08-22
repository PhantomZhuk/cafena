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
            console.log(data);

            for (el of data) {
                if (el.category == "best") {
                    $(`.cardContainer`).append(
                        `
                        <div class="card">
                    <div class="imgBox">
                        <img src="./${el.img}" alt="photo">
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

$(`.fa-basket-shopping`).click(()=>{
    $(`.cartContainer`).css(`display`, `flex`);
});

$(`.fa-xmark`).click(()=>{
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

$(`.cardContainer`).click((e) => {
    const productId = e.target.id;
    const quantity = 1;
    console.log(productId)

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

});

$(`#adminBtn`).dblclick(()=>{
    window.location.href = `http://localhost:3000/admin`;
});