export const sleep = async (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const createRandomArray = (maxSamples: number, maxValue: number): number[] =>
  Array.from({ length: maxSamples }, () => Math.floor(Math.random() * (maxValue))
)