-- SQLite
--SELECT * FROM Users;

--SELECT Users.age_range FROM Users WHERE age_range == 0;

--SELECT * FROM Services;


--SELECT * FROM Users INNER JOIN Services ON Users.weather_service == Services.id;

--SELECT Ages.age_range AS age, Users.app_name, Users.daily_check, Users.gender, Users.income_range, Users.us_region, Users.use_smartwatch, Users.weather_service FROM Users INNER JOIN Ages ON Users.age_range = Ages.id WHERE Users.age_range = 0;

SELECT Ages.age_range AS age, Users.app_name, Users.daily_check, Users.gender, Income.income, Users.us_region, Likelihoods.likelihood AS Smartwatch_Likelihood, Services.service AS service FROM Users INNER JOIN Ages ON Users.age_range = Ages.id INNER JOIN Services ON Users.weather_service = Services.id INNER JOIN Income ON Users.income_range = Income.id INNER JOIN Likelihoods ON Users.use_smartwatch = Likelihoods.id WHERE Users.age_range = 0;