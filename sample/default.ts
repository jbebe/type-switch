import {Case, Default, TypeSwitch} from "../src";

const maybeNumber = [1, [], {}, Promise.resolve(null)][Math.floor(Math.random()*4)];

TypeSwitch(maybeNumber)(
	Case(Array)
		('Not good.'),
	Case(Object)
		('Not good either.'),
	Case(Promise)
		('Not good either.'),
	Default('Bingo!')
);