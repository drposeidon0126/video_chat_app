import { Injectable } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import {
  CanActivate,
  CanLoad,
  Route,
  UrlSegment,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router'
import { peekCode, validatePeekCode } from '@peek/core/model'
import { PeekCodeDialog } from '@peek/shared/elements'
import { Observable } from 'rxjs'
import { map, switchMap } from 'rxjs/operators'

@Injectable({
  providedIn: 'root',
})
export class MeetGuard implements CanActivate, CanLoad {
  constructor(private _dialog: MatDialog, private _router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const code = route.paramMap.get('code')
    if (validatePeekCode(code)) {
      return true
    }
    return this._dialog
      .open(PeekCodeDialog, { data: peekCode() })
      .afterClosed()
      .pipe(
        switchMap((response) => this._router.navigate(['/', response ?? '']))
      )
  }
  canLoad(
    route: Route,
    segments: UrlSegment[]
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    console.log('load: ', route, segments)

    return true
  }
}
