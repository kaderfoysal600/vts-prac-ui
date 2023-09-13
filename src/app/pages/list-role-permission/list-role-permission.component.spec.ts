import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListRolePermissionComponent } from './list-role-permission.component';

describe('ListRolePermissionComponent', () => {
  let component: ListRolePermissionComponent;
  let fixture: ComponentFixture<ListRolePermissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListRolePermissionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListRolePermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
