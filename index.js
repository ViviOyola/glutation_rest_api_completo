const express = require('express');
const app = express();
const port = process.env.PORT || 3001; // Puedes cambiar el puerto si lo deseas

/**
 * @swagger
 * components:
 *   schemas:
 *     Usuario:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Identificador único del usuario.
 *           example: 1
 *         nombre:
 *           type: string
 *           description: Nombre completo del usuario.
 *           example: "Ana Pérez"
 *         correo:
 *           type: string
 *           format: email
 *           description: Correo electrónico del usuario.
 *           example: "ana.perez@example.com"
 *         telefono:
 *           type: string
 *           description: Número de teléfono del usuario.
 *           example: "3001234567"
 *         direccion:
 *           type: string
 *           description: Dirección de residencia del usuario.
 *           example: "Calle Falsa 123, Ciudad Ejemplo"
 *         password:
 *           type: string
 *           description: Contraseña del usuario (en un sistema real, esto sería un hash).
 *           example: "securePassword123"
 *     Producto:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Identificador único del producto.
 *           example: "P001"
 *         nombre:
 *           type: string
 *           description: Nombre del producto.
 *           example: "Glutation Premium"
 *         descripcion:
 *           type: string
 *           description: Descripción detallada del producto.
 *           example: "Suplemento de glutation de alta calidad."
 *         precio:
 *           type: number
 *           format: float
 *           description: Precio del producto.
 *           example: 29.99
 *         imagen:
 *           type: string
 *           description: URL de la imagen del producto.
 *           example: "url_imagen_glutation_premium.jpg"
 *         beneficios:
 *           type: string
 *           description: Beneficios clave del producto.
 *           example: "Antioxidante, refuerza el sistema inmunológico, desintoxicante."
 *     Pedido:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Identificador único del pedido.
 *           example: 101
 *         clienteId:
 *           type: integer
 *           description: ID del cliente que realizó el pedido.
 *           example: 1
 *         productosPedido:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               productoId:
 *                 type: string
 *                 example: "P001"
 *               cantidad:
 *                 type: integer
 *                 example: 2
 *         direccionEntrega:
 *           type: string
 *           description: Dirección de entrega del pedido.
 *           example: "Calle Falsa 123, Ciudad Ejemplo"
 *         fechaPedido:
 *           type: string
 *           format: date-time
 *           description: Fecha y hora en que se realizó el pedido.
 *         estado:
 *           type: string
 *           description: Estado actual del pedido.
 *           enum: ["pendiente", "en proceso", "enviado", "entregado", "cancelado"]
 *           example: "pendiente"
 *     SolicitudContacto:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         nombre:
 *           type: string
 *           example: "Carlos Ruiz"
 *         correo:
 *           type: string
 *           format: email
 *           example: "carlos.ruiz@example.com"
 *         asunto:
 *           type: string
 *           example: "Información Adicional"
 *         mensaje:
 *           type: string
 *           example: "Quisiera más detalles sobre los envíos."
 *         fecha:
 *           type: string
 *           format: date-time
 */

app.use(express.json())

// Simulación de base de datos en memoria para usuarios registrados
const usuariosRegistrados = [
    { id: 1, nombre: "Usuario Uno", correo: "usuario1@example.com", telefono: "1234567890", direccion: "Calle Falsa 123", password: "password1" },
    { id: 2, nombre: "Usuario Dos", correo: "usuario2@example.com", telefono: "0987654321", direccion: "Avenida Siempre Viva 742", password: "password2" },
    { id: 3, nombre: "Test User", correo: "test@example.com", telefono: "5555555555", direccion: "Boulevard de los Sueños Rotos", password: "password123" },
];
let nextUserId = 4; // Para generar IDs únicos para nuevos usuarios

