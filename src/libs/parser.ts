export type Tent = 'H' | 'C' | 'S' | 'M' | 'F';
export type ReportState = 'broken' | 'fighting' | 'looting' | 'dead' | 'empty';
export type Location = 'DWF' | 'ELM' | 'RDI';

export interface WarbandInfo {
    world: number,
    location: Location,
    tents: [Tent, Tent, Tent],
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

    if (message.match(/(^|\s)(pker|clan|clanned)(\s|$)/i)) {
        out.pker = true;
    }

    let tentsMatch = message.match(/\s([hcsmf]{3})($|\s)/i);
    if (tentsMatch) {
        let tents = tentsMatch[1].toUpperCase();

        let tentOne = tents[0] as Tent;
        let tentTwo = tents[1] as Tent;
        let tentThree = tents[2] as Tent;
        out.tents = [tentOne, tentTwo, tentThree];
    }

    let stateMatch = message.match(/\s(broken|beamed|fighting|looting|dead|empty|loot|lootable|cleared|clear|broke|boss)(\s|$)/i);
    if (stateMatch){
        let state = null
        if (['beamed', 'fighting', 'boss'].includes(stateMatch[1])){
            state = 'fighting';
        } else if (['broken', 'broke'].includes(stateMatch[1])){
            state = 'broken';
        } else if (['looting', 'loot', 'lootable', 'clear', 'cleared'].includes(stateMatch[1])){
            state = 'looting';
        } else {
            state = stateMatch[1];
        }

        if (!out.pker){
            out.state = state as ReportState;
        }

    }

    let timeMatch = message.match(/\s([0-9]+\s(min|mins|m))(\s|$)/i);
    if (timeMatch){
        let time = parseInt(timeMatch[1])*60;
        out.timer = time
    } else{
        timeMatch = message.match(/\s([0-9]+(min|mins|m))(\s|$)/i);
        if (timeMatch){
            let time = parseInt(timeMatch[1])*60;
            out.timer = time;
        } else{
            timeMatch = message.match(/\s([0-9]+:[0-9]+)(\s|$)/i);
            if (timeMatch){
                let time = timeMatch[1].split(':');
                out.timer = parseInt(time[0])*60+parseInt(time[1]);
            }
        }

    }
    let invalidCheck = message.match(/\s(invalid message)(\s|$)/i);
        if (invalidCheck){
            return null
        }

    return out;

}
