utils = require '../utils.coffee'

class Preview extends QingModule

  @_tpl = """
    <div class="qing-gallery-preview">
      <div class="qing-gallery-stage loading">
        <div class="frame">
          <img src="" />
          <div class="loading-indicator"></div>
        </div>
      </div>
      <div class="qing-gallery-controls">
        <span class="filename"></span>
        <div class="controls"></div>
      </div>
    </div>
  """

  constructor: (opts) ->
    super

    @opts = $.extend {}, Preview.opts, opts
    @el = $ Preview._tpl

    @_render()
    @_bind()

  _render: ->
    @controls = @el.find '.qing-gallery-controls'
    @stage = @el.find '.qing-gallery-stage'
    @frame = @stage.find '.frame'
    @img = @stage.find 'img'

  _bind: ->
    @stage.on 'click.qing-gallery', (e) =>
      @trigger('modalClick') if $(e.target).is $(e.currentTarget)

  init: (imageItem) ->
    @frame.css @_frameInitialPos(imageItem)
      .css imageItem.thumb.size
    @img.attr 'src', imageItem.thumb.src

  load: (imageItem) ->
    @frame.addClass 'animate'
    .css $.extend({
      left: 0
      top: 0
    }, utils.fitSize({
      width: @stage.width()
      height: @stage.height()
    }, imageItem.origin.size))

    @img.attr('src', imageItem.thumb.src)
    @stage.addClass 'modal'
    @el.find('.filename').text imageItem.origin.name
    @frame.addClass 'loading'

    utils.preloadImages imageItem.origin.src, (originImage) =>
      return if not originImage or not originImage.src

      @img.attr('src', originImage.src)
      @frame.removeClass 'loading'

    @imageItem = imageItem

  _frameInitialPos: (imageItem) ->
    $doc = $(document)
    offset = imageItem.el.offset()

    top: (
      offset.top - $doc.scrollTop() -
      (@stage.height() - imageItem.el.height()) / 2
    ) * 2
    left: (
      offset.left - $doc.scrollLeft() -
      (@stage.width() - imageItem.el.width()) / 2
    ) * 2

  destroy: (callback) ->
    @controls.fadeOut '50'
    @stage.removeClass 'modal'
    @frame.css @imageItem.thumb.size
      .css @_frameInitialPos(@imageItem)
    @frame.one utils.transitionEnd(), (e) ->
      callback()

module.exports = Preview
