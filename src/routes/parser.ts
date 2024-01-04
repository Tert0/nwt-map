import type { DataEntry } from "../app";

const ENTRY_SIZE = 24;

function validate_checksum(entry_raw: ArrayBuffer): boolean {
    const bytes = new Uint8Array(entry_raw);
    let checksum = 0;
    for (const byte of bytes) {
        checksum ^= byte;
    }
    return checksum == 0;
}

export function parseData(raw: ArrayBuffer): Array<DataEntry> {
    const entries_cnt = Math.trunc(raw.byteLength / ENTRY_SIZE);
    if (raw.byteLength % ENTRY_SIZE != 0) {
        alert(
            `Data length is correct. (Got: ${raw.byteLength} Expected: Block Size of ${ENTRY_SIZE})`
        );
    }

    const entries = [];

    for (let i = 0; i < entries_cnt; i++) {
        const entry_raw = raw.slice(i * ENTRY_SIZE, (i + 1) * ENTRY_SIZE);
        const [distance1, distance2, distance3] = new Uint16Array(entry_raw.slice(0, 6));
        const [latitude, longitude] = new Float64Array(entry_raw.slice(6, 22));
        const [pulse] = new Uint8Array(entry_raw.slice(22, 23));
        // Checksum is not read
        const valid = validate_checksum(entry_raw);
        if (!valid) {
            alert('Found invalid entry in data');
            continue;
        }
        const entry: DataEntry = {
            distance1,
            distance2,
            distance3,
            latitude,
            longitude,
            pulse
        };
        entries.push(entry);
    }
    
    return entries;
}