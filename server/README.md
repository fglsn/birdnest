**Initial Setup**
  
run containers in background:  
	&emsp; `docker-compose up -d`  
  
connect to postgres:  
	&emsp; `psql postgresql://localhost:5432/matcha -U postgres`  
  
**Migrations**
  
To create new migration run:  
&emsp; `npm run migration:create --  <migrationName>`  
  
Run migration:  
&emsp; `npm run migrate`  
  
**Tests**  
Run test migration:  
&emsp; `npm run migrate:test`  
  
to run one test, use for.ex:  
&emsp; `npm test -- tests/process_report.test.js`  
or  
&emsp; `npm test -- -t 'test desc/name'`  
  
**express-async-handler**  
middleware added for handling missed errors on async functions  
every endpoint should be wrapped with asyncHandler();  
https://www.npmjs.com/package/express-async-handler  
  
**db-migrate**  
Database migration framework for node.js  
Basic usage: db-migrate [up|down|reset|create|db] [[dbname/]migrationName|all] [options]  
https://db-migrate.readthedocs.io/en/latest/  
