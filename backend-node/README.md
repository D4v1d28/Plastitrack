Server Restful para el sistema



Requisitos Previos:

* Node.js (v18 o superior)
* MySQL Server (v8.0+)
* MySQL Workbench
* Thunder Client como extensión en VSCode para probar funciones GET y POST



\---Configuración el entorno local: ---

Una vez habiendo instalado Node.js y MySQL Workbench. 

Durante la instalación de MySQL Server haberlo aceptado como un servicio de Windows con la dirección y puerto por defecto.



\---Configurar la terminal de VSCode: ---

1. Dentro de VS Code, presiona la combinación de teclas Ctrl + Shift + P para abrir la paleta de comandos.
2. Escribe Terminal: Select Default Profile y presiona Enter.
3. Selecciona Command Prompt de la lista de opciones.
4. Haz clic en el ícono del bote de basura en la esquina de la terminal actual para cerrarla.
5. Abre una nueva terminal (`Ctrl + Shift + `` o desde el menú Terminal > New Terminal).



Para verificar que el cambio funcionó ejecutar en una nueva terminal en VSCode:

npm -v

(Debe mostrar la versión npm ejemplo: 10.8.2 sin mostrar mensajes de error)





Ejecutar en terminal los siguientes comandos para instalar librerías para API REST, Autenticación JWT y conexión a MySQL 

"npm install express mysql2 dotenv cors jsonwebtoken bcryptjs" 

Herramienta de desarrollo (reinicios automáticos al guardar cambios)

"npm install --save-dev nodemon" 





Finalizando

Extraer los archivos de la carpeta backend-node (11,13 y 14)

Abrir la carpeta de estos archivos en VSCode y renombrar el archivo ".env.example" a ".env" desde VSCode.

De ser necesario modificar las credenciales (en el mismo archivo .env) de MySQL según las establecidas al instalar MySQL. (DB\_USER, DB\_PASSWORD y DB\_PORT en caso de usar otro que no sea el por defecto "3306")

Guardar todos los archivos una vez habiendo modificado las credenciales personales de MySQL





\---Levantar el servidor: ---

En terminal ejecutar:

"npm run dev" 

para inicializar el servidor (debe mostrar ✅ Conexión exitosa a la base de datos MySQL (plastitrack))

Probar el server en Thunder Client:

Una vez instalado la extensión ThunderClient en VSCode aparecerá un rayo en la barra lateral izquierda. 

Con el servidor corriendo hacer click en new request y agregar la dirección en GET "http://localhost:3000/api/health"

al enviarlo devolverá un mensaje 

{

&#x20; "status": "OK",

&#x20; "message": "Servidor y BD activos",

&#x20; "testQuery": {

&#x20;   "resultado": 2

&#x20; }

}

\--- Levantar el servidor Frontend: ---


Una vez descomprimida la carpeta del frontend 
En VSCode File -> Open folder -> Seleccionar plastitrack-frontend

Abrir una terminal nueva y escribir el comando:
"flutter pub add image_picker"
"flutter pub get"

Una vez instaladas las dependencias del Flutter:
"flutter run -d web-server --web-port 8080"
abrira el simulador en el puerto 8080
acceder a el desde cualquier navegador ingresando la Url: http://localhost:8080
Para poder visualizar el frontend primero se debe levantar el servidor del backend.


\--- Base de datos: ---
para poder visualizar los cambios en la base de datos nueva se tendra que abrir MySQL Workbench
En la pantalla inicial en la parte de MySQL Connections deberá aparecer una conexión predeterminada al haber instalado MySQL server como servicio de Windows con la dirección y puerto por defecto.
Si no es el caso, crear una conexión con los datos por defecto.

Entrar a la conexión con la contraseña establecida al instalar MySQL server y Workbench
una vez dentro hacer clic en 
File -> Open SQL script -> Seleccionar plastitrack_db (la nueva BDD "Temporal")
y dar clic en el icono del rayo.

Para ver que se haya creado
Dar clic derecho en Schemas (lateral izquierdo) -> Refresh all
y aparecera la BDD 

Se puede cambiar el código de la BDD agregando nuevos usuarios personalizados en la parte final del código si gustan q:

ya para ver si cambian las entradas de merma en la bdd hacer una peticion en una New Query Tab de la tabla merma una vez realizado entradas en el front



\---Orden final del Directorio del Backend: ---
plastitrack-backend/
├── src
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── paroController.js
│   │   ├── mermaController.js
│   │   ├── produccionController.js
│   │   └── reporteController.js
│   ├── middlewares/
│   │   └── authMiddleware.js
│   ├── routes/
│   │   ├── paroRoutes.js
│   │   ├── authRoutes.js
│   │   ├── mermaRoutes.js
│   │   ├── produccionRoutes.js
│   │   └── reporteRoutes.js
│   ├── uploads/  
│   │   └── merma-1790236765754-888205563.png
│   └── index.js
├── .env          
└── package.json
└── plastitrack_db.sql










