# API REST para Red Social

Este proyecto es una **API REST** para una red social, construida con **Node.js**, **Express** y **MongoDB**. Utiliza **JWT** para autenticación y permite gestionar usuarios, publicaciones y seguidores. Además, cuenta con un **script** que facilita el arranque de la base de datos y el servidor.

## Funcionalidades

- **Gestión de usuarios**: Registro, autenticación y gestión de datos de usuarios.
- **Publicaciones**: Creación, lectura y eliminación de publicaciones de los usuarios.
- **Seguidores**: Seguimiento de otros usuarios.

## Tecnologías Utilizadas

- **Backend**: Node.js, Express
- **Base de Datos**: MongoDB
- **Autenticación**: JWT (JSON Web Tokens)
- **Librerías**:
  - **Mongoose**: Para interactuar con MongoDB.
  - **Bcryptjs**: Para encriptar contraseñas.
  - **JWT**: Para la gestión de autenticación.

## Diseño de la Base de Datos

La base de datos está estructurada en tres entidades principales:  
1. **Usuarios**: Información de los usuarios registrados.  
2. **Publicaciones**: Contenido creado por los usuarios.  
3. **Seguidores**: Relación de los usuarios que siguen a otros.

Se pueden agregar más entidades como **Notificaciones**, **Mensajes**, **Comentarios**, entre otros.

![Diagrama de la Base de Datos](https://www.notion.so/API-REST-para-RED-SOCIAL-138ba628e3df8038b43df4853af3e576g)

## Instalación

1. Clona este repositorio:
   ```bash
   git clone https://github.com/JhimmiCalderon/api-rest-red-social.git
