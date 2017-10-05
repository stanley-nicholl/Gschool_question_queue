const expect = require('chai').expect
const main = require('../scripts/askify')

describe('addToQueue', function () {
  it('should be a function', function () {
    expect(main.askify.addToQueue).to.be.a('function')
  })
})
