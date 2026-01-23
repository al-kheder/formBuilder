import { useState } from 'react';
import { getAllPositions, getCustomPositions, addCustomPosition, removeCustomPosition } from '@/data/positions';

export function usePositions() {
  const [customPositions, setCustomPositions] = useState<string[]>(getCustomPositions());
  const [allPositions, setAllPositions] = useState<string[]>(getAllPositions());

  const addPosition = (position: string) => {
    if (position.trim() && !allPositions.includes(position.trim())) {
      addCustomPosition(position.trim());
      updatePositions();
    }
  };

  const removePosition = (position: string) => {
    removeCustomPosition(position);
    updatePositions();
  };

  const updatePositions = () => {
    setCustomPositions(getCustomPositions());
    setAllPositions(getAllPositions());
  };

  return {
    customPositions,
    allPositions,
    addPosition,
    removePosition,
  };
}
