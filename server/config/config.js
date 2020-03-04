//Puerto
process.env.PORT = process.env.PORT || 3000;


//ENTORNO
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


//BASE DE DATOS

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb+srv://root:hrDqlhZtzLyXkzId@cluster0-gwnzt.mongodb.net/cafe';
}

process.env.URLDB = urlDB;
// mongoose.connect('mongodb://localhost:27017/cafe'
//         mongodb + srv: //root:<password>@cluster0-gwnzt.mongodb.net/test