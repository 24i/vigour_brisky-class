'use strict'
const getParent = require('brisky-core/lib/render/dom/parent')

exports.properties = {
  class: {
    type: 'group',
    storeContextKey: true,
    properties: {
      useKey: true
    },
    render: {
      static (target, node, store) {
        var val = target.compute()
        if (val === true || target.useKey) {
          const key = target.cParent().key
          val = typeof val === 'string' ? (val + ' ' + key) : key
        } else if (typeof val === 'object') {
          val = ''
        }
        setClassName(parseStore(val, store), node)
      },
      state (target, state, type, stamp, subs, tree, id, pid, store) {
        var val = state && target.$ ? target.compute(state) : target.compute()
        if (val === true || target.useKey) {
          const key = parseKey(target, id)
          val = typeof val === 'string' ? (val + ' ' + key) : key
        } else if (typeof val === 'object') {
          val = ''
        }
        const node = getParent(type, stamp, subs, tree, pid)
        setClassName(parseStore(val, store), node)
      }
    }
  }
}

function parseStore (val, store) {
  for (let key in store) {
    let fieldval = store[key]
    if (fieldval === true) {
      fieldval = key
    }
    if (fieldval !== false) {
      if (val) {
        val += ' ' + fieldval
      } else {
        val = fieldval
      }
    }
  }
  return val
}

function setClassName (val, node) {
  if (val) {
    node.className = val
  } else if (node.className) {
    node.removeAttribute('class')
  }
}

function parseKey (target, pid) {
  if (pid[0] === 'c') {
    for (let i = pid.length - 1; i >= 0; i--) {
      if (pid[i] === '-') {
        return pid.slice(1, i)
      }
    }
  } else {
    return target.cParent().key
  }
}
