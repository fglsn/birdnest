# How to run locally
### Go to the server directory:  
	cd server
  
### Prepare database:
	docker-compose up -d
  
### To run backend:
1. Install dependencies:  
&emsp; `npm install`  
2. Migrate database:  
&emsp; `npm run migrate`  
3. Start the server:  
&emsp; `npm run dev`  

### To run frontend:  
1. Go to the client directory:  
&emsp; `cd ../client`  
2. Install dependencies:  
&emsp; `npm install`  
3. Start client with:  
&emsp; `npm start`  
  
  
## Tests
Run test migration:  
&emsp; `npm run migrate:test`  
  
to run one test, use for.ex:  
&emsp; `npm test -- tests/process_report.test.js`  
or  
&emsp; `npm test -- -t 'test desc/name'`  
  
