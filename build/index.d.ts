declare type Functions<T> = {
    [key: string]: () => T;
};
interface ISettings {
    callBatchSize: number;
    cycleTime: number;
    warmUpCycleCount: number;
    measurementCycleCount: number;
    bestMeasurementCount: number;
}
export declare function testSync(functions: Functions<any>, settings?: Partial<ISettings>): Promise<void>;
export declare function testAsync(functions: Functions<Promise<any>>, settings?: Partial<ISettings>): Promise<void>;
export declare function test(functions: Functions<any>, settings?: Partial<ISettings>): Promise<void>;
export {};
//# sourceMappingURL=index.d.ts.map