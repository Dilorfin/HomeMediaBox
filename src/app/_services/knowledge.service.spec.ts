import { TestBed } from '@angular/core/testing';

import { KnowledgeService } from './knowledge.service';

describe('KnowledgeService', () =>
{
	let service: KnowledgeService;

	beforeEach(() =>
	{
		TestBed.configureTestingModule({});
		service = TestBed.inject(KnowledgeService);
	});

	it('should be created', () =>
	{
		expect(service).toBeTruthy();
	});
});
