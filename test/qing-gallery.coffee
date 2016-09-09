QingGallery = require '../src/qing-gallery'
expect = chai.expect

describe 'QingGallery', ->

  $el = null
  qingGallery = null

  before ->
    $el = $('<div class="test-el"></div>').appendTo 'body'

  after ->
    $el.remove()
    $el = null

  beforeEach ->
    qingGallery = new QingGallery
      el: '.test-el'

  afterEach ->
    qingGallery.destroy()
    qingGallery = null

  it 'should inherit from QingModule', ->
    expect(qingGallery).to.be.instanceof QingModule
    expect(qingGallery).to.be.instanceof QingGallery

  it 'should throw error when element not found', ->
    spy = sinon.spy QingGallery
    try
      new spy
        el: '.not-exists'
    catch e

    expect(spy.calledWithNew()).to.be.true
    expect(spy.threw()).to.be.true
