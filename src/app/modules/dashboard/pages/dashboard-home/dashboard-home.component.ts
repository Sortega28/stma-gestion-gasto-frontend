import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { Router } from '@angular/router';
import { DashboardService, DashboardResumen } from '../../../../dashboard.service';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.scss']
})
export class DashboardHomeComponent implements OnInit, AfterViewInit, OnDestroy {

  loading = true;

  totalGasto = 0;
  gastoMensual = 0;
  ordenesActivas = 0;
  topProveedor = '';
  topProveedorImporte = 0;

  displayedColumns = ['estatus', 'solicitante', 'cif', 'proveedor', 'importe'];
  dataSource: any[] = [];

  evolucionLabels: string[] = [];
  evolucionDatos: number[] = [];

  private chart?: Chart;
  private resizeListener?: () => void;

  constructor(
    private router: Router,
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    this.cargarDashboard();
  }

  ngAfterViewInit(): void {
    /** Redibuja el gráfico en cambio de tamaño */
    this.resizeListener = () => {
      if (this.chart) this.chart.resize();
    };
    window.addEventListener('resize', this.resizeListener);
  }

  ngOnDestroy(): void {
    if (this.resizeListener) {
      window.removeEventListener('resize', this.resizeListener);
    }
  }

  cargarDashboard(): void {
    this.dashboardService.getResumen().subscribe({
      next: (res: DashboardResumen) => {

        this.totalGasto = res.totalGasto;
        this.gastoMensual = res.gastoMensual;
        this.ordenesActivas = res.ordenesActivas;

        this.topProveedor = res.topProveedor?.nombre ?? '';
        this.topProveedorImporte = res.topProveedor?.total ?? 0;

        this.dataSource = res.ultimasOrdenes;

        this.evolucionLabels = res.evolucionMensual.map(x => x.mes);
        this.evolucionDatos  = res.evolucionMensual.map(x => x.total);

        this.loading = false;

        /** Asegurar que el canvas existe antes de pintar */
        setTimeout(() => this.dibujarGrafica(), 30);
      },
      error: (err) => {
        console.error('Error cargando dashboard:', err);
        this.loading = false;
      }
    });
  }

  dibujarGrafica(): void {
    const canvas = document.getElementById('gastoChart') as HTMLCanvasElement;
    if (!canvas) return;

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(canvas, {
      type: 'line',
      data: {
        labels: this.evolucionLabels,
        datasets: [{
          label: 'Gasto (€)',
          data: this.evolucionDatos,
          borderColor: '#3f3dff',
          backgroundColor: '#3f3dff33',
          fill: true,
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } }
      }
    });
  }

  onLogout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
