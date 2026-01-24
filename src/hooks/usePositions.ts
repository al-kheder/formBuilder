import { useState, useEffect } from 'react';
import { getAllPositions, getCustomPositions, addCustomPosition, removeCustomPosition } from '@/data/positions';

export const POSITIONS_UPDATED_EVENT = 'positions-updated';

export function usePositions() {
  const [customPositions, setCustomPositions] = useState<string[]>(getCustomPositions());
  const [allPositions, setAllPositions] = useState<string[]>(getAllPositions());

  const updatePositions = () => {
    setCustomPositions(getCustomPositions());
    setAllPositions(getAllPositions());
  };

  useEffect(() => {
    window.addEventListener(POSITIONS_UPDATED_EVENT, updatePositions);
    return () => {
      window.removeEventListener(POSITIONS_UPDATED_EVENT, updatePositions);
    };
  }, []);

  const addPosition = (position: string) => {
    if (position.trim() && !allPositions.includes(position.trim())) {
      addCustomPosition(position.trim());
      updatePositions();
      window.dispatchEvent(new Event(POSITIONS_UPDATED_EVENT));
    }
  };

  const removePosition = (position: string) => {
    removeCustomPosition(position);
    updatePositions();
    window.dispatchEvent(new Event(POSITIONS_UPDATED_EVENT));
  };

  return {
    customPositions,
    allPositions,
    addPosition,
    removePosition,
  };
}
