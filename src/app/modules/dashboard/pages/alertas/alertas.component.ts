import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';
import { RoleService } from '../../../auth/core/services/role.service';
import { environment } from '../../../../../environments/environment'; 

@Component({
  selector: 'app-alertas',
  templateUrl: './alertas.component.html',
  styleUrls: ['./alertas.component.scss']
})
export class AlertasComponent implements OnInit {

  apiUrl = environment.apiUrl;  // 🔥 YA NO ES LOCALHOST
  loading = false;

  dataSource = new MatTableDataSource<any>([]);

  cols: string[] = [
    'proveedor',
    'objeto',
    'importe',
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
    public roleService: RoleService
  ) {}

  ngOnInit(): void {
    this.cargarAlertas();
  }

  regenerarAlertas() {
    this.loading = true;

    this.http.post(`${this.apiUrl}/alertas/generar`, {})
      .subscribe({
        next: () => {
          alert('Alertas regeneradas correctamente');
          this.cargarAlertas();
        },
        error: err => {
          console.error('Error regenerando alertas:', err);
          alert('Error regenerando alertas');
          this.loading = false;
        }
      });
  }

  cargarAlertas() {
    this.loading = true;

    const params: any = {
      page: this.page,
      perPage: this.perPage,
    };

    if (this.filtros.proveedor.trim()) params.proveedor = this.filtros.proveedor.trim();
    if (this.filtros.objeto) params.objeto = this.filtros.objeto;
    if (this.filtros.tipo_alerta) params.tipo_alerta = this.filtros.tipo_alerta;
    if (this.filtros.noRevisadas) params.noRevisadas = '1';

    this.http.get<any>(`${this.apiUrl}/alertas`, { params })
      .subscribe({
        next: (resp) => {
          this.dataSource.data = resp.data;
          this.total = resp.total;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error cargando alertas:', err);
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
      .subscribe({
        next: () => this.cargarAlertas(),
        error: () => alert('Error al actualizar la alerta')
      });
  }
}
