const express = require('express');
const mysql = require('mysql');

const app = express();
const port = 3000;

// Opprett tilkobling til MySQL-database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password', // Bytt ut med ditt MySQL-passord
  database: 'teller_db'
});

// Koble til databasen
connection.connect(err => {
  if (err) {
    console.error('Feil ved tilkobling til MySQL:', err);
  } else {
    console.log('Tilkoblet til MySQL-database');
  }
});

app.set('view engine', 'ejs');
// app.use(express.static('public'));

// Opprett en enkel teller
let teller = 0;

app.get('/', (req, res) => {
    connection.query('SELECT * FROM teller', (err, rows) => {
        if (err) {
            console.error('Feil ved henting av data fra database:', err)
            res.status(500).send('Intern feil')
        } else {
            // Hvis det ikke er noen feil, henter vi ut antall fra resultatet
            // og oppdaterer telleren
            res.render('knapp', {teller: rows[0].antall})
        }
    });
});

// Definer ruten for å øke telleren når knappen trykkes
app.post('/', (req, res) => {

  // Oppdater databasen med det nye tallet
  connection.query('UPDATE teller SET antall = antall + 1', (err, result) => {
    if (err) {
      console.error('Feil ved oppdatering av database:', err);
      res.status(500).send('Intern feil');
    } else {
      res.redirect('/');
    }
  });
});

// Start serveren
app.listen(port, () => {
  console.log(`Serveren kjører på http://localhost:${port}`);
});
