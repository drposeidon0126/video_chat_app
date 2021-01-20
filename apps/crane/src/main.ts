import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
;(async () => {
  const port = process.env.PORT || 3000
  const host = `http://localhost:${port}`
  const app = await NestFactory.create(AppModule, { cors: true })
  await app.listen(port, () => Logger.log(`Listening at: ${host}`))
})()
