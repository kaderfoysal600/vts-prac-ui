import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermissionLooderComponent } from './permission-looder.component';

describe('PermissionLooderComponent', () => {
  let component: PermissionLooderComponent;
  let fixture: ComponentFixture<PermissionLooderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PermissionLooderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PermissionLooderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
