utils = require '../utils.coffee'

class List extends QingModule

  @opts:
    imageItems: null
    selected: null

  @_tpl: '''
    <div class="qing-gallery-list"></div>
  '''

  @_imageItem: '''
    <a class="thumb" href="javascript:;"><img src="" /></a>
  '''

  constructor: (opts) ->
    super

    @opts = $.extend {}, List.opts, opts
    @_render()
    @_bind()
    @el.hide() if @opts.imageItems.length <= 1

  _bind: ->
    @el.on 'click.qing-gallery', '.thumb', (e) =>
      @select $(e.currentTarget)

  select: ($imageItem = $(@el.find('.selected'))) ->
    imageItem = $imageItem.data 'imageItem'

    $imageItem.addClass 'selected'
      .siblings '.selected'
      .removeClass 'selected'

    @_scrollToSelected()

    @el.css 'opacity', 1
    @trigger 'imageItemChange', [imageItem]
    false

  _render: ->
    @el = $ List._tpl
    @el.append @opts.imageItems.map((imageItem) =>
      $imageItem = $(List._imageItem)
        .find('img').attr('src', imageItem.thumb.src)
        .end().data('imageItem', imageItem)

      $imageItem.addClass 'selected' if imageItem is @opts.selected
      $imageItem
    )

    utils.preloadImages @opts.imageItems.map((imageItem) ->
      imageItem.origin.src
    )

  prev: ->
    $prev = @el.find('.selected').prev()
    $prev = @el.find('.thumb:last') unless $prev.length
    $prev.click()

  next: ->
    $next = @el.find('.selected').next()
    $next = @el.find('.thumb:first') unless $next.length
    $next.click()

  _scrollToSelected: ->
    $selected = @el.find('.selected')
    offset = $selected.offset()
    docScrollTop = $(document).scrollTop()

    return if offset.top <= docScrollTop + $(window).height() -
    $selected.outerHeight() and offset.top >= docScrollTop

    @el.scrollTop(
      @el.scrollTop() + offset.top -
      docScrollTop - parseInt($selected.css('marginTop'))
    )

  destroy: ->
    @el.css 'opacity', 0

module.exports = List
