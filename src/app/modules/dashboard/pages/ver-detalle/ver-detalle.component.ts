import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SolicitudesService } from '../../../../solicitudes.service';
import { RoleService } from '../../../auth/core/services/role.service';  

@Component({
  selector: 'app-ver-detalle',
  templateUrl: './ver-detalle.component.html',
  styleUrls: ['./ver-detalle.component.scss']
})
export class VerDetalleComponent implements OnInit {

  modoEdicion = false;
  id!: number;

  orden: any = {};

  proyectos = ['Proyecto A', 'Proyecto B', 'Proyecto C'];
  objetos = ['Servicio', 'Suministro', 'Obra'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private solicitudesService: SolicitudesService,
    public roleService: RoleService
  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));

    if (!this.id) {
      alert("ID inválido");
      this.router.navigate(['/dashboard/ordenes']);
      return;
    }

    this.cargarOrden();
  }

  cargarOrden() {
    this.solicitudesService.getSolicitud(this.id)
      .subscribe({
        next: (data: any) => {
          console.log("Detalle recibido:", data);

          // valores para el formulario
          this.orden = {
            num_OG: data.num_OG ?? '',
            usuario: data.usuario ?? '',
            codigo_proyecto: data.codigo_proyecto ?? '',
            cif_prov_final: data.cif_prov_final ?? '',
            nombre_prov_final: data.nombre_prov_final ?? '',
            concepto: data.concepto ?? '',
            importe: data.importe ?? 0,
            objeto: data.objeto ?? '',
            observaciones: data.observaciones ?? '',
            idsolicitudgasto: data.idsolicitudgasto
          };
        },
        error: (err: any) => {
          console.error("Error cargando detalle:", err);
          alert("No se pudo cargar la orden");
        }
      });
  }

  activarEdicion() {
    if (!this.roleService.puedeEditarSolicitud()) {
      alert("No tienes permisos para editar esta orden.");
      return;
    }
    this.modoEdicion = true;
  }

  cancelarEdicion() {
    this.modoEdicion = false;
    this.cargarOrden();
  }

  guardarCambios() {
    if (!this.roleService.puedeEditarSolicitud()) {
      alert("No tienes permisos para guardar cambios.");
      return;
    }

    this.solicitudesService.updateSolicitud(
      this.orden.idsolicitudgasto,
      this.orden
    ).subscribe({
      next: () => {
        alert('Orden actualizada correctamente');
        this.modoEdicion = false;
      },
      error: (err: any) => {
        console.error(err);
        alert('No se pudo actualizar la orden.');
      }
    });
  }
}
