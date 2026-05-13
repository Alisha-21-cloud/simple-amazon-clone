import { orders } from '../data/orders.js';
import { getProduct, loadProductsFetch } from '../data/products.js';
import { getCartQuantity } from '../data/cart.js';
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';

function updateCartQuantity() {
  const cartQuantityElement = document.querySelector('.js-cart-quantity');
  if (cartQuantityElement) {
    cartQuantityElement.textContent = getCartQuantity();
  }
}

function setProgressStatus(status) {
  const statuses = {
    Preparing: document.querySelector('.js-progress-label-preparing'),
    Shipped: document.querySelector('.js-progress-label-shipped'),
    Delivered: document.querySelector('.js-progress-label-delivered')
  };

  Object.values(statuses).forEach((label) => {
    if (label) {
      label.classList.remove('current-status');
    }
  });

  if (statuses[status]) {
    statuses[status].classList.add('current-status');
  }
}

function renderTrackingDetails(order, orderProduct) {
  const product = getProduct(orderProduct.productId);
  const deliveryDate = dayjs(orderProduct.estimatedDeliveryTime)
    .format('dddd, MMMM D');

  const deliveryDateElement = document.querySelector('.js-delivery-date');
  if (deliveryDateElement) {
    deliveryDateElement.textContent = `Arriving on ${deliveryDate}`;
  }

  const productNameElement = document.querySelector('.js-product-name');
  if (productNameElement) {
    productNameElement.textContent = product ? product.name : 'Product';
  }

  const productQuantityElement = document.querySelector('.js-product-quantity');
  if (productQuantityElement) {
    productQuantityElement.textContent = `Quantity: ${orderProduct.quantity}`;
  }

  const productImageElement = document.querySelector('.js-product-image');
  if (productImageElement && product) {
    productImageElement.src = product.image;
    productImageElement.alt = product.name;
  }

  const orderTime = dayjs(order.orderTime);
  const deliveryTime = dayjs(orderProduct.estimatedDeliveryTime);
  const totalTime = deliveryTime.diff(orderTime);
  const currentTime = dayjs();

  let progressPercent = 0;
  if (totalTime > 0) {
    progressPercent = (currentTime.diff(orderTime) / totalTime) * 100;
  } else if (currentTime.isAfter(deliveryTime)) {
    progressPercent = 100;
  }

  progressPercent = Math.min(100, Math.max(0, progressPercent));

  const progressBar = document.querySelector('.js-progress-bar');
  if (progressBar) {
    progressBar.style.width = `${progressPercent}%`;
  }

  let status = 'Preparing';
  if (progressPercent >= 100) {
    status = 'Delivered';
  } else if (progressPercent >= 50) {
    status = 'Shipped';
  }

  setProgressStatus(status);
}

function renderMissingOrder() {
  const trackingContainer = document.querySelector('.order-tracking');
  if (trackingContainer) {
    trackingContainer.innerHTML = `
      <a class="back-to-orders-link link-primary" href="orders.html">
        View all orders
      </a>
      <div>Order details not found.</div>
    `;
  }
}

async function loadPage() {
  await loadProductsFetch();

  const url = new URL(window.location.href);
  const orderId = url.searchParams.get('orderId');
  const productId = url.searchParams.get('productId');

  const order = orders.find((orderItem) => orderItem.id === orderId);
  const orderProduct = order?.products?.find(
    (orderItem) => orderItem.productId === productId
  );

  if (!order || !orderProduct) {
    renderMissingOrder();
    updateCartQuantity();
    return;
  }

  renderTrackingDetails(order, orderProduct);
  updateCartQuantity();
}

loadPage();
