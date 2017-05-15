const chai = require('chai')
const chaiAlmost = require('../src')

chai.use(chaiAlmost())

const { expect } = chai

describe('chaiAlmost', () => {
  describe('almost method', () => {
    it('should alias closeTo with default tolerance', () => {
      expect(3.9999999).to.be.almost(4)
      expect(3.9).not.to.be.almost(4)
    })

    it('should alias closeTo with custom tolerance', () => {
      expect(3.8).to.be.almost(4, 1)
      expect(2).not.to.be.almost(4, 1)
    })
  })

  describe('almost chainable method', () => {
    describe('with shallow equality', () => {
      it('should modify shallow equality checks on numbers to allow default tolerance', () => {
        const exp = 4
        const good = 3.9999999
        const bad = 3.9

        expect(good).to.almost.equal(exp)
        expect(good).to.almost.eq(exp)
        expect(good).almost.equals(exp)
        expect(bad).to.not.almost.equal(exp)
        expect(bad).to.not.almost.eq(exp)
        expect(bad).not.almost.equals(exp)
      })

      it('should modify shallow equality checks on numbers to allow custom tolerance', () => {
        const exp = 4
        const good = 3.8
        const bad = 2

        expect(good).to.almost(1).equal(exp)
        expect(good).to.almost(1).eq(exp)
        expect(good).almost(1).equals(exp)
        expect(bad).to.not.almost(1).equal(exp)
        expect(bad).to.not.almost(1).eq(exp)
        expect(bad).not.almost(1).equals(exp)
      })

      it('should not modify shallow equality checks on non-numbers', () => {
        expect('taco').to.almost.equal('taco')
        expect('taco').to.not.almost.equal('tacos')
        const x = { taco: 'pastor' }
        const y = [1, 2, 3]
        expect(x).to.almost.equal(x)
        expect(x).to.not.almost.equal({ taco: 'pastor' })
        expect(y).to.almost.equal(y)
        expect(y).to.not.almost.equal([1, 2, 3])
      })
    })

    describe('with deep equality', () => {
      it('should modify deep equality checks to allow default tolerance for numbers', () => {
        const exp = { taco: 'pastor', quantity: 3 }
        const good = { taco: 'pastor', quantity: 2.9999999 }
        const bad = { taco: 'pastor', quantity: 3.1 }

        expect(good).to.almost.eql(exp)
        expect(good).to.deep.almost.equal(exp)
        expect(good).almost.deep.eqls(exp)
        expect(bad).to.not.almost.eql(exp)
        expect(bad).to.not.deep.almost.equal(exp)
        expect(bad).not.almost.deep.eqls(exp)
      })

      it('should modify deep equality checks to allow custom tolerance for numbers', () => {
        const exp = { taco: 'pastor', quantity: 10 }
        const good = { taco: 'pastor', quantity: 29 }
        const bad = { taco: 'pastor', quantity: 31 }

        expect(good).to.almost(20).eql(exp)
        expect(good).to.deep.almost(20).equal(exp)
        expect(good).almost(20).deep.eqls(exp)
        expect(bad).to.not.almost(20).eql(exp)
        expect(bad).to.not.deep.almost(20).equal(exp)
        expect(bad).not.almost(20).deep.eqls(exp)
      })

      it('should not modify shallow equality checks on non-numbers', () => {
        const exp = { taco: 'pastor', delicious: true }
        const good = { taco: 'pastor', delicious: true }
        const bad = { taco: 'pastor', delicious: false }

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
