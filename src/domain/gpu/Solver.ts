import { GPU, Texture, IKernelRunShortcut, IKernelFunctionThis, KernelFunction, IConstantsThis } from "gpu.js"
import { WorkerReadyPayload } from "../cpu/workers/Payloads";
import { DataInMessagePayload, DataOutMessagePayload } from "./Payloads"
const gpu = new GPU({ mode: "gpu" });

interface IConstants extends IConstantsThis {
    rangeLen: number,
}

interface IThis extends IKernelFunctionThis {
    constants: IConstants,
}

class SolverGPU {
    private readonly ctx: Worker = (self as unknown) as Worker;

    constructor() {
        this.ctx.onmessage = this.handleMessage.bind(this);
    }

    handleMessage(message: MessageEvent<DataInMessagePayload>) {
        const dataOut: DataOutMessagePayload = {
            matches: null,
            error: null,
        };

        try {
            this.checkInputPayload(message.data);
            dataOut.matches = this.solve(message.data);
        } catch (error) {
            dataOut.error = error;
        }

        this.ctx.postMessage(dataOut);
    }

    private checkInputPayload(data: DataInMessagePayload) {
        if (data.text.length < 1) {
            throw Error(
                `Text must be at least 1 character long (is ${data.text.length}).`
            );
        }
        if (data.pattern.length < 1) {
            throw Error(
                `Pattern must be at least 1 character long (is ${data.pattern.length}).`
            );
        }
        if (data.pattern.length > data.text.length) {
            throw Error(
                `Pattern can't be longer than text 
            (pattern length: ${data.pattern.length}, 
            text length: ${data.text.length})`
            );
        }
        if (data.kernelCount < 1) {
            throw Error(`Kernel count ({data.kernelCount}) must be a positive integer`);
        }
        if (data.kernelCount > data.text.length - data.pattern.length + 1) {
            throw Error(
                `Kernel count ({data.kernelCount}) must not be greater 
                than available exact matching positions ({data.text.length - data.pattern.length + 1}).`
            );
        }
    }

    solve(data: DataInMessagePayload): Array<number> {
        const maxPositionCount = data.text.length - data.pattern.length + 1;
        const perKernelRange = maxPositionCount / data.kernelCount;
        const paddingLength = maxPositionCount - Math.floor(perKernelRange) * data.kernelCount;

        const paddedText = new Uint8Array(data.text.length + paddingLength);
        paddedText.set(data.text, 0);

        const searchKernel = gpu.createKernel(kernelFunction).setOutput([data.kernelCount]);

        const output = searchKernel.run(data.text, data.pattern, perKernelRange);
        const matches : Array<number> = (output as number[][]).flat();
        
        return matches;
    }
}

const kernelFunction: KernelFunction = function (text: number[], pattern: number[], rangeLen: number) : Array<number> {
    const matches: Array<number> = [];
    const startPosition = this.thread.x * rangeLen;
    const endPosition = startPosition + rangeLen;

    // Run kernel for [i * perKernelRange, (i+1)*perKernelRange)
    for (let pos = startPosition; pos < endPosition; pos++) {
        let notMatching = false;

        for (let i = 0; pos < pattern.length; i++) {
            if (text[pos + i] != pattern[i]) {
                notMatching = true;
                break;
            }
        }
        if (notMatching) {
            continue;
        }
        matches.push(pos);
    }

    return matches;
};


/*
// Look ma! I can typescript on my GPU!
const kernelFunction: KernelFunction = function(anInt: number, anArray: number[], aNestedArray: number[][]) {
  const x = .25 + anInt + anArray[this.thread.x] + aNestedArray[this.thread.x][this.thread.y];
  return x;
};

const kernel: IKernelRunShortcut = gpu.createKernel(kernelFunction)
  .setOutput([1]);

const result = kernel(1, [.25], [[1.5]]);

console.log(result[0]); // 3
*/