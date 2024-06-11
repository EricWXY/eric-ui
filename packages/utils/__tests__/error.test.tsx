import {describe,expect,it,vi} from 'vitest'
import {debugWarn,throwError} from '../error'

describe('error',()=>{
  it('throwError should work',()=>{
    expect(()=>{
      throwError('scope', 'message')
    }).toThrowError('[scope] message')
  })
  it('debugWarn should work',()=>{
    const warn = vi.spyOn(console, 'warn').mockImplementation(()=> vi.fn)
    debugWarn('scope','message')
    debugWarn(new SyntaxError('custom error'))
    expect(warn.mock.calls).toMatchInlineSnapshot(`
      [
        [
          [ErUIError: [scope] message],
        ],
        [
          [SyntaxError: custom error],
        ],
      ]
    `)
  })
})

