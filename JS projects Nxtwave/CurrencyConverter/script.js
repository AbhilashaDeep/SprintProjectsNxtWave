const fromCurrency = document.getElementById("fromCurrency");
const toCurrency = document.getElementById("toCurrency");
const amount = document.getElementById("amount");
const result = document.getElementById("result");
const rateInfo = document.getElementById("rateInfo");
const timestamp = document.getElementById("timestamp");
const swapBtn = document.getElementById("swap");

const currencies = [
  "USD",
  "EUR",
  "INR",
  "CAD",
  "GBP",
  "AUD",
  "JPY",
  "CNY",
  "BRL",
];

function populateDropdowns() {
  currencies.forEach((currency) => {
    const option1 = document.createElement("option");
    option1.value = currency;
    option1.textContent = currency;
    fromCurrency.appendChild(option1);

    const option2 = document.createElement("option");
    option2.value = currency;
    option2.textContent = currency;
    toCurrency.appendChild(option2);
  });

  fromCurrency.value = "INR";
  toCurrency.value = "CAD";
}

async function getExchangeRate() {
  const base = fromCurrency.value;
  const target = toCurrency.value;

  if (base === target) {
    result.textContent = parseFloat(amount.value).toFixed(2);
    rateInfo.textContent = `1 ${base} = 1 ${target}`;
    timestamp.textContent = "";
    return;
  }

  try {
    const res = await fetch(`https://open.er-api.com/v6/latest/${base}`);
    const data = await res.json();

    const rate = data.rates[target];
    const converted = (parseFloat(amount.value) * rate).toFixed(2);

    result.textContent = converted;
    rateInfo.textContent = `1 ${base} = ${rate.toFixed(5)} ${target}`;
    timestamp.textContent = `Last updated: ${data.time_last_update_utc}`;
  } catch (error) {
    result.textContent = "Error";
    rateInfo.textContent = "Could not fetch rate.";
    timestamp.textContent = "";
    console.error(error);
  }
}

amount.addEventListener("input", getExchangeRate);
fromCurrency.addEventListener("change", getExchangeRate);
toCurrency.addEventListener("change", getExchangeRate);

swapBtn.addEventListener("click", () => {
  const temp = fromCurrency.value;
  fromCurrency.value = toCurrency.value;
  toCurrency.value = temp;
  getExchangeRate();
});

populateDropdowns();
getExchangeRate();
