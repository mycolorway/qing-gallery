Control = require './control.coffee'
utils = require '../utils.coffee'

class Rotate extends Control
  name: 'rotate'

  constructor: (qingGallery) ->
    super
    @degree = 0

  _bind: ->
    @el.on 'click', =>
      @rotateTo(@degree + 90)

  reset: ->
    return unless @qingGallery.preview.imageItem
    @rotateTo(@degree - @degree % 360)

  rotateTo: (degree) ->
    @degree = degree

    @qingGallery.preview.frame
      .css @_rotateFitSize()
      .css transform: "rotate(#{ @degree }deg)"

  _rotateFitSize: ->
    isOrthogonal = @degree / 90 % 2 is 1
    originSize = @qingGallery.preview.imageItem.origin.size

    if isOrthogonal
      originSize =
        width: originSize.height
        height: originSize.width

    size = utils.fitSize({
      width: @qingGallery.preview.stage.width()
      height: @qingGallery.preview.stage.height()
    }, originSize)

    if isOrthogonal
      size =
        width: size.height
        height: size.width

    size

module.exports = Rotate
