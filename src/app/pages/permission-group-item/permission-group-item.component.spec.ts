import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermissionGroupItemComponent } from './permission-group-item.component';

describe('PermissionGroupItemComponent', () => {
  let component: PermissionGroupItemComponent;
  let fixture: ComponentFixture<PermissionGroupItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PermissionGroupItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PermissionGroupItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
