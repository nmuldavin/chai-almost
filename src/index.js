const deepEqual = require('deep-eql')
const type = require('type-detect')

const DEFAULT_TOLERANCE = 1e-6

const isNumber = val => type(val) === 'number'

const bothNumbers = (left, right) => isNumber(right) && isNumber(left)

const almostEqual = (left, right, tol) => Math.abs(left - right) <= tol

const comparator = tolerance => (left, right) => {
  if (bothNumbers(left, right)) {
    return almostEqual(left, right, tolerance)
  }
  return null
}

const chaiAlmost = (standardTolerance = DEFAULT_TOLERANCE) => ({ Assertion }, { flag }) => {
  function overrideAssertEqual (_super) {
    return function assertEqual (val, msg) {
      if (msg) flag(this, 'message', msg)

      const deep = flag(this, 'deep')
      const tolerance = flag(this, 'tolerance')

      if (deep) {
        return this.eql(val)
      } else if (tolerance && bothNumbers(val, this._obj)) {
        this.assert(
          almostEqual(val, this._obj, tolerance),
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

      const tolerance = flag(this, 'tolerance')

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

  function method (val, customTolerance = standardTolerance) {
    flag(this, 'tolerance', customTolerance)

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

module.exports = chaiAlmost
