'use strict'
const test = require('tape')
const render = require('brisky-core/render')
const parse = require('parse-element')
const strip = require('vigour-util/strip/formatting')
const s = require('vigour-state/s')

require('brisky-core').prototype.inject(require('../'))


test('context - keys as class name', function (t) {
  const elem = render({
    types: {
      elem: {
        class: {
          val: true,
          thing: { $: 'simpleClass' }
        }
      }
    },
    elem1: { type: 'elem' },
    elem2: { type: 'elem' }
  }, {
    simpleClass: 'simple-class'
  })
  t.equals(elem.childNodes[0].className, 'elem1 simple-class', 'context 1 correct key')
  t.equals(elem.childNodes[1].className, 'elem2 simple-class', 'context 2 correct key')
  t.end()
})

test('context - class subscription with nested properties', function (t) {
  var node
  const state = s({
    thing: {
      active: true
    }
  })

  const elem = {
    types: {
      thing: {
        class: {
          default: 'hello'
        }
      }
    },
    thing: {
      $: 'thing',
      type: 'thing',
      class: {
        active: {
          $: 'active',
          $transform: (val) => val && 'active'
        }
      }
    }
  }

  node = render(elem, state)
  t.equals(node.childNodes[0].className, 'hello active', 'init with subs')

  state.thing.active = false
  node = render(elem, state)
  t.equals(node.childNodes[0].className, 'hello', 'removed class')

  t.end()
})

test('context - remove field on inherited class', function (t) {
  const state = s({})

  const elem = render({
    types: {
      elem: {
        class: {
          hello: true,
          thing: {
            $: 'simpleClass'
          }
        }
      }
    },
    elem1: { type: 'elem' },
    elem2: { type: 'elem', class: { bla: { $: 'bla' } } }
  }, state)

  t.equals(elem.childNodes[0].className, 'hello', '1 initial')
  t.equals(elem.childNodes[1].className, 'hello', '2 initial')

  state.set({ simpleClass: true })
  t.equals(elem.childNodes[0].className, 'hello thing', '1 after state "true"')
  t.equals(elem.childNodes[1].className, 'hello thing', '2 after state "true"')

  state.set({ bla: true })
  t.equals(elem.childNodes[1].className, 'hello thing bla', '2 after state "true"')

  state.simpleClass.remove()
  t.equals(elem.childNodes[0].className, 'hello', '1 after removal of $root.simpleClass')
  t.equals(elem.childNodes[1].className, 'hello bla', '2 after removal of $root.simpleClass')

  state.bla.remove()
  t.equals(elem.childNodes[1].className, 'hello', '2 after removal of $root.bal')
  t.end()
})
