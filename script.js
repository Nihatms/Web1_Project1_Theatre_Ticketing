const venueData = [
  {
    sectionName: "VIP",
    price: 150,
    color: "#f1c40f", // Gold marker for CSS in Week 2
    rows: 3,
    seatsPerRow: 10,
    idPrefix: "V",
  },
  {
    sectionName: "Stalls",
    price: 85,
    color: "#e67e22", // Orange marker
    rows: 6,
    seatsPerRow: 14,
    idPrefix: "S",
  },
  {
    sectionName: "Balcony",
    price: 45,
    color: "#3498db", // Blue marker
    rows: 5,
    seatsPerRow: 18,
    idPrefix: "B",
  },
];

const seatsContainer = document.getElementById("seats-container");

function generateVenue() {
  venueData.forEach((section) => {
    const sectionDiv = document.createElement("div");
    sectionDiv.classList.add("venue-section");
    sectionDiv.style.marginBottom = "20px";

    for (let r = 1; r <= section.rows; r++) {
      const rowDiv = document.createElement("div");
      rowDiv.classList.add("row");

      for (let s = 1; s <= section.seatsPerRow; s++) {
        const seatBtn = document.createElement("button");
        seatBtn.classList.add("seat", "available");
        seatBtn.style.backgroundColor = section.color;

        const seatId = `${section.idPrefix}-${r}-${s}`;
        seatBtn.id = seatId;
        seatBtn.textContent = s;
        seatBtn.dataset.section = section.sectionName;
        seatBtn.dataset.row = r;
        seatBtn.dataset.number = s;
        seatBtn.dataset.price = section.price;

        if (Math.random() < 0.05) {
          seatBtn.classList.replace("available", "unavailable");
          seatBtn.disabled = true;
        }

        rowDiv.appendChild(seatBtn);
      }
      sectionDiv.appendChild(rowDiv);
    }
    seatsContainer.appendChild(sectionDiv);
  });
}

generateVenue();

const seatDetailsDisplay = document.getElementById("seat-details");
const seatPriceDisplay = document.getElementById("seat-price");
const addToCartBtn = document.getElementById("add-to-cart");

let currentlyInspectedSeat = null;

seatsContainer.addEventListener("click", (e) => {
  if (
    e.target.classList.contains("seat") &&
    e.target.classList.contains("available")
  ) {
    const clickedSeat = e.target;

    if (currentlyInspectedSeat) {
      currentlyInspectedSeat.classList.remove("inspected");
    }

    clickedSeat.classList.add("inspected");
    currentlyInspectedSeat = clickedSeat;

    const section = clickedSeat.dataset.section;
    const row = clickedSeat.dataset.row;
    const number = clickedSeat.dataset.number;
    const price = clickedSeat.dataset.price;

    seatDetailsDisplay.textContent = `Section: ${section} | Row: ${row} | Seat: ${number}`;
    seatPriceDisplay.textContent = `Price: $${price}`;

    addToCartBtn.disabled = false;
  }
});



// ///////////////////////////

const cartItemsList = document.getElementById("cart-items");
const cartTotalDisplay = document.getElementById("cart-total");

const venueMap = document.getElementById("venue-map");



let cart = [];
let zoomLevel = 1;
let panX = 0;
let panY = 0;

function updateMapTransform() {
  venueMap.style.transform = `translate(${panX}px, ${panY}px) scale(${zoomLevel})`;
}


document.getElementById("zoom-in").addEventListener("click", () => {
  zoomLevel += 0.1;  updateMapTransform();
});


document.getElementById("zoom-out").addEventListener("click", () => {
  if (zoomLevel > 0.5) zoomLevel -= 0.1;
  updateMapTransform();
});


document.getElementById("move-up").addEventListener("click", () => {
  panY += 30;
  updateMapTransform();
});


document.getElementById("move-down").addEventListener("click", () => {
  panY -= 30;
  updateMapTransform();
});


document.getElementById("move-left").addEventListener("click", () => {
  panX += 30;
  updateMapTransform();
});


document.getElementById("move-right").addEventListener("click", () => {
  panX -= 30;
  updateMapTransform();
});


document.getElementById("reset-view").addEventListener("click", () => {
  zoomLevel = 1;
  panX = 0;
  panY = 0;
  updateMapTransform();
});


// Add Inspected Seat to Cart
addToCartBtn.addEventListener("click", () => {
  if (!currentlyInspectedSeat) return;

  const seatId = currentlyInspectedSeat.id;
  const exists = cart.some((item) => item.id === seatId);

  if (exists) return;

  const seatData = {
    id: seatId,
    section: currentlyInspectedSeat.dataset.section,
    row: currentlyInspectedSeat.dataset.row,
    number: currentlyInspectedSeat.dataset.number,
    price: parseInt(currentlyInspectedSeat.dataset.price),
  };

  cart.push(seatData);

  currentlyInspectedSeat.classList.remove("inspected", "available");
  currentlyInspectedSeat.classList.add("in-cart");

  currentlyInspectedSeat = null;
  seatDetailsDisplay.textContent = "Select a seat to view details.";
  seatPriceDisplay.textContent = "";
  addToCartBtn.disabled = true;

  saveAndRenderCart();
});

// Remove Ticket from Cart and Update Seat State on the mapp
function removeSeatFromCart(seatId) {
  cart = cart.filter((item) => item.id !== seatId);

  const seatElement = document.getElementById(seatId);
  if (seatElement) {
    seatElement.classList.remove("in-cart");
    seatElement.classList.add("available");
  }

  saveAndRenderCart();
}

// Save Cart State to LocalStorage
function saveAndRenderCart() {
  localStorage.setItem("theatreCart", JSON.stringify(cart));
  renderCart();
}

function renderCart() {
  cartItemsList.innerHTML = "";
  let total = 0;

  cart.forEach((item) => {
    total += item.price;
    const li = document.createElement("li");
    li.innerHTML = `<span>${item.section} R${item.row} S${item.number} - $${item.price}</span>
    <button class="remove-btn" onclick="removeSeatFromCart('${item.id}')">Remove</button>`;
    cartItemsList.appendChild(li);
  });

  cartTotalDisplay.textContent = total;
}


function loadCartFromStorage() {
  const savedCart = localStorage.getItem("theatreCart");
  if (savedCart) {
    cart = JSON.parse(savedCart);
    cart.forEach((item) => {
      const seatElement = document.getElementById(item.id);
      if (seatElement) {
        seatElement.classList.remove("available");
        seatElement.classList.add("in-cart");
      }
    });
    renderCart();

  }
}

loadCartFromStorage();


// THIS PREVENTS adding unavailable seats
function isSeatAvailable(seatElement) {
  return seatElement && seatElement.classList.contains("available");
}

// CHECK IF SEAT IS IN CART WHEN CLICKED AND DISPLAY MESSAGE
seatsContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("seat") && e.target.classList.contains("in-cart")) {
    
    seatDetailsDisplay.textContent = "This seat is already in your cart.";
    
    seatPriceDisplay.textContent = "";
    
    addToCartBtn.disabled = true;
  }
});