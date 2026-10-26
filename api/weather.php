
<?php

header("Content-Type: application/json");

// 1. Load the API key from the private configuration file
$config = require "C:/xampp/weather-config/config.php";
$apiKey = $config["api_key"];

// 2. Get the city name from the browser
$city = trim($_GET["city"] ?? "Lagos");

// 3. Check that a city name was provided
if ($city === "") {
    http_response_code(400);
    echo json_encode(["error" => "Please enter a city name."]);
    exit;
}

// 4. Build the WeatherAPI request URL
$url = "https://api.weatherapi.com/v1/forecast.json?" . http_build_query([
    "key" => $apiKey,
    "q" => $city,
    "days" => 5,
    "aqi" => "no"
]);

// 5. Request weather data from WeatherAPI
$ch = curl_init($url);

curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 10);
curl_setopt($ch, CURLOPT_TIMEOUT, 20);

$response = curl_exec($ch);
$curlError = curl_error($ch);
$statusCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

curl_close($ch);

// 6. Handle connection errors
if ($response === false) {
    http_response_code(502);
    echo json_encode(["error" => "Could not connect to the weather service."]);
    exit;
}

// 7. Return the weather data to JavaScript
http_response_code($statusCode ?: 502);
echo $response;

?>

