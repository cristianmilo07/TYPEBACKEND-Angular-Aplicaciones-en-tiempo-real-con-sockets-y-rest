import Server from "./classes/server";
import router from "./routes/router";
import bodyParser from "body-parser";
import cors from "cors";

const server = Server.instance;

//bodyParser
server.app.use( bodyParser.urlencoded({ extended: true }));
server.app.use( bodyParser.json());

//CORS
server.app.use( cors({ origin:true, credentials: true }));

//Rutas de servicio
server.app.use('/', router);

 server.start(() => {
    console.log(`servidor corriendo en el puerto ${server.port}`)
 });