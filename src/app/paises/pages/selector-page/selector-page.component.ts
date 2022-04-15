import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { switchMap, tap } from 'rxjs';
import { PaisSmall } from '../../interfaces/paises.interface';
import { PaisesService } from '../../services/paises.service';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styleUrls: ['./selector-page.component.css']
})
export class SelectorPageComponent implements OnInit {

  cargando: boolean = false;

  miFormulario: FormGroup = this.fb.group({
    region: [ '', Validators.required ],
    pais: [ '', Validators.required ],
    frontera: [ '' /*{value: '', disabled: true}*/, Validators.required ]
  });

  regiones: string[] = [];
  paises: PaisSmall[] = [];
  //fronteras: string [] = [];
  fronteras: PaisSmall [] = [];

  constructor( 
    private fb: FormBuilder,
    private paisesService: PaisesService
  ) { }

  ngOnInit(): void {

    this.regiones = this.paisesService.regiones;

    // Otra forma de hacer lo de la dependencia del selector 2 sin rxjs
    // this.miFormulario.get('region')?.valueChanges.subscribe( region => {
    //   console.log(region);

    //   this.paisesService.getPaisesPorRegion( region )
    //   .subscribe( paises => {
    //     this.paises = paises;
    //     console.log(paises);
    //   });

    // });

    // Cuando cambie la region
    this.miFormulario.get('region')?.valueChanges
    .pipe(
      tap( (_) => {
        this.miFormulario.get('pais')?.reset();
        this.cargando = true;
        // this.miFormulario.get('frontera')?.disable();
      } ),
      switchMap( region => this.paisesService.getPaisesPorRegion( region ) )
    )
    .subscribe( paises => {
      this.paises = paises;
      this.cargando = false;
    } );

    // Cuando cambie el pais
    this.miFormulario.get('pais')?.valueChanges
    .pipe(
      tap( () => {
        this.fronteras = [];
        this.miFormulario.get('frontera')?.reset();
        this.cargando = true;
        // this.miFormulario.get('frontera')?.enable();
      } ),
      switchMap( codigo => this.paisesService.getPaisPorCodigo( codigo) ),
      switchMap( pais => this.paisesService.getPaisesPorCodigos( pais?.borders! ))
    )
    .subscribe( paises => {
      this.fronteras = paises;
      this.cargando = false;
    } );

  }

  guardar(): void {
    console.log(this.miFormulario.value)
  }

}
