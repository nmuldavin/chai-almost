var chai = require('chai')
var chaiAlmost = require('./index')

chai.use(chaiAlmost())

var expect = chai.expect

describe('chaiAlmost', function () {
  describe('almost method', function () {
    describe('with shallow equality', function () {
      it('should modify shallow equality checks on numbers to allow default tolerance', function () {
        expect(3.9999999).to.be.almost(4)
        expect(3.9).not.to.be.almost(4)
      })

      it('should modify shallow equality checks on numbers to allow custom tolerance', function () {
        expect(3.8).to.be.almost(4, 1)
        expect(2).not.to.be.almost(4, 1)
      })

      it('should not modify shallow equality checks on non-numbers', function () {
        expect('taco').to.be.almost('taco')
        expect('taco').to.not.be.almost('tacos')
        var x = { taco: 'pastor' }
        var y = [1, 2, 3]
        expect(x).to.be.almost(x)
        expect(x).to.not.be.almost({ taco: 'pastor' })
        expect(y).to.be.almost(y)
        expect(y).to.not.be.almost([1, 2, 3])
      })
    })

    describe('with deep equality', function () {
      it('should modify deep equality checks to allow default tolerance for numbers', function () {
        var exp = { taco: 'pastor', quantity: 3 }
        var good = { taco: 'pastor', quantity: 2.9999999 }
        var bad = { taco: 'pastor', quantity: 3.1 }

        expect(good).to.be.deep.almost(exp)
        expect(bad).to.not.be.deep.almost(exp)
      })

      it('should modify deep equality checks to allow custom tolerance for numbers', function () {
        var exp = { taco: 'pastor', quantity: 10 }
        var good = { taco: 'pastor', quantity: 29 }
        var bad = { taco: 'pastor', quantity: 31 }

        expect(good).to.be.deep.almost(exp, 20)
        expect(bad).to.not.be.deep.almost(exp, 20)
      })
    })
  })

  describe('almost chainable method', function () {
    describe('with shallow equality', function () {
      it('should modify shallow equality checks on numbers to allow default tolerance', function () {
        var exp = 4
        var good = 3.9999999
        var bad = 3.9

        expect(good).to.almost.equal(exp)
        expect(good).to.almost.eq(exp)
        expect(good).almost.equals(exp)
        expect(bad).to.not.almost.equal(exp)
        expect(bad).to.not.almost.eq(exp)
        expect(bad).not.almost.equals(exp)
      })

      it('should not modify shallow equality checks on non-numbers', function () {
        expect('taco').to.almost.equal('taco')
        expect('taco').to.not.almost.equal('tacos')
        var x = { taco: 'pastor' }
        var y = [1, 2, 3]
        expect(x).to.almost.equal(x)
        expect(x).to.not.almost.equal({ taco: 'pastor' })
        expect(y).to.almost.equal(y)
        expect(y).to.not.almost.equal([1, 2, 3])
      })
    })

    describe('with deep equality', function () {
      it('should modify deep equality checks to allow default tolerance for numbers', function () {
        var exp = { taco: 'pastor', quantity: 3 }
        var good = { taco: 'pastor', quantity: 2.9999999 }
        var bad = { taco: 'pastor', quantity: 3.1 }

        expect(good).to.almost.eql(exp)
        expect(good).to.deep.almost.equal(exp)
        expect(good).almost.deep.eqls(exp)
        expect(bad).to.not.almost.eql(exp)
        expect(bad).to.not.deep.almost.equal(exp)
        expect(bad).not.almost.deep.eqls(exp)
      })

      it('should not modify shallow equality checks on non-numbers', function () {
        var exp = { taco: 'pastor', delicious: true }
        var good = { taco: 'pastor', delicious: true }
        var bad = { taco: 'pastor', delicious: false }

        expect(good).to.almost.eql(exp)
        expect(good).to.deep.almost.equal(exp)
        expect(good).almost.deep.eqls(exp)
        expect(bad).to.not.almost.eql(exp)
        expect(bad).to.not.deep.almost.equal(exp)
        expect(bad).not.almost.deep.eqls(exp)
      })
    })
  })
})
