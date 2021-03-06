'use strict'
require('brisky-core').prototype.inject(require('../'))
const s = require('vigour-state/s')
const test = require('tape')
const render = require('brisky-core/render')
const strip = require('vigour-util/strip/formatting')
const parse = require('parse-element')

test('subscription - any + test - class false', function (t) {
  const state = s({
    todos: {
      1: { text: 'hello 1' },
      2: { text: 'hello 2', done: true }
    }
  })

  const app = render({
    todos: {
      tag: 'fragment',
      $: 'todos.$any',
      child: {
        text: { $: 'text' },
        class: {
          val: 'todo',
          done: { $: 'done' },
          party: {
            $: 'text.$test',
            $test: {
              val (val) {
                return val.compute().indexOf('party') !== -1
              }
            },
            $type: 'boolean'
          }
        }
      }
    }
  }, state)

  state.todos[1].set({ text: 'party boys' })

  t.same(
    strip(`
      <div>
        <div class="todo party">party boys</div>
        <div class="todo done">hello 2</div>
      </div>
    `),
    parse(app),
    'initial subcription'
  )

  state.todos[1].text.set('hello')
  t.same(
    strip(`
      <div>
        <div class="todo">hello</div>
        <div class="todo done">hello 2</div>
      </div>
    `),
    parse(app),
    'initial subcription'
  )
  t.end()
})
