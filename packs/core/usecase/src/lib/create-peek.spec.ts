import { WebSocketFacade } from '@peek/core/adapter'
import { peekCode } from '@peek/core/model'
import { CreatePeek } from './create-peek'

describe('CreatePeek', () => {
  const code = peekCode()
  let socket = new WebSocketFacade({
    url: '',
  })
  it('should create an instance', () => {
    expect(new CreatePeek(socket, code)).toBeTruthy()
  })
})
