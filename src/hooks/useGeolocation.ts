import { useState, useEffect, useCallback } from 'react';

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
}

interface GeolocationError {
  code: number;
  message: string;
}

export const useGeolocation = () => {
  const [location, setLocation] = useState<GeolocationState>({ latitude: null, longitude: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<GeolocationError | null>(null);

  const getGeolocation = useCallback(() => {
    setLoading(true);
    setError(null);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({ latitude: position.coords.latitude, longitude: position.coords.longitude });
          setLoading(false);
        },
        (err) => {
          setError({ code: err.code, message: err.message });
          setLoading(false);
        }
      );
    } else {
      setError({ code: 0, message: "Geolocation is not supported by this browser." });
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getGeolocation();
  }, [getGeolocation]);

  return { location, loading, error, retry: getGeolocation };
};