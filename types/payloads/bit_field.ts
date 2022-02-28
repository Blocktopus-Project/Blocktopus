export interface DisplayedSkinParts {
  cape: boolean;
  jacket: boolean;
  leftSleeve: boolean;
  rightSleeve: boolean;
  leftPantsLeg: boolean;
  rightPantsLeg: boolean;
  hat: boolean;
}

export interface AbilitiesFlags {
  invulnerable: boolean;
  flying: boolean;
  allowFlying: boolean;
  creativeMode: boolean;
}

export interface SteerVehicleFlags {
  jump: boolean;
  unmount: boolean;
}

export interface CommandblockFlags {
  trackOutput: boolean;
  isConditional: boolean;
  automatic: boolean;
}
