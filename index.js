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
app.use(limiter);


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
            return res.json({
                error : error.response.data
            })
        }
    
        return res.json({
            error : error
        })
    }
})

app.use('/booking', createProxyMiddleware({ target: 'http://localhost:5600', changeOrigin: true }));

const startServer = async () => {

    app.listen(PORT , () => {
        console.log(`server is running on port ${PORT}`);
    })

}

startServer();