import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { GeneralApiService } from './general-api.service';
import { HttpClient } from '@angular/common/http';

describe('GeneralApiService', () => {
  let service: GeneralApiService;
  let httpTestingController: HttpTestingController;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [GeneralApiService]
    });

    service = TestBed.inject(GeneralApiService);
    httpTestingController = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  afterEach(() => {
    httpTestingController.verify(); // Verifies no outstanding requests after each test
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('searchByKeyword', () => {
    const testUrl = 'https://api.example.com/search';
    const testKeyword = 'angular testing';
    const encodedKeyword = encodeURIComponent(testKeyword);
    const mockResponse = { results: [1, 2, 3] };

    it('should make GET request with correct URL', fakeAsync(() => {
      service.searchByKeyword(testUrl, testKeyword).subscribe();

      const req = httpTestingController.expectOne(`${testUrl}?q=${encodedKeyword}`);
      expect(req.request.method).toEqual('GET');
      req.flush(mockResponse);
      tick();
    }));

    it('should return observable with response data', fakeAsync(() => {
      let actualResult: any;

      service.searchByKeyword(testUrl, testKeyword).subscribe(res => {
        actualResult = res;
      });

      const req = httpTestingController.expectOne(`${testUrl}?q=${encodedKeyword}`);
      req.flush(mockResponse);
      tick();

      expect(actualResult).toEqual(mockResponse);
    }));

    it('should handle empty search keyword', fakeAsync(() => {
      const emptyKeyword = '';
      service.searchByKeyword(testUrl, emptyKeyword).subscribe();

      const req = httpTestingController.expectOne(`${testUrl}?q=`);
      req.flush(mockResponse);
      tick();
    }));

    it('should handle special characters in keyword', fakeAsync(() => {
      const specialCharKeyword = 'foo@bar & co!';
      const encodedSpecial = encodeURIComponent(specialCharKeyword);

      service.searchByKeyword(testUrl, specialCharKeyword).subscribe();

      const req = httpTestingController.expectOne(`${testUrl}?q=${encodedSpecial}`);
      req.flush(mockResponse);
      tick();
    }));

    it('should handle different API URLs', fakeAsync(() => {
      const altUrl = 'https://another-api.com/data';
      service.searchByKeyword(altUrl, testKeyword).subscribe();

      const req = httpTestingController.expectOne(`${altUrl}?q=${encodedKeyword}`);
      req.flush(mockResponse);
      tick();
    }));
  });
});
