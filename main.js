const express = require('express'); // pido el modulo express guardo un objeto gigante llamado express.
const bodyParser = require('body-parser');
const cors = require('cors'); // modulo para la validacion del lado del servidor. deshabilita.
console.log("LISTENING...");
const app = express(); //crea el servidor. todavia no hace nada.
const tempLog=[{
    id:1,
    time:new Date().toLocaleString(),
    temp: 35,
    unit: 'C'
}];
const target=[{
    id:1,
    time:new Date(),
    temp: 80,
    unit: 'C',
    enable:0
}];
//body parser. para poder leer los body de los posts
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors()); // a cors() le puedo pasar los dominios conocidos y permitidos.

app.get('/', (req,res)=>{
    console.log(tempLog);
    res.send(JSON.stringify(tempLog));
});
app.get('/temperaturas', (req, res) => {
    console.log(tempLog);
    res.json(tempLog);
})
app.get('/target', (req, res) => {
    console.log(target);
    res.json(target);
});

app.put('/target', (req, res) => {
    // voy a editar un elemento, primero necesito saber que elemento.
    // necesito saber que ponerle
    const temperatura = req.body;
    console.log(temperatura);
    const index = target.findIndex(t => t.id == 1);
    if (index >= 0) {
        const nuevoTarget = {
            ...target[index],
            ...temperatura,
            time:new Date()
        };
        target[index] = nuevoTarget;
        return res.json(target);
    }
    else return res.status(404).send('NO PODES');
});

app.post('/temperaturas', (req, res) => {
    console.log(req);
    const id = idMayor() + 1;
    const curTemp = req.body;
    curTemp.id = id;
    curTemp.time = new Date().toLocaleString();
    console.log(id);
    tempLog.push(curTemp);
    res.send(curTemp);
});
function idMayor() {
    let mayor = 0;
    tempLog.forEach(a => { a.id > mayor ? mayor = a.id : '' });
    return mayor;
}

app.delete('/temperaturas', (req, res) => {
    if (tempLog.length> 0) {
        while(tempLog.length){
            tempLog.splice(0,1);
        }
        return res.send('Tabla Vacía...');
    }
    else return res.status(418).send('<img src="https://evert.meulie.net/wp-content/uploads/2016/03/Teapot.png"/>Nope... no existe...');
});
app.listen(3000);