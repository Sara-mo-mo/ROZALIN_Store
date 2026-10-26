"use strict";
const productsData = {
    recent: [
        {
            id: 1,
            name: "سلسلة قلب",
            price: 100,
            image: "54c5b2b9-ce0c-4e1d-b2c2-5c148ead0817 1.png"
        },
        {
            id: 2,
            name: "سلسلة بجع",
            price: 110,
            image: "ccad6c4e-5a1f-45d9-a002-a674644e3ce1 1.png"
        },
        {
            id: 3,
            name: "أساور استانلس",
            price: 150,
            image: "ec93f4b5-ddd3-447e-b5b1-86cff15bec28 1.png"
        },
        {
            id: 4,
            name: "خاتم ذهبي",
            price: 90,
            image: "image 1.png"
        }
    ],

    accessories: [
        {
            id: 5,
            name: "سلسلة ذهبية",
            price: 85,
            image: "image 2.png"
        },
        {
            id: 6,
            name: "سلسلة ذهبية أنيقة",
            price: 70,
            image: "image 3.png"
        },
        {
            id: 7,
            name: "سلسلة مرصعة",
            price: 100,
            image: "image 4.png"
        },
        {
            id: 8,
            name: "عقد مرصع بالكريستال",
            price: 120,
            image: "image 5.png"
        }
    ],

    beauty: [
        {
            id: 9,
            name: "أحمر شفاه مات",
            price: 120,
            image: "image 11.png"
        },
        {
            id: 10,
            name: "ماسكرا مقاومة للماء",
            price: 90,
            image: "image 7.png"
        },
        {
            id: 11,
            name: "مجموعة العناية بالبشرة",
            price: 350,
            image: "image 8.png"
        },
        {
            id: 12,
            name: "مجموعة تنت 6 درجات",
            price: 240,
            image: "image 12.png"
        }
    ],

    offers: [
        {
            id: 13,
            name: "فاونديشن مقاوم للماء",
            price: 70,
            oldPrice: 130,
            image: "image 10.png"
        },
        {
            id: 14,
            name: "سلسلة غزال مرصعة",
            price: 100,
            oldPrice: 150,
            image: "image 6.png"
        },
        {
            id: 15,
            name: "سلسلة شمسية",
            price: 90,
            oldPrice: 130,
            image: "image 9.png"
        },
        {
            id: 16,
            name: "طقم مجوهرات متكامل",
            price: 110,
            oldPrice: 150,
            image: "image 13.png"
        }
    ]
};

const modal = document.getElementById("productModal");
const modalImg = document.getElementById("modal-img");
const modalName = document.getElementById("modal-name");
const modalPrice = document.getElementById("modal-price");

const closeModalBtn = document.getElementById("closeModalBtn");
const orderBtn = document.getElementById("orderBtn");

const cartCount = document.getElementById("cartCount");
const cartButton = document.getElementById("cartButton");

const cartModal = document.getElementById("cartModal");
const closeCartBtn = document.getElementById("closeCartBtn");
const cartItemsContainer = document.getElementById("cartItems");
const cartTotalElement = document.getElementById("cartTotal");

const toast = document.getElementById("toast");
const toastMessage = document.getElementById("toastMessage");

const searchButton = document.getElementById("searchButton");
const searchPanel = document.getElementById("searchPanel");
const searchInput = document.getElementById("searchInput");
const closeSearchBtn = document.getElementById("closeSearchBtn");
function getAllProducts() {
    return Object.values(productsData).flat();
}

function findProduct(productId) {
    return getAllProducts().find(
        product => Number(product.id) === Number(productId)
    );
}

function formatPrice(price) {
    return `${Number(price).toLocaleString("en-US")} جنيه`;
}

function getProductPriceHTML(product) {
    const hasDiscount =
        Number(product.oldPrice) > Number(product.price);

    return `
        <div class="product-prices">
            <span class="current-price">
                ${formatPrice(product.price)}
            </span>

            ${
                hasDiscount
                    ? `<span class="old-price">
                           ${formatPrice(product.oldPrice)}
                       </span>`
                    : ""
            }
        </div>
    `;
}
let toastTimer;

function showToast(message) {
    if (!toast || !toastMessage) return;

    toastMessage.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}
