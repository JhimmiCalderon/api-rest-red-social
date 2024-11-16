// Importar dependencias y modulos
const bcrypt = require("bcrypt");
const mongoosePaginate = require("mongoose-pagination");

// Importar modelo
const User = require("../models/user");
const { params } = require("../routes/user");

// Importar Servicios
const jwt =require("../services/jwt");
const user = require("../models/user");

// Acciones de pruebas
const pruebaUser = (req, res) => {
  return res.status(200).send({
    message: "Mensaje enviado desde: controllers/user.js",
    Usuario: req.user // Devolver todo los datos 
  });
};

// Registro de usuarios
const register = async (req, res) => {
  // Recoger datos de la peticion
  let params = req.body;

  try {
    // Comprobar que me llagan bien (+ validacion)
    if (!params.name || !params.email || !params.password || !params.nick) {
      return res.status(400).json({
        status: "error",
        message: "Faltan datos obligatorios",
      });
    }

    // Control de usuarios duplicados
    const existingUser = await User.findOne({
      $or: [
        { email: params.email.toLowerCase() },
        { nick: params.nick.toLowerCase() },
      ],
    });

    if (existingUser) {
      return res.status(404).json({
        status: "error",
        message: "El correo o el nick ya están en uso",
      });
    }

    // Cifrar la contraseña
    let pwd = await bcrypt.hash(params.password, 10); // Corrección: ajuste del factor de coste a 10 (recomendado para bcrypt)
    params.password = pwd; // Asigna la contraseña cifrada al objeto `params`

    // Crear objeto de usuario
    let user_save = new User(params); // Para crear nuevo usuario en memoria

    // Guardar usuario en la BD
    const newUser = await user_save.save(); // Uso de `await` para guardar el usuario y esperar el resultado

    // Devolver resultado
    return res.status(200).json({
      status: "succes",
      message: "Accion  de registro de usuarios",
      user: newUser, // Devolver el usuario recién creado
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      estatus: "error",
      message: "Ocurrió un error al registrar el usuario",
    });
  }
};

/*----------------------------------------------------------------------------------------------------------------------*/
// Metodo login
const login = async (req, res) => {
  // Cundo le pasemos la credenciales correctas va a devolver los datos del usuario si es correcto o un token de JWT
  // Recoger parametros body
  let params = req.body;

  try {
    if (!params.email || !params.password) {
      return res.status(400).send({
        status: "error",
        message: "Faltan datos por enviar",
      });
    }

    // Buscar en la BD si existe
    const loginUser = await User
      .findOne({ email: params.email });
      

    // Verificar si el usuario no existe
    if (!loginUser) {
      return res.status(404).json({
        status: "error",
        message: "Usuario no encontrado. Verifica tu correo electrónico.",
      });
    }

    // Comprobar su contraseña
    // Comparar la contraseña ingresada con la almacenada (asíncrono)
    const pwdMatch = await bcrypt.compare(params.password, loginUser.password);

    if (!pwdMatch) {
      return res.status(400).send({
        status: "error",
        message: "No te has identificado correctamente",
      });
    }

    // Devolver Token
    const token = jwt.crateToken(loginUser);

 
    // Devolver Datos del usuario

    return res.status(200).send({
      status: "success",
      message: "Te has identificado correctamente",
      loginUser: {
        id: loginUser._id,
        name: loginUser.name,
        nick: loginUser.nick,
      },
      // Para devolver el token
      token 
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      status: "error",
      message: "Ocurrió un error interno en el servidor",
    });
  }
};
/*----------------------------------------------------------------------------------------------------------------------*/

