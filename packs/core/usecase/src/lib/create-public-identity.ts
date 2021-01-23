import { Identity, peekCode } from '@peek/core/model'
import { UseCase } from './usecase'

export class CreatePublicIdentity
  implements UseCase<Omit<Identity, 'code'>, Identity> {
  execute({ name, nick }: Pick<Identity, 'name' | 'nick'>): Promise<Identity> {
    return Promise.resolve(new Identity(peekCode(), name, nick))
  }
}
