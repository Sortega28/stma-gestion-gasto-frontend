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
    { nombre: 'Gestor', value: 'auditor' },
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

  // Usuario vacío
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

        this.usuarios = resp.data.map(u => {
          const partes = u.name.trim().split(' ');
          return {
            ...u,
            nombre: partes[0] || '',
            apellidos: partes.slice(1).join(' '),
            rol: u.role,     
            role: u.role     
          };
        });

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
      rol: usuario.role,   
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

    let nombre = (this.usuarioSeleccionado.nombre || '').trim();
    let apellidos = (this.usuarioSeleccionado.apellidos || '').trim();

    const nameCompleto = apellidos !== ''
      ? `${nombre} ${apellidos}` : nombre;

    const payload = {
      name: nameCompleto.trim(),
      email: this.usuarioSeleccionado.email,
      password: this.usuarioSeleccionado.password,
      role: this.usuarioSeleccionado.rol  
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

    let nombre = (this.usuarioSeleccionado.nombre || '').trim();
    let apellidos = (this.usuarioSeleccionado.apellidos || '').trim();

    if (!nombre) {
      nombre = this.usuarioSeleccionado.name.split(' ')[0];
    }

    const nameCompleto = apellidos !== ''
      ? `${nombre} ${apellidos}`
      : nombre;

    const payload: any = {
      name: nameCompleto.trim(),
      email: this.usuarioSeleccionado.email,
      role: this.usuarioSeleccionado.rol || this.usuarioSeleccionado.role 
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
