import { ConfigService } from '@nestjs/config'

export const httpFactory = (configService: ConfigService) => {
  const timeout = configService.get('HTTP_TIMEOUT')
  const maxRedirects = configService.get('HTTP_MAX_REDIRECTS')
  return { timeout, maxRedirects }
}
