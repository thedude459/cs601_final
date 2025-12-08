import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getWeather, WeatherData } from '../services/weatherService';

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

const GeolocationComponent: React.FC = () => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingWeather, setLoadingWeather] = useState<boolean>(false);

  const getWindDirection = (degrees: number): string => {
    const directions = [
      'N',
      'NNE',
      'NE',
      'ENE',
      'E',
      'ESE',
      'SE',
      'SSE',
      'S',
      'SSW',
      'SW',
      'WSW',
      'W',
      'WNW',
      'NW',
      'NNW',
    ];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
  };

  const getLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setLoading(true);
    setError('');

    const options = {
      enableHighAccuracy: false,
      timeout: 10000,
      maximumAge: 30000,
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        });
        setLoading(false);
        fetchWeather(position.coords.latitude, position.coords.longitude);
      },
      (err) => {
        let errorMessage = '';
        switch (err.code) {
          case err.PERMISSION_DENIED:
            errorMessage =
              'Location permission denied. Please enable location access in your browser settings.';
            break;
          case err.POSITION_UNAVAILABLE:
            errorMessage =
              'Location unavailable. Please ensure location services are enabled in System Settings, and try moving near a window or outdoors for better signal. Laptops rely on Wi-Fi positioning and may not work well indoors.';
            break;
          case err.TIMEOUT:
            errorMessage = 'Location request timed out. Please try again.';
            break;
          default:
            errorMessage = `Error: ${err.message}`;
        }
        setError(errorMessage);
        setLoading(false);
      },
      options
    );
  };

  const fetchWeather = async (lat: number, lon: number) => {
    setLoadingWeather(true);

    try {
      const data = await getWeather(lat, lon);
      setWeather(data);
    } catch (err) {
      console.error('Error fetching weather:', err);
    } finally {
      setLoadingWeather(false);
    }
  };

  return (
    <div className="page-content">
      <Link to="/" className="back-link">
        ← Back to Home
      </Link>

      <h2>Geolocation Demo</h2>
      <p>Get your current location using the HTML5 Geolocation API</p>

      <button className="btn" onClick={getLocation} disabled={loading}>
        {loading ? 'Getting Location...' : 'Get My Location'}
      </button>

      {error && <div className="error-message">{error}</div>}

      {location && (
        <div className="location-info">
          <h3>Location Details:</h3>
          <div className="info-grid">
            <div className="info-item">
              <strong>Latitude:</strong>
              <span>{location.latitude.toFixed(6)}</span>
            </div>
            <div className="info-item">
              <strong>Longitude:</strong>
              <span>{location.longitude.toFixed(6)}</span>
            </div>
            <div className="info-item">
              <strong>Accuracy:</strong>
              <span>{location.accuracy.toFixed(2)} meters</span>
            </div>
            <div className="info-item">
              <strong>Time:</strong>
              <span>{new Date(location.timestamp).toLocaleString()}</span>
            </div>
          </div>

          <div className="map-link">
            <a
              href={`https://www.openstreetmap.org/?mlat=${location.latitude}&mlon=${location.longitude}#map=15/${location.latitude}/${location.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn"
            >
              View on Map
            </a>
          </div>
        </div>
      )}

      {loadingWeather && (
        <div className="location-info" style={{ marginTop: '1.5rem' }}>
          <h3>Loading Weather Data...</h3>
        </div>
      )}

      {weather && (
        <div
          className="location-info"
          style={{
            marginTop: '1.5rem',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
          }}
        >
          <h3>Current Weather in {weather.city}</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginTop: '1rem' }}>
            <img
              src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
              alt="Weather icon"
              style={{ width: '80px', height: '80px' }}
            />
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{weather.temperature}°F</div>
              <div style={{ fontSize: '1.2rem', textTransform: 'capitalize', opacity: 0.9 }}>
                {weather.description}
              </div>
              <div style={{ fontSize: '1rem', opacity: 0.8, marginTop: '0.5rem' }}>
                Feels like {weather.feelsLike}°F
              </div>
            </div>
          </div>
          <div
            className="info-grid"
            style={{
              marginTop: '1.5rem',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            }}
          >
            <div className="info-item">
              <strong style={{ color: 'white' }}>💧 Humidity:</strong>
              <span style={{ color: 'white' }}>{weather.humidity}%</span>
            </div>
            <div className="info-item">
              <strong style={{ color: 'white' }}>💨 Wind:</strong>
              <span style={{ color: 'white' }}>
                {weather.windSpeed} mph {getWindDirection(weather.windDirection)}
              </span>
            </div>
            <div className="info-item">
              <strong style={{ color: 'white' }}>☁️ Cloud Cover:</strong>
              <span style={{ color: 'white' }}>{weather.cloudCover}%</span>
            </div>
            <div className="info-item">
              <strong style={{ color: 'white' }}>☀️ UV Index:</strong>
              <span style={{ color: 'white' }}>{weather.uvIndex.toFixed(1)}</span>
            </div>
            {weather.precipitation > 0 && (
              <div className="info-item">
                <strong style={{ color: 'white' }}>🌧️ Precipitation:</strong>
                <span style={{ color: 'white' }}>{weather.precipitation} mm</span>
              </div>
            )}
            <div className="info-item">
              <strong style={{ color: 'white' }}>🌦️ Precip. Chance:</strong>
              <span style={{ color: 'white' }}>{weather.precipitationProbability}%</span>
            </div>
            <div className="info-item">
              <strong style={{ color: 'white' }}>🌅 Sunrise:</strong>
              <span style={{ color: 'white' }}>
                {new Date(weather.sunrise).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
            <div className="info-item">
              <strong style={{ color: 'white' }}>🌇 Sunset:</strong>
              <span style={{ color: 'white' }}>
                {new Date(weather.sunset).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GeolocationComponent;
