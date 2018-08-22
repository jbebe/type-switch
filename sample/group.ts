import {Case, TypeSwitch} from "../src";

const maybeNumber = [1, [], {}, Promise.resolve(null)][Math.floor(Math.random()*4)];

TypeSwitch(maybeNumber)(
	Case(Number, Array)
		('This is either a number or an array.'),
	Case(Object, Promise)
		("This is something we don't want")
);