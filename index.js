'use strict'

var deepEqual = require('deep-eql')
var type = require('type-detect')

var DEFAULT_TOLERANCE = 1e-6

function isNumber (val) {
  return type(val) === 'number'
}

function bothNumbers (left, right) {
  return isNumber(right) && isNumber(left)
}

function almostEqual (left, right, tol) {
  return Math.abs(left - right) <= tol
}

function comparator (tolerance) {
  return function (left, right) {
    if (bothNumbers(left, right)) {
      return almostEqual(left, right, tolerance)
    }
    return null
  }
}

function chaiAlmost (customTolerance) {
  var standardTolerance = customTolerance || DEFAULT_TOLERANCE

  return function (chai, utils) {
    var Assertion = chai.Assertion
    var flag = utils.flag

    function overrideAssertEqual (_super) {
      return function assertEqual (val, msg) {
        if (msg) flag(this, 'message', msg)

        var deep = flag(this, 'deep')
        var tolerance = flag(this, 'tolerance')

        if (deep) {
          return this.eql(val)
        } else if (tolerance && bothNumbers(val, this._obj)) {
          this.assert(almostEqual(val, this._obj, tolerance),
            'expected #{this} to almost equal #{exp}',
            'expected #{this} to not almost equal #{exp}',
            val,
            this._obj,
            true
          )
        } else {
          return _super.apply(this, arguments)
        }
      }
    }

    function overrideAssertEql (_super) {
      return function assertEql (val, msg) {
        if (msg) flag(this, 'message', msg)

        var tolerance = flag(this, 'tolerance')

        if (tolerance) {
          this.assert(
            deepEqual(val, this._obj, { comparator: comparator(tolerance) }),
            'expected #{this} to deeply almost equal #{exp}',
            'expected #{this} to not deeply almost equal #{exp}',
            val,
            this._obj,
            true
          )
        } else {
          return _super.apply(this, arguments)
        }
      }
    }

    function method (val, toleranceOverride) {
      var tolerance = toleranceOverride || standardTolerance

      flag(this, 'tolerance', tolerance)

      return this.equal(val)
    }

    function chainingBehavior () {
      flag(this, 'tolerance', standardTolerance)
    }

    Assertion.addChainableMethod('almost', method, chainingBehavior)

    Assertion.overwriteMethod('equal', overrideAssertEqual)
    Assertion.overwriteMethod('equals', overrideAssertEqual)
    Assertion.overwriteMethod('eq', overrideAssertEqual)

    Assertion.overwriteMethod('eql', overrideAssertEql)
    Assertion.overwriteMethod('eqls', overrideAssertEql)
  }
}

module.exports = chaiAlmost