// Simulación de base de datos en memoria para productos
const productos = [
    {
        id: "P001",
        nombre: "Glutation Premium",
        descripcion: "Suplemento de glutation de alta calidad.",
        precio: 29.99,
        imagen: "url_imagen_glutation_premium.jpg",
        beneficios: "Antioxidante, refuerza el sistema inmunológico, desintoxicante."
    },
    {
        id: "P002",
        nombre: "Glutation Plus",
        descripcion: "Fórmula avanzada con vitaminas y minerales.",
        precio: 39.99,
        imagen: "url_imagen_glutation_plus.jpg",
        beneficios: "Mayor absorción, energía celular, protección contra radicales libres."
    },
    {
        id: "P003",
        nombre: "Glutation Esencial",
        descripcion: "Glutation puro para el bienestar diario.",
        precio: 24.99,
        imagen: "url_imagen_glutation_esencial.jpg",
        beneficios: "Soporte antioxidante básico, mejora la piel."
    }
];

let nextSolicitudId = 1; // Para generar IDs únicos para nuevas solicitudes de contacto
const solicitudesContacto = [];
let nextPedidoId = 1; // Para generar IDs únicos para nuevos pedidos
const pedidos = [];

/**
 * @swagger
 * /:
 *   get:
 *     summary: Ruta raíz de la API.
 *     description: Devuelve un mensaje de bienvenida y la lista actual de usuarios registrados (solo para demostración).
 *     responses:
 *       200:
 *         description: Mensaje de bienvenida y datos.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "¡Bienvenido a la API REST de Glutation!"
 *                 usuariosActuales:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Usuario'
 */
app.get('/', (req, res) => {
  res.status(200).json({
    message: '¡Bienvenido a la API REST de Glutation!',
    usuariosActuales: usuariosRegistrados 
  });
});

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Inicia sesión de un usuario.
 *     description: Autentica a un usuario basado en correo y contraseña.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - correo
 *               - password
 *             properties:
 *               correo:
 *                 type: string
 *                 format: email
 *                 example: "usuario1@example.com"
 *               password:
 *                 type: string
 *                 example: "password1"
 *     responses:
 *       200:
 *         description: Autenticación satisfactoria.
 *       400:
 *         description: Faltan campos (correo y/o contraseña).
 *       401:
 *         description: Correo o contraseña incorrectos.
 */
app.post("/login", (req, res) =>  {
  const {correo, password} = req.body

  if(!correo || !password) {
    return res.status(400).json({message: "Error en la autenticación: Faltan campos (correo y/o contraseña)."});
  }
  
  const usuarioEncontrado = usuariosRegistrados.find(user => user.correo === correo);

  if (!usuarioEncontrado || usuarioEncontrado.password !== password) {
    return res.status(401).json({message: "Error en la autenticación: Correo o contraseña incorrectos."});
  }

  res.status(200).json({message: "Autenticación satisfactoria."});
});

/**
 * @swagger
 * /logout:
 *   post:
 *     summary: Cierra la sesión del usuario.
 *     description: En una implementación real con tokens, esto invalidaría el token del lado del servidor si es necesario. Aquí, solo devuelve un mensaje de éxito.
 *     responses:
 *       200:
 *         description: Sesión cerrada exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Sesión cerrada exitosamente."
 */
app.post("/logout", (req, res) => {
    // En una aplicación real con tokens JWT, aquí podrías añadir el token a una blacklist
    // o realizar alguna otra acción para invalidar la sesión del lado del servidor.
    // Para esta simulación, simplemente devolvemos un mensaje de éxito.
    res.status(200).json({ message: "Sesión cerrada exitosamente." });
});

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Registra un nuevo usuario.
 *     description: Crea una nueva cuenta de usuario con los datos proporcionados.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - correo
 *               - telefono
 *               - direccion
 *               - password
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Nuevo Usuario"
 *               correo:
 *                 type: string
 *                 format: email
 *                 example: "nuevo@example.com"
 *               telefono:
 *                 type: string
 *                 example: "3109876543"
 *               direccion:
 *                 type: string
 *                 example: "Avenida Central 456"
 *               password:
 *                 type: string
 *                 example: "newPassword456"
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 usuario:
 *                   $ref: '#/components/schemas/Usuario'
 *       400:
 *         description: Error en el registro debido a campos faltantes o formato de correo inválido.
 *       409:
 *         description: El correo electrónico ya está registrado.
 */
