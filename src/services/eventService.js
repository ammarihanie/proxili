import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';

const eventsCollection = collection(db, 'events');

export const subscribeToEvents = (callback, onError) => {
  const eventsQuery = query(eventsCollection, orderBy('createdAt', 'desc'));

  return onSnapshot(
    eventsQuery,
    (snapshot) => {
      const events = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));

      callback(events);
    },
    (error) => {
      if (onError) {
        onError(error);
      }
    }
  );
};

export const addEvent = async (eventData) =>
  addDoc(eventsCollection, {
    ...eventData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
