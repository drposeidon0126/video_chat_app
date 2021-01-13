import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToPeerComponent } from './to-peer.component';

describe('ToPeerComponent', () => {
  let component: ToPeerComponent;
  let fixture: ComponentFixture<ToPeerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToPeerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToPeerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
