Preview = require './views/preview.coffee'
List = require './views/list.coffee'
ImageItem = require './models/image-item.coffee'
Rotate = require './plugins/rotate.coffee'
Download = require './plugins/download.coffee'
Source = require './plugins/source.coffee'

class QingGallery extends QingModule

  @opts:
    el: null
    appendTo: 'body'
    scopeSelector: ''
    matchSelector: ''
    plugins: ['rotate', 'download', 'source']
    locales:
      rotate: 'Rotate'
      download: 'Download'
      source: 'Source'

  constructor: (opts) ->
    @opts = $.extend {}, QingGallery.opts, opts
    @el = $ @opts.el
    unless @el.length > 0
      throw new Error 'QingGallery: option el is required'

    QingGallery.destroyAll()
    @_render()
    @_bind()

    super @opts
    @preview.init @el.data('imageItem')
    @list.select()

  _render: ->
    @imageItems = @el.closest(@opts.scopeSelector).find(@opts.matchSelector)
    .add(@el).map ->
      new ImageItem
        el: @
    .get()

    @preview = new Preview()
    @list = new List
      imageItems: @imageItems
      selected: @el.data('imageItem')

    @wrapper = $('<div class="qing-gallery init-animation"></div>')
      .data('qingGallery', @)
      .append [
        @preview.el
        @list.el
      ]
      .appendTo @opts.appendTo

    $('html').addClass 'qing-gallery-active'
    @el.data 'qingGallery', @

  _bind: ->
    @list.on 'imageItemChange', (e, imageItem) =>
      @plugins.rotate.reset()
      @plugins.download.load imageItem
      @plugins.source.load imageItem
      @preview.load imageItem
      @wrapper.addClass 'modal'

    @preview.on 'modalClick', =>
      @destroy()

    $(document).on 'keydown.qing-gallery', (e) =>
      if /27|32/.test(e.which)
        @destroy()
        return false
      else if /37|38/.test(e.which)
        @list.prev()
        return false
      else if /39|40/.test(e.which)
        @list.next()
        return false

  destroy: ->
    @plugins.rotate.reset()
    @list.off 'imageItemChange'
    @preview.off 'modalClick'
    $(document).off('.qing-gallery')

    @wrapper.removeClass 'init-animation modal'
      .addClass 'destroy-animation'
    @list.destroy()
    @preview.destroy =>
      @wrapper.remove()
      @el.removeData 'qingGallery'
      $('html').removeClass 'qing-gallery-active'

  @destroyAll: ->
    $('.qing-gallery').each ->
      $(@).data('qingGallery')?.destroy()

QingGallery.plugin 'rotate', Rotate
QingGallery.plugin 'download', Download
QingGallery.plugin 'source', Source

module.exports = QingGallery
