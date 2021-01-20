import { fromPeekCode, PeekCode, validatePeekCode } from '@peek/core/model'
import { debounceTime, filter, takeUntil } from 'rxjs/operators'
import { Component, OnDestroy, OnInit } from '@angular/core'
import { FormControl, Validators } from '@angular/forms'
import { MatDialogRef } from '@angular/material/dialog'
import { Router } from '@angular/router'
import { Subject } from 'rxjs'

@Component({
  templateUrl: './code.component.html',
  styleUrls: ['./code.component.scss'],
})
export class PeekCodeComponent implements OnInit, OnDestroy {
  private destroy = new Subject<void>()
  code = new FormControl('', Validators.required)

  constructor(
    private _ref: MatDialogRef<PeekCodeComponent>,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this.code.valueChanges
      .pipe(
        filter((v) => !!v),
        debounceTime(1000),
        takeUntil(this.destroy)
      )
      .subscribe((value: PeekCode) => {
        if (validatePeekCode(value)) {
          this._router
            .navigate(['/', fromPeekCode(value)])
            .then(() => this._ref.close())
        }
      })
  }

  ngOnDestroy(): void {
    this.destroy.next()
    this.destroy.complete()
  }
}
