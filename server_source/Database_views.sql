/*SQL-søgninger på databasen som returnerer data på andre måder end bare det helt banale:*/

/*Samlet forbrug for hele husstanden, målt hvert kvarter:*/
CREATE OR REPLACE VIEW TotalConsumption AS
SELECT 
	LoadHistory.houseId AS "houseId", 
	LoadHistory.time AS "time", 
	SUM(LoadHistory.load) AS "load"
FROM LoadHistory
GROUP BY LoadHistory.houseId, LoadHistory.time;	



/*Samlet forbrug for hele husstanden, målt hver time, men returneret som watt-kvarter (/4 for at få WH)Æ:*/
CREATE VIEW TotalConsumption1H AS
SELECT 	
	LoadHistory.houseId AS "houseId", 
	LoadHistory.time AS "time", 
	SUM(LoadHistory.load) AS "load"
FROM LoadHistory
GROUP BY LoadHistory.houseId, YEAR(LoadHistory.time), MONTH(LoadHistory.time), DAY(LoadHistory.time), HOUR(LoadHistory.time);

/*Samlet forbrug for hele husstande, målt hver døgn, returneret som watt-kvarter. */
CREATE VIEW TotalConsumption1D AS
SELECT 
	LoadHistory.houseId AS "houseId", 
	LoadHistory.time AS "time", 
	SUM(LoadHistory.load) AS "load"
FROM LoadHistory
GROUP BY LoadHistory.houseId, YEAR(LoadHistory.time), MONTH(LoadHistory.time), DAY(LoadHistory.time);

/*Samlet forbrug for hele husstanden, målt hver uge, returneret som watt-kvarter. */
CREATE VIEW TotalConsumption1W AS
SELECT LoadHistory.houseId AS "houseId", 
	LoadHistory.time AS "time", 
	WEEKOFYEAR(LoadHistory.time) AS "week", 
	SUM(LoadHistory.load) AS "load"
FROM LoadHistory
GROUP BY LoadHistory.houseId, YEAR(LoadHistory.time), WEEKOFYEAR(LoadHistory.time);

/*Samlet forbrug for hele husstanden i en måned, returneret som watt-kvarter. */
CREATE VIEW TotalConsumption1M AS
SELECT 
	LoadHistory.houseId AS "houseId", 
	LoadHistory.time AS "time", 
	SUM(LoadHistory.load) AS "load"
FROM LoadHistory
GROUP BY LoadHistory.houseId, YEAR(LoadHistory.time), MONTH(LoadHistory.time);


/*--------------------------------------- */

/*Samlet forbrug på en enhed hver time, målt i watt-kvarter: */
CREATE VIEW TotalConsumptionOutlet1H AS
SELECT 
	LoadHistory.houseId AS "houseId", 
	LoadHistory.outletId AS "outletId", 
	LoadHistory.time AS "time", 
	SUM(LoadHistory.load) AS "load"
FROM LoadHistory
GROUP BY LoadHistory.houseId, LoadHistory.outletId, YEAR(LoadHistory.time), MONTH(LoadHistory.time), DAY(LoadHistory.time), HOUR(LoadHistory.time);


/*Samlet forbrug på en enhed hvert døgn, målt i watt-kvarter: */
CREATE VIEW TotalConsumptionOutlet1D AS
SELECT 
	LoadHistory.houseId AS "houseId", 
	LoadHistory.outletId AS "outletId", 
	LoadHistory.time AS "time", 
	SUM(LoadHistory.load) AS "load"
FROM LoadHistory
GROUP BY LoadHistory.houseId, LoadHistory.outletId, YEAR(LoadHistory.time), MONTH(LoadHistory.time), DAY(LoadHistory.time);

/*Samlet forbrug på en enhed hver uge, målt i watt-kvarter: */
CREATE VIEW TotalConsumptionOutlet1W AS
SELECT 
	LoadHistory.houseId AS "houseId", 
	LoadHistory.outletId AS "outletId", 
	WEEKOFYEAR(LoadHistory.time) AS "week", 
	LoadHistory.time AS "time", 
	SUM(LoadHistory.load) AS "load"
FROM LoadHistory
GROUP BY LoadHistory.houseId, LoadHistory.outletId, YEAR(LoadHistory.time), WEEKOFYEAR(LoadHistory.time);

/*Samlet forbrug på en enhed hver måned, målt i watt-kvarter: */
CREATE VIEW TotalConsumptionOutlet1M AS
SELECT 
	LoadHistory.houseId AS "houseId", 
	LoadHistory.outletId AS "outletId", 
	LoadHistory.time AS "time", 
	SUM(LoadHistory.load) AS "load"
FROM LoadHistory
GROUP BY LoadHistory.houseId, LoadHistory.outletId, YEAR(LoadHistory.time), MONTH(LoadHistory.time);

