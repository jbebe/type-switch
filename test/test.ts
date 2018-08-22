import {Case, Default, FALL_THROUGH, TypeSwitch} from "../src";
import {expect} from 'chai';
import 'mocha';

describe('TypeSwitch', () => {
	const genSucceedFn = (validType: any) => {
		return (switchOn: any) => expect(switchOn).equal(validType);
	};
	const failFn = () => expect(0).equal(1);

	it('should handle null', () => {
		const succeedFn = genSucceedFn(null);
		TypeSwitch(null)(
			Case(String)(failFn),
			Case(null)(succeedFn),
			Case(Number)(failFn)
		);
	});

	it('should handle undefined', () => {
		const succeedFn = genSucceedFn(undefined);
		TypeSwitch(undefined)(
			Case(String)(failFn),
			Case(undefined)(succeedFn),
			Case(Number)(failFn),
		);
	});

	it('should handle arbitrary Objects/Classes', () => {
		class Foo {
		}

		const foo = new Foo();
		const succeedFn = genSucceedFn(foo);
		TypeSwitch(foo)(
			Case(String)(failFn),
			Case(Foo)(succeedFn),
			Case(Number)(failFn),
		);
	});

	it('should return the value in the case body', () => {
		const result = TypeSwitch(1)(
			Case(String)(failFn),
			Case(Number)(42),
			Case(Array,)(failFn),
		);
		expect(result).equal(42);
	});

	it('should handle groups', () => {

		const result = TypeSwitch(1)(
			Case(Array)(failFn),
			Case(String, Number, Promise)(42),
		);
		expect(result).equal(42);
	});

	it('should handle fallthrough', () => {
		let numberCase = false;
		let stringCase = false;
		let booleanCase = false;
		TypeSwitch(1)(
			Case(Array)(failFn),
			Case(Promise)(FALL_THROUGH, failFn),
			Case(Number)(FALL_THROUGH, () => (numberCase = true)),
			Case(String)(FALL_THROUGH, () => (stringCase = true)),
			Case(Boolean)(() => (booleanCase = true)),
			Case(Boolean)(failFn),
		);
		expect([numberCase, stringCase, booleanCase]).to.deep.equal([true, true, true]);
	});

	it('should return value after fallthrough', () => {
		const result = TypeSwitch(1)(
			Case(Array)(failFn),
			Case(Promise)(FALL_THROUGH, failFn),
			Case(Number)(FALL_THROUGH, 41),
			Case(String)(FALL_THROUGH, 41),
			Case(Boolean)(42),
			Case(Boolean)(failFn),
		);
		expect(result).to.equal(42);
	});

	it('should handle default case', () => {
		const result = TypeSwitch(1)(
			Case(Array)(failFn),
			Case(Promise)(FALL_THROUGH, failFn),
			Case(Number)(FALL_THROUGH, 41),
			Case(String)(FALL_THROUGH, 41),
			Default(42),
		);
		expect(result).to.equal(42);

		const result2 = TypeSwitch(5)(
			Case(Array)(failFn),
			Default(42),
		);
		expect(result2).to.equal(42);
	});

	it('should handle non-objects in general', () => {
		let isCalled = false;
		TypeSwitch(null)(
			Case(Array)(failFn),
			Case(null)(() => isCalled = true)
		);
		expect(isCalled).to.equal(true);

		let result = TypeSwitch(null)(
			Case(Array)(failFn),
			Case(null)(true)
		);
		expect(result).to.equal(true);

		isCalled = false;
		TypeSwitch(undefined)(
			Case(Array)(failFn),
			Case(undefined)(() => isCalled = true)
		);
		expect(isCalled).to.equal(true);

		result = TypeSwitch(undefined)(
			Case(Array)(failFn),
			Case(undefined)(true)
		);
		expect(result).to.equal(true);

		isCalled = false;
		TypeSwitch(undefined)(
			Case(Array)(failFn),
			Case(null, undefined)(() => isCalled = true)
		);
		expect(isCalled).to.equal(true);

		result = TypeSwitch(undefined)(
			Case(Array)(failFn),
			Case(null, undefined)(true)
		);
		expect(result).to.equal(true);
	});

	it('should handle switch value as argument', () => {
		let args: number[] = [];
		TypeSwitch(1)(
			// @ts-ignore:7006
			Default((on) => args.push(on))
		);
		TypeSwitch(2)(
			// @ts-ignore:7006
			Case(Number)((on) => args.push(on))
		);
		TypeSwitch(3)(
			// @ts-ignore:7006
			Case(Number)(FALL_THROUGH, (on) => args.push(on)),
			// @ts-ignore:7006
			Case(String)(FALL_THROUGH, (on) => args.push(on)),
			// @ts-ignore:7006
			Default((on) => args.push(on))
		);
		expect(args).deep.equal([1, 2, 3, 3, 3]);
	});

	it('should return null if no match', () => {

		const result = TypeSwitch(1)(
			Case(Array)(failFn),
			Case(String, Promise, null)(failFn),
		);
		expect(result).equal(null);
	});

});
