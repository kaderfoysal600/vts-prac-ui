import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPermissionGroupItemComponent } from './list-permission-group-item.component';

describe('ListPermissionGroupItemComponent', () => {
  let component: ListPermissionGroupItemComponent;
  let fixture: ComponentFixture<ListPermissionGroupItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListPermissionGroupItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPermissionGroupItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
