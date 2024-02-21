import PQueue from "p-queue";

export const cpuQueue = new PQueue({ concurrency: 1 });
