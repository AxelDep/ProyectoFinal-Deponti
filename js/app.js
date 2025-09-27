import { addToCart, renderCartBadge, renderCartPanel } from "./cart.js";

async function loadProducts() {
  const res = await fetch("./js/data/products.json");
  const products = await res.json();
  renderProducts(products);
}

function renderProducts(products) {
  const container = document.getElementById("products");
  container.innerHTML = "";
  products.forEach(p => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${p.img}" alt="${p.title}">
      <h3>${p.title}</h3>
      <p>$${p.price}</p>
      <button data-id="${p.id}">Agregar</button>
    `;
    container.appendChild(card);
  });

  container.querySelectorAll("button[data-id]").forEach(btn => {
    btn.addEventListener("click", () => {
      const product = products.find(p => p.id == btn.dataset.id);
      addToCart(product);
      Swal.fire("Agregado", `${product.title} se agregó al carrito`, "success");
      renderCartPanel();
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  loadProducts();
  renderCartBadge();
  renderCartPanel();
});
