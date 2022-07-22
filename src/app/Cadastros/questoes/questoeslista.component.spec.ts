import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestoeslistaComponent } from './questoeslista.component';

describe('QuestoeslistaComponent', () => {
  let component: QuestoeslistaComponent;
  let fixture: ComponentFixture<QuestoeslistaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuestoeslistaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestoeslistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
