const tf = require('@tensorflow/tfjs');
const fs = require('fs');
const { readFileSync } = require('fs');
const { parse } = require('csv-parse/sync')
//const multer = require('multer'); // Middleware para manejar archivos
//const storage = multer.memoryStorage(); // Almacenar el archivo en la memoria
//const upload = multer({ storage: storage });



exports.getCSVParseado = (req, res) => {
    console.log({ 'req': req.file });


    if (!req.body.file) {
        return res.status(400).json({ error: 'No se ha proporcionado ningún archivo CSV.' });
    }



    // Obtener el contenido del archivo CSV desde req.file.buffer
    const csvData = req.file.buffer.toString('utf-8');

    // Analizar el archivo CSV
    csv.parse(csvData, { columns: true }, (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Error al analizar el archivo CSV.' });
        }

        // Aquí puedes procesar los datos del CSV según tus necesidades
        // Por ejemplo, puedes realizar predicciones o guardarlos en una base de datos

        // En este ejemplo, simplemente los devolvemos como respuesta
        res.json({ data });
    });
};







// exports.getCSVParseado = async function (req, res) {
//     try {

//         const csvData = req.file.buffer.toString('utf-8');

//         //console.log({ 'csvData': csvData });

//         const fileContent = readFileSync(csvData, 'utf-8');

//         //console.log({ 'fileContent': fileContent });
//         const csvContent = parse(fileContent, {
//             columns: true, // first row of the CSV is a header
//             cast: (value, context) => {
//                 if (context.column === ' cantidad') return Number(value);
//                 if (context.column === 'fecha') return new Date(value);
//                 return value
//             }
//         });

//         console.log({ 'csvContent': csvContent });
//         res.status(200).send({ "respuesta": csvContent });
//     } catch (error) {
//         res.status(400).send(JSON.stringify(
//             {
//                 "mensaje": error,
//                 "parametros": req.body
//             }
//         ));
//     }
// };
