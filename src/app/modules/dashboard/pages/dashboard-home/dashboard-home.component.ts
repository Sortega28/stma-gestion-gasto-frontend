import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { Router } from '@angular/router';
import { DashboardService, DashboardResumen } from '../../../../dashboard.service';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.scss']
})
export class DashboardHomeComponent implements OnInit, AfterViewInit {

  userName = '';
  loading = true;

  // Datos del dashboard
  totalGasto = 0;
  gastoMensual = 0;
  ordenesActivas = 0;
  topProveedor = '';
  topProveedorImporte = 0;

  // Tabla de últimas órdenes
  displayedColumns = ['estatus', 'solicitante', 'cif', 'proveedor', 'importe'];
  dataSource: any[] = [];

  // Gráfica evolución
  evolucionLabels: string[] = [];
  evolucionDatos: number[] = [];

  private chart?: Chart;

  constructor(
    private router: Router,
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    this.cargarDashboard();
  }

  cargarDashboard(): void {
    this.dashboardService.getResumen().subscribe({
      next: (res: DashboardResumen) => {

        // Guardamos datos
        this.totalGasto = res.totalGasto;
        this.gastoMensual = res.gastoMensual;
        this.ordenesActivas = res.ordenesActivas;

        this.topProveedor = res.topProveedor?.nombre ?? '';
        this.topProveedorImporte = res.topProveedor?.total ?? 0;

        this.dataSource = res.ultimasOrdenes;

        // Labels y valores para Chart.js
        this.evolucionLabels = res.evolucionMensual.map(x => x.mes);
        this.evolucionDatos  = res.evolucionMensual.map(x => x.total);

        this.loading = false;

        // Una vez cargado el dashboard, dibujamos la gráfica
        this.dibujarGrafica();
      },
      error: (err) => {
        console.error('Error cargando dashboard:', err);
        this.loading = false;
      }
    });
  }

  ngAfterViewInit(): void {
    // La gráfica se dibuja cuando los datos ya están cargados
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
