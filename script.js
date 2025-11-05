const container = document.getElementById("cryptoContainer");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const errorMessage = document.getElementById("errorMessage");

async function fetchCryptoList(query = "") {
	container.innerHTML = "⏳ Loading...";
	errorMessage.textContent = "";

	try {
		const res = await fetch(
			`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1`
		);
		const data = await res.json();

		let filtered = data.filter(coin =>
			coin.name.toLowerCase().includes(query.toLowerCase())
		);

		if (filtered.length === 0) {
			container.innerHTML = "";
			errorMessage.textContent = `No crypto found for "${query}"`;
			return;
		}

		displayCryptos(filtered);
	} catch (err) {
		container.innerHTML = "";
		errorMessage.textContent = "Failed to load crypto data. Try again.";
	}
}

function displayCryptos(coins) {
	container.innerHTML = "";
	coins.forEach(coin => {
		const changeClass = coin.price_change_percentage_24h >= 0 ? "green" : "red";
		const card = document.createElement("div");
		card.className = "crypto-card";

		card.innerHTML = `
      <div class="left">
        <img src="${coin.image}" alt="${coin.name}">
        <strong>${coin.name} (${coin.symbol.toUpperCase()})</strong>
      </div>
      <div class="right">
        <span>$${coin.current_price.toLocaleString()}</span>
        <span class="${changeClass}">${coin.price_change_percentage_24h.toFixed(2)}%</span>
      </div>
    `;

		container.appendChild(card);
	});
}

// Event listeners
searchBtn.addEventListener("click", () => {
	fetchCryptoList(searchInput.value);
});

searchInput.addEventListener("keydown", (e) => {
	if (e.key === "Enter") fetchCryptoList(searchInput.value);
});

// Load default coins on page start
window.onload = () => fetchCryptoList();
