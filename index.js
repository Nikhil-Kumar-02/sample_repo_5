const express = require('express');
const { PORT } = require('./serverConfig');
const app = express();
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const axios = require('axios');

const limiter = rateLimit({
    windowMs: 2 * 60 * 1000, // 2 minutes
	max: 3, // Limit each IP to 3 requests per `window` (here, per 2 minutes)
})

app.use(morgan('combined'));
const { createProxyMiddleware } = require('http-proxy-middleware');
//below will restrict the number of times a user with a ip can make request in certain time window
app.use(limiter);

/*
accoding to our scope of the project we can have these type of request from our website
1 -> either a user want to search for a flight so he can do this without any authentication or authorization
so for searching the flight we have to redirect him to the flight and search service

2 -> or a user want to book a ticket so he must be authorized and authenticated as a cutomer
meaning at the time of booking he must be logged in

3 -> or a user want to see his already booked ticket althought at the time of booking we will send
the ticket to the registered email but he anyways want to see his ticket then we have to redirect him to the 
remainder service
*/

//1



app.use('/booking' , async (req,res,next) => {
    try {
        console.log('the recieved jwt token is :   ',req.headers['x-access-token']);
        const response = await axios.get('http://localhost:3333/api/isAuthenticated' , {
            headers : {
                'x-access-token' : req.headers['x-access-token']
            }
        });
        console.log(response.data.sucess);
        if(response)
            next();
            
    } catch (error) {
        // console.log(error.response.data.message)
        // if(error.response.data.message == 'User is not authenticated to perform activity'){
        //     console.log(true);
        // }
        // else{
        //     console.log(false);
        // }

        if(error.response.data.message == 'User is not authenticated to perform activity'){
            return res.status(401).json({
                error : error.response.data
            })
        }
    
        return res.json({
            error : error
        })
    }
})

app.use('/booking', createProxyMiddleware({ target: 'http://localhost:5600', changeOrigin: true }));

app.use('/flight', createProxyMiddleware({ target: 'http://localhost:4003', changeOrigin: true }));

const startServer = async () => {

    app.listen(PORT , () => {
        console.log(`server is running on port ${PORT}`);
    })

}

startServer();