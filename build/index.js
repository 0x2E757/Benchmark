"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.test = exports.testAsync = exports.testSync = void 0;
const perf_hooks_1 = require("perf_hooks");
const defaultSettings = {
    callBatchSize: 1000,
    cycleTime: 100,
    warmUpCycleCount: 10,
    measurementCycleCount: 100,
    bestMeasurementCount: 10,
};
function execSync(func, settings) {
    return __awaiter(this, void 0, void 0, function* () {
        let operationCount = 0;
        let elapsedMilliseconds = 0;
        let start = perf_hooks_1.performance.now();
        while ((elapsedMilliseconds = perf_hooks_1.performance.now() - start) < settings.cycleTime) {
            for (let n = 0; n < settings.callBatchSize; n += 20) {
                func();
                func();
                func();
                func();
                func();
                func();
                func();
                func();
                func();
                func();
                func();
                func();
                func();
                func();
                func();
                func();
                func();
                func();
                func();
                func();
            }
            operationCount += settings.callBatchSize;
        }
        return operationCount / (elapsedMilliseconds / 1000);
    });
}
function execAsync(func, settings) {
    return __awaiter(this, void 0, void 0, function* () {
        let operationCount = 0;
        let elapsedMilliseconds = 0;
        let start = perf_hooks_1.performance.now();
        while ((elapsedMilliseconds = perf_hooks_1.performance.now() - start) < settings.cycleTime) {
            for (let n = 0; n < settings.callBatchSize; n += 20) {
                yield Promise.all([
                    func(), func(), func(), func(), func(),
                    func(), func(), func(), func(), func(),
                    func(), func(), func(), func(), func(),
                    func(), func(), func(), func(), func(),
                ]);
            }
            operationCount += settings.callBatchSize;
        }
        return operationCount / (elapsedMilliseconds / 1000);
    });
}
function run(functions, settings, runner) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`Running tests with batch size = ${settings.callBatchSize.toLocaleString()} ops`);
        console.log(`Warm up time per function = ${(settings.cycleTime * settings.warmUpCycleCount).toLocaleString()} ms`);
        console.log(`Time per function = ${(settings.cycleTime * settings.measurementCycleCount).toLocaleString()} ms`);
        console.log(`Cycle time = ${settings.cycleTime.toLocaleString()} ms`);
        console.log(`Running warm up cycles (${settings.warmUpCycleCount}).`);
        for (let n = 0; n < settings.warmUpCycleCount; n++) {
            for (const name in functions) {
                yield runner(functions[name], settings);
            }
        }
        console.log(`Running measurement cycles (${settings.measurementCycleCount}).`);
        for (const name in functions) {
            functions[name].measurements = [];
        }
        for (let n = 0; n < settings.measurementCycleCount; n++) {
            for (const name in functions) {
                const measurement = yield runner(functions[name], settings);
                functions[name].measurements.push(measurement);
            }
        }
        console.log(`Results (best ${settings.bestMeasurementCount} measurements cycles):`);
        for (const name in functions) {
            const measurements = functions[name].measurements;
            const bestMeasurements = measurements.sort((a, b) => b - a).slice(0, settings.bestMeasurementCount);
            const opsPerSec = bestMeasurements.reduce((sum, x) => sum + x, 0);
            console.log(`[${name}] → ${Math.round(opsPerSec).toLocaleString()} ops/sec`);
        }
    });
}
function testSync(functions, settings = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        yield run(functions, Object.assign(Object.assign({}, defaultSettings), settings), execSync);
    });
}
exports.testSync = testSync;
function testAsync(functions, settings = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        yield run(functions, Object.assign(Object.assign({}, defaultSettings), settings), execAsync);
    });
}
exports.testAsync = testAsync;
function test(functions, settings = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        yield testSync(functions, settings);
    });
}
exports.test = test;
//# sourceMappingURL=index.js.map