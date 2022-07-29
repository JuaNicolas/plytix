import { Component, CUSTOM_ELEMENTS_SCHEMA, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { PillPipe } from 'src/app/pill.pipe';
import { CardComponent } from './card.component';

@Component({
  selector: `app-host-component`,
  template: `<app-card
    [user]="{
      id: 1,
      name: 'Nicolas',
      email: 'email@gmail.com',
      department: 'Development',
      created: '2022-07-25'
    }"
  ></app-card>`,
})
class TestHostComponent {
  @ViewChild(CardComponent, { static: true })
  public cardComponent!: CardComponent;
}

describe('CardComponent', () => {
  let testHostComponent: TestHostComponent;
  let testHostFixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CardComponent, PillPipe, TestHostComponent],
      imports: [MatCardModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    testHostFixture = TestBed.createComponent(TestHostComponent);
    testHostComponent = testHostFixture.componentInstance;
    testHostFixture.detectChanges();
  });

  it('should create', () => {
    expect(testHostComponent.cardComponent).toBeTruthy();
  });
});
