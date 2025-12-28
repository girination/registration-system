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

export const personnelData: Personnel[] = [
  { id: 'p1', name: 'Clinton Giri', rank: 'Cadet', forceId: 'F1234', department: 'Training Wing', facility: 'Military Camp Alpha', block: 'Upper Block', room: 'Room 12', status: 'Active' },
  { id: 'p2', name: 'Sonia Sharma', rank: 'Sergeant', forceId: 'F5678', department: 'Logistics', facility: 'Military Camp Alpha', block: 'Lower Block', room: 'Room 3', status: 'Active' },
  { id: 'p3', name: 'Amit Kumar', rank: 'Officer', forceId: 'F9012', department: 'Command', facility: 'Military Camp Alpha', block: 'Admin Building', room: 'Office 1', status: 'Active' },
  { id: 'p4', name: 'Ravi Singh', rank: 'Teacher', forceId: 'T3456', department: 'Science', facility: 'Central School', block: 'Main Building', room: 'Class 10A', status: 'Active' },
];

export const currentVisitorsData: Visitor[] = [
  { id: 'v1', name: 'John Doe', photoId: 'visitor-1', visitingPersonnelId: 'p1', timeIn: '14:00', status: 'On-site' },
  { id: 'v2', name: 'Jane Smith', photoId: 'visitor-2', visitingPersonnelId: 'p2', timeIn: '13:30', status: 'On-site' },
  { id: 'v3', name: 'Peter Jones', photoId: 'visitor-3', visitingPersonnelId: 'p1', timeIn: '10:00', status: 'Overstaying' },
];
