import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RoleService } from '../../../auth/core/services/role.service';
import { SolicitudesService } from '../../../../solicitudes.service';

@Component({
  selector: 'app-new-order',
  templateUrl: './new-order.component.html',
  styleUrls: ['./new-order.component.scss']
})
export class NewOrderComponent {

  form: FormGroup;

  proyectos = ['Proyecto A', 'Proyecto B', 'Proyecto C'];
  objetos = ['Suministro', 'Servicio', 'Obra'];

 
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
    private fb: FormBuilder,
    public roleService: RoleService,
    private solicitudesService: SolicitudesService
  ) {
    this.form = this.fb.group({
      codigo_proyecto: [''],
      cif_prov_final: ['', Validators.required],
      nombre_prov_final: ['', Validators.required],
      concepto: [''],
      importe: ['', Validators.required],
      objeto: ['', Validators.required],
      idtipo_gasto: ['', Validators.required] 
    });
  }

  guardar() {
    if (this.form.invalid) {
      alert('Completa los campos obligatorios');
      return;
    }

    this.solicitudesService.crearSolicitud(this.form.value).subscribe({
      next: (res) => {
        console.log('Solicitud creada:', res);
        alert('Solicitud creada correctamente');
        this.form.reset();
      },
      error: (err) => {
        console.error(err);
        alert('Error al crear la solicitud');
      }
    });
  }
}
