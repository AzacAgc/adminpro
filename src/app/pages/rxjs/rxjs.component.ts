import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscriber, Subscription } from 'rxjs';
import { map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: []
})
export class RxjsComponent implements OnInit, OnDestroy {

  suscription: Subscription;

  constructor() {

    this.suscription = this.regresaObservable().subscribe(
      numero => console.log('Termino ', numero),
      error => console.error('Hubo un error', error),
      () => console.log('Termino')
    );

  }

  ngOnInit() {
  }

  ngOnDestroy() {
    console.log('Saliendo de la página');
    this.suscription.unsubscribe();
  }

  regresaObservable(): Observable<any> {
    return new Observable((observer: Subscriber<any>) => {
      let cont = 0;

      const intervalo = setInterval(() => {
        cont++;

        const salida = {
          valor: cont
        };

        observer.next(salida);

        // if ( cont === 2 ) {
        //   // clearInterval(intervalo);
        //   observer.error('Ups...');
        // }
      }, 1000);
    }).pipe(
      map(resp => resp.valor),
      filter( resp => {
        if ( (resp % 2) === 1 ) {
          return true;
        } else {
          return false;
        }
      })
    );
  }

}
