import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone : true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrls: './login.css',
})

export class Login{
  usuario:string = "";
  password:string = "";
  errormensaje:string = "";

  onSubmit(){
    this.errormensaje = "";

    if(!this.usuario || !this.password) {
      this.errormensaje = "Usuario o contraseña incorrectos";
      return
}

console.log("Usuario: " + this.usuario);
console.log("Contraseña: " + this.password);
}

onOlvideMiPassword(){
  console.log('Flujo: olvidé mi contraseña');
}

onRegistrarse(){
  console.log('Navegar a registro');
}
}