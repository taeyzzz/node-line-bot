const express = require('express')
const line = require('@line/bot-sdk')

const services = require('./services')

const lineSdkConfig = {
    channelSecret: process.env.LINE_CHANNEL_SECRET,
}

const router = express.Router()

router.use(line.middleware(lineSdkConfig))

router.post('/webhook', async (req, res) => {
    try{
        console.log(req.body);
        const results = await Promise.all(req.body.events.map(services.handleEvent))
        res.json({
            message: "success"
        })
    }
    catch(err){
        console.log(err)        
    }    
})

module.exports = router