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

  miFormulario: FormGroup = this.fb.group({
    region: [ '', Validators.required ],
    pais: [ '', Validators.required ]
  });

  regiones: string[] = [];
  paises: PaisSmall[] = [];

  constructor( 
    private fb: FormBuilder,
    private paisesService: PaisesService
  ) { }

  ngOnInit(): void {

    this.regiones = this.paisesService.regiones;

    // this.miFormulario.get('region')?.valueChanges.subscribe( region => {
    //   console.log(region);

    //   this.paisesService.getPaisesPorRegion( region )
    //   .subscribe( paises => {
    //     this.paises = paises;
    //     console.log(paises);
    //   });

    // });

    this.miFormulario.get('region')?.valueChanges
    .pipe(
      tap( (_) => {
        this.miFormulario.get('pais')?.reset();
      } ),
      switchMap( region => this.paisesService.getPaisesPorRegion( region ) )
    )
    .subscribe( paises => {
      this.paises = paises;
      console.log(paises);
    } );

  }

  guardar(): void {
    console.log(this.miFormulario.value)
  }

}
