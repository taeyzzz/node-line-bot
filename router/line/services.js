const axios = require('axios')

const lineClient = require("./lineClient")
const GeminiModel = require('./geminiClient')

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

    if(message.text === "ราคาน้ำมัน"){
        const oilResult = await getOilPrices()
        const flexOilMessage = generateFlexMessageOilPrice(oilResult)
        
        const replyResult = await lineClient.replyMessage({
            replyToken,
            messages: [
                flexOilMessage,
            ]
        })
        return replyResult
    }
    
    const result = await GeminiModel.generateContent(message.text);
    return await lineClient.replyMessage({
        replyToken,
        messages: [
            {
                "type": "text",
                "text": result.response.text()
            }
        ]
    })

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
        },
        footer: {
            type: "box",
            layout: "vertical",
            contents: [
                {
                    type: "button",
                    action: {
                        type: "uri",
                        label: "More detail",
                        uri: "https://oil-price.bangchak.co.th/BcpOilPrice1/th"
                    },
                    "style": "primary",
                    "color": "#6eb109"
                }
            ]
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
        },
        footer: {
            type: "box",
            layout: "vertical",
            contents: [
                {
                    type: "button",
                    action: {
                        type: "uri",
                        label: "More detail",
                        uri: "https://oil-price.bangchak.co.th/BcpOilPrice1/th"
                    },
                    "style": "primary",
                    "color": "#6eb109"
                }
            ]
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