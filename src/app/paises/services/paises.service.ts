import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, combineLatest } from 'rxjs';
import { Pais, PaisSmall } from '../interfaces/paises.interface';

@Injectable({
  providedIn: 'root'
})
export class PaisesService {

  private baseUrl: string = 'https://restcountries.com/v2';

  private _regiones: string[] = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

  get regiones() {
    return [...this._regiones];
  }

  constructor( private http: HttpClient ) { }

  getPaisesPorRegion( region: string ): Observable<PaisSmall[]> {
    const url: string = `${ this.baseUrl }/region/${ region }?fields=alpha3Code,name`;
    return this.http.get<PaisSmall[]>(url);
  }

  //https://restcountries.com/v2/alpha/AZE
  getPaisPorCodigo( codigo: string ): Observable<Pais | null> {

    if (!codigo) {
      return of(null);
    }

    const url: string = `${ this.baseUrl }/alpha/${ codigo }`;
    return this.http.get<Pais>(url);
  }

  getPaisPorCodigoSmall(codigo: string): Observable<PaisSmall> {
    const url: string = `${ this.baseUrl }/alpha/${ codigo }?fields=alpha3Code,name`;
    return this.http.get<PaisSmall>(url);
  }

  getPaisesPorCodigos( borders: string[] ): Observable<PaisSmall[]> {

    if ( !borders ) {
      return of([]);
    }

    const peticiones: Observable<PaisSmall>[] = [];

    borders.forEach(codigo => {
      const peticion = this.getPaisPorCodigoSmall(codigo);
      peticiones.push(peticion);
    });

    return combineLatest(peticiones);

  }

}
