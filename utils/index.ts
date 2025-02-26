// utils/weatherService.js
import axios from "axios";

// IMPORTANT: Do not hardcode API keys in production
// Use environment variables instead
const WEATHER_API_KEY =
  process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY;
const WEATHER_BASE_URL = "https://api.openweathermap.org/data/3.0/onecall";

// Default coordinates (New Delhi as fallback)
const DEFAULT_LOCATION = {
  latitude: 28.6139,
  longitude: 77.209,
};

export const getWeather = async (
  lat = DEFAULT_LOCATION.latitude,
  lon = DEFAULT_LOCATION.longitude,
  exclude = "minutely,hourly,alerts",
  units = "metric"
) => {
  try {
    // Make API request to OpenWeatherMap One Call API 3.0
    const response = await axios.get(WEATHER_BASE_URL, {
      params: {
        lat,
        lon,
        exclude,
        units,
        appid: WEATHER_API_KEY,
      },
    });

    // Extract relevant data from the response
    const weatherData = {
      city: "", // Will be populated by geocoding
      coordinates: {
        latitude: lat,
        longitude: lon,
      },
      current: {
        temperature: Math.round(response.data.current.temp),
        description: response.data.current.weather[0].description,
        icon: response.data.current.weather[0].icon,
        humidity: response.data.current.humidity,
        windSpeed: response.data.current.wind_speed,
        feelsLike: Math.round(response.data.current.feels_like),
        pressure: response.data.current.pressure,
      },
      daily: response.data.daily.slice(0, 5).map((day) => ({
        date: new Date(day.dt * 1000).toLocaleDateString(),
        temp: {
          min: Math.round(day.temp.min),
          max: Math.round(day.temp.max),
        },
        description: day.weather[0].description,
        icon: day.weather[0].icon,
      })),
    };

    // Get city name using Google Maps API
    try {
      const address = await fetchAddressFromGoogle(lat, lon);
      weatherData.city = address;
    } catch (addressError) {
      console.warn("Failed to fetch city name:", addressError);
      weatherData.city = "Unknown location";
    }

    return weatherData;
  } catch (error) {
    // Handle different types of errors
    if (error.response) {
      throw new Error(`Weather API error: ${error.response.data.message}`);
    } else if (error.request) {
      throw new Error(
        "No response from weather service. Please check your internet connection."
      );
    } else {
      throw new Error("Error fetching weather data: " + error.message);
    }
  }
};

export const fetchAddressFromGoogle = async (latitude, longitude) => {
  const API_KEY = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${API_KEY}`;

  try {
    let response = await fetch(url);
    let json = await response.json();

    if (json.status === "OK") {
      let address = json.results[0].formatted_address;
      return address;
    } else {
      console.error("Geocoding failed:", json.status);
      return "Address not found";
    }
  } catch (error) {
    console.error("Error fetching address:", error);
    return "Error fetching address";
  }
};
