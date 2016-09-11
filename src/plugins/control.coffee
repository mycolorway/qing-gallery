class Control extends QingModule
  @_tpl: '''
    <a class="control" href="javascript:;">
      <i class="icon"></i>
      <span class="name"></span>
    </a>
  '''

  constructor: (qingGallery) ->
    @qingGallery = qingGallery
    @el = $ Control._tpl
      .addClass "control-#{ @name }"
      .find('.name').text qingGallery.opts.locales[@name]
      .end().attr 'title', 'Rotate'
      .appendTo qingGallery.preview.controls.find('.controls')

    @_bind()

  _bind: ->
    'need to implement'

module.exports = Control
