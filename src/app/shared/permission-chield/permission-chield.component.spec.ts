import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermissionChieldComponent } from './permission-chield.component';

describe('PermissionChieldComponent', () => {
  let component: PermissionChieldComponent;
  let fixture: ComponentFixture<PermissionChieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PermissionChieldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PermissionChieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
