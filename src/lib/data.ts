import { collection, writeBatch, getDocs, getFirestore } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';

// This file is now primarily for seeding data and defining types.
// The data is no longer exported directly.

export type Personnel = {
  id: string;
  name: string;
  rank: string;
  forceId: string;
  department: string;
  facility: string;
  block: string;
  room: string;
  status: 'Active' | 'On Leave' | 'Transferred';
};

export type Visitor = {
  id: string;
  name: string;
  photoId: string;
  visitingPersonnelId: string;
  timeIn: string;
  status: 'On-site' | 'Overstaying';
};

const personnelData: Personnel[] = [
  { id: 'p1', name: 'Clinton Giri', rank: 'Cadet', forceId: 'F1234', department: 'Training Wing', facility: 'Military Camp Alpha', block: 'Upper Block', room: 'Room 12', status: 'Active' },
  { id: 'p2', name: 'Sonia Sharma', rank: 'Sergeant', forceId: 'F5678', department: 'Logistics', facility: 'Military Camp Alpha', block: 'Lower Block', room: 'Room 3', status: 'Active' },
  { id: 'p3', name: 'Amit Kumar', rank: 'Officer', forceId: 'F9012', department: 'Command', facility: 'Military Camp Alpha', block: 'Admin Building', room: 'Office 1', status: 'Active' },
  { id: 'p4', name: 'Ravi Singh', rank: 'Teacher', forceId: 'T3456', department: 'Science', facility: 'Central School', block: 'Main Building', room: 'Class 10A', status: 'Active' },
];

const currentVisitorsData: Visitor[] = [
  { id: 'v1', name: 'John Doe', photoId: 'visitor-1', visitingPersonnelId: 'p1', timeIn: '14:00', status: 'On-site' },
  { id: 'v2', name: 'Jane Smith', photoId: 'visitor-2', visitingPersonnelId: 'p2', timeIn: '13:30', status: 'On-site' },
  { id: 'v3', name: 'Peter Jones', photoId: 'visitor-3', visitingPersonnelId: 'p1', timeIn: '10:00', status: 'Overstaying' },
];

async function seedFirestore() {
  try {
    const { firestore } = initializeFirebase();
    
    // Seed Personnel
    const personnelCol = collection(firestore, 'personnel');
    const personnelSnapshot = await getDocs(personnelCol);
    if (personnelSnapshot.empty) {
      const personnelBatch = writeBatch(firestore);
      personnelData.forEach(person => {
        const docRef = collection(firestore, 'personnel', person.id);
        personnelBatch.set(docRef, person);
      });
      await personnelBatch.commit();
      console.log('Personnel data seeded.');
    }

    // Seed Visitors
    const visitorsCol = collection(firestore, 'visitors');
    const visitorsSnapshot = await getDocs(visitorsCol);
    if (visitorsSnapshot.empty) {
      const visitorsBatch = writeBatch(firestore);
      currentVisitorsData.forEach(visitor => {
        const docRef = collection(firestore, 'visitors', visitor.id);
        visitorsBatch.set(docRef, visitor);
      });
      await visitorsBatch.commit();
      console.log('Visitor data seeded.');
    }

  } catch (error) {
    console.error("Error seeding Firestore: ", error);
  }
}

// Check if we are in a browser environment before seeding
if (typeof window !== 'undefined') {
    //seedFirestore();
}
