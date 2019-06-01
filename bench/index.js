/* eslint-disable no-console */

const Benchmark = require('benchmark')
const matches = require('../dist')

const suite = new Benchmark.Suite()

suite
  .add('matches() - checks all', () => {
    const isPromiseFunctionNode = matches({
      type: 'CallExpression',
      callee: {
        type: 'MemberExpression',
        property: {
          name: /then|catch/,
        },
      },
    })

    isPromiseFunctionNode({
      type: 'CallExpression',
      callee: {
        type: 'MemberExpression',
        property: {
          name: 'then',
        },
      },
    })
  })
  .add('standard - checks all', () => {
    function isPromiseFunctionNode(node) {
      if (node.type !== 'CallExpression') {
        return false
      }
      if (node.callee.type !== 'MemberExpression') {
        return false
      }
      const propertyName = node.callee.property.name
      return propertyName === 'then' || propertyName === 'catch'
    }

    isPromiseFunctionNode({
      type: 'CallExpression',
      callee: {
        type: 'MemberExpression',
        property: {
          name: 'then',
        },
      },
    })
  })
  .add('matches() - exit early', () => {
    const isPromiseFunctionNode = matches({
      type: 'CallExpression',
      callee: {
        type: 'MemberExpression',
        property: {
          name: /then|catch/,
        },
      },
    })

    isPromiseFunctionNode({})
  })
  .add('standard - exit early', () => {
    function isPromiseFunctionNode(node) {
      if (node.type !== 'CallExpression') {
        return false
      }
      if (node.callee.type !== 'MemberExpression') {
        return false
      }
      const propertyName = node.callee.property.name
      return propertyName === 'then' || propertyName === 'catch'
    }

    isPromiseFunctionNode({})
  })
  .on('cycle', e => {
    console.log(String(e.target))
  })
  .on('complete', function() {
    const top = this.filter('fastest').map('name')
    console.log(`Fastest is ${top}`)
  })
  .run({ async: true })
