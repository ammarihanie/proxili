import {
  addDoc,
  collection,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';

const eventsCollection = collection(db, 'events');

export const subscribeToEvents = (callback, onError) => {
  return onSnapshot(
    eventsCollection,
    (snapshot) => {
      const events = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data()
        }))
        .sort((a, b) => {
          const aDate = a.createdAt?.toDate?.() ?? new Date(0);
          const bDate = b.createdAt?.toDate?.() ?? new Date(0);
          return bDate - aDate;
        });

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
