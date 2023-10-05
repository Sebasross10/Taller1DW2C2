const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.redirect('/formulario.html');
});

app.post('/prestamo', (req, res) => {
  const { id, nombre, apellido, titulo, autor, editorial, año } = req.body;

  if (!id || !nombre || !apellido || !titulo || !autor || !editorial || !año) {
    return res.redirect('/error.html');
  }

  const contenido = `${id}, ${nombre}, ${apellido}, ${titulo}, ${autor}, ${editorial}, ${año}`;
  const archivoNombre = `data/id_${id}.txt`;

  fs.writeFile(archivoNombre, contenido, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error interno del servidor.');
    }

    res.redirect(`/descargar/${id}`);
  });
});

app.get('/descargar/:id', (req, res) => {
  const id = req.params.id;
  const archivoNombre = `data/id_${id}.txt`;

  if (fs.existsSync(archivoNombre)) {
    res.download(archivoNombre, (err) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error al descargar el archivo.');
      }
    });
  } else {
    res.status(404).send('El archivo no existe.');
  }
});

app.listen(port, () => {
  console.log(`Servidor en ejecución en http://localhost:${port}`);
});
