import { performance } from "perf_hooks";

type Functions<T> = { [key: string]: () => T };
type FunctionsExtended = { [key: string]: Function & { measurements: number[] } };
type Runner = (func: Function, settings: ISettings) => Promise<number>;

interface ISettings {
    callBatchSize: number;
    cycleTime: number;
    warmUpCycleCount: number;
    measurementCycleCount: number;
    bestMeasurementCount: number;
}

const defaultSettings: ISettings = {
    callBatchSize: 1_000,
    cycleTime: 100,
    warmUpCycleCount: 10,
    measurementCycleCount: 100,
    bestMeasurementCount: 10,
}

async function execSync(func: Function, settings: ISettings): Promise<number> {
    let operationCount: number = 0;
    let elapsedMilliseconds: number = 0;
    let start: number = performance.now();
    while ((elapsedMilliseconds = performance.now() - start) < settings.cycleTime) {
        for (let n: number = 0; n < settings.callBatchSize; n += 20) {
            func(); func(); func(); func(); func();
            func(); func(); func(); func(); func();
            func(); func(); func(); func(); func();
            func(); func(); func(); func(); func();
        }
        operationCount += settings.callBatchSize;
    }
    return operationCount / (elapsedMilliseconds / 1000);
}

async function execAsync(func: Function, settings: ISettings): Promise<number> {
    let operationCount: number = 0;
    let elapsedMilliseconds: number = 0;
    let start: number = performance.now();
    while ((elapsedMilliseconds = performance.now() - start) < settings.cycleTime) {
        for (let n: number = 0; n < settings.callBatchSize; n += 20) {
            await Promise.all([
                func(), func(), func(), func(), func(),
                func(), func(), func(), func(), func(),
                func(), func(), func(), func(), func(),
                func(), func(), func(), func(), func(),
            ]);
        }
        operationCount += settings.callBatchSize;
    }
    return operationCount / (elapsedMilliseconds / 1000);
}

async function run(functions: FunctionsExtended, settings: ISettings, runner: Runner) {
    console.log(`Running tests with batch size = ${settings.callBatchSize.toLocaleString()} ops`);
    console.log(`Warm up time per function = ${(settings.cycleTime * settings.warmUpCycleCount).toLocaleString()} ms`);
    console.log(`Time per function = ${(settings.cycleTime * settings.measurementCycleCount).toLocaleString()} ms`);
    console.log(`Cycle time = ${settings.cycleTime.toLocaleString()} ms`);
    console.log(`Running warm up cycles (${settings.warmUpCycleCount}).`);
    for (let n: number = 0; n < settings.warmUpCycleCount; n++) {
        for (const name in functions) {
            await runner(functions[name], settings);
        }
    }
    console.log(`Running measurement cycles (${settings.measurementCycleCount}).`);
    for (const name in functions) {
        functions[name].measurements = [];
    }
    for (let n = 0; n < settings.measurementCycleCount; n++) {
        for (const name in functions) {
            const measurement: number = await runner(functions[name], settings);
            functions[name].measurements.push(measurement);
        }
    }
    console.log(`Results (best ${settings.bestMeasurementCount} measurements cycles):`);
    for (const name in functions) {
        const measurements: number[] = functions[name].measurements;
        const bestMeasurements: number[] = measurements.sort((a, b) => b - a).slice(0, settings.bestMeasurementCount);
        const opsPerSec: number = bestMeasurements.reduce((sum, x) => sum + x, 0);
        console.log(`[${name}] → ${Math.round(opsPerSec).toLocaleString()} ops/sec`);
    }
}

export async function testSync(functions: Functions<any>, settings: Partial<ISettings> = {}) {
    await run(functions as any as FunctionsExtended, { ...defaultSettings, ...settings }, execSync);
}

export async function testAsync(functions: Functions<Promise<any>>, settings: Partial<ISettings> = {}) {
    await run(functions as any as FunctionsExtended, { ...defaultSettings, ...settings }, execAsync);
}

export async function test(functions: Functions<any>, settings: Partial<ISettings> = {}) {
    await testSync(functions, settings);
}