function renderProducts(searchTerm = "") {
    const sections = {
        "recent-list": productsData.recent,
        "accessories-list": productsData.accessories,
        "beauty-list": productsData.beauty,
        "offers-list": productsData.offers
    };

    const query = searchTerm.trim().toLowerCase();

    for (const [containerId, products] of Object.entries(sections)) {
        const container = document.getElementById(containerId);

        if (!container) {
            console.error("لم يتم العثور على القسم:", containerId);
            continue;
        }

        const filteredProducts = products.filter(product =>
            product.name.toLowerCase().includes(query)
        );

        if (filteredProducts.length === 0) {
            container.innerHTML = query
                ? `<p class="empty-section">لا توجد منتجات مطابقة للبحث.</p>`
                : "";
            continue;
        }

        container.innerHTML = filteredProducts.map(product => `
            <article
                class="product-card"
                tabindex="0"
                role="button"
                aria-label="عرض تفاصيل ${product.name}"
                data-product-id="${product.id}"
            >
                <img
                    src="${product.image}"
                    alt="${product.name}"
                    loading="lazy"
                >

                <div class="name">${product.name}</div>

                ${getProductPriceHTML(product)}
            </article>
        `).join("");

        container.querySelectorAll(".product-card").forEach(card => {
            card.addEventListener("click", () => {
                openModal(card.dataset.productId);
            });

            card.addEventListener("keydown", event => {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    openModal(card.dataset.productId);
                }
            });
        });

        container.querySelectorAll("img").forEach(img => {
            img.addEventListener("error", () => {
                console.error(
                    "تعذر تحميل صورة المنتج. راجعي اسم الملف والمسار:",
                    img.getAttribute("src")
                );
            }, { once: true });
        });
    }
}
function openModal(productId) {
    const product = findProduct(productId);

    if (!product || !modal) return;

    modalImg.src = product.image;
    modalImg.alt = product.name;
    modalName.textContent = product.name;
    modalPrice.innerHTML = getProductPriceHTML(product);

    modal.dataset.productId = product.id;

    modal.classList.add("show");
    modal.setAttribute("aria-hidden", "false");

    document.body.classList.add("modal-open");
}

function closeModal() {
    if (!modal) return;

    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");

    if (!cartModal?.classList.contains("show")) {
        document.body.classList.remove("modal-open");
    }
}

if (closeModalBtn) {
    closeModalBtn.addEventListener("click", closeModal);
}

if (modal) {
    modal.addEventListener("click", event => {
        if (event.target === modal) {
            closeModal();
        }
    });
}
function loadCart() {
    try {
        const savedCart = JSON.parse(
            localStorage.getItem("rozalinCart") || "[]"
        );

        if (!Array.isArray(savedCart)) return [];

        return savedCart.filter(item =>
            item &&
            Number.isFinite(Number(item.id)) &&
            findProduct(item.id)
        ).map(item => {
            const originalProduct = findProduct(item.id);

            return {
                ...originalProduct,
                quantity: Math.max(
                    1,
                    Math.floor(Number(item.quantity) || 1)
                )
            };
        });
    } catch (error) {
        console.error("تعذر قراءة عربة التسوق:", error);
        return [];
    }
}

let cart = loadCart();

function saveCart() {
    try {
        localStorage.setItem("rozalinCart", JSON.stringify(cart));
        return true;
    } catch (error) {
        console.error("تعذر حفظ عربة التسوق:", error);
        showToast("تعذر حفظ العربة. تحققي من مساحة التخزين.");
        return false;
    }
}
function updateCartCount() {
    if (!cartCount) return;

    const totalQuantity = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

    cartCount.textContent = totalQuantity;
    cartCount.hidden = totalQuantity === 0;

    if (cartButton) {
        cartButton.setAttribute(
            "aria-label",
            `سلة التسوق، عدد المنتجات ${totalQuantity}`
        );
    }
}
function orderProduct() {
    if (!modal) return;

    const productId = Number(modal.dataset.productId);
    const product = findProduct(productId);

    if (!product) {
        showToast("عذرًا، لم يتم العثور على المنتج.");
        return;
    }

    const existingProduct = cart.find(
        item => Number(item.id) === productId
    );

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    if (!saveCart()) {
        cart = loadCart();
        updateCartCount();
        return;
    }

    updateCartCount();
    closeModal();

    showToast(
        `تمت إضافة "${product.name}" إلى عربة التسوق بنجاح!`
    );
}

