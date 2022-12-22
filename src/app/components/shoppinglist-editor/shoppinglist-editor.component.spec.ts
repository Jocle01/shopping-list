import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShoppinglistEditorComponent } from './shoppinglist-editor.component';

describe('ShoppinglistEditorComponent', () => {
  let component: ShoppinglistEditorComponent;
  let fixture: ComponentFixture<ShoppinglistEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShoppinglistEditorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShoppinglistEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