app.post("/register", (req, res) => {
    const EmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const {nombre, correo, telefono, direccion, password} = req.body;
  
    if(!password){
        return res.status(400).json({message: "Error en el registro: Falta el campo password.", status: 400});
    }
    if(!nombre){
        return res.status(400).json({message: "Error en el registro: Falta el campo nombre.", status: 400});
    }
    if(!telefono){
        return res.status(400).json({message: "Error en el registro: Falta el campo telefono.", status: 400});
    }
    if(!direccion){
        return res.status(400).json({message: "Error en el registro: Falta el campo direccion.", status: 400});
    }
    
    if(!correo || !EmailRegex.test(correo)){
        return res.status(400).json({message: "Error en el registro: Falta el campo correo o el formato del email es inválido.", status: 400});
    }

    const usuarioExistente = usuariosRegistrados.find(user => user.correo === correo);
    if (usuarioExistente) {
        return res.status(409).json({message: "Error en el registro: El correo electrónico ya está registrado.", status: 409});
    }

    const nuevoUsuario = {
        id: nextUserId++,
        nombre,
        correo,
        telefono,
        direccion,
        password 
    };
    usuariosRegistrados.push(nuevoUsuario);
    
    res.status(201).json({message: "Usuario registrado exitosamente.", usuario: nuevoUsuario });
});

/**
 * @swagger
 * /productos:
 *   get:
 *     summary: Obtiene la lista de todos los productos.
 *     description: Retorna un arreglo con todos los productos disponibles.
 *     responses:
 *       200:
 *         description: Lista de productos obtenida exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Producto'
 */
app.get("/productos", (req, res) => {
    res.status(200).json(productos);
});

/**
 * @swagger
 * /contacto:
 *   post:
 *     summary: Envía un formulario de contacto o solicitud de información.
 *     description: Permite a los usuarios enviar consultas, preguntas o solicitudes a través de un formulario.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - correo
 *               - asunto
 *               - mensaje
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Ana Pérez"
 *               correo:
 *                 type: string
 *                 format: email
 *                 example: "ana.perez@example.com"
 *               asunto:
 *                 type: string
 *                 example: "Consulta sobre Glutation Premium"
 *               mensaje:
 *                 type: string
 *                 example: "Me gustaría saber más sobre los ingredientes y el modo de uso."
 *     responses:
 *       201:
 *         description: Solicitud de contacto enviada exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Solicitud de contacto recibida exitosamente."
 *                 solicitud:
 *                   $ref: '#/components/schemas/SolicitudContacto'
 *       400:
 *         description: Error en la solicitud, faltan campos o el correo es inválido.
 */
app.post("/contacto", (req, res) => {
    const EmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const { nombre, correo, asunto, mensaje } = req.body;

    if (!nombre || !correo || !asunto || !mensaje) {
        return res.status(400).json({ message: "Error en la solicitud: Faltan campos (nombre, correo, asunto y/o mensaje).", status: 400 });
    }

    if (!EmailRegex.test(correo)) {
        return res.status(400).json({ message: "Error en la solicitud: El formato del correo electrónico es inválido.", status: 400 });
    }

    const nuevaSolicitud = {
        id: nextSolicitudId++,
        nombre,
        correo,
        asunto,
        mensaje,
        fecha: new Date().toISOString()
    };

    solicitudesContacto.push(nuevaSolicitud);

    res.status(201).json({ message: "Solicitud de contacto recibida exitosamente.", solicitud: nuevaSolicitud });
});

