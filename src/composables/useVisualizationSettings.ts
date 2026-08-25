import { reactive, watch } from "vue";

export type DisplayMode = "bars" | "dots";
export type OrderMode = "random" | "increasing" | "decreasing";
export type SpeedMode = "slow" | "medium" | "fast";

export interface VisualizationSettings {
  displayMode: DisplayMode;
  orderMode: OrderMode;
  maxSamples: number;
  speed: SpeedMode;
  delay: number;
}

export const SPEED_PRESETS: Record<SpeedMode, number> = {
  slow: 400,
  medium: 150,
  fast: 20,
};

const settings = reactive<VisualizationSettings>({
  displayMode: "bars",
  orderMode: "random",
  maxSamples: 15,
  speed: "medium",
  delay: SPEED_PRESETS.medium,
});

watch(
  () => settings.speed,
  (newSpeed) => {
    if (SPEED_PRESETS[newSpeed] !== undefined && settings.delay !== SPEED_PRESETS[newSpeed]) {
      settings.delay = SPEED_PRESETS[newSpeed];
    }
  }
);

watch(
  () => settings.delay,
  (newDelay) => {
    for (const [preset, delayVal] of Object.entries(SPEED_PRESETS) as [SpeedMode, number][]) {
      if (delayVal === newDelay && settings.speed !== preset) {
        settings.speed = preset;
        break;
      }
    }
  }
);

export function useVisualizationSettings() {
  return {
    settings,
  };
}

