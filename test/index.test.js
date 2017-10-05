const expect = require('chai').expect
const main = require('../scripts/index')

describe('login', function () {
  it('should be a function', function () {
    expect(main.index.login).to.be.a('function')
  })

  describe('stringify', function () {
    it('should be a function', function () {
      expect(main.index.stringify).to.be.a('function')
    })

    it('output should be a string', function () {
      expect(main.index.stringify({fname:'Kat',lname:'Reinhart'})).to.equal("fname:'kat',lname:'Reinhart'")
    })
  })
})
