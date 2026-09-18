import { egyptMission } from './egypt';
import { brazilMission } from './brazil';
import { indiaMission } from './india';
import { usaMission } from './usa';
import { australiaMission } from './australia';

/**
 * Array of all missions in the game
 */
export const missionsData = [
  egyptMission,
  brazilMission,
  indiaMission,
  usaMission,
  australiaMission
];

/**
 * Helper query functions for future database / API integration
 */
export const getMissionById = (id) => {
  return missionsData.find((mission) => mission.id === id) || missionsData[0];
};

export const getMissionByCode = (code) => {
  return missionsData.find((mission) => mission.code === code);
};

export const getAllMissions = () => {
  return missionsData;
};

export {
  egyptMission,
  brazilMission,
  indiaMission,
  usaMission,
  australiaMission
};
