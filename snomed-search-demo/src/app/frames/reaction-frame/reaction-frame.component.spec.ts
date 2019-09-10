import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReactionFrameComponent } from './reaction-frame.component';

describe('EncounterFrameComponent', () => {
  let component: ReactionFrameComponent;
  let fixture: ComponentFixture<ReactionFrameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReactionFrameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReactionFrameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