const profile = async (req, res) => {
  try {
    // Recibir el parámetro del id de usuario por la URL
    const id = req.params.id;

    // Consulta para obtener los datos del usuario
    const userProfile = await User.findById(id)
    .select("-password -role") // Excluir los campos "password" y "role"
    .exec();

    // Verificar si el usuario no existe
    if (!userProfile) {
      return res.status(404).send({
        status: "error",
        message: "El usuario no existe",
      });
    }

    // Devolver el resultado
    // Posteriormente: devolver informacion de follows
    return res.status(200).send({
      status: "success",
      user: userProfile,
    });
  } catch (error) {
    // Manejo de errores en caso de fallo en la consulta u otro problema
    return res.status(500).send({
      status: "error",
      message: "Ocurrió un error al obtener el perfil del usuario",
      error: error.message, // Devuelve el mensaje de error para debugging
    });
  }
};
/*----------------------------------------------------------------------------------------------------------------------*/
// Metodo listar
const list = async (req, res) => {
  try {
    // Página y elementos por página
    const page = parseInt(req.params.pag) || 1;
    const itemsPerPage = 5;

    // Consulta con exclusión de campos sensibles
    const users = await User.find({}, '-password -role')
      .sort({ _id: 1 }) // Ordenar por _id ascendente
      .skip((page - 1) * itemsPerPage) // Calcular elementos a omitir
      .limit(itemsPerPage); // Limitar el número de resultados

    // Total de documentos para calcular páginas
    const total = await User.countDocuments();

    // Devolver resultado
    return res.status(200).send({
      status: "success",
      users,
      page,
      total,
      itemsPerPage,
      totalPages: Math.ceil(total / itemsPerPage),
    });
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "Ocurrió un error al obtener el listado de usuarios",
    });
  }
};
/*----------------------------------------------------------------------------------------------------------------------*/
// Metodo Editar
const update = async (req, res) => {
  // Recoger info del usuario a actualizar
  let userIdentity = req.user;
  let userToUpdate = req.body;

  // Eliminar campos sobrantes
  delete userToUpdate.iat;
  delete userToUpdate.exp;
  delete userToUpdate.role;
  delete userToUpdate.image;

  // Validar que email y nick existen
  if (userToUpdate.email) {
    userToUpdate.email = userToUpdate.email.toLowerCase();
  }
  if (userToUpdate.nick) {
    userToUpdate.nick = userToUpdate.nick.toLowerCase();
  }

  try {
    // Comprobar si el usuario ya existe
    const users = await User.find({
      $or: [
        { email: userToUpdate.email },
        { nick: userToUpdate.nick },
      ],
    });

    let userIsset = false;
    let existingUser = null;

    // Verificar si el usuario ya existe y no es el mismo que está haciendo la actualización
    users.forEach(user => {
      if (user && user._id != userIdentity.id) {
        userIsset = true;
        existingUser = user; // Guardar el usuario existente
      }
    });

    if (userIsset) {
      // Si el usuario ya existe, devolver los datos del usuario existente con un mensaje
      return res.status(200).send({
        status: "success",
        message: "El usuario ya existe",
        user: existingUser, // Devolver los datos del usuario existente
      });
    }

    // Cifrar la contraseña si es necesario
    if (userToUpdate.password) {
      let pwd = await bcrypt.hash(userToUpdate.password, 10); // Recomendación: factor de coste 10
      userToUpdate.password = pwd; // Asigna la contraseña cifrada al objeto `userToUpdate`
    }

    // Buscar y actualizar el usuario
    const userUpdated = await User.findByIdAndUpdate(userIdentity.id, userToUpdate, { new: true });

    if (!userUpdated) {
      return res.status(400).send({ status: "error", 
        message: "Error al actualizar usuario" });
    }

    // Devolver respuesta de éxito con el usuario actualizado
    return res.status(200).send({
      status: "success",
      message: "Método de actualizar usuario",
      user: userUpdated, // Enviar los datos del usuario actualizado
    });

  } catch (error) {
    return res.status(500).send({
       status: "error", 
       message: "error al actualizar",
       });
  }
};


/*----------------------------------------------------------------------------------------------------------------------*/
// Metodo Subir archivos

const upload = async (req, res) =>{
  try{

    // Recoger el fichero de imagen y comprobar que existe

    // Conseguir el nombre del archivo

    // Sacara la extension del archivo

    // Comprobar  extension

    // Si no es correcto, borrar archivo

    // si es correcta, guardar imagen en BD

    // Devolver repuesta

    return res.status(200).send({
      status: "success",
      message: "Subir imagen",
      user: req.user,
      file: req.file,
      files: req.files
    })

  }catch(error){
    return res.status(500).send({
      status: "error",
      message
    })
  }
}

// Exportar acciones

module.exports = {
  pruebaUser,
  register,
  login,
  profile,
  list,
  update,
  upload

};
