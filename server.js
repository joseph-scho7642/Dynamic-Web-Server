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

        let age = req.params.age;
        let q = 'SELECT id FROM Ages';
        let prev;
        let next;
        db.all(q, [], (err, rows) => {
            //console.log(err);
            //console.log(rows);
            


            let i;
            for (i=0; i<rows.length; i++){
                console.log('id: ' + rows[i].id + ' AGE: ' + age);
                if(rows[i].id == age){
                    if(i==0){
                        prev = rows[rows.length-1].id;
                        next = rows[i+1].id;
                    }
                    else if(i == rows.length-1){
                        prev = rows[i-1].id;
                        next = rows[0].id;
                    }
                    else{
                        prev = rows[i-1].id;
                        next = rows[i+1].id;
                    }
                }
            }
            console.log('PREV: ' + prev);
        });

        let query = 'SELECT Ages.age_range AS age, Users.app_name, Users.daily_check, \
        Users.gender, Users.weather_service, Ages.age_range, Income.income, Users.us_region, Likelihoods.likelihood AS Smartwatch_Likelihood, \
        Services.service AS service FROM Users INNER JOIN Ages ON Users.age_range = Ages.id INNER JOIN \
        Services ON Users.weather_service = Services.id INNER JOIN Income ON Users.income_range = Income.id \
        INNER JOIN Likelihoods ON Users.use_smartwatch = Likelihoods.id WHERE Users.age_range = ?;'
        db.all(query, age, (err, rows) =>{ // We are doing cereal/a but the manufacturer is A
            //console.log(err);
            //console.log(rows);

            let response = template.toString();

            let anychart = require('./public/js/anychart');
            console.log(anychart);
            let response_chart = toString(anychart.draw); // 'Calling the draw of anydraw

            

            response = response.replace('%%AGE_IMAGE%%', '/images/' + age + '_age.jpg');
            response = response.replace('%%AGE_ALT_TEXT%%', 'Picture of ' + rows[0].age);

            response = response.replace('%%AGE%%', 'Age Range: ' + rows[0].age);

            let age_table = '';
            let i;
 

            for(i=0; i< rows.length; i++){
                age_table = age_table + '<tr><td>' + rows[i].service + '</td>';
                age_table = age_table + '<td>' + rows[i].app_name + '</td>';
                age_table = age_table + '<td>' + rows[i].Smartwatch_Likelihood + '</td>';
                age_table = age_table + '<td>' + rows[i].age_range + '</td>';
                age_table = age_table + '<td>' + rows[i].gender + '</td>';
                age_table = age_table + '<td>' + rows[i].income + '</td>';
                age_table = age_table + '<td>' + rows[i].us_region + '</td>';
            }
            response = response.replace('%%WEATHER_INFO%%', age_table);
        

            response = response.replace('%%NEXT_PAGE%%', next);
            response = response.replace('%%PREV_PAGE%%', prev);
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

        let query = 'SELECT Income.income AS income, Users.app_name, Users.daily_check, \
        Users.gender, Users.weather_service, Ages.age_range, Income.income, Users.us_region, Likelihoods.likelihood AS Smartwatch_Likelihood, \
        Services.service AS service FROM Users INNER JOIN Ages ON Users.age_range = Ages.id INNER JOIN \
        Services ON Users.weather_service = Services.id INNER JOIN Income ON Users.income_range = Income.id \
        INNER JOIN Likelihoods ON Users.use_smartwatch = Likelihoods.id WHERE Users.income_range = ?;'


        let income = req.params.income;
        db.all(query, income, (err, rows) =>{ // We are doing cereal/a but the manufacturer is A
            console.log(err);
            console.log(rows);

            let response = template.toString();

            
            response = response.replace('%%INCOME_IMAGE%%', '/images/' + income + '_income.jpg');
            response = response.replace('%%INCOME_ALT_TEXT%%', 'Picture of ' + rows[0].income);

            response = response.replace('%%INCOME_RANGE%%', 'Income Range: ' + rows[0].income);

            let income_table = '';
            let i;
            for(i=0; i< rows.length; i++){
                income_table = income_table + '<tr><td>' + rows[i].service + '</td>';
                income_table = income_table + '<td>' + rows[i].app_name + '</td>';
                income_table = income_table + '<td>' + rows[i].Smartwatch_Likelihood + '</td>';
                income_table = income_table + '<td>' + rows[i].age_range + '</td>';
                income_table = income_table + '<td>' + rows[i].gender + '</td>';
                income_table = income_table + '<td>' + rows[i].income + '</td>';
                income_table = income_table + '<td>' + rows[i].us_region + '</td>';
            }
            response = response.replace('%%WEATHER_INFO%%', income_table);
        


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

        let query = 'SELECT Services.service AS age, Users.app_name, Users.daily_check, \
        Users.gender, Users.weather_service, Ages.age_range, Income.income, Users.us_region, Likelihoods.likelihood AS Smartwatch_Likelihood, \
        Services.service AS service FROM Users INNER JOIN Ages ON Users.age_range = Ages.id INNER JOIN \
        Services ON Users.weather_service = Services.id INNER JOIN Income ON Users.income_range = Income.id \
        INNER JOIN Likelihoods ON Users.use_smartwatch = Likelihoods.id WHERE Users.weather_service = ?;'


        let services = req.params.services.toUpperCase();
        db.all(query, services, (err, rows) =>{ // We are doing cereal/a but the manufacturer is A
            console.log(err);
            console.log(rows);

            let response = template.toString();

            response = response.replace('%%SERVICES_IMAGE%%', '/images/' + services + '_services.jpg');
            response = response.replace('%%SERVICES_ALT_TEXT%%', 'Picture of ' + rows[0].service);

            response = response.replace('%%SERVICE%%', 'Service: ' + rows[0].service);

            let services_table = '';
            let i;
            for(i=0; i< rows.length; i++){
                services_table = services_table + '<tr><td>' + rows[i].service + '</td>';
                services_table = services_table + '<td>' + rows[i].app_name + '</td>';
                services_table = services_table + '<td>' + rows[i].Smartwatch_Likelihood + '</td>';
                services_table = services_table + '<td>' + rows[i].age_range + '</td>';
                services_table = services_table + '<td>' + rows[i].gender + '</td>';
                services_table = services_table + '<td>' + rows[i].income + '</td>';
                services_table = services_table + '<td>' + rows[i].us_region + '</td>';
            }
            response = response.replace('%%WEATHER_INFO%%', services_table);
        


            res.status(200).type('html').send(response);            
        });



    });
});

// Start server
app.listen(port, () => {
    console.log('Now listening on port ' + port);
});
