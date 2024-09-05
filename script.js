// Sample Products Data
const products = [
    { id: 1, name: "Product 1", price: 10.00 },
    { id: 2, name: "Product 2", price: 20.00 },
    { id: 3, name: "Product 3", price: 30.00 },
];

// Function to display products
function displayProducts() {
    const productList = document.getElementById("product-list");
    products.forEach(product => {
        const productItem = document.createElement("div");
        productItem.classList.add("product-item");
        productItem.innerHTML = `
            <h2>${product.name}</h2>
            <p>$${product.price.toFixed(2)}</p>
            <button onclick="addToBag(${product.id})">Add to Bag</button>
        `;
        productList.appendChild(productItem);
    });
}

// Shopping Bag State
let shoppingBag = [];


// Update Bag Item Count
function updateBagCount() {
    const itemCount = shoppingBag.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById("item-count").textContent = itemCount;
}


// Event Listener for "View Bag" Button
document.getElementById("view-bag-button").addEventListener("click", viewBag);
// Function to Calculate Total Price
function calculateTotalPrice() {
    return shoppingBag.reduce((sum, item) => sum + item.product.price * item.quantity, 0).toFixed(2);
}

// Display Total Price in View Bag
function viewBag() {
    const bagItems = document.getElementById("bagItems");
    const totalPriceElement = document.getElementById("totalPrice");

    const bagContent = shoppingBag.map(item => `
        <div class="bag-item">
            <span>${item.product.name}</span>
            <span>$${item.product.price.toFixed(2)}</span>
            <span>Quantity: <input type="number" value="${item.quantity}" min="1" onchange="updateQuantity(${item.product.id}, this.value)"></span>
            <button onclick="removeFromBag(${item.product.id})">Remove</button>
        </div>
    `).join('');

    bagItems.innerHTML = bagContent || "<p>Your bag is empty!</p>";
    totalPriceElement.textContent = `Total Price: $${calculateTotalPrice()}`;

    document.getElementById("bagModal").style.display = "block";
}
// Load Shopping Bag from Local Storage
function loadShoppingBag() {
    const savedBag = JSON.parse(localStorage.getItem("shoppingBag"));
    if (savedBag) {
        shoppingBag = savedBag;
        updateBagCount();
    }
}

// Save Shopping Bag to Local Storage
function saveShoppingBag() {
    localStorage.setItem("shoppingBag", JSON.stringify(shoppingBag));
}

// Function to Add Product to Bag
function addToBag(productId) {
    const product = products.find(p => p.id === productId);
    const existingProduct = shoppingBag.find(item => item.product.id === productId);

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        shoppingBag.push({ product, quantity: 1 });
    }

    updateBagCount();
    saveShoppingBag();
}

// Function to Update Quantity
function updateQuantity(productId, newQuantity) {
    const productInBag = shoppingBag.find(item => item.product.id === productId);
    if (productInBag) {
        productInBag.quantity = parseInt(newQuantity, 10);
        updateBagCount();
        saveShoppingBag();
        viewBag();
    }
}

// Function to Remove Product from Bag
function removeFromBag(productId) {
    shoppingBag = shoppingBag.filter(item => item.product.id !== productId);
    updateBagCount();
    saveShoppingBag();
    viewBag();
}

// Close the modal 
document.querySelector(".close").onclick = function () {
    document.getElementById("bagModal").style.display = "none";
}

// Close the modal when the user clicks outside
window.onclick = function (event) {
    const bagModal = document.getElementById("bagModal");
    if (event.target == bagModal) {
        bagModal.style.display = "none";
    }
}
// Page Load
window.onload = () => {
    displayProducts();
    loadShoppingBag();
};

