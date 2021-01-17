import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { CraneModule } from './crane.module'
;(async () => {
  const port = process.env.PORT || 3000
  const host = `http://localhost:${port}`
  const crane = await NestFactory.create(CraneModule, { cors: true })
  await crane.listen(port, () => Logger.log(`Listening at: ${host}`))
})()
