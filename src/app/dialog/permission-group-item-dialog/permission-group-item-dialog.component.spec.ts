import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermissionGroupItemDialogComponent } from './permission-group-item-dialog.component';

describe('PermissionGroupItemDialogComponent', () => {
  let component: PermissionGroupItemDialogComponent;
  let fixture: ComponentFixture<PermissionGroupItemDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PermissionGroupItemDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PermissionGroupItemDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
