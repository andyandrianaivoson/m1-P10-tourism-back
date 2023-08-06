import { fileURLToPath } from 'url';
import { dirname, sep } from "path";

const __dirname = dirname(dirname(fileURLToPath(import.meta.url))) + sep;
const keys = {
    app :{
        port: process.env.PORT || 3000,
        apiUrl :'api'
    },
    database: {
        url: process.env.MONGO_URI || "mongodb+srv://admin:test@cluster0.7bgfxkm.mongodb.net/Tourism?retryWrites=true&w=majority",
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'secret',
        tokenLife: "7d",
    },
    paths: {
        root: __dirname,
        static: __dirname + 'static' + sep,
        upload: __dirname + 'static' + sep + 'uploads' + sep
    },
    img: {
        baseUrl: '/uploads/',
        dir: __dirname + 'static' + sep + 'uploads' + sep,
        targetWidth: 800
    },
    dbQuery: {
        itemsPerPage : 10
    }
};

export default keys;
