"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Fallthrough {
}
exports.FALL_THROUGH = new Fallthrough();
const Type = {
    Undefined: 'undefined',
    Null: 'null'
};
function NameOfType(val) {
    if (val === void 0) {
        return Type.Undefined;
    }
    if (val === null) {
        return Type.Null;
    }
    return val.name;
}
function NameOfValue(val) {
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
class BaseType {
    constructor(response) {
        this.response = response;
    }
    matches(key) {
        return false;
    }
    isFallthrough() {
        return false;
    }
}
class DefaultType extends BaseType {
    constructor(response) {
        super(response);
    }
    matches(key) {
        return false;
    }
    isFallthrough() {
        return false;
    }
}
function Default(_responseValue) {
    let responseValue;
    if (_responseValue.constructor === Function) {
        responseValue = _responseValue;
    }
    else {
        responseValue = () => _responseValue;
    }
    return new DefaultType(responseValue);
}
exports.Default = Default;
class CaseType extends BaseType {
    constructor(types, response, fallthrough) {
        super(response);
        this.types = types;
        this.fallthrough = fallthrough;
    }
    matches(key) {
        return this.types.includes(key);
    }
    isFallthrough() {
        return this.fallthrough;
    }
}
function Case(..._types) {
    let types = _types.map(NameOfType);
    return (maybeFallthrough, maybeResponseValue) => {
        let responseValue;
        let fallthrough = false;
        const maybeFallthroughType = NameOfValue(maybeFallthrough);
        if (maybeFallthroughType === Function.name) {
            responseValue = maybeFallthrough;
        }
        else if (maybeFallthroughType === Fallthrough.name) {
            if (NameOfValue(maybeResponseValue) === Function.name) {
                responseValue = maybeResponseValue;
            }
            else {
                responseValue = EmptyFunction;
            }
            fallthrough = true;
        }
        else {
            responseValue = () => maybeFallthrough;
        }
        return new CaseType(types, responseValue, fallthrough);
    };
}
exports.Case = Case;
function TypeSwitch(switchOn) {
    const typeName = NameOfValue(switchOn);
    return (...cases) => {
        if (cases.length === 0) {
            return null;
        }
        let isFallthrough = false;
        let fallthroughIndex = -1;
        for (const [index, caseObj] of cases.entries()) {
            if (caseObj.matches(typeName)) {
                if (caseObj.isFallthrough()) {
                    fallthroughIndex = index;
                    isFallthrough = true;
                    break;
                }
                else {
                    return caseObj.response(switchOn);
                }
            }
        }
        if (isFallthrough) {
            let i = fallthroughIndex;
            do {
                const singleCase = cases[i];
                if (!singleCase.isFallthrough()) {
                    return singleCase.response(switchOn);
                }
                else {
                    singleCase.response(switchOn);
                }
                ++i;
            } while (i < cases.length);
            return null;
        }
        const lastCase = cases[cases.length - 1];
        if (lastCase.constructor === DefaultType) {
            return lastCase.response(switchOn);
        }
        return null;
    };
}
exports.TypeSwitch = TypeSwitch;
//# sourceMappingURL=index.js.map