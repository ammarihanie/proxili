# proxili

Application mobile citoyenne (React + Vite + Tailwind + Capacitor + Firebase) pour afficher et signaler des événements en temps réel.

## Structure recommandée (scalable)

```text
src/
  components/
    EventReporter.jsx
    MapDisplay.jsx
  hooks/
    useEvents.js
  services/
    firebase.js
    eventService.js
  store/
    useAppStore.js
```

- `src/hooks` : listeners Firestore et logique temps réel côté React.
- `src/components` : composants UI réutilisables (carte, formulaire de signalement, etc.).
- `src/services` : configuration Firebase + accès Firestore/Storage.
- `src/store` : état global (ici avec Zustand).

## Firebase (SDK Web v9+ modulaire)

- `src/services/eventService.js`
  - `subscribeToEvents(callback)` : écoute les changements Firestore en temps réel via `onSnapshot`.
  - `addEvent(eventData)` : ajoute un incident/festivité avec géolocalisation et timestamps serveur.

## Hook React temps réel

- `src/hooks/useEvents.js`
  - abonnement au montage,
  - état local des événements,
  - gestion `loading`/`error`,
  - nettoyage du listener au démontage.

## Carte React-Leaflet

- `src/components/MapDisplay.jsx`
  - centre la carte sur la position de l'utilisateur via `@capacitor/geolocation`,
  - affiche les événements en `Marker`,
  - icônes personnalisées selon catégorie (`travaux` jaune, `evenement` vert),
  - barre de recherche flottante Tailwind,
  - optimisation perf via `useMemo` + `React.memo` pour les marqueurs.

## Accès natif Capacitor (géolocalisation + caméra)

- `src/components/EventReporter.jsx`
  - `getPreciseCoordinates()` avec `@capacitor/geolocation`,
  - `captureIncidentPhoto()` avec `@capacitor/camera`,
  - renvoie une URL (`dataUrl`) exploitable pour upload Firebase Storage.

## Setup rapide Capacitor (iOS + Android)

> Prérequis : projet React/Vite initialisé, Node.js, Xcode (iOS), Android Studio (Android).

```bash
npm install
npm install @capacitor/core @capacitor/cli @capacitor/geolocation @capacitor/camera
npx cap init proxili com.proxili.app --web-dir=dist
npm run build
npx cap add ios
npx cap add android
npx cap sync
npx cap open ios
npx cap open android
```

Workflow courant après changements web :

```bash
npm run build
npx cap sync
```
