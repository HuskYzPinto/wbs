import {parseChatLine, WarbandInfo} from "./parser";

test.each([
    ['30 dwf', {world: 30, location: 'DWF'}],
    ['1 elm', {world: 1, location: 'ELM'}],
    ['1 rdi', {world: 1, location: 'RDI'}],
    ['1 cms', {world: 1, camps: ['C', 'M', 'S']}],
    ['w1 dwf', {world: 1, location: 'DWF'}],
    ['1 beamed hsm', {world: 1, camps: ['H', 'S', 'M'], state: 'beamed'}],
    ['1 hsm beamed', {world: 1, camps: ['H', 'S', 'M'], state: 'beamed'}],
    ['1 broken hsf', {world: 1, camps: ['H', 'S', 'F'], state: 'broken'}],
    ['1 broke hsm', {world: 1, camps: ['H', 'S', 'M'], state: 'broken'}],
    ['1 dead', {world: 1, state: 'dead'}],
    ['60 empty', {world: 60, state: 'empty'}],
    ['60 rdi empty', {world: 60, location: 'RDI', state: 'empty'}],
    ['60 dwf fighting', {world: 60, location: 'DWF', state: 'fighting'}],
    ['60 boss', {world: 60, state: 'fighting'}],
    ['60 looting', {world: 60, state: 'looting'}],
    ['60 looting cmf', {world: 60, camps: ['C', 'M', 'F'], state: 'looting'}],
    ['60 loot cmf', {world: 60, camps: ['C', 'M', 'F'], state: 'looting'}],
    ['pker 1', {world: 1, pker: true}],
    ['pker w1', {world: 1, pker: true}],
    ['1 clanned', {world: 1, pker: true}],
    ['1 clan', {world: 1, pker: true}],
    ['1 invalid message', null],
    ['w60 invalid message', null],
    ['w60 fighting pker', {world: 60, pker: true}],
] as Array<[string, Partial<WarbandInfo>]>)('%s', (chatLine, expected) => {
    expect(parseChatLine(chatLine)).toEqual(expected);
})

