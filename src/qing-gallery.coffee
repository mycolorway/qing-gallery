class QingGallery extends QingModule

  @opts:
    el: null

  constructor: (opts) ->
    super

    @el = $ @opts.el
    unless @el.length > 0
      throw new Error 'QingGallery: option el is required'

    @opts = $.extend {}, QingGallery.opts, @opts
    @_render()
    @trigger 'ready'

  _render: ->
    @el.append """
      <p>This is a sample component.</p>
    """
    @el.addClass ' qing-gallery'
      .data 'qingGallery', @

  destroy: ->
    @el.empty()
      .removeData 'qingGallery'

module.exports = QingGallery
