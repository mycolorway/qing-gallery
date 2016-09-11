Control = require './control.coffee'

class Source extends Control
  name: 'source'

  constructor: (qingGallery) ->
    super
    @el.attr 'target', '_blank'

  load: (imageItem) ->
    @el.attr 'href', imageItem.origin.src

module.exports = Source
