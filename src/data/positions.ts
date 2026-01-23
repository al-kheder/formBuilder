// Default position/function options
export const defaultPositions = [
  'Chief Executive Officer (CEO)',
  'Chief Financial Officer (CFO)',
  'Chief Technology Officer (CTO)',
  'Chief Operating Officer (COO)',
  'Managing Director',
  'Director',
  'Vice President',
  'Senior Manager',
  'Manager',
  'Team Lead',
  'Analyst',
  'Consultant',
  'Administrator',
  'Coordinator',
];

// Get custom positions from localStorage
export function getCustomPositions(): string[] {
  try {
    const stored = localStorage.getItem('customPositions');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading custom positions:', error);
    return [];
  }
}

// Save custom positions to localStorage
export function saveCustomPositions(positions: string[]): void {
  try {
    localStorage.setItem('customPositions', JSON.stringify(positions));
  } catch (error) {
    console.error('Error saving custom positions:', error);
  }
}

// Get all positions (default + custom)
export function getAllPositions(): string[] {
  const custom = getCustomPositions();
  return [...defaultPositions, ...custom];
}

// Add a new custom position
export function addCustomPosition(position: string): void {
  const custom = getCustomPositions();
  if (!custom.includes(position) && !defaultPositions.includes(position)) {
    custom.push(position);
    saveCustomPositions(custom);
  }
}

// Remove a custom position
export function removeCustomPosition(position: string): void {
  const custom = getCustomPositions();
  const filtered = custom.filter(p => p !== position);
  saveCustomPositions(filtered);
}
