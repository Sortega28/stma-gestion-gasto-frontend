import { Component, OnInit } from '@angular/core';
import { ReportesService } from '../../../../reports.service';
import { Chart, registerables } from 'chart.js';
import { RoleService } from '../../../auth/core/services/role.service';   

Chart.register(...registerables);

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

  filtros = {
    desde: '',
    hasta: '',
    estado: '',
    objeto: '',
    unidad: '',
    proveedor: ''
  };

  registros: any[] = [];

  porObjeto: { objeto: string; total: number }[] = [];
  porProveedor: { proveedor: string; total: number }[] = [];
  porEstado: { desc: string; cantidad: number; total: number }[] = [];

  displayedColumns = ['estado', 'cantidad', 'total'];
  dataSource: any[] = [];

  chartObjeto?: Chart;
  chartProveedor?: Chart;

  loading = false;


  constructor(
    private reportesService: ReportesService,
    public roleService: RoleService
  ) {}

  ngOnInit(): void {
    this.cargarReportes();
  }

  cargarReportes(): void {
    this.loading = true;

    this.reportesService.getReportes(this.filtros).subscribe({
      next: (res: any) => {
        this.loading = false;

        if (!res.ok) {
          console.error('Error en API de reportes:', res.error);
          return;
        }

        this.registros = res.data || [];

        this.calcularPorObjeto();
        this.calcularPorProveedor();
        this.calcularPorEstado();

        this.dataSource = this.porEstado;

        this.dibujarGraficaObjeto();
        this.dibujarGraficaProveedor();
      },
      error: (err: any) => {
        this.loading = false;
        console.error('Error HTTP en reportes:', err);
        alert('No se pudieron cargar los reportes.');
      }
    });
  }

  aplicarFiltros(): void {
    this.cargarReportes();
  }

  limpiarFiltros(): void {
    this.filtros = {
      desde: '',
      hasta: '',
      estado: '',
      objeto: '',
      unidad: '',
      proveedor: ''
    };
    this.cargarReportes();
  }

  private calcularPorObjeto(): void {
    const mapa: Record<string, number> = {};

    for (const r of this.registros) {
      const obj = r.objeto || 'Sin clasificar';
      const importe = parseFloat(r.importe) || 0;

      mapa[obj] = (mapa[obj] || 0) + importe;
    }

    this.porObjeto = Object.keys(mapa).map(k => ({
      objeto: k,
      total: mapa[k]
    }));
  }

  private calcularPorProveedor(): void {
    const mapa: Record<string, number> = {};

    for (const r of this.registros) {
      const prov = r.nombre_prov_final || 'Sin proveedor';
      const importe = parseFloat(r.importe) || 0;

      mapa[prov] = (mapa[prov] || 0) + importe;
    }

    this.porProveedor = Object.keys(mapa)
      .map(k => ({ proveedor: k, total: mapa[k] }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 10);
  }

  private calcularPorEstado(): void {
    const mapa: Record<string, { cantidad: number; total: number }> = {};

    for (const r of this.registros) {
      const desc = r.estado_solicitud_gasto?.desc_corta
                || r.estadoSolicitudGasto?.desc_corta
                || 'Sin estado';

      const importe = parseFloat(r.importe) || 0;

      if (!mapa[desc]) {
        mapa[desc] = { cantidad: 0, total: 0 };
      }

      mapa[desc].cantidad++;
      mapa[desc].total += importe;
    }

    this.porEstado = Object.keys(mapa).map(k => ({
      desc: k,
      cantidad: mapa[k].cantidad,
      total: mapa[k].total
    }));
  }

  private dibujarGraficaObjeto(): void {
    if (this.chartObjeto) this.chartObjeto.destroy();

    const canvas = document.getElementById('chartObjeto') as HTMLCanvasElement;
    if (!canvas) return;

    this.chartObjeto = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: this.porObjeto.map(x => x.objeto),
        datasets: [{
          label: 'Total (€)',
          data: this.porObjeto.map(x => x.total),
          backgroundColor: '#0f62fe'
        }]
      },
      options: { responsive: true, plugins: { legend: { display: false } } }
    });
  }

  private dibujarGraficaProveedor(): void {
    if (this.chartProveedor) this.chartProveedor.destroy();

    const canvas = document.getElementById('chartProveedor') as HTMLCanvasElement;
    if (!canvas) return;

    this.chartProveedor = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: this.porProveedor.map(x => x.proveedor),
        datasets: [{
          label: 'Total (€)',
          data: this.porProveedor.map(x => x.total),
          backgroundColor: '#3f6c6d'
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { x: { ticks: { maxRotation: 45, minRotation: 45 } } }
      }
    });
  }

  exportarPdf(): void {
    this.reportesService.descargarPdf(this.filtros).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'reporte_solicitudes.pdf';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: () => alert('No se pudo generar el PDF.')
    });
  }

  exportarExcel(): void {
    this.reportesService.descargarExcel(this.filtros).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'reporte_solicitudes.xlsx';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: () => alert('No se pudo generar el Excel.')
    });
  }
}
