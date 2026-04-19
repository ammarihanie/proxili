import { memo, useEffect, useMemo, useState } from 'react';
import { Geolocation } from '@capacitor/geolocation';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import { useEvents } from '../hooks/useEvents';
import 'leaflet/dist/leaflet.css';

const iconByCategory = {
  travaux: new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41]
  }),
  evenement: new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41]
  }),
  default: new L.Icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41]
  })
};

const EventMarkers = memo(({ items }) =>
  items.map((event) => {
    const category = event.category?.toLowerCase() ?? 'default';
    const icon = iconByCategory[category] ?? iconByCategory.default;

    return (
      <Marker key={event.id} position={[event.location?.lat, event.location?.lng]} icon={icon}>
        <Popup>
          <p className="font-semibold">{event.title}</p>
          <p className="text-sm text-slate-600">{event.category}</p>
        </Popup>
      </Marker>
    );
  })
);

const MapDisplay = () => {
  const { events, loading, error } = useEvents();
  const [search, setSearch] = useState('');
  const [userPosition, setUserPosition] = useState([48.8566, 2.3522]);

  useEffect(() => {
    const loadPosition = async () => {
      try {
        const permission = await Geolocation.requestPermissions();
        if (permission.location === 'granted') {
          const { coords } = await Geolocation.getCurrentPosition({ enableHighAccuracy: true });
          setUserPosition([coords.latitude, coords.longitude]);
        }
      } catch (geoError) {
        console.error('Unable to load user geolocation', geoError);
      }
    };

    loadPosition();
  }, []);

  const filteredEvents = useMemo(
    () =>
      events
        .filter(
          (event) =>
            typeof event.location?.lat === 'number' && typeof event.location?.lng === 'number'
        )
        .filter((event) =>
          `${event.title ?? ''} ${event.category ?? ''}`.toLowerCase().includes(search.toLowerCase())
        ),
    [events, search]
  );

  if (loading) {
    return <p className="p-4 text-sm text-slate-500">Chargement des événements…</p>;
  }

  if (error) {
    return <p className="p-4 text-sm text-red-600">Impossible de charger les événements.</p>;
  }

  return (
    <div className="relative h-[calc(100vh-4rem)] w-full overflow-hidden rounded-xl border border-slate-200">
      <div className="absolute left-4 right-4 top-4 z-[1000] rounded-xl bg-white/90 p-3 shadow-lg backdrop-blur">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Rechercher un événement citoyen"
          className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
      </div>

      <MapContainer center={userPosition} zoom={14} className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <EventMarkers items={filteredEvents} />
      </MapContainer>
    </div>
  );
};

export default MapDisplay;
