import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
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
  styleUrls: ['./alertas.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush 
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
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef 
  ) {}

  ngOnInit(): void {
    this.cargarAlertas();
  }

  regenerarAlertas() {
    this.loading = true;
    this.cdr.markForCheck();

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
          this.loading = false;
          this.cdr.markForCheck();
        }
      });
  }

  cargarAlertas() {
    this.loading = true;
    this.cdr.markForCheck();

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

          // Se evitan pipe en HTML para mejorar rendimiento
          const data = resp.data.map((a: any) => ({
            ...a,
            gasto_anual_fmt: new Intl.NumberFormat('es-ES', {
              style: 'currency',
              currency: 'EUR'
            }).format(a.gasto_anual),
            umbral_fmt: new Intl.NumberFormat('es-ES', {
              style: 'currency',
              currency: 'EUR'
            }).format(a.umbral)
          }));

          this.dataSource.data = data;
          this.total = resp.total;
          this.loading = false;
          this.cdr.markForCheck();
        },
        error: err => {
          console.error('Error cargando alertas:', err);
          this.loading = false;
          this.cdr.markForCheck();
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

          // Actualización local (NO recargar todo)
          const row = this.dataSource.data.find(a => a.id === id);
          if (row) {
            row.revisada = true;
            this.dataSource.data = [...this.dataSource.data];
            this.cdr.markForCheck();
          }
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
