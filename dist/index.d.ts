export declare class Fallthrough {
}
export declare const FALL_THROUGH: Fallthrough;
export interface IMatcher {
    matches(key: string): boolean;
}
export declare abstract class BaseType implements IMatcher {
    response: Function;
    protected constructor(response: Function);
    matches(key: string): boolean;
    isFallthrough(): boolean;
}
export declare class DefaultType extends BaseType {
    constructor(response: Function);
    matches(key: string): boolean;
    isFallthrough(): boolean;
}
export declare function Default(responseValue: any): DefaultType;
export declare function Default(callback: Function): DefaultType;
export declare class CaseType extends BaseType {
    types: string[];
    fallthrough: boolean;
    constructor(types: string[], response: Function, fallthrough: boolean);
    matches(key: string): boolean;
    isFallthrough(): boolean;
}
export declare function Case(..._types: (undefined | null | Function)[]): (_1: any | Function | Fallthrough, _2?: any | Function) => CaseType;
export declare function TypeSwitch(switchOn: any): (..._: BaseType[]) => any;
