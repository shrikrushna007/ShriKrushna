let cart = [];
let totalMrp = 0;
let totalAmount = 0;
let allProducts = [];
const clickSound = new Audio('./click-sound.mp3'); 


fetch('https://fakestoreapi.com/products')
    .then(response => response.json())
    .then(products => {
        allProducts = products;
        renderProducts(products);
    })
    .catch(error => console.error('Error fetching products:', error));


function renderProducts(products) {
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';  

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');

        productCard.innerHTML = `
            <img src="${product.image}" alt="Product Image" class="product-image">
            <p>${product.title}</p>
            <p>⭐ ${product.rating.rate}</p>
            <p>₹${product.price}</p>
            <button class="add-cart-btn">Add to Cart</button>
        `;

        productList.appendChild(productCard);

        const addButton = productCard.querySelector('.add-cart-btn');
        addButton.addEventListener('click', () => {
            addToCart(product);
            playClickSound();
        });
    });
}


function playClickSound() {
    clickSound.currentTime = 0; 
    clickSound.play();
}


document.getElementById('search-bar').addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredProducts = allProducts.filter(product =>
        product.title.toLowerCase().includes(searchTerm)
    );
    renderProducts(filteredProducts);
});


function addToCart(product) {
    const cartItemIndex = cart.findIndex(item => item.id === product.id);

    if (cartItemIndex !== -1) {
        cart[cartItemIndex].quantity += 1;
    } else {
        product.quantity = 1;
        cart.push(product);
    }

    updateCart();
}


function updateCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.innerHTML = '';

    totalMrp = 0;

    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');

        cartItem.innerHTML = `
            <img src="${item.image}" alt="Product Image" class="cart-image">
            <div class="cart-info">
                <p>${item.title}</p>
                <p>₹${item.price}</p>
                <div class="quantity-control">
                    <button class="decrease-btn">-</button>
                    <span>${item.quantity}</span>
                    <button class="increase-btn">+</button>
                </div>
            </div>
            <button class="remove-btn">Remove</button>
        `;

        cartItemsContainer.appendChild(cartItem);

        const decreaseButton = cartItem.querySelector('.decrease-btn');
        const increaseButton = cartItem.querySelector('.increase-btn');
        const removeButton = cartItem.querySelector('.remove-btn');

        decreaseButton.addEventListener('click', () => {
            if (item.quantity > 1) {
                item.quantity -= 1;
            } else {
                cart = cart.filter(cartItem => cartItem.id !== item.id);
            }
            updateCart();
            playClickSound(); 
        });

        increaseButton.addEventListener('click', () => {
            item.quantity += 1;
            updateCart();
            playClickSound(); 
        });

        removeButton.addEventListener('click', () => {
            cart = cart.filter(cartItem => cartItem.id !== item.id);
            updateCart();
            playClickSound(); 
        });

        totalMrp += item.price * item.quantity;
    });

    document.getElementById('total-mrp').textContent = totalMrp.toFixed(2);
    calculateTotalAmount();
}

function calculateTotalAmount() {
    const couponDiscount = 50;
    const platformFee = 10;
    const shippingCharges = 20;

    if (totalMrp === 0) {
        totalAmount = 0;
    } else if(totalMrp > 500){
        totalAmount = totalMrp - couponDiscount + platformFee + shippingCharges;
    } else{
        totalAmount = totalMrp + platformFee + shippingCharges;
    }

    totalAmount = Math.max(0, totalAmount); 
    document.getElementById('total-amount').innerText = totalAmount.toFixed(2);
}


document.querySelector('.place-order-btn').addEventListener('click', () => {
    playClickSound(); 
});

const orderPopup = document.getElementById('order-popup');
const closePopupBtn = document.getElementById('close-popup-btn');
const placeOrderBtn = document.getElementById('place-order-btn');
const cartItemsContainer = document.getElementById('cart-items');


function isCartEmpty() {
    return cartItemsContainer.children.length === 0;  
}


placeOrderBtn.addEventListener('click', () => {
    if (isCartEmpty()) {
        alert('Your cart is empty! Please add items before placing an order.'); 
    } else {
        orderPopup.style.display = 'flex';  
    }
});


closePopupBtn.addEventListener('click', () => {
    orderPopup.style.display = 'none';  
});

orderPopup.addEventListener('click', (e) => {
    if (e.target === orderPopup) {  
        orderPopup.style.display = 'none';
    }
});
