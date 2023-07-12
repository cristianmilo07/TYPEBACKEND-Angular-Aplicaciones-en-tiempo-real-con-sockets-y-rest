import express from 'express';
import { SERVER_PORT } from '../global/environment';
import {Server as WSServer} from 'socket.io';
import http from 'http';

import * as socket from '../sockets/socket';

export default class Server {

    private static _intance: Server
    public app: express.Application;
    public port: number;
    public io;
    private httpServer: http.Server;

    private constructor(){
        this.app = express();
        this.port = SERVER_PORT;

        this.httpServer = this.httpServer = http.createServer(this.app);
        this.io = new WSServer(this.httpServer,
            {
                cors: {
                    credentials: true,
                }
            }); 

        this.escucharSockets();
    }

    public static get instance(){
        return this._intance || (this._intance = new this());

    }

    private escucharSockets(){
        console.log('Escuchando conexiones - sockets')
        this.io.on('connection', cliente => {
            console.log('Nuevo cliente conectado');

            //Conectar cliente
            socket.conectarCliente( cliente);

            //Configurar Usuario
            socket.configurarUsuario(cliente, this.io);

            //Mensajes
            socket.mensaje(cliente, this.io);

            //Desconectar
            socket.desconectar( cliente);

        })

    }
    
    start(callback: Function) {
        this.httpServer.listen( this.port, callback())
    }
}