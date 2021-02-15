export type Tents = 'H' | 'C' | 'S' | 'M' | 'F';
export type ReportState = 'broken' | 'beamed' | 'fighting' | 'looting' | 'dead' | 'empty';
export type Location = 'DWF' | 'ELM' | 'RDI';

export interface WarbandInfo {
    world: number,
    location: Location,
    tents: [Tents, Tents, Tents],
    pker: boolean,
    timer: number, // time in seconds
    state: ReportState,
};

export function parseChatLine(message: string): Partial<WarbandInfo>|null {
    let out: Partial<WarbandInfo> = {};
    let worldMatch = message.match(/^w?([0-9]+) /);
    if (worldMatch) {
        out.world = parseInt(worldMatch[1]);
    } else {
        worldMatch = message.match(/\sw?([0-9]+)$/);
        if (!worldMatch) {
            return null;
        }
        out.world = parseInt(worldMatch[1]);
    }

    let locationMatch = message.match(/\s(elm|rdi|dwf)(\s|$)/i);
    if (locationMatch) {
        out.location = locationMatch[1].toUpperCase() as Location;
    }

    if (message.match(/(^|\s)(pker|clan)(\s|$)/i)) {
        out.pker = true;
    }

    let tentsMatch = message.match(/\s(h|c|s|m|f)(h|c|s|m|f)(h|c|s|m|f)($|\s)/i);
    if (tentsMatch) {
        let tentOne = tentsMatch[1].toUpperCase() as Tents;
        let tentTwo = tentsMatch[2].toUpperCase() as Tents;
        let tentThree = tentsMatch[3].toUpperCase() as Tents;
        out.tents = [tentOne, tentTwo, tentThree];
    }

    return out;
}