if (orderBtn) {
    orderBtn.addEventListener("click", orderProduct);
}
function renderCart() {
    if (!cartItemsContainer || !cartTotalElement) return;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <p class="empty-cart">عربة التسوق فارغة حاليًا.</p>
        `;

        cartTotalElement.textContent = "الإجمالي: 0 جنيه";
        return;
    }

    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item" data-product-id="${item.id}">
            <img src="${item.image}" alt="${item.name}">

            <div class="cart-item-info">
                <strong>${item.name}</strong>
                <span>${formatPrice(item.price)}</span>
                <span>الكمية: ${item.quantity}</span>
            </div>

            <div class="cart-item-actions">
                <button
                    type="button"
                    data-action="increase"
                    aria-label="زيادة الكمية"
                >+</button>

                <button
                    type="button"
                    data-action="decrease"
                    aria-label="تقليل الكمية"
                >−</button>

                <button
                    type="button"
                    class="remove-item"
                    data-action="remove"
                    aria-label="حذف المنتج"
                >
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        </div>
    `).join("");

    const total = cart.reduce(
        (sum, item) => sum + Number(item.price) * item.quantity,
        0
    );

    cartTotalElement.textContent = `الإجمالي: ${formatPrice(total)}`;

    cartItemsContainer.querySelectorAll(".cart-item").forEach(row => {
        const productId = Number(row.dataset.productId);

        row.querySelectorAll("button[data-action]").forEach(button => {
            button.addEventListener("click", () => {
                changeCartItem(productId, button.dataset.action);
            });
        });

        row.querySelectorAll("img").forEach(img => {
            img.addEventListener("error", () => {
                console.error(
                    "تعذر تحميل صورة العربة:",
                    img.getAttribute("src")
                );
            }, { once: true });
        });
    });
}

function changeCartItem(productId, action) {
    const item = cart.find(
        product => Number(product.id) === productId
    );

    if (!item) return;

    if (action === "increase") {
        item.quantity += 1;
    } else if (action === "decrease") {
        item.quantity -= 1;

        if (item.quantity <= 0) {
            cart = cart.filter(
                product => Number(product.id) !== productId
            );
        }
    } else if (action === "remove") {
        cart = cart.filter(
            product => Number(product.id) !== productId
        );
    }

    if (!saveCart()) {
        cart = loadCart();
    }

    updateCartCount();
    renderCart();
}
function openCart() {
    if (!cartModal) return;

    renderCart();

    cartModal.classList.add("show");
    cartModal.setAttribute("aria-hidden", "false");

    document.body.classList.add("modal-open");
}

function closeCart() {
    if (!cartModal) return;

    cartModal.classList.remove("show");
    cartModal.setAttribute("aria-hidden", "true");

    if (!modal?.classList.contains("show")) {
        document.body.classList.remove("modal-open");
    }
}

if (cartButton) {
    cartButton.addEventListener("click", openCart);
}

if (closeCartBtn) {
    closeCartBtn.addEventListener("click", closeCart);
}

if (cartModal) {
    cartModal.addEventListener("click", event => {
        if (event.target === cartModal) {
            closeCart();
        }
    });
}
if (searchButton && searchPanel && searchInput) {
    searchButton.addEventListener("click", () => {
        searchPanel.hidden = !searchPanel.hidden;

        if (!searchPanel.hidden) {
            searchInput.focus();
        } else {
            searchInput.value = "";
            renderProducts();
        }
    });
}

if (closeSearchBtn && searchPanel && searchInput) {
    closeSearchBtn.addEventListener("click", () => {
        searchInput.value = "";
        searchPanel.hidden = true;
        renderProducts();
    });
}

if (searchInput) {
    searchInput.addEventListener("input", () => {
        renderProducts(searchInput.value);
    });
}
document.addEventListener("keydown", event => {
    if (event.key !== "Escape") return;

    closeModal();
    closeCart();

    if (searchPanel && !searchPanel.hidden) {
        searchPanel.hidden = true;
        searchInput.value = "";
        renderProducts();
    }
});

renderProducts();
updateCartCount();