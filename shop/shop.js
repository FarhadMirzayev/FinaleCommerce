document.addEventListener("DOMContentLoaded", async function () {
  const productList = document.getElementById("productlist");

  
  let activeUser = null;
  try {
    activeUser = JSON.parse(localStorage.getItem("activeUser"));
  } catch (_) {}

  let products = [];
  let filteredProducts = [];

  // Məhsulları serverdən götür
  async function fetchProducts() {
    try {
      const response = await fetch("http://195.26.245.5:9505/api/products", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${activeUser?.token || ""}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      products = await response.json();
      filteredProducts = [...products];

     
      localStorage.setItem("products", JSON.stringify(products));

      loadProducts();
    } catch (error) {
      console.error("Error fetching products:", error);
      productList.innerHTML =
        `<p class="text-danger text-center">Failed to load products.</p>`;
    }
  }

  // Məhsulları ekrana yüklə
  function loadProducts() {
    productList.innerHTML = "";

    if (filteredProducts.length === 0) {
      productList.innerHTML =
        `<p class="text-center">No products found.</p>`;
        return;
    
    }

    filteredProducts.forEach((product) => {
      const productCard = document.createElement("div");
      productCard.classList.add("col-md-3", "mb-4");

      productCard.innerHTML = `
        <div class="product-card">
          <img src="${product.imageUrl}" alt="${product.brand}" class="product-image" data-id="${product.id}">
          <h6 class="product-title" data-id="${product.id}">
            ${product.brand} ${product.model}
          </h6>
          <p class="price">$${product.price}</p>
          <p class="rating">★ ${product.rating} ${Math.floor(Math.random() * 100) + 1}</p>
          <button class="btn-add-to-cart" data-id="${product.id}">Add to cart</button>
        </div>
      `;

      
      productList.appendChild(productCard);
    });
  }

  
  await fetchProducts();
});