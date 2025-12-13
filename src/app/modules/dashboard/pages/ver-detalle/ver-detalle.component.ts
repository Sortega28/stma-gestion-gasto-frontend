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

  tiposGasto = [
    { id: 1, nombre: 'Funcionamiento' },
    { id: 2, nombre: 'Inversiones' },
    { id: 3, nombre: 'Contratación Personal' },
    { id: 4, nombre: 'Dietas' },
    { id: 5, nombre: 'Funcionamiento Otros costes' },
    { id: 6, nombre: 'Subcontratación' },
    { id: 7, nombre: 'Reintegro' },
    { id: 8, nombre: 'Cargo Interno' },
    { id: 9, nombre: 'Resolución' },
    { id: 10, nombre: 'Dedicación personal propio' },
    { id: 11, nombre: 'Cargo interno servicios' },
    { id: 12, nombre: 'Cargo interno funcionamiento' },
    { id: 13, nombre: 'Cargo interno combustible' },
    { id: 14, nombre: 'Infraestructuras' },
    { id: 15, nombre: 'Reintegro servicios' },
    { id: 16, nombre: 'Reintegro funcionamiento' },
    { id: 17, nombre: 'Reintegro otros gastos' },
    { id: 18, nombre: 'Factura combustible' },
    { id: 19, nombre: 'Funcionamiento Servicios' },
    { id: 20, nombre: 'Funcionamiento Fungible' },
    { id: 21, nombre: 'Funcionamiento Viajes' },
  ];

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

          // datos EXACTOS que existen en la tabla
          this.orden = {
            idsolicitudgasto: data.idsolicitudgasto,
            num_OG: data.num_OG ?? '',
            usuario: data.usuario ?? '',
            codigo_proyecto: data.codigo_proyecto ?? '',
            cif_prov_final: data.cif_prov_final ?? '',
            nombre_prov_final: data.nombre_prov_final ?? '',
            concepto: data.concepto ?? '',
            importe: data.importe ?? 0,
            objeto: data.objeto ?? '',
            idtipo_gasto: data.idtipo_gasto ?? null,  
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

    if (!this.orden.idtipo_gasto) {
      alert("Debes seleccionar un tipo de gasto.");
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
