import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { SolicitudesService } from '../../../../solicitudes.service';
import { RoleService } from '../../../auth/core/services/role.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {

  displayedColumns = [
    'validar',
    'estatus',
    'solicitante',
    'cif',
    'proveedor',
    'importe',
    'acciones'
  ];

  dataSource = new MatTableDataSource<any>([]);

  page = 1;
  perPage = 10;
  total = 0;
  totalPaginas = 1;

  loading = false;

  selectedConceptos: string[] = [];
  selectedOperador: string = 'like';
  filtroTexto: string = '';

  seleccionadas: number[] = [];

  //Mapeado

  estadoMap: any = {
  'PENDIENTE': 100,
  'ACEPTADA EN TRAMITE': 110,
  'DENEGADA': 120,
  'CREDITO COMPROBADO': 125,
  'EN ESPERA': 127,
  'ACEPTADA': 130,
  'FACTURA RECIBIDA': 132,
  'PENDIENTE DE PAGO': 135,
  'ANULADA': 140,
  'FACTURA PENDIENTE R': 145,
  'PAGADA': 150
};


  constructor(
    private solicitudesService: SolicitudesService,
    private router: Router,
    public roleService: RoleService
  ) {}

  ngOnInit() {
    this.cargarSolicitudes(true);
  }

  cargarSolicitudes(reset: boolean = false) {
    if (this.loading) return;
    this.loading = true;

    if (reset) {
      this.dataSource.data = [];
      this.seleccionadas = [];
    }

    let filtros: any = {};

    if (this.filtroTexto.trim() && this.selectedConceptos.length > 0) {
      filtros.conceptos = this.selectedConceptos.join(',');
      filtros.operadores = this.selectedOperador;
      filtros.texto = this.filtroTexto.trim();
    }

    this.solicitudesService
      .getSolicitudes(this.page, this.perPage, filtros)
      .subscribe({
        next: (resp: any) => {
          const nuevas = resp.data ?? resp;
          this.dataSource.data = [...this.dataSource.data, ...nuevas];

          if (resp.total) {
            this.total = resp.total;
            this.totalPaginas = Math.ceil(resp.total / this.perPage);
          }

          this.loading = false;
        },
        error: (err: any) => {
          console.error('Error cargando órdenes:', err);
          this.loading = false;
        }
      });
  }

  paginaSiguiente() {
    if (this.page < this.totalPaginas) {
      this.page++;
      this.cargarSolicitudes(false);
    }
  }

  paginaAnterior() {
    if (this.page > 1) {
      this.page--;
      this.cargarSolicitudes(true);
    }
  }

  toggleConcepto(campo: string) {
    const idx = this.selectedConceptos.indexOf(campo);
    if (idx >= 0) {
      this.selectedConceptos.splice(idx, 1);
    } else {
      this.selectedConceptos.push(campo);
    }
  }

  toggleLike(op: string) {
    this.selectedOperador = op;
  }

  aplicarFiltros() {
    this.page = 1;
    this.cargarSolicitudes(true);
  }


  estaSeleccionada(id: number) {
    return this.seleccionadas.includes(id);
  }

  toggleSeleccion(row: any) {
    const id = row.idsolicitudgasto;
    const idx = this.seleccionadas.indexOf(id);

    if (idx >= 0) {
      this.seleccionadas.splice(idx, 1);
    } else {
      this.seleccionadas.push(id);
    }
  }

  toggleSeleccionTodas(event: any) {
    const checked = event.checked;

    if (checked) {
      const idsPagina = this.dataSource.data.map(row => row.idsolicitudgasto);
      this.seleccionadas = [...new Set([...this.seleccionadas, ...idsPagina])];
    } else {
      const idsPagina = this.dataSource.data.map(row => row.idsolicitudgasto);
      this.seleccionadas = this.seleccionadas.filter(id => !idsPagina.includes(id));
    }
  }

  validarSeleccionadas() {
  if (this.seleccionadas.length === 0) return;

  const ESTADO_ACEPTADA = this.estadoMap['ACEPTADA']; // 130

  this.solicitudesService
    .validarMasivo(this.seleccionadas, ESTADO_ACEPTADA)
    .subscribe({
      next: () => {
        alert('Órdenes validadas correctamente');

        this.dataSource.data = this.dataSource.data.map(row => {
          if (this.seleccionadas.includes(row.idsolicitudgasto)) {
            return {
              ...row,
              id_estado: ESTADO_ACEPTADA,
              estado_nombre: 'ACEPTADA' 
            };
          }
          return row;
        });

        this.seleccionadas = [];
      },
      error: (err: any) => {
        console.error(err);
        alert('Error al validar');
      }
    });
}


irNuevaOrden() {
  this.router.navigate(['/dashboard/nueva-solicitud']);
}

verDetalle(id: number) {
  this.router.navigate(['/dashboard/solicitudes', id]);
}


}
