import { useState } from 'react';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Geolocation } from '@capacitor/geolocation';

const EventReporter = () => {
  const [coords, setCoords] = useState(null);
  const [photoUrl, setPhotoUrl] = useState('');

  const getPreciseCoordinates = async () => {
    const permission = await Geolocation.requestPermissions();
    if (permission.location !== 'granted') {
      throw new Error('Location permission denied');
    }

    const { coords: preciseCoords } = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000
    });

    const nextCoords = {
      lat: preciseCoords.latitude,
      lng: preciseCoords.longitude,
      accuracy: preciseCoords.accuracy
    };

    setCoords(nextCoords);
    return nextCoords;
  };

  const captureIncidentPhoto = async () => {
    const photo = await Camera.getPhoto({
      quality: 80,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera
    });

    const uploadUrl = photo.dataUrl ?? '';
    setPhotoUrl(uploadUrl);
    return uploadUrl;
  };

  return (
    <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="text-base font-semibold text-slate-800">Signaler un événement</h2>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={getPreciseCoordinates}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Récupérer la position précise
        </button>
        <button
          type="button"
          onClick={captureIncidentPhoto}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          Prendre une photo
        </button>
      </div>

      {coords && (
        <p className="text-sm text-slate-600">
          Coordonnées : {coords.lat.toFixed(6)}, {coords.lng.toFixed(6)} (±{Math.round(coords.accuracy)}m)
        </p>
      )}

      {photoUrl && (
        <div className="space-y-2">
          <p className="text-sm text-slate-600">URL prête pour upload Firebase Storage :</p>
          <img src={photoUrl} alt="Incident" className="max-h-48 w-full rounded-lg object-cover" />
        </div>
      )}
    </section>
  );
};

export default EventReporter;
