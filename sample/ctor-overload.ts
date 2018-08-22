import {Case, TypeSwitch} from "../src";

class StringContainer {

	private data: string;

	constructor(count: number, char: string);
	constructor(initialValue: string);
	constructor(cpy: StringContainer);
	constructor(arg1: number | string | StringContainer, char?: string){
		this.data = '';
		TypeSwitch(arg1)(
			Case(Number)
				((count: number) => this.data = (<string>char).repeat(count)),
			Case(String)
				((initialValue: string) => this.data = initialValue),
			Case(StringContainer)
				((cpy: StringContainer) => this.data = cpy.data)
		);
	}
}

