import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';
import { RoleService } from '../../../auth/core/services/role.service';
import { environment } from '../../../../../environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-alertas',
  templateUrl: './alertas.component.html',
  styleUrls: ['./alertas.component.scss']
})
export class AlertasComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();

  apiUrl = environment.apiUrl;
  loading = false;

  dataSource = new MatTableDataSource<any>([]);

  cols: string[] = [
    'proveedor',
    'objeto',
    'importe_objeto',
    'umbral',
    'tipo_alerta',
    'acciones'
  ];

  page = 1;
  perPage = 10;
  total = 0;

  filtros = {
    proveedor: '',
    objeto: '',
    tipo_alerta: '',
    noRevisadas: false
  };

  constructor(
    private http: HttpClient,
    public roleService: RoleService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.cargarAlertas();
  }

  regenerarAlertas() {
    this.loading = true;

    this.http.post(`${this.apiUrl}/alertas/generar`, {})
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.snackBar.open(
            'Alertas regeneradas correctamente',
            'Cerrar',
            { duration: 3000 }
          );
          this.cargarAlertas();
        },
        error: err => {
          console.error('Error regenerando alertas:', err);
          this.snackBar.open(
            'Error regenerando alertas',
            'Cerrar',
            { duration: 3000 }
          );
          this.loading = false;
        }
      });
  }

  cargarAlertas() {
    this.loading = true;

    const params: any = {
      page: this.page,
      perPage: this.perPage,
      ...(this.filtros.proveedor.trim() && { proveedor: this.filtros.proveedor.trim() }),
      ...(this.filtros.objeto && { objeto: this.filtros.objeto }),
      ...(this.filtros.tipo_alerta && { tipo_alerta: this.filtros.tipo_alerta }),
      ...(this.filtros.noRevisadas && { noRevisadas: '1' })
    };

    this.http.get<any>(`${this.apiUrl}/alertas`, { params })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: resp => {
          this.dataSource.data = resp.data;
          this.total = resp.total;
          this.loading = false;
        },
        error: err => {
          console.error('Error cargando alertas:', err);
          this.snackBar.open(
            'Error al cargar alertas',
            'Cerrar',
            { duration: 3000 }
          );
          this.loading = false;
        }
      });
  }

  buscar() {
    this.page = 1;
    this.cargarAlertas();
  }



  get totalPages() {
    return Math.ceil(this.total / this.perPage);
  }

  siguiente() {
    if (this.page < this.totalPages) {
      this.page++;
      this.cargarAlertas();
    }
  }

  anterior() {
    if (this.page > 1) {
      this.page--;
      this.cargarAlertas();
    }
  }


  marcarRevisada(id: number) {
    this.http.patch(`${this.apiUrl}/alertas/${id}/estado`, { revisada: true })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.snackBar.open(
            'Alerta marcada como revisada',
            'Cerrar',
            { duration: 2500 }
          );
          this.cargarAlertas();
        },
        error: () => {
          this.snackBar.open(
            'Error al actualizar la alerta',
            'Cerrar',
            { duration: 2500 }
          );
        }
      });
  }


  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
