import { ConfirmDialog, ConfirmData } from '@peek/shared/elements'
import { peekCode, validatePeekCode } from '@peek/core/model'
import { MatDialog } from '@angular/material/dialog'
import { Injectable } from '@angular/core'
import { switchMap } from 'rxjs/operators'
import { Observable } from 'rxjs'
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router'

@Injectable({
  providedIn: 'root',
})
export class VoiceGuard implements CanActivate {
  constructor(private _dialog: MatDialog, private _router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | boolean {
    if (validatePeekCode(route.paramMap.get('code') ?? '')) {
      return true
    }
    const data: ConfirmData = {
      title: 'Iniciando',
      text: 'Envie o link com código para seu convidado',
      extra: peekCode(),
    }
    return this._dialog
      .open(ConfirmDialog, { data })
      .afterClosed()
      .pipe(
        switchMap((code = '') => {
          const route = ['/']
          if (code) route.push('voice', code)
          return this._router.navigate(route)
        })
      )
  }
}
