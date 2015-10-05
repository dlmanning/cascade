'use strict'

var extend = require('deep-extend')

function cataract (styles) {
  const accumulatedStyle = {}

  visit(styles, function (ref, propName, lineage) {
    var mergedValues = shallowMergeValues(lineage)
    if (Object.keys(mergedValues).length > 0) {
      accumulatedStyle[propName] = mergedValues
    }
  })

  return accumulatedStyle
}

cataract.withBase = function withBase (base) {
  return function (cataract) {
    return function (styles) {
      var stylesWithBase = extend({}, base, styles)
      return cataract(stylesWithBase)
    }
  }
}

cataract.withConstants = function withConstants (constants) {
  return function (cataract) {
    return function (styles) {
      var stylesWithConstants = extend({}, styles)

      visit(stylesWithConstants, function (ref) {
        for (var property in ref) {
          if (!ref.hasOwnProperty(property)) continue

          if (constants[ref[property]] != null) {
            ref[property] = constants[ref[property]]
          }
        }
      })

      return cataract(stylesWithConstants)
    }
  }
}

cataract.compose = function compose (/* ...funcs */) {
  var funcs = []
  for (var i = 0; i < arguments.length; i++) {
    funcs[i] = arguments[i];
  }

  return function (arg) {
    return funcs.reduceRight(function (composed, f) {
      return f(composed)
    }, arg)
  }
}

function visit (accum, cb) {
  accum = (toType(accum) == 'object')
        ? [ { path: '', lineage: [ accum ]} ]
        : accum

  if (accum.length === 0) return

  var currentNode = accum.pop()
  var ref = currentNode.lineage[currentNode.lineage.length - 1],
      path = currentNode.path

  for (var property in ref) {
    if (!ref.hasOwnProperty(property)) continue

    if (toType(ref[property]) === 'object') {
      accum.push({
         path: path + (path && ':') + property,
         lineage: currentNode.lineage.concat(ref[property])
       })
    }
  }

  cb(ref, path || '$base', currentNode.lineage)
  visit(accum, cb)
}

function shallowMergeValues (args) {
  var merged = {}, i, obj, prop, propType

  for (i = 0, obj = args[i]; i <= args.length; obj = args[i++]) {
    if (toType(obj) !== 'object') {
      throw new Error('Can only merge objects')
    }

    for (prop in obj) {
      if (!obj.hasOwnProperty(prop)) continue

      propType = toType(obj[prop])
      if (propType === 'number' || propType === 'string') {
        merged[prop] = obj[prop]
      }
    }
  }

  return merged
}

function toType (obj) {
  return ({}).toString.call(obj).match(/\s([a-z|A-Z]+)/)[1].toLowerCase()
}

module.exports = cataract
