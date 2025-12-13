import { Component, OnInit } from '@angular/core';
import { UsersService, Usuario, UsersResponse } from './users.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  roles = [
    { nombre: 'Administrador', value: 'admin' },
    { nombre: 'Auditor', value: 'auditor' },
    { nombre: 'Consulta', value: 'user' }
  ];

  usuarios: Usuario[] = [];
  usuarioSeleccionado: Usuario = this.getUsuarioVacio();

  displayedColumns = ['nombre', 'apellidos', 'rol', 'acciones'];

  page = 1;
  perPage = 10;
  lastPage = 1;
  total = 0;

  filtroNombre: string = '';

  constructor(private usersService: UsersService) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }


  getUsuarioVacio(): Usuario {
    return {
      id: 0,
      name: '',
      email: '',
      role: '',
      nombre: '',
      apellidos: '',
      password: '',
      imagen: 'assets/user-default.png'
    };
  }

  cargarUsuarios(page: number = 1) {

    const params: any = { page, perPage: this.perPage };

    if (this.filtroNombre.trim() !== '') {
      params.search = this.filtroNombre.trim();
    }

    this.usersService.getUsuarios(params).subscribe({
      next: (resp: UsersResponse) => {


        this.usuarios = resp.data;

        this.page = resp.current_page;
        this.lastPage = resp.last_page;
        this.total = resp.total;
      },
      error: (err) => console.error("Error cargando usuarios:", err)
    });
  }

  buscarUsuario() {
    this.page = 1;
    this.cargarUsuarios(1);
  }

  siguiente() {
    if (this.page < this.lastPage) this.cargarUsuarios(this.page + 1);
  }

  anterior() {
    if (this.page > 1) this.cargarUsuarios(this.page - 1);
  }

  editarUsuario(usuario: Usuario) {
    this.usuarioSeleccionado = { 
      ...usuario,
      role: usuario.role
    };
  }

  nuevoUsuario() {
    this.usuarioSeleccionado = this.getUsuarioVacio();
  }

  guardarPerfil() {
    if (!this.usuarioSeleccionado.id) {
      this.crearUsuario();
    } else {
      this.actualizarUsuario();
    }
  }

  crearUsuario() {

    const payload = {
      nombre: this.usuarioSeleccionado.nombre,
      apellidos: this.usuarioSeleccionado.apellidos,
      email: this.usuarioSeleccionado.email,
      password: this.usuarioSeleccionado.password,
      role: this.usuarioSeleccionado.role
    };

    this.usersService.crearUsuario(payload).subscribe({
      next: () => {
        alert('Usuario creado correctamente');
        this.cargarUsuarios(1);
        this.nuevoUsuario();
      },
      error: () => alert('No se pudo crear el usuario.')
    });
  }

  actualizarUsuario() {

    const payload: any = {
      nombre: this.usuarioSeleccionado.nombre,
      apellidos: this.usuarioSeleccionado.apellidos,
      email: this.usuarioSeleccionado.email,
      role: this.usuarioSeleccionado.role
    };

    if (this.usuarioSeleccionado.password?.trim()) {
      payload.password = this.usuarioSeleccionado.password;
    }

    this.usersService.actualizarUsuario(this.usuarioSeleccionado.id!, payload).subscribe({
      next: () => {
        alert('Usuario actualizado correctamente');
        this.cargarUsuarios(1);
      },
      error: () => alert('No se pudo actualizar el usuario.')
    });
  }

  eliminarUsuario(usuario: Usuario) {
    if (!confirm(`¿Eliminar al usuario ${usuario.name}?`)) return;

    this.usersService.eliminarUsuario(usuario.id).subscribe({
      next: () => {
        alert('Usuario eliminado correctamente');
        this.cargarUsuarios(1);
      },
      error: () => alert('No se pudo eliminar el usuario.')
    });
  }

}
