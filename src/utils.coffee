Utils =
  preloadImages: (images, callback) ->
    arguments.callee.loadedImages ||= {}
    loadedImages = arguments.callee.loadedImages

    if Object.prototype.toString.call(images) is "[object String]"
      images = [images]
    else if Object.prototype.toString.call(images) isnt "[object Array]"
      return false

    images = $.unique images

    for url in images
      if not loadedImages[url] or callback
        img = new Image()

        if $.isFunction(callback)
          img.onload = ->
            loadedImages[url] = true
            callback img

          img.onerror = ->
            callback()

        img.src = url

  # cross browser transitionend event name (IE10+ Opera12+)
  transitionEnd: ->
    el = document.createElement('fakeelement')
    transitions =
      'transition':'transitionend'
      'MozTransition':'transitionend'
      'WebkitTransition':'webkitTransitionEnd'

    for t of transitions
      if el.style[t] isnt undefined
        return transitions[t]

  fitSize: (container, inner) ->
    return inner if inner.width <= container.width and
    inner.height <= container.height

    return {
      width: container.width
      height: container.width * inner.height / inner.width
    } if inner.width / inner.height > container.width / container.height

    {
      height: container.height
      width: container.height * inner.width / inner.height
    }

module.exports = Utils
