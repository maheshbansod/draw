
export interface Serializeable<Names extends string = string> {
    serialize(): SerializeableOutput<Names>;
}

export interface SerializeableOutput<Names extends string = string> {
    name: Names;
    data: {
        [key: string]: SerializeableOutput | SerializeableOutput[] | Json | string | number | boolean | null;
    }
}


export function stringify(obj: SerializeableOutput) {
    return JSON.stringify(obj);
}

export function parse(str: string) {
    return JSON.parse(str) as SerializeableOutput;
}

type Json = JsonObject | JsonArray | string | number | boolean | null;

type JsonObject = {
    [key: string]: Json
}

type JsonArray = Json[]