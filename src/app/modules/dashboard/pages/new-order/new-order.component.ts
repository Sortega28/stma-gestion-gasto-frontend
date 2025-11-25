import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RoleService } from '../../../auth/core/services/role.service';   

@Component({
  selector: 'app-new-order',
  templateUrl: './new-order.component.html',
  styleUrls: ['./new-order.component.scss']
})
export class NewOrderComponent {

  form: FormGroup;

  proyectos = ['Proyecto A', 'Proyecto B', 'Proyecto C'];
  objetos = ['Material', 'Servicio', 'Obra'];

  constructor(
    private fb: FormBuilder,
    public roleService: RoleService    
  ) {
    this.form = this.fb.group({
      numero: ['AUTOFILL'],
      solicitante: [''],
      proyecto: [''],
      cif: [''],
      proveedor: [''],
      concepto: [''],
      importe: [''],
      objeto: [''],
      observaciones: ['']
    });
  }

  guardar() {
    console.log("Formulario enviado:", this.form.value);
    alert('Orden guardada (simulado)');
  }
}
