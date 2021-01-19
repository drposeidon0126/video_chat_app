import { WebSocketFacade } from '@peek/core/adapter'
import { CreatePeek } from './create-peek'

describe('CreatePeek', () => {
  let socket = new WebSocketFacade({
    url: '',
  })
  it('should create an instance', () => {
    expect(new CreatePeek(socket)).toBeTruthy()
  })
})
