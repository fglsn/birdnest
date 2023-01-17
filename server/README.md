# How to run locally
### Go to the server directory:  
	cd server
  
### Prepare database:
	docker-compose up -d
  
### Create new migration:
	npm run migration:create --  <migrationName>
  
### To run backend:
1. Install dependencies:  
&emsp; `npm install`  
2. Migrate database:  
&emsp; `npm run migrate`  
3. Start the server:  
&emsp; `npm run dev`  

### To run frontend:  
1. Install dependencies:  
&emsp; `npm install`  
2. Start client with:  
&emsp; `npm install`  
  
  
## Tests
Run test migration:  
&emsp; `npm run migrate:test`  
  
to run one test, use for.ex:  
&emsp; `npm test -- tests/process_report.test.js`  
or  
&emsp; `npm test -- -t 'test desc/name'`  
  
