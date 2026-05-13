async function searchCountry() {
  const countryName = document.getElementById("countryInput").value.trim();
  const result = document.getElementById("result");

  if (countryName === "") {
    result.innerHTML = "<p class='error'>Please enter a country name</p>";
    return;
  }

  result.innerHTML = "Loading...";

  try {
const response = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(countryName)}`);
    if (!response.ok) {
      throw new Error("Country not found");
    }

    const data = await response.json();
    const country = data[0];

    const name = country.name.common;
    const capital = country.capital ? country.capital.join(", ") : "No capital";
    const population = country.population.toLocaleString();
    const region = country.region;
    const flag = country.flags.png;
    const currency = getMainCurrency(country);

    result.innerHTML = `
      <h2>${name}</h2>
      <img src="${flag}" alt="Country Flag">
      <p><strong>Capital:</strong> ${capital}</p>
      <p><strong>Population:</strong> ${population}</p>
      <p><strong>Currency:</strong> ${currency}</p>
      <p><strong>Region:</strong> ${region}</p>
    `;
  } catch (error) {
    result.innerHTML = "<p class='error'>Country not found</p>";
  }
}

function getMainCurrency(country) {
  const mainCurrencyByCountry = {
    PSE: "ILS",
    USA: "USD",
    GBR: "GBP",
    JOR: "JOD",
    EGY: "EGP",
    SAU: "SAR",
    ARE: "AED",
    QAT: "QAR",
    KWT: "KWD",
    BHR: "BHD",
    OMN: "OMR",
    LBN: "LBP",
    IRQ: "IQD",
    SYR: "SYP",
    MAR: "MAD",
    DZA: "DZD",
    TUN: "TND",
    TUR: "TRY",
    DEU: "EUR",
    FRA: "EUR",
    ESP: "EUR",
    ITA: "EUR",
    NLD: "EUR",
    BEL: "EUR",
    CAN: "CAD",
    AUS: "AUD",
    JPN: "JPY",
    CHN: "CNY",
    IND: "INR",
    BRA: "BRL",
    RUS: "RUB"
  };

  if (!country.currencies) {
    return "No currency";
  }

  const currencyCodes = Object.keys(country.currencies);

  let selectedCode;

  if (mainCurrencyByCountry[country.cca3]) {
    selectedCode = mainCurrencyByCountry[country.cca3];
  } else {
    selectedCode = currencyCodes[0];
  }

  const selectedCurrency = country.currencies[selectedCode];

  if (!selectedCurrency) {
    const firstCode = currencyCodes[0];
    const firstCurrency = country.currencies[firstCode];
    return `${firstCurrency.name} (${firstCurrency.symbol || firstCode})`;
  }

  return `${selectedCurrency.name} (${selectedCurrency.symbol || selectedCode})`;
}