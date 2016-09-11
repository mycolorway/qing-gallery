QingGallery = require '../src/qing-gallery'
ImageItem = require '../src/models/image-item'
expect = chai.expect

describe 'QingGallery', ->

  $el = null
  qingGallery = null

  before ->
    $el = $('''
      <img src="https://tower.im/assets/home/logos/logo-0dc263aa32b489b62161f437b17bb8e8.png"
  		data-origin-src="https://tower.im/assets/home/logos/logo@2x-a96718a1aabf2cd777c8774c500826eb.png"
  		data-download-src="https://tower.im/assets/home/logos/logo@2x-a96718a1aabf2cd777c8774c500826eb.png"
  		alt="tower" width="200" height="10" class="test-el">
    ''').appendTo 'body'

  after ->
    $el.remove()
    $el = null

  beforeEach ->
    qingGallery = new QingGallery
      el: $el

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

  it 'should closed on modal clicked', ->
    spy = sinon.spy qingGallery, 'destroy'

    qingGallery.preview.frame.click()
    sinon.assert.notCalled(spy)

    qingGallery.preview.controls.click()
    sinon.assert.notCalled(spy)

    qingGallery.list.el.click()
    sinon.assert.notCalled(spy)

    qingGallery.preview.stage.click()
    sinon.assert.called(spy)

  describe 'List', ->
    it 'should hide when only one image', ->
      expect(qingGallery.list.el.is(':hidden')).to.be.true

  describe 'Rotate', ->
    it 'should zoom on rotate', ->
      frame = qingGallery.preview.frame

      beforeWidth = frame.width()
      beforeHeight = frame.height()
      beforeRatio = beforeWidth / beforeHeight

      qingGallery.plugins.rotate.el.click()

      afterWidth = frame.width()
      afterHeight = frame.height()
      afterRatio = afterHeight / afterWidth

      expect(beforeRatio).to.equal(afterRatio)
      expect(beforeWidth).to.not.equal(afterHeight)
      expect(beforeHeight).to.not.equal(afterWidth)

describe 'ImageItem', ->
  describe 'getOriginSize', ->
    it 'should using origin-size', ->
      imageItem = new ImageItem
        el: $('<img src="test.png" data-origin-size="20,10">')

      expect(imageItem.origin.size.width).to.equal(20)
      expect(imageItem.origin.size.height).to.equal(10)

    it 'should using 10 times of thumb size', ->
      $el = $('<img src="test.png" width="40" height="20">').appendTo 'body'
      imageItem = new ImageItem
        el: $el

      expect(imageItem.thumb.size.width).to.equal(40)
      expect(imageItem.thumb.size.height).to.equal(20)
      expect(imageItem.origin.size.width).to.equal(40 * 10)
      expect(imageItem.origin.size.height).to.equal(20 * 10)
      $el.remove()
