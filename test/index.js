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
        expect(3.9999999).to.almost.equal(4)
        expect(3.9999999).to.almost.eq(4)
        expect(3.9999999).almost.equals(4)
        expect(3.9).to.not.almost.equal(4)
        expect(3.9).to.not.almost.eq(4)
        expect(3.9).not.almost.equals(4)
      })

      it('should modify shallow equality checks on numbers to allow custom tolerance', () => {
        expect(3.8).to.almost(1).equal(4)
        expect(3.8).to.almost(1).eq(4)
        expect(3.8).almost(1).equals(4)
        expect(2).to.not.almost(1).equal(4)
        expect(2).to.not.almost(1).eq(4)
        expect(2).not.almost(1).equals(4)
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
  })
})