/**
 * @swagger
 * /pedidos:
 *   post:
 *     summary: Registra un nuevo pedido de productos.
 *     description: Permite a un cliente registrado realizar un pedido de uno o más productos.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - clienteId
 *               - productosPedido
 *               - direccionEntrega
 *             properties:
 *               clienteId:
 *                 type: integer
 *                 description: ID del usuario que realiza el pedido.
 *                 example: 1
 *               productosPedido:
 *                 type: array
 *                 description: Lista de productos y cantidades.
 *                 items:
 *                   type: object
 *                   required:
 *                     - productoId
 *                     - cantidad
 *                   properties:
 *                     productoId:
 *                       type: string
 *                       description: ID del producto.
 *                       example: "P001"
 *                     cantidad:
 *                       type: integer
 *                       description: Cantidad del producto.
 *                       example: 2
 *               direccionEntrega:
 *                 type: string
 *                 description: Dirección de entrega para el pedido.
 *                 example: "Calle Falsa 123, Ciudad Ejemplo"
 *     responses:
 *       201:
 *         description: Pedido registrado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Pedido registrado exitosamente."
 *                 pedido:
 *                   $ref: '#/components/schemas/Pedido'
 *       400:
 *         description: Error en la solicitud (datos faltantes, ID de cliente inválido, ID de producto inválido, cantidad inválida).
 *       404:
 *         description: Cliente o producto no encontrado.
 */
app.post("/pedidos", (req, res) => {
    const { clienteId, productosPedido, direccionEntrega } = req.body;

    if (!clienteId || !productosPedido || !Array.isArray(productosPedido) || productosPedido.length === 0 || !direccionEntrega) {
        return res.status(400).json({ message: "Error en la solicitud: Faltan campos obligatorios (clienteId, productosPedido, direccionEntrega) o productosPedido está vacío." });
    }

    const cliente = usuariosRegistrados.find(u => u.id === clienteId);
    if (!cliente) {
        return res.status(404).json({ message: "Error en el pedido: Cliente no encontrado." });
    }

    for (const item of productosPedido) {
        if (!item.productoId || !item.cantidad || typeof item.cantidad !== 'number' || item.cantidad <= 0) {
            return res.status(400).json({ message: "Error en la solicitud: Cada producto en productosPedido debe tener productoId y una cantidad positiva." });
        }
        const productoExistente = productos.find(p => p.id === item.productoId);
        if (!productoExistente) {
            return res.status(404).json({ message: `Error en el pedido: Producto con ID '${item.productoId}' no encontrado.` });
        }
    }

    const nuevoPedido = {
        id: nextPedidoId++,
        clienteId,
        productosPedido, 
        direccionEntrega,
        fechaPedido: new Date().toISOString(),
        estado: "pendiente" 
    };

    pedidos.push(nuevoPedido);
    res.status(201).json({ message: "Pedido registrado exitosamente.", pedido: nuevoPedido });
});

/**
 * @swagger
 * /admin/usuarios:
 *   get:
 *     summary: (Admin) Obtiene la lista de todos los usuarios registrados.
 *     description: Retorna un arreglo con todos los usuarios. Debería ser accesible solo por administradores.
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Usuario'
 */
app.get("/admin/usuarios", (req, res) => {
    res.status(200).json(usuariosRegistrados);
});

/**
 * @swagger
 * /admin/usuarios/{id}:
 *   put:
 *     summary: (Admin) Actualiza la información de un usuario existente.
 *     description: Permite al administrador actualizar nombre, correo, teléfono y dirección de un usuario. La contraseña no se actualiza por esta vía.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID numérico del usuario a actualizar.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               correo:
 *                 type: string
 *                 format: email
 *               telefono:
 *                 type: string
 *               direccion:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       400:
 *         description: Datos de entrada inválidos (ej. formato de correo).
 *       404:
 *         description: Usuario no encontrado.
 *       409:
 *         description: El correo electrónico ya está en uso por otro usuario.
 */
