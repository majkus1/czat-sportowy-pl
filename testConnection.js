const mongoose = require('mongoose');

const DATABASE_URL = process.env.DATABASE_URL || "mongodb+srv://michalipka1:LppH9x5s5Qvoa7eS@cluster0.ecqbnyn.mongodb.net/";

mongoose.connect(DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection.on('connected', () => {
    console.log('Połączono z bazą danych MongoDB');
    mongoose.connection.close();
});

mongoose.connection.on('error', (err) => {
    console.error('Błąd podczas próby połączenia z MongoDB:', err);
    mongoose.connection.close();
});
