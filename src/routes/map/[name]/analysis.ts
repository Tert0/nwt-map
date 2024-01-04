import type { DataEntry } from "../../../app";

export function dangerLevelByDistance(distance: number): 0 | 1 | 2 {
    if(distance < 500) {
        return 2;
    }
    if(distance < 1000) {
        return 1;
    }
    return 0;
}

export function dangerLevelByEntry(entry: DataEntry): 0 | 1 | 2 {
    return Math.max(...[entry.distance1, entry.distance2, entry.distance3].map(dangerLevelByDistance)) as (0 | 1 | 2);
}