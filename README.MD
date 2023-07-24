## RONTEND ----- MIDDLE-END ----- BACKEND

- We need an intermediate layer between the client side and the microservices
- Using middle end when client sends request we will be able to make descisions that which microservice should actually respond to this request
- We can do message validation , response transformation , rate limiting (if some ip is forwarding multiple request then we can block him so this logic should not be present in every microservice rather the api gateway will handle it for all services) and (response transformation means let say we are getting multiple api with almost same output so we can get the response and send the filtered response according to the request like same requst from mobile and desktop or want flight details but one want from to and price and another want only from and to)
- We can prepare an api gateway that acts as this middle end
- Let say client want to fetch airport details and that service is running on port y so clinet need not to know about the port this redirection or proxy thing should be done by api gateway