app.put("/admin/usuarios/:id", (req, res) => {
    const { id } = req.params;
    const { nombre, correo, telefono, direccion } = req.body;
    const EmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const usuarioIndex = usuariosRegistrados.findIndex(u => u.id === parseInt(id));

    if (usuarioIndex === -1) {
        return res.status(404).json({ message: "Usuario no encontrado." });
    }

    if (correo && !EmailRegex.test(correo)) {
        return res.status(400).json({ message: "Error en la actualización: El formato del correo electrónico es inválido." });
    }

    if (nombre) usuariosRegistrados[usuarioIndex].nombre = nombre;
    if (correo) {
        const correoExistente = usuariosRegistrados.find(u => u.correo === correo && u.id !== parseInt(id));
        if (correoExistente) {
            return res.status(409).json({ message: "Error en la actualización: El correo electrónico ya está registrado por otro usuario." });
        }
        usuariosRegistrados[usuarioIndex].correo = correo;
    }
    if (telefono) usuariosRegistrados[usuarioIndex].telefono = telefono;
    if (direccion) usuariosRegistrados[usuarioIndex].direccion = direccion;

    res.status(200).json(usuariosRegistrados[usuarioIndex]);
});

/**
 * @swagger
 * /admin/usuarios/{id}:
 *   delete:
 *     summary: (Admin) Elimina un usuario.
 *     description: Permite al administrador eliminar un usuario por su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID numérico del usuario a eliminar.
 *     responses:
 *       200:
 *         description: Usuario eliminado exitosamente.
 *       404:
 *         description: Usuario no encontrado.
 */
app.delete("/admin/usuarios/:id", (req, res) => {
    const { id } = req.params;
    const usuarioIndex = usuariosRegistrados.findIndex(u => u.id === parseInt(id));

    if (usuarioIndex === -1) {
        return res.status(404).json({ message: "Usuario no encontrado." });
    }

    usuariosRegistrados.splice(usuarioIndex, 1);
    res.status(200).json({ message: "Usuario eliminado exitosamente." });
});

/**
 * @swagger
 * /admin/pedidos:
 *   get:
 *     summary: (Admin) Obtiene la lista de todos los pedidos.
 *     description: Retorna un arreglo con todos los pedidos realizados. Debería ser accesible solo por administradores.
 *     responses:
 *       200:
 *         description: Lista de pedidos obtenida exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Pedido'
 */
app.get("/admin/pedidos", (req, res) => {
    res.status(200).json(pedidos);
});

/**
 * @swagger
 * /admin/pedidos/{id}:
 *   put:
 *     summary: (Admin) Actualiza el estado de un pedido.
 *     description: Permite al administrador actualizar el estado de un pedido existente.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID numérico del pedido a actualizar.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - estado
 *             properties:
 *               estado:
 *                 type: string
 *                 description: Nuevo estado del pedido.
 *                 enum: ["pendiente", "en proceso", "enviado", "entregado", "cancelado"]
 *                 example: "en proceso"
 *     responses:
 *       200:
 *         description: Estado del pedido actualizado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pedido'
 *       400:
 *         description: Estado no proporcionado o inválido.
 *       404:
 *         description: Pedido no encontrado.
 */
app.put("/admin/pedidos/:id", (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;
    const { direccionEntrega } = req.body;

    const validStatuses = ["pendiente", "en proceso", "enviado", "entregado", "cancelado"];

    if (!estado) {
        return res.status(400).json({ message: "Error en la actualización: Falta el campo 'estado'." });
    }

    if (!validStatuses.includes(estado)) {
        return res.status(400).json({ message: `Error en la actualización: El estado '${estado}' no es válido. Estados permitidos: ${validStatuses.join(", ")}.` });
    }

    const pedidoIndex = pedidos.findIndex(p => p.id === parseInt(id));

    if (pedidoIndex === -1) {
        return res.status(404).json({ message: "Pedido no encontrado." });
    }

    pedidos[pedidoIndex].estado = estado;
    pedidos[pedidoIndex].direccionEntrega = direccionEntrega;
    res.status(200).json(pedidos[pedidoIndex]);
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`)
});
 