import { WebSocketConfig } from '@peek/core/adapter'
import { InjectionToken } from "@angular/core";

export const SOCKET_CONFIG_TOKEN = new InjectionToken<WebSocketConfig>(
  '__SOCKET_IO_CONFIG__'
)
