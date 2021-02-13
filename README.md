# Grocery APP

List of microservices to serve grocery app. 
Project structure
- ###### services
    - ###### APIGateway - its a main service which will expose other services. Route permission handled by jwt token.
    - ###### userService - its a service related to the user details, has two endpoints: register, getUser.
    - ###### productsService - this service exposes endpoints to create product, review them and to search. Has three endpoints: /product, /product/review and /product/search?page={number}  
 
## How to run  services

#### Example for APIGateway service:

Run command:

`cd services/APIGateway` then  `npm i`

to start service: `npm start`

###### _The same steps needs to be done in order to start other services_
