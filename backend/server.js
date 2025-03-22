require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const contactoRoutes = require("./routes/contactoRoutes");
app.use("/api/contacto", contactoRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

app.get("/", (req, res) => {
    res.send("API de SHIDOG operativa ✅");
});

