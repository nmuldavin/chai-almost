const deepEqual = require('deep-eql')
const type = require('type-detect')

const DEFAULT_TOLERANCE = 1e-6

const isNumber = val => type(val) === 'number'

const bothNumbers = (left, right) => isNumber(right) && isNumber(left)

const almostEqual = (left, right, tol) => Math.abs(left - right) <= tol

const chaiAlmost = (standardTolerance = DEFAULT_TOLERANCE) => ({ Assertion }, { flag }) => {
  function customComparator (left, right) {
    if (bothNumbers(left, right)) {
      return almostEqual(left, right, standardTolerance)
    }
    return null
  }

  function method (expected, customTolerance = standardTolerance) {
    return this.closeTo(expected, customTolerance)
  }

  function defaultChainingBehavior () {
    flag(this, 'tolerance', standardTolerance)
  }

  function customChainingBehavior (tolerance) {
    flag(this, 'tolerance', tolerance)
  }

  function assertEqual (_super) {
    return function (val, msg) {
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

  Assertion.addMethod('almost', method)
  Assertion.addChainableMethod('almost', customChainingBehavior, defaultChainingBehavior)

  Assertion.overwriteMethod('equal', assertEqual)
  Assertion.overwriteMethod('equals', assertEqual)
  Assertion.overwriteMethod('eq', assertEqual)
}

module.exports = chaiAlmost
