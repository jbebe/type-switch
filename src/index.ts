//
// Type
//

export class Fallthrough {}
export const FALL_THROUGH = new Fallthrough();

const Type = {
	Undefined: 'undefined',
	Null: 'null'
};

function NameOfType(val: any): string {
	if (val === void 0) {
		return Type.Undefined;
	}
	if (val === null) {
		return Type.Null;
	}
	return val.name;
}

function NameOfValue(val: any): string {
	if (val === void 0) {
		return Type.Undefined;
	}
	if (val === null) {
		return Type.Null;
	}
	return val.constructor.name;
}

const EmptyFunction = () => {
};

//
// Base and Interface
//

export interface IMatcher {

	matches(key: string): boolean;
}

export abstract class BaseType implements IMatcher {

	protected constructor(
		public response: Function
	) {
	}

	matches(key: string): boolean {
		return false;
	}

	isFallthrough(): boolean {
		return false;
	}
}

//
// Default
//

export class DefaultType extends BaseType {

	constructor(
		response: Function
	) {
		super(response);
	}

	matches(key: string): boolean {
		return false;
	}

	isFallthrough(): boolean {
		return false;
	}

}

export function Default(responseValue: any): DefaultType;
export function Default(callback: Function): DefaultType;
export function Default(_responseValue: any): DefaultType {
	let responseValue: Function;
	if (_responseValue.constructor === Function) {
		responseValue = <Function>_responseValue;
	} else {
		responseValue = () => _responseValue;
	}
	return new DefaultType(responseValue);
}

//
// Case
//

export class CaseType extends BaseType {

	constructor(
		public types: string[],
		response: Function,
		public fallthrough: boolean
	) {
		super(response);
	}

	matches(key: string): boolean {
		return this.types.includes(key);
	}

	isFallthrough(): boolean {
		return this.fallthrough;
	}

}

export function Case(
	..._types: (undefined | null | Function)[]
): (_1: any | Function | Fallthrough, _2?: any | Function) => CaseType {

	// get type names in a string array
	let types: string[] = _types.map(NameOfType);

	// return a function to get the case body separately
	return (
		maybeFallthrough: undefined | null | Function | Fallthrough,
		maybeResponseValue?: undefined | null | Function
	): CaseType => {

		// responseValue will always be a Function
		let responseValue: Function;

		// fallthrough flag for the CaseType
		let fallthrough = false;

		const maybeFallthroughType = NameOfValue(maybeFallthrough);

		// if maybeFallthrough is a function, we do nothing extra
		if (maybeFallthroughType === Function.name) {
			responseValue = <Function>maybeFallthrough;
		}
		// if maybeFallthrough is a fallthrough, we create a fallthrough case
		else if (maybeFallthroughType === Fallthrough.name) {

			// if maybeResponseValue is a possible body, we use it
			if (NameOfValue(maybeResponseValue) === Function.name) {
				responseValue = <Function>maybeResponseValue;
			}
			// otherwise it would be useless to return a single value
			// so we substitute it with an empty lambda
			else {
				responseValue = EmptyFunction;
			}

			// at this point we are certain that maybeFallthrough is a boolean
			fallthrough = true;
		}
		// if maybeFallthrough is not a function nor a fallthrough, we create a simple function
		// that returns that value. this way we can handle the case body as a function
		else {
			responseValue = (): any => <any>maybeFallthrough;
		}

		return new CaseType(types, responseValue, fallthrough);
	};
}

//
// SwitchType Function
//

export function TypeSwitch(switchOn: any): (..._: BaseType[]) => any {

	const typeName = NameOfValue(switchOn);

	return (...cases: BaseType[]) => {

		// return null if no rules defined
		if (cases.length === 0) {
			return null;
		}

		let isFallthrough = false;
		let fallthroughIndex: number = -1;

		// iterate over every case
		for (const [index, caseObj] of cases.entries()) {

			// we found a matching case
			if (caseObj.matches(typeName)) {

				// fallthrough found
				if (caseObj.isFallthrough()) {
					// store position in cases array
					fallthroughIndex = index;
					isFallthrough = true;
					// if it is a fallthrough we break out and iterate until the first non-fallthrough
					break;
				}
				// not a fallthrough, return value
				else {
					return caseObj.response(switchOn);
				}
			}
		}

		if (isFallthrough) {

			// start iteration from where we left
			let i = fallthroughIndex;

			do {
				const singleCase = cases[i];

				// first time it is a fallthrough but after that we eventually reach a non-fallthrough
				// in this case we return the value
				if (!singleCase.isFallthrough()) {
					return singleCase.response(switchOn);
				}
				// otherwise, it's another fallthrough so we need not to store the result
				else {
					singleCase.response(switchOn);
				}

				// increment index
				++i;

			} while (i < cases.length);

			// if we reach i === cases.length, return null because we ran out of the cases
			return null;
		}

		const lastCase = cases[cases.length - 1];

		// if the last case is a default, return that
		if (lastCase.constructor === DefaultType) {
			return lastCase.response(switchOn);
		}

		// if none of the cases matched the switch and there was no fallthrough, return null
		return null;
	};
}
