import type { DataEntry } from "../../../app";

export function dangerLevelByDistance(distance: number): number {
    if(distance < 500) {
        return 2;
    }
    if(distance < 1000) {
        return 1;
    }
    return 0;
}

export function dangerLevelByEntry(entry: DataEntry): number {
    return Math.max(...[entry.distance1, entry.distance2, entry.distance3].map(dangerLevelByDistance));
}