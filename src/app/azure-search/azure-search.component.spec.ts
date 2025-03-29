import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AzureSearchComponent } from './azure-search.component';

describe('AzureSearchComponent', () => {
  let component: AzureSearchComponent;
  let fixture: ComponentFixture<AzureSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AzureSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AzureSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
