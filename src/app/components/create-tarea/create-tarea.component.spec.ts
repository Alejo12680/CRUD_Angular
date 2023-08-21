import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTareaComponent } from './create-tarea.component';

describe('CreateTareaComponent', () => {
  let component: CreateTareaComponent;
  let fixture: ComponentFixture<CreateTareaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateTareaComponent]
    });
    fixture = TestBed.createComponent(CreateTareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
