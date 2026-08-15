import { reactive } from "vue";

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

const settings = reactive<VisualizationSettings>({
  displayMode: "bars",
  orderMode: "random",
  maxSamples: 15,
  speed: "medium",
  delay: 200,
});

export function useVisualizationSettings() {
  return {
    settings,
  };
}
