import { Socket } from 'socket.io';
import {Server as WSServer} from 'socket.io';
import { UsuariosLista } from '../classes/usuarios-lista';
import { Usuario } from '../classes/usuario';

export const usuariosConectados = new UsuariosLista();

export const conectarCliente = ( cliente: Socket, io: WSServer) => {

    const usuario = new Usuario( cliente.id );
    usuariosConectados.agregar(usuario);

}


export const desconectar = (cliente: Socket, io: WSServer) => {
    cliente.on('disconnect', ()=> {
        console.log('Cliente desconectado');
        usuariosConectados.borrarUsuario(cliente.id);
        io.emit('usuarios-activos', usuariosConectados.getLista())
    })

}

//Escuchar mensajes
export const mensaje = (cliente: Socket, io: WSServer)=>{
    cliente.on('mensaje', (payload: { de: string, cuerpo: string})=> {
        console.log('Mensaje recibido', payload)

        io.emit('mensaje-nuevo', payload);
    })
}

//Configurar usuario
export const configurarUsuario = (cliente: Socket, io: WSServer)=>{
    cliente.on('Configurar-usuario', (payload: { nombre: string}, callback:Function)=> {

        usuariosConectados.actualizarNombre(cliente.id, payload.nombre)
    
        io.emit('usuarios-activos', usuariosConectados.getLista())

    callback({
        ok: true,
        mensaje: `Usuario ${payload.nombre}, configurado`
     })
    })
}

//Obtener usuario
export const ObtenerUsuarios = (cliente: Socket, io: WSServer)=>{
    cliente.on('obtener-usuarios', ()=> {

    
        io.to(cliente.id).emit('usuarios-activos', usuariosConectados.getLista())

    });
}