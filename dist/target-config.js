// Shared by the board mesh, scoring, cinematic callouts and round scorecard.
export const TARGET_RADIUS=.65;
export const BULLSEYE_RADIUS=.0325; // Half the previous 10-ring diameter.
export const X_RING_RADIUS=.009;
export const ringRadius=index=>index===9?BULLSEYE_RADIUS:TARGET_RADIUS*(10-index)/10;
