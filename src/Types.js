"use strict";

/**
 * @class Type
 * This class manages type conversions for a single data type. Instances of this class
 * are created by `Types.define`.
 */
class Type {
    constructor (config) {
        Object.assign(this, config);
    }

    convert (value) {
        return value;
    }

    is (value) {
        return this.name === typeof value;
    }
}

Type.prototype.isType = true;

class BooleanType extends Type {
    constructor () {
        super();

        this.anyRe = /^(?:true|false|yes|no|on|off)$/i;
        this.trueRe = /^(?:true|yes|on)$/i;
        this.falseRe = /^(?:false|no|off)$/i;

        this.default = false;
        this.name = 'boolean';
    }

    convert (value) {
        var t = typeof value,
            r = value;

        switch (t) {
            default:
                r = String(r);

                if (this.trueRe.test(r)) {
                    r = true;
                } else if (this.falseRe.test(r)) {
                    r = false;
                } else {
                    r = null;
                }

                break;

            case 'boolean':
                break;

            case 'number':
                r = !!r;
                break;
        }

        return r;
    }
}

/*
class DateType extends Type {
    constructor () {
        super();

        this.default = new Date();
        this.name = 'date';
    }

    convert (value) {
        // TODO
    }

    is (value) {
    }
}
*/

class NumberType extends Type {
    constructor () {
        super();

        this.default = 0;
        this.name = 'number';
    }

    convert (value) {
        var r = +value;  // op+ is a strict parser (+'5a' === NaN)

        if (isNaN(r)) {
            r = null;
        }

        return r;
    }
}

class StringType extends Type {
    constructor () {
        super();

        this.default = '';
        this.name = 'string';
    }

    convert (value) {
        return String(value);
    }
}

/**
 * @class Types
 * @singleton
 *
 * This class manages a basic type registry for type conversions. Types can be defined
 * by calling `define`
 */
const Types = {
    defs: {},

    define (def) {
        if (Types.defs[def.name]) {
            throw new Error(`Type already defined: "${def.name}"`);
        }

        if (!def.isType) {
            def = new Type(def);
        }

        Types.defs[def.name] = def;
    },

    get (name) {
        return Types.defs[name] || null;
    },

    of (value) {
        let def = Types.pick(value, def => def.is(value));

        if (!def) {
            // If the value is not a direct type match, see who can parse it
            def = Types.pick(value, def => def.convert(value) !== null);
        }

        return def;
    },

    pick (value, test) {
        let defs = Types.defs;
        let found = null;
        let ambiguous;

        for (let s in defs) {
            let def = defs[s];

            if (test(def, value)) {
                if (found) {
                    (ambiguous || (ambiguous = [found.name])).push(s);
                }

                found = def;
            }
        }

        if (ambiguous) {
            throw new Error(`Ambiguous type for "${value}"; could be: ${ambiguous.join(', ')}`);
        }

        return found;
    }
};

Types.define(new BooleanType());
//Types.define(new DateType());
Types.define(new NumberType());
Types.define(new StringType());

module.exports = Types;