import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MicroUpgradeComponent } from './micro-upgrade.component';

describe('MicroUpgradeComponent', () => {
  let component: MicroUpgradeComponent;
  let fixture: ComponentFixture<MicroUpgradeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MicroUpgradeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MicroUpgradeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
