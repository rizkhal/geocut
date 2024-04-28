import { type MultiPartData } from "h3";
import { twMerge } from "tailwind-merge";
import { type ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function bytesToMb(bytes: number, roundTo: number) {
  var converted = bytes / (1024 * 1024);
  return roundTo ? converted.toFixed(roundTo) : converted;
}

export const isFile = (data: MultiPartData) => {
  const FILE_KEYS = ["name", "filename", "type", "data"];

  return (
    Object.keys(data).filter((key) => FILE_KEYS.indexOf(key) !== -1).length ===
    FILE_KEYS.length
  );
};

export const transoformRequest = (data?: MultiPartData[]) => {
  const arr = Array.isArray(data) ? data : ([] as MultiPartData[]);

  const result = arr.reduce((prev: Record<string, any>, curr) => {
    prev[String(curr.name)] = isFile(curr) ? curr : curr.data.toString("utf8");

    return prev;
  }, {});

  return result;
};
