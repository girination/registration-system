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
