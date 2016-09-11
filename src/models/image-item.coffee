class ImageItem extends QingModule
  @opts:
    el: null

  constructor: (opts) ->
    super

    @opts = $.extend {}, ImageItem.opts, opts
    @el = $ @opts.el

    @thumb =
      src: @el.attr('src')
      size:
        width: @el.width()
        height: @el.height()

    @origin =
      src: @el.data('origin-src')
      size: @_getOriginSize()
      download: @el.data('download-src')
      name: @el.data('image-name') or @el.data('origin-name') or
      @el.attr('alt') or '图片'

    @el.data 'imageItem', @

  _getOriginSize: ->
    size = @el.data('image-size') or @el.data('origin-size')
    size = if size then size.split(',') else [0, 0]

    {
      width: size[0] * 1 or @thumb.size.width * 10
      height: size[1] * 1 or @thumb.size.height * 10
    }

module.exports = ImageItem
