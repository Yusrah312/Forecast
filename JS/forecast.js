const input = document.querySelector("#cityInput");
const getWeatherBtn = document.querySelector("#getWeatherBtn");
const errorMsg = document.querySelector("#errorMsg");
const result = document.querySelector("#result");

async function getForecast() {
    const city = input.value.trim();
    if (city === "") {
        errorMsg.textContent = "Please enter a city name.";
        setTimeout(() => {
            errorMsg.textContent = "";
        }, 3000);
        return;
    }
    else {
        result.innerHTML = `<p>Loading forecast data for ${city}...</p>`;
    }
    try {
        const response = await fetch(
        `../api/weather.php?city=${encodeURIComponent(city)}`
        );




        if (!response.ok) {
            throw new Error("Failed to fetch forecast data.");
        }

        const data = await response.json();

        console.log(data);


        const forecast = data.forecast.forecastday;

        let forecastHTML = "";

        forecast.forEach((day) => {
            const date = new Date(day.date);

            const formattedDate = date.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric"
            });

            forecastHTML += `
              <div class="forecast-card">
                <h2>${formattedDate}</h2>

                <img 
                  src="${day.day.condition.icon}" 
                  alt="${day.day.condition.text}"
                  class="weather-icon"
                >
                <p class="temperature">${day.day.avgtemp_c}°C</p>
                <p>High: ${day.day.maxtemp_c}°C</p>

                <p>Low: ${day.day.mintemp_c}°C</p>

                <p>Condition: ${day.day.condition.text}</p>
                <p>Humidity: ${day.day.avghumidity}%</p>
             </div>
            `;
        });
        result.innerHTML = forecastHTML;
    } catch (error) {
        errorMsg.textContent = "Error fetching forecast data. Please try again.";
        errorMsg.style.color = "red";
        errorMsg.style.fontWeight = "bolder";
        setTimeout(() => {
            errorMsg.textContent = "";
        }, 3000);
    }
}