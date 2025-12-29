import { collection, doc, writeBatch, getDocs } from 'firebase/firestore';
import { initializeFirebase } from '../src/firebase/index';

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
    console.log('Initializing Firebase...');
    const { firestore } = initializeFirebase();
    console.log('Firebase initialized.');
    
    // Seed Personnel
    console.log('Seeding personnel data...');
    const personnelCol = collection(firestore, 'personnel');
    const personnelSnapshot = await getDocs(personnelCol);
    if (personnelSnapshot.empty) {
      const personnelBatch = writeBatch(firestore);
      personnelData.forEach(person => {
        const docRef = doc(firestore, 'personnel', person.id);
        personnelBatch.set(docRef, person);
      });
      await personnelBatch.commit();
      console.log('✅ Personnel data seeded successfully.');
    } else {
      console.log('ℹ️ Personnel data already exists. Skipping seed.');
    }

    // Seed Visitors
    console.log('Seeding visitor data...');
    const visitorsCol = collection(firestore, 'visitors');
    const visitorsSnapshot = await getDocs(visitorsCol);
    if (visitorsSnapshot.empty) {
      const visitorsBatch = writeBatch(firestore);
      currentVisitorsData.forEach(visitor => {
        const docRef = doc(firestore, 'visitors', visitor.id);
        visitorsBatch.set(docRef, visitor);
      });
      await visitorsBatch.commit();
      console.log('✅ Visitor data seeded successfully.');
    } else {
        console.log('ℹ️ Visitor data already exists. Skipping seed.');
    }

    console.log('Database seeding complete.');
    // The script will exit automatically.
    // We need to add a small delay to allow async operations to finish.
    await new Promise(resolve => setTimeout(resolve, 2000));
    process.exit(0);

  } catch (error) {
    console.error("❌ Error seeding Firestore: ", error);
    process.exit(1);
  }
}

seedFirestore();
