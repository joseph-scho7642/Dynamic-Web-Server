// Built-in Node.js modules
let fs = require('fs');
let path = require('path');

// NPM modules
let express = require('express');
let sqlite3 = require('sqlite3');


let public_dir = path.join(__dirname, 'public');
let template_dir = path.join(__dirname, 'templates');
let db_filename = path.join(__dirname, 'db', 'weather_checking.sqlite3');

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


// Trying out slider
/*
var rangeslider = document.getElementById("sliderRange");
var output = document.getElementById("demo");
output.innerHTML = rangeslider.value;

rangeslider.oninput = function() {
  output.innerHTML = this.value;
}*/

// GET request handler for home page '/' (redirect to desired route)
app.get('/', (req, res) => {
    let home = '/weatherbyage/0'; // <-- change this
    res.redirect(home);
});

// GET request handler for cereal a from a specific manufacturer
app.get('/weatherbyage/:age', (req, res) => {
    console.log(req.params.age);
    fs.readFile(path.join(template_dir, 'age_template.html'), (err, template) => {
        // modify `template` and send response
        // this will require a query to the SQL database
        //let query = 'SELECT * FROM Users'
        let query = 'SELECT Users.age_range AS age, Users.id, Users.daily_check, Users.weather_service FROM Users INNER JOIN Services ON Users.weather_service = Services.id, \
                    Users.app_name, Users.use_smartwatch FROM Users INNER JOIN Likelihoods ON Users.use_smartwatch = Likelihoods.id, Users.age_range FROM Users INNER JOIN Ages ON Users.age_range = Ages.id, \
                    Users.gender, Users.income_range FROM Users INNER JOIN Income ON Users.income_range = Income.id, Users.us_region'

        /* Currently a working query with {} in db.all
        let query = 'SELECT Users.id, Users.daily_check, Users.weather_service, \
                    Users.app_name, Users.use_smartwatch, Users.age_range, \
                    Users.gender, Users.income_range, Users.us_region FROM Users';  */ 

        let age = req.params.age;
        db.all(query, age, (err, rows) =>{ // We are doing cereal/a but the manufacturer is A
            console.log(err);
            console.log(rows);

            let response = template.toString();

            //response = response.replace('%%MANUFACTURER%%', rows[0].age); // Rows .mfr but the first index
            //response = response.replace('%%MFR_IMAGE%%', '/images/' + age + '_logo.png');
            //response = response.replace('%%MFR_ALT_TEXT%%', 'Logo of ' + rows[0].age);

            let cereal_table = '';
            let i;
 

            for(i=0; i< rows.length; i++){
                cereal_table = cereal_table + '<tr><td>' + rows[i].id + '</td>';
                cereal_table = cereal_table + '<td>' + rows[i].daily_check + '</td>';
                cereal_table = cereal_table + '<td>' + rows[i].weather_service + '</td>';
                cereal_table = cereal_table + '<td>' + rows[i].app_name + '</td>';                
                cereal_table = cereal_table + '<td>' + rows[i].use_smartwatch + '</td>';
                cereal_table = cereal_table + '<td>' + rows[i].age_range + '</td>';
                cereal_table = cereal_table + '<td>' + rows[i].gender + '</td>';
                cereal_table = cereal_table + '<td>' + rows[i].income_range + '</td>';
                cereal_table = cereal_table + '<td>' + rows[i].us_region + '</td></tr>';
            }
            response = response.replace('%%WEATHER_INFO%%', cereal_table);
        


            res.status(200).type('html').send(response);            
        });



    });
});

// GET request handler for cereal a from a specific manufacturer
app.get('/weatherbyincome/:income', (req, res) => {
    console.log(req.params.income);
    fs.readFile(path.join(template_dir, 'income.html'), (err, template) => {
        // modify `template` and send response
        // this will require a query to the SQL database
        let query = 'SELECT Manufacturers.name AS mfr, Cereals.name, Cereals.calories, Cereals.carbohydrates, \
                    Cereals.protein, Cereals.fat, Cereals.rating FROM Cereals INNER JOIN Manufacturers \
                    ON Cereals.mfr = Manufacturers.id WHERE Cereals.mfr = ?'; // We use ? instead of req.params.mfr because then someone could inject hazardous code

        let income = req.params.income;
        db.all(query, income, (err, rows) =>{ // We are doing cereal/a but the manufacturer is A
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
app.get('/weatherbyservices/:services', (req, res) => {
    console.log(req.params.services);
    fs.readFile(path.join(template_dir, 'services.html'), (err, template) => {
        // modify `template` and send response
        // this will require a query to the SQL database
        let query = 'SELECT Manufacturers.name AS mfr, Cereals.name, Cereals.calories, Cereals.carbohydrates, \
                    Cereals.protein, Cereals.fat, Cereals.rating FROM Cereals INNER JOIN Manufacturers \
                    ON Cereals.mfr = Manufacturers.id WHERE Cereals.mfr = ?'; // We use ? instead of req.params.mfr because then someone could inject hazardous code

        let services = req.params.services.toUpperCase();
        db.all(query, services, (err, rows) =>{ // We are doing cereal/a but the manufacturer is A
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




// THIS IS A BEGINNER TEMPLATE

/*
// GET request handler for cereal a from a specific manufacturer
app.get('/age/:year', (req, res) => {
    console.log(req.params.mfr);
    fs.readFile(path.join(template_dir, 'services.html'), (err, template) => {
        // modify `template` and send response
        // this will require a query to the SQL database
        let query = 'SELECT Manufacturers.name AS mfr, Cereals.name, Cereals.calories, Cereals.carbohydrates, \
                    Cereals.protein, Cereals.fat, Cereals.rating FROM Cereals INNER JOIN Manufacturers \
                    ON Cereals.mfr = Manufacturers.id WHERE Cereals.mfr = ?'; // We use ? instead of req.params.mfr because then someone could inject hazardous code

        let year = req.params.year;
        db.all(query, [year], (err, rows) =>{ // We are doing cereal/a but the manufacturer is A
            console.log(err);
            console.log(rows);

            let response = template.toString();

            response = response.replace('%%MANUFACTURER%%', rows[0].year); // Rows .mfr but the first index
            response = response.replace('%%MFR_IMAGE%%', '/images/' + year + '_logo.png');
            response = response.replace('%%MFR_ALT_TEXT%%', 'Logo of ' + rows[0].year);

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
*/

// Start server
app.listen(port, () => {
    console.log('Now listening on port ' + port);
});
