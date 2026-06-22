async function searchCountry() {
  const countryName = document.getElementById("countryInput").value.trim();
  const result = document.getElementById("result");

  if (countryName === "") {
    result.innerHTML = "<p class='error'>Please enter a country name</p>";
    return;
  }

  result.innerHTML = "Loading...";

  try {
    const url = "https://cdn.jsdelivr.net/gh/mledoze/countries@master/countries.json";
    console.log("API URL:", url);

    const response = await fetch(url);
    console.log("Response status:", response.status);

    if (!response.ok) {
      throw new Error("Country not found from API");
    }

    const data = await response.json();
    const searchName = countryName.toLowerCase();

    const country = data.find(function (item) {
      const commonName = item.name.common.toLowerCase();
      const officialName = item.name.official.toLowerCase();
      const cca2 = item.cca2 ? item.cca2.toLowerCase() : "";
      const cca3 = item.cca3 ? item.cca3.toLowerCase() : "";

      return commonName === searchName ||
             officialName === searchName ||
             commonName.includes(searchName) ||
             officialName.includes(searchName) ||
             cca2 === searchName ||
             cca3 === searchName;
    });

    if (!country) {
      throw new Error("Country not found");
    }

    const name = country.name.common;
    const capital = country.capital ? country.capital.join(", ") : "No capital";
    const region = country.region || "Not available";
    const flag = `https://flagcdn.com/w320/${country.cca2.toLowerCase()}.png`;
    const currency = getMainCurrency(country);

    result.innerHTML = `
      <h2>${name}</h2>
      <img src="${flag}" alt="Country Flag">
      <p><strong>Capital:</strong> ${capital}</p>
      <p><strong>Currency:</strong> ${currency}</p>
      <p><strong>Region:</strong> ${region}</p>
    `;
  } catch (error) {
    console.error("Real error:", error);
    result.innerHTML = `<p class='error'>${error.message}</p>`;
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
  let selectedCode = mainCurrencyByCountry[country.cca3] || currencyCodes[0];

  const selectedCurrency = country.currencies[selectedCode];

  if (!selectedCurrency) {
    const firstCode = currencyCodes[0];
    const firstCurrency = country.currencies[firstCode];
    return `${firstCurrency.name} (${firstCurrency.symbol || firstCode})`;
  }

  return `${selectedCurrency.name} (${selectedCurrency.symbol || selectedCode})`;
}
