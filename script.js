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
