const express = require("express");
const router = express.Router();
const pool = require("../db");
const nodemailer = require("nodemailer");
require("dotenv").config();

// Configuración de nodemailer
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
});

// 📩 **Guardar mensaje en BD y enviar correo**
router.post("/", async (req, res) => {
    try {
        const { nombre, email, servicio, mensaje } = req.body;

        const result = await pool.query(
            "INSERT INTO contacto (nombre, email, servicio, mensaje, estado, comentario) VALUES ($1, $2, $3, $4, 'Pendiente', '') RETURNING *",
            [nombre, email, servicio, mensaje]
        );

        // Enviar correo
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.RECEIVER_EMAIL,
            subject: "Nuevo Mensaje de Contacto",
            text: `Nombre: ${nombre}\nEmail: ${email}\nServicio: ${servicio}\nMensaje:\n${mensaje}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) console.error("Error enviando correo:", error);
            else console.log("Correo enviado:", info.response);
        });

        res.status(201).json({ message: "Mensaje enviado y guardado correctamente." });
    } catch (error) {
        console.error("❌ Error en POST /contacto:", error);
        res.status(500).json({ error: "Error interno al guardar el mensaje." });
    }
});

// 📜 **Obtener todos los mensajes**
router.get("/", async (_req, res) => {
    try {
        const result = await pool.query("SELECT * FROM contacto ORDER BY fecha DESC");
        res.json(result.rows);
    } catch (error) {
        console.error("❌ Error en GET /contacto:", error); // Este log es clave
        res.status(500).json({ error: "Error al obtener los mensajes." });
    }
});

// 🔄 **Actualizar estado del mensaje**
router.put("/:id/estado", async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;
    const estadosValidos = ["Pendiente", "En proceso", "Completado", "Cancelado"];

    if (!estadosValidos.includes(estado)) {
        return res.status(400).json({ error: "Estado no válido." });
    }

    try {
        await pool.query("UPDATE contacto SET estado = $1 WHERE id = $2", [estado, id]);
        res.json({ message: "Estado actualizado." });
    } catch (error) {
        console.error("❌ Error actualizando estado:", error);
        res.status(500).json({ error: "Error al actualizar estado." });
    }
});

// 📝 **Actualizar comentario**
router.put("/:id/comentario", async (req, res) => {
    const { id } = req.params;
    const { comentario } = req.body;

    try {
        await pool.query("UPDATE contacto SET comentario = $1 WHERE id = $2", [comentario, id]);
        res.json({ message: "Comentario actualizado." });
    } catch (error) {
        console.error("❌ Error actualizando comentario:", error);
        res.status(500).json({ error: "Error al actualizar comentario." });
    }
});

// 📅 **Guardar cita en BD**
router.post("/citas", async (req, res) => {
    const { id_contacto, nombre, email, servicio, fecha } = req.body;

    if (!fecha) {
        return res.status(400).json({ error: "La fecha es obligatoria." });
    }

    try {
        const result = await pool.query(
            "INSERT INTO citas (id_contacto, nombre, email, servicio, fecha) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [id_contacto, nombre, email, servicio, fecha]
        );
        res.status(201).json({ message: "Cita guardada", cita: result.rows[0] });
    } catch (error) {
        console.error("❌ Error guardando cita:", error);
        res.status(500).json({ error: "Error al guardar cita." });
    }
});

// 📅 **Obtener todas las citas**
router.get("/citas", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM citas ORDER BY fecha ASC");
        res.json(result.rows);
    } catch (error) {
        console.error("❌ Error al obtener citas:", error);
        res.status(500).json({ error: "Error al obtener citas." });
    }
});

module.exports = router;
