import { orders } from '../data/orders.js';
import { addToCart, getCartQuantity } from '../data/cart.js';
import { getProduct, loadProductsFetch } from '../data/products.js';
import { formatCurrency } from './utils/money.js';
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';

function updateCartQuantity() {
  const cartQuantityElement = document.querySelector('.js-cart-quantity');
  if (cartQuantityElement) {
    cartQuantityElement.textContent = getCartQuantity();
  }
}

function renderOrders() {
  const ordersGrid = document.querySelector('.js-orders-grid');

  if (!orders.length) {
    ordersGrid.innerHTML = '<div>No orders yet.</div>';
    return;
  }

  let ordersHTML = '';

  orders.forEach((order) => {
    const orderDate = dayjs(order.orderTime).format('MMMM D');
    const orderTotal = formatCurrency(order.totalCostCents || 0);
    const orderProducts = order.products || [];

    let productsHTML = '';

    orderProducts.forEach((orderProduct) => {
      const product = getProduct(orderProduct.productId);
      if (!product) {
        return;
      }

      const deliveryDate = dayjs(orderProduct.estimatedDeliveryTime).format('MMMM D');

      productsHTML += `
        <div class="product-image-container">
          <img src="${product.image}">
        </div>

        <div class="product-details">
          <div class="product-name">
            ${product.name}
          </div>
          <div class="product-delivery-date">
            Arriving on: ${deliveryDate}
          </div>
          <div class="product-quantity">
            Quantity: ${orderProduct.quantity}
          </div>
          <button class="buy-again-button button-primary js-buy-again"
            data-product-id="${product.id}">
            <img class="buy-again-icon" src="images/icons/buy-again.png">
            <span class="buy-again-message">Buy it again</span>
          </button>
        </div>

        <div class="product-actions">
          <a href="tracking.html?orderId=${order.id}&productId=${product.id}">
            <button class="track-package-button button-secondary">
              Track package
            </button>
          </a>
        </div>
      `;
    });

    ordersHTML += `
      <div class="order-container">
        <div class="order-header">
          <div class="order-header-left-section">
            <div class="order-date">
              <div class="order-header-label">Order Placed:</div>
              <div>${orderDate}</div>
            </div>
            <div class="order-total">
              <div class="order-header-label">Total:</div>
              <div>$${orderTotal}</div>
            </div>
          </div>

          <div class="order-header-right-section">
            <div class="order-header-label">Order ID:</div>
            <div>${order.id}</div>
          </div>
        </div>

        <div class="order-details-grid">
          ${productsHTML}
        </div>
      </div>
    `;
  });

  ordersGrid.innerHTML = ordersHTML;

  document.querySelectorAll('.js-buy-again')
    .forEach((button) => {
      button.addEventListener('click', () => {
        addToCart(button.dataset.productId);
        updateCartQuantity();
      });
    });
}

async function loadPage() {
  await loadProductsFetch();
  renderOrders();
  updateCartQuantity();
}

loadPage();
