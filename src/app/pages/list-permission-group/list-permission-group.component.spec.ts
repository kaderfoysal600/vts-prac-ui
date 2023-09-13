import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPermissionGroupComponent } from './list-permission-group.component';

describe('ListPermissionGroupComponent', () => {
  let component: ListPermissionGroupComponent;
  let fixture: ComponentFixture<ListPermissionGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListPermissionGroupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPermissionGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
