$(`#adminBtn`).dblclick(() => {
    window.location.href = `http://localhost:3000/admin`;
});

function updateCart() {
    axios.get(`/api/goods/orders`)
        .then(res => {
            const data = res.data;
            $('.main').empty();

            data.forEach(el => {
                $('.main').append(
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

updateCart();