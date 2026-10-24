// Placeholder coordinates: verify the campus centre, bounds and every destination
// by right-clicking the real location in Google Maps and copying its coordinates.
// Routes, walking times, distances, menus and office details are sample data.
export const CONFIG = {
  center: [2.833, 101.705],
  bounds: [[2.827, 101.699], [2.839, 101.711]],
  start: [2.8308, 101.7032],
  places: [
    { id: 'a', name: 'Sample Building A', type: 'Academic building', coords: [2.8336, 101.7043], distance: 420, minutes: 6, description: 'A sample academic building with student offices.', offices: [
      { id: 'o1', name: 'Sample Admissions Office', floor: 2, directions: ['Enter through the main entrance.', 'Take the lift to Floor 2.', 'Turn left. The sample office is at the end of the corridor.'] },
      { id: 'o2', name: 'Sample Student Affairs Office', floor: 1, directions: ['Enter through the main entrance.', 'Take the lift to Floor 1.', 'Turn left and follow the corridor to the sample office.'] },
    ] },
    { id: 'b', name: 'Sample Building B', type: 'Administration', coords: [2.8342, 101.7065], distance: 560, minutes: 8, description: 'A sample administration building.', offices: [
      { id: 'o3', name: 'Sample Finance Office', floor: 2, directions: ['Use the main entrance.', 'Take the lift to Floor 2.', 'Turn left at the lobby. The sample office is at the end of the corridor.'] },
      { id: 'o4', name: 'Sample Faculty Office', floor: 3, directions: ['Use the main entrance.', 'Take the lift to Floor 3.', 'Follow the corridor to the left to reach the sample office.'] },
    ] },
    { id: 'c', name: 'Sample Library', type: 'Study space', coords: [2.8353, 101.7048], distance: 680, minutes: 9, description: 'A sample place for reading and study.', offices: [] },
    { id: 'd', name: 'Sample Canteen', type: 'Food and drink', coords: [2.8321, 101.7048], distance: 240, minutes: 3, description: 'A sample stop for a meal between classes.', offices: [], menu: [{ name: 'Sample rice bowl', price: 'RM 8.00' }, { name: 'Sample noodle soup', price: 'RM 7.50' }, { name: 'Sample iced tea', price: 'RM 2.50' }], hours: 'Sample hours: Mon–Fri, 8 am–6 pm' },
    { id: 'e', name: 'Sample Event Hall', type: 'Event venue', coords: [2.8318, 101.7066], distance: 380, minutes: 5, description: 'A sample indoor venue for presentations and student events.', offices: [] },
  ],
};
export const DESTINATIONS = CONFIG.places.flatMap(place => [{ ...place, place }, ...place.offices.map(office => ({ ...office, place }))]);
export const OFFICES = DESTINATIONS.filter(item => item.floor);
