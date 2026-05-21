export let cart;

loadFromStorage();

function normalizeCartItems() {
  if (!Array.isArray(cart)) {
    cart = [];
  }

  cart.forEach((cartItem) => {
    if (cartItem.deliveryOptionId === undefined) {
      if (cartItem.deliveryOptionsId !== undefined) {
        cartItem.deliveryOptionId = cartItem.deliveryOptionsId;
        delete cartItem.deliveryOptionsId;
      } else {
        cartItem.deliveryOptionId = '1';
      }
    }
  });
}

function setCartItems(newCart) {
  cart = Array.isArray(newCart) ? newCart : [];
  normalizeCartItems();
  saveToStorage();
}

export function loadFromStorage() {
  cart = JSON.parse(localStorage.getItem('cart'));

  if (!cart) {
    cart = [{
        productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
        quantity: 2,
        deliveryOptionId: '1',
    }, {
        productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
        quantity: 1,
        deliveryOptionId: '2',
    }];
  }

  normalizeCartItems();
}

function saveToStorage(){
  localStorage.setItem('cart', JSON.stringify(cart));
}

export function addToCart(productId, quantity = 1){
  let matchingItem;
  const quantityNumber = Math.max(1, Number(quantity) || 1);

  cart.forEach((cartItem) => {
      if(productId === cartItem.productId){
        matchingItem = cartItem;
      }
  });

  if(matchingItem){
    matchingItem.quantity += quantityNumber;
  }else{
      cart.push({
      productId: productId,
      quantity: quantityNumber,
      deliveryOptionId: '1'
    });
  }

  saveToStorage();
}

export function removeFromCart(productId) {
  const newCart = [];

  cart.forEach((cartItem) => {
    if(cartItem.productId !== productId){
      newCart.push(cartItem)
    }
  });

  cart = newCart;

  saveToStorage();
}

export function updateDeliveryOption(productId, deliveryOptionId) {
  let matchingItem;

  cart.forEach((cartItem) => {
    if (productId === cartItem.productId) {
      matchingItem = cartItem;
    }
  });

  matchingItem.deliveryOptionId = deliveryOptionId;

  saveToStorage();
}

export function getCartQuantity() {
  return cart.reduce((total, cartItem) => total + cartItem.quantity, 0);
}

export function clearCart() {
  cart = [];
  saveToStorage();
}
