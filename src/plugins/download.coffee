Control = require './control.coffee'

class Download extends Control
  name: 'download'

  constructor: (qingGallery) ->
    super
    @el.attr 'target', '_blank'

  load: (imageItem) ->
    if imageItem.origin.download
      @el.show().attr 'href', imageItem.origin.download
    else
      @el.hide()

module.exports = Download
