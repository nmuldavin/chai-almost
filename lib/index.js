'use strict';

var deepEqual = require('deep-eql');
var type = require('type-detect');

var DEFAULT_TOLERANCE = 1e-6;

var isNumber = function isNumber(val) {
  return type(val) === 'number';
};

var bothNumbers = function bothNumbers(left, right) {
  return isNumber(right) && isNumber(left);
};

var almostEqual = function almostEqual(left, right, tol) {
  return Math.abs(left - right) <= tol;
};

var comparator = function comparator(tolerance) {
  return function (left, right) {
    if (bothNumbers(left, right)) {
      return almostEqual(left, right, tolerance);
    }
    return null;
  };
};

var chaiAlmost = function chaiAlmost() {
  var standardTolerance = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : DEFAULT_TOLERANCE;
  return function (_ref, _ref2) {
    var Assertion = _ref.Assertion;
    var flag = _ref2.flag;

    function method(expected) {
      var customTolerance = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : standardTolerance;

      return this.closeTo(expected, customTolerance);
    }

    function defaultChainingBehavior() {
      flag(this, 'tolerance', standardTolerance);
    }

    function customChainingBehavior(tolerance) {
      flag(this, 'tolerance', tolerance);
    }

    function assertEqual(_super) {
      return function (val, msg) {
        if (msg) flag(this, 'message', msg);

        var deep = flag(this, 'deep');
        var tolerance = flag(this, 'tolerance');

        if (deep) {
          return this.eql(val);
        } else if (tolerance && bothNumbers(val, this._obj)) {
          this.assert(almostEqual(val, this._obj, tolerance), 'expected #{this} to almost equal #{exp}', 'expected #{this} to not almost equal #{exp}', val, this._obj, true);
        } else {
          return _super.apply(this, arguments);
        }
      };
    }

    function assertEql(_super) {
      return function (val, msg) {
        if (msg) flag(this, 'message', msg);

        var tolerance = flag(this, 'tolerance');

        if (tolerance) {
          this.assert(deepEqual(val, this._obj, { comparator: comparator(tolerance) }), 'expected #{this} to deeply almost equal #{exp}', 'expected #{this} to not deeply almost equal #{exp}', val, this._obj, true);
        } else {
          return _super.apply(this, arguments);
        }
      };
    }

    Assertion.addMethod('almost', method);
    Assertion.addChainableMethod('almost', customChainingBehavior, defaultChainingBehavior);

    Assertion.overwriteMethod('equal', assertEqual);
    Assertion.overwriteMethod('equals', assertEqual);
    Assertion.overwriteMethod('eq', assertEqual);

    Assertion.overwriteMethod('eql', assertEql);
    Assertion.overwriteMethod('eqls', assertEql);
  };
};

module.exports = chaiAlmost;