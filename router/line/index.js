const express = require('express')
const line = require('@line/bot-sdk')

const lineSdkConfig = {
    channelSecret: process.env.LINE_CHANNEL_SECRET,
}

const client = new line.messagingApi.MessagingApiClient({
    channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN
});

const router = express.Router()

router.use(line.middleware(lineSdkConfig))

router.post('/webhook', async (req, res) => {
    try{
        console.log(req.body);
        // const results = await Promise.all(req.body.events.map(handleEvent))
        res.json({
            message: "success"
        })
    }
    catch(err){

    }    
})

module.exports = router