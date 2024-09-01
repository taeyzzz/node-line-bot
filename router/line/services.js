const lineClient = require("./lineClient")
const axios = require('axios')

const handleEvent = async ({
    type,
    message,
    webhookEventId,
    deliveryContext,
    timestamp,
    source,
    replyToken,
    mode
}) => {
    if (type !== 'message' || message.type !== 'text') {
        return Promise.resolve(null);
    }
    const oilResult = await getOilPrices()
    const flexOilMessage = generateFlexMessageOilPrice(oilResult)
    
    try{
        const replyResult = await lineClient.replyMessage({
            replyToken,
            messages: [
                flexOilMessage,
            ]
        })
        return replyResult
    }
    catch(err){
        console.log(err);
        
    }
   
    console.log(replyResult);
    
    return replyResult
}

const getOilPrices = async () => {
    const response = await axios.get("https://oil-price.bangchak.co.th/apioilprice2/th")
    const oilPriceResult = JSON.parse(response.data[0].OilList)
    return oilPriceResult
}

const generateFlexMessageOilPrice = (listOilData) => {
    const todayPriceBubbleMessage = {
        type: "bubble",
        header: {
            type: "box",
            layout: "vertical",
            background: {
                type: "linearGradient",
                angle: "90deg",
                startColor: "#3aa537",
                endColor: "#a4c948"
            },
            contents: [
                {
                    type: "text",
                    text: "ราคาน้ำมันวันนี้",
                    size: "xl",
                    weight: "bold",
                    color: "#FFFFFF"
                }
            ],                        
        },
        body: {
            type: "box",
            layout: "vertical",
            contents: listOilData.map(o => {
                let color = undefined
                let sign = "-"
                if(o.PriceToday > o.PriceYesterday) {
                    sign = "▲"
                    color = "#ff0000"
                }
                else if(o.PriceToday < o.PriceYesterday) {
                    sign = "▼"
                    color = "#009e45"
                }
                return {
                    type: "box",
                    layout: "horizontal",
                    contents: [
                        {
                            type: "box",
                            layout: "vertical",
                            width: "60%",
                            contents: [
                                { type: "text", size: "sm", text: `${o.OilName}:` },                                                
                            ]
                        },
                        {
                            type: "box",
                            layout: "vertical",
                            width: "30%",
                            contents: [
                                { type: "text", weight: "bold", text: `${o.PriceToday} บาท` },                                                
                            ]
                        },
                        {
                            type: "box",
                            layout: "vertical",
                            width: "10%",
                            contents: [
                                { type: "text", color, text: sign },                                                
                            ]
                        }
                    ]
                }
            })
        }
    }

    const tomorrowPriceBubbleMessage = {
        type: "bubble",
        header: {
            type: "box",
            layout: "vertical",
            background: {
                type: "linearGradient",
                angle: "90deg",
                startColor: "#a4c948",
                endColor: "#3aa537"
            },
            contents: [
                {
                    type: "text",
                    text: "ราคาน้ำมันวันพรุ่งนี้",
                    size: "xl",
                    weight: "bold",
                    color: "#FFFFFF"
                }
            ],                        
        },
        body: {
            type: "box",
            layout: "vertical",
            contents: listOilData.map(o => {
                let color = undefined
                let sign = "-"
                if(o.PriceTomorrow > o.PriceToday) {
                    sign = "▲"
                    color = "#ff0000"
                }
                else if(o.PriceTomorrow < o.PriceToday) {
                    sign = "▼"
                    color = "#009e45"
                }
                return {
                    type: "box",
                    layout: "horizontal",
                    contents: [
                        {
                            type: "box",
                            layout: "vertical",
                            width: "60%",
                            contents: [
                                { type: "text", size: "sm", text: `${o.OilName}:` },                                                
                            ]
                        },
                        {
                            type: "box",
                            layout: "vertical",
                            width: "30%",
                            contents: [
                                { type: "text", weight: "bold", text: `${o.PriceTomorrow} บาท` },                                                
                            ]
                        },
                        {
                            type: "box",
                            layout: "vertical",
                            width: "10%",
                            contents: [
                                { type: "text", color, text: sign },                                                
                            ]
                        }
                    ]
                }
            })
        }
    }

    return {
        type: "flex",
        altText: "Oil Price",
        contents: {
            type: "carousel",
            contents: [
                todayPriceBubbleMessage,
                tomorrowPriceBubbleMessage
            ]
          }
    }
}

module.exports = {
    handleEvent
}