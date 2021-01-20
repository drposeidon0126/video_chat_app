import { WebSocketFacade } from '@peek/core/adapter'
import { createPeekCode } from '@peek/core/model'
import { CreatePeek } from './create-peek'

describe('CreatePeek', () => {
  const peekCode = createPeekCode()
  let socket = new WebSocketFacade({
    url: '',
  })
  it('should create an instance', () => {
    expect(new CreatePeek(socket, peekCode)).toBeTruthy()
  })
})
