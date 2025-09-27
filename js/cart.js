import { save, load } from "./storage.js";

let cart = load("cart") || [];

function persist() {
  save("cart", cart);
  renderCartBadge();
}

export function addToCart(product) {
  const exist = cart.find(p => p.id === product.id);
  if (exist) {
    if (exist.qty < product.stock) {
      exist.qty++;
    } else {
      Swal.fire("Sin stock", "No hay más unidades disponibles", "warning");
      return;
    }
  } else {
    cart.push({ ...product, qty: 1 });
  }
  persist();
}

export function renderCartBadge() {
  const el = document.getElementById("cartCount");
  el.textContent = cart.reduce((sum, i) => sum + i.qty, 0);
}

export function renderCartPanel() {
  const panel = document.getElementById("cart");
  panel.innerHTML = "<h2>Carrito</h2>";

  if (cart.length === 0) {
    panel.innerHTML += "<p>Carrito vacío</p>";
    return;
  }

  let total = 0;
  cart.forEach(item => {
    total += item.price * item.qty;
    panel.innerHTML += `
      <div class="cart-item">
        <span>${item.title} x${item.qty}</span>
        <span>$${item.price * item.qty}</span>
      </div>
    `;
  });

  panel.innerHTML += `<div class="cart-total">Total: $${total}</div>`;
}
