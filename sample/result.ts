import {Case, Default, FALL_THROUGH, TypeSwitch} from "../src";

const complicatedNumberToString = TypeSwitch(5)(
	Case(Number)
		(Number.prototype.toString.call),
	Default('Default: in case 5 is not a number')
);

const fallthroughResult = TypeSwitch(5)(
	Case(Array)
	(FALL_THROUGH, "Won't happen."),
	Case(Number)
	(FALL_THROUGH, 'Will happen but result will be something else.'),
	Case(String)
	(FALL_THROUGH, () => 'This will also happen but the result is still not this value.'),
	Case(Boolean)
	("Yup. This will be the value of 'result'")
);

// assert(fallthroughResult === "Yup. This will be the value of 'result'");