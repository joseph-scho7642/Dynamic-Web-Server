// Built-in Node.js modules
let fs = require('fs');
let path = require('path');

// NPM modules
let express = require('express');
let sqlite3 = require('sqlite3');


let public_dir = path.join(__dirname, 'public');
let template_dir = path.join(__dirname, 'templates');
let db_filename = path.join(__dirname, 'cereal.sqlite3');

let app = express();
let port = 8000;

// Open SQLite3 database (in read-only mode)
let db = new sqlite3.Database(db_filename, sqlite3.OPEN_READONLY, (err) => {
    if (err) {
        console.log('Error opening ' + path.basename(db_filename));
    }
    else {
        console.log('Now connected to ' + path.basename(db_filename));
    }
});

// Serve static files from 'public' directory
app.use(express.static(public_dir));


// GET request handler for home page '/' (redirect to desired route)
app.get('/', (req, res) => {
    let home = '/cereal/services_template.html'; // <-- change this
    res.redirect(home);
});

// GET request handler for cereal a from a specific manufacturer
app.get('/cereal/services_template.html', (req, res) => {
    console.log(req.params.mfr);
    fs.readFile(path.join(template_dir, 'services_template.html'), (err, template) => {
        // modify `template` and send response
        // this will require a query to the SQL database
        let query = 'SELECT Manufacturers.name AS mfr, Cereals.name, Cereals.calories, Cereals.carbohydrates, \
                    Cereals.protein, Cereals.fat, Cereals.rating FROM Cereals INNER JOIN Manufacturers \
                    ON Cereals.mfr = Manufacturers.id WHERE Cereals.mfr = ?'; // We use ? instead of req.params.mfr because then someone could inject hazardous code

        let mfr = 'A';
        db.all(query, [mfr], (err, rows) =>{ // We are doing cereal/a but the manufacturer is A
            console.log(err);
            console.log(rows);

            let response = template.toString();

            response = response.replace('%%MANUFACTURER%%', rows[0].mfr); // Rows .mfr but the first index
            response = response.replace('%%MFR_IMAGE%%', '/images/' + mfr + '_logo.png');
            response = response.replace('%%MFR_ALT_TEXT%%', 'Logo of ' + rows[0].mfr);

            let cereal_table = '';
            let i;
            for(i=0; i< rows.length; i++){
                cereal_table = cereal_table + '<tr><td>' + rows[i].name + '</td>';
                cereal_table = cereal_table + '<td>' + rows[i].calories + '</td>';
                cereal_table = cereal_table + '<td>' + rows[i].carbohydrates + '</td>';
                cereal_table = cereal_table + '<td>' + rows[i].protein + '</td>';
                cereal_table = cereal_table + '<td>' + rows[i].fat + '</td>';
                cereal_table = cereal_table + '<td>' + rows[i].rating + '</td></tr>';
            }
            response = response.replace('%%CEREAL_INFO%%', cereal_table);
        


            res.status(200).type('html').send(response);            
        });



    });
});

// GET request handler for cereal a from a specific manufacturer
app.get('/cereal/likelihoods_template.html', (req, res) => {
    console.log(req.params.mfr);
    fs.readFile(path.join(template_dir, 'likelihoods_template.html'), (err, template) => {
        // modify `template` and send response
        // this will require a query to the SQL database
        let query = 'SELECT Manufacturers.name AS mfr, Cereals.name, Cereals.calories, Cereals.carbohydrates, \
                    Cereals.protein, Cereals.fat, Cereals.rating FROM Cereals INNER JOIN Manufacturers \
                    ON Cereals.mfr = Manufacturers.id WHERE Cereals.mfr = ?'; // We use ? instead of req.params.mfr because then someone could inject hazardous code

        let mfr = 'K';
        db.all(query, [mfr], (err, rows) =>{ // We are doing cereal/a but the manufacturer is A
            console.log(err);
            console.log(rows);

            let response = template.toString();

            response = response.replace('%%MANUFACTURER%%', rows[0].mfr); // Rows .mfr but the first index
            response = response.replace('%%MFR_IMAGE%%', '/images/' + mfr + '_logo.png');
            response = response.replace('%%MFR_ALT_TEXT%%', 'Logo of ' + rows[0].mfr);

            let cereal_table = '';
            let i;
            for(i=0; i< rows.length; i++){
                cereal_table = cereal_table + '<tr><td>' + rows[i].name + '</td>';
                cereal_table = cereal_table + '<td>' + rows[i].calories + '</td>';
                cereal_table = cereal_table + '<td>' + rows[i].carbohydrates + '</td>';
                cereal_table = cereal_table + '<td>' + rows[i].protein + '</td>';
                cereal_table = cereal_table + '<td>' + rows[i].fat + '</td>';
                cereal_table = cereal_table + '<td>' + rows[i].rating + '</td></tr>';
            }
            response = response.replace('%%CEREAL_INFO%%', cereal_table);
        


            res.status(200).type('html').send(response);            
        });



    });
});

// GET request handler for cereal a from a specific manufacturer
app.get('/cereal/users_template.html', (req, res) => {
    console.log(req.params.mfr);
    fs.readFile(path.join(template_dir, 'users_template.html'), (err, template) => {
        // modify `template` and send response
        // this will require a query to the SQL database
        let query = 'SELECT Manufacturers.name AS mfr, Cereals.name, Cereals.calories, Cereals.carbohydrates, \
                    Cereals.protein, Cereals.fat, Cereals.rating FROM Cereals INNER JOIN Manufacturers \
                    ON Cereals.mfr = Manufacturers.id WHERE Cereals.mfr = ?'; // We use ? instead of req.params.mfr because then someone could inject hazardous code

        let mfr = 'G';
        db.all(query, [mfr], (err, rows) =>{ // We are doing cereal/a but the manufacturer is A
            console.log(err);
            console.log(rows);

            let response = template.toString();

            response = response.replace('%%MANUFACTURER%%', rows[0].mfr); // Rows .mfr but the first index
            response = response.replace('%%MFR_IMAGE%%', '/images/' + mfr + '_logo.png');
            response = response.replace('%%MFR_ALT_TEXT%%', 'Logo of ' + rows[0].mfr);

            let cereal_table = '';
            let i;
            for(i=0; i< rows.length; i++){
                cereal_table = cereal_table + '<tr><td>' + rows[i].name + '</td>';
                cereal_table = cereal_table + '<td>' + rows[i].calories + '</td>';
                cereal_table = cereal_table + '<td>' + rows[i].carbohydrates + '</td>';
                cereal_table = cereal_table + '<td>' + rows[i].protein + '</td>';
                cereal_table = cereal_table + '<td>' + rows[i].fat + '</td>';
                cereal_table = cereal_table + '<td>' + rows[i].rating + '</td></tr>';
            }
            response = response.replace('%%CEREAL_INFO%%', cereal_table);
        


            res.status(200).type('html').send(response);            
        });



    });
});

// Start server
app.listen(port, () => {
    console.log('Now listening on port ' + port);
});
