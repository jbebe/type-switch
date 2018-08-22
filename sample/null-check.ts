import {Case, TypeSwitch} from "../src";

const maybeNumber = [null, undefined, 5][Math.floor(Math.random()*3)];

// only one case type

TypeSwitch(maybeNumber)(
	Case(Number)
	('Is good.'),
	Case(null)
	(() => {
		throw new Error('Not good.')
	})
);

// behold! case group!

TypeSwitch(maybeNumber)(
	Case(Number)
		('Is good.'),
	Case(null, undefined)
		(() => {
			throw new Error('Not good.')
		})
);