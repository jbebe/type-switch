import {Case, Default, FALL_THROUGH, TypeSwitch} from "../src";

TypeSwitch(5)(
	Case(Array)
		(FALL_THROUGH, "Won't happen."),
	Case(Number)
		(FALL_THROUGH, 'Will happen.'),
	Case(String)
		(FALL_THROUGH, () => 'This will also happen.'),
	Case(Boolean)
		('And this will also happen!'),
	Case(Promise)
		("But this won't."),
	Default('And this one neither.')
);