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
      .find('.name').text('Rotate') # qingGallery.opts.locales.plugins[@name].name
      .end().attr 'title', 'Rotate'
      .appendTo qingGallery.preview.controls.find('.controls')

    @_bind()

  _bind: ->
    'nothing to do'

module.exports = Control
