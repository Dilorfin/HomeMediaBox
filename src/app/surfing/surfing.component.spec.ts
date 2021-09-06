import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SurfingComponent } from './surfing.component';

describe('SurfingComponent', () =>
{
	let component: SurfingComponent;
	let fixture: ComponentFixture<SurfingComponent>;

	beforeEach(waitForAsync(() =>
	{
		TestBed.configureTestingModule({
			declarations: [SurfingComponent],
			imports: [IonicModule.forRoot()]
		}).compileComponents();

		fixture = TestBed.createComponent(SurfingComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create', () =>
	{
		expect(component).toBeTruthy();
	});
});
