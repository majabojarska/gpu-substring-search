export interface DataInMessagePayload {
    pattern: Uint8Array;
    text: Uint8Array;
    kernelCount: number;
}

export interface DataOutMessagePayload {
    matches: Array<number>;
    error: Error;
}