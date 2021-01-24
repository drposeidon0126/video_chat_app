import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PwnedMessageComponent } from './pwned-message.component';

describe('PwnedMessageComponent', () => {
  let component: PwnedMessageComponent;
  let fixture: ComponentFixture<PwnedMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PwnedMessageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PwnedMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
