import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchCompareFrameComponent } from './search-compare-frame.component';

describe('SearchCompareFrameComponent', () => {
  let component: SearchCompareFrameComponent;
  let fixture: ComponentFixture<SearchCompareFrameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchCompareFrameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchCompareFrameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
