import {parse} from './grammar';

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
    try {
        return parse(message);
    } catch(e) {
        return null;
    }
}
