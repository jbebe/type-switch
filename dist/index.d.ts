declare class Fallthrough {
}
export declare const FALL_THROUGH: Fallthrough;
interface IMatcher {
    matches(key: string): boolean;
}
declare abstract class BaseType implements IMatcher {
    response: Function;
    protected constructor(response: Function);
    matches(key: string): boolean;
    isFallthrough(): boolean;
}
declare class DefaultType extends BaseType {
    constructor(response: Function);
    matches(key: string): boolean;
    isFallthrough(): boolean;
}
export declare function Default(responseValue: any): DefaultType;
export declare function Default(callback: Function): DefaultType;
declare class CaseType extends BaseType {
    types: string[];
    fallthrough: boolean;
    constructor(types: string[], response: Function, fallthrough: boolean);
    matches(key: string): boolean;
    isFallthrough(): boolean;
}
export declare function Case(..._types: (undefined | null | Function)[]): (_1: any | Function | Fallthrough, _2?: any | Function) => CaseType;
export declare function TypeSwitch(switchOn: any): (..._: BaseType[]) => any;
export {};
//# sourceMappingURL=index.d.ts.map