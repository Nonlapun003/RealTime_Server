var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var request = require('request')

url = 'https://bx.in.th/api/trade/?pairing=1'

require('./app/models/user.model.js')

var Trade = require('mongoose').model('Trade')
var gSocket = null

setInterval(() => {
    request.get(url, function (err, res) {
        if (err == null) {
            // console.log(res.body)
            var data = JSON.parse(res.body)
            var trades = data.trades
            for (var i = 0; i < trades.length; i++) {
                var trade = trades[i]
                //console.log(trade)

                var trade = new Trade({ trade_id: trade.trade_id, rate: trade.rate, amount: trade.amount, trade_date: trade.trade_date, order_id: trade.order_id, trade_type: trade.trade_type, reference_id: trade.reference_id, seconds: trade.seconds });
                trade.save(function (err) {
                    if (err) {
                        console.log(err);
                    } else {
                        //console.log('hello')
                        if (gSocket != null) {
                            console.log('jhk')
                            gSocket.emit('realtime', trades)
                        }
                    }
                });
            }
        }
    })
}, 8000);

io.on('connection', function (socket) {
    //socket.on('shop', function (data) {
    gSocket = socket
    // Trade.find({trade_type:'sell'})
    setInterval(() => {
        Trade.find({}, function (err, data) {
            if (err) {
                console.log('error')
            } else {
                console.log(data)
                const sell = []
                const buy = []
                let countSell = 0
                let countBuy = 0
                let total
                let sellPer
                let buyPer


                for (const trade of data) {
                    if (trade.trade_type == "sell") {
                        sell.push(trade)
                        countSell++
                    } else {
                        buy.push(trade)
                        countBuy++
                    }
                }
                // console.log(countBuy)
                // console.log(countSell)
                total = countBuy + countSell
                sellPer = ((100 * countSell) / total)
                // console.log(sellPer)
                buyPer = ((100 * countBuy) / total)
                //console.log(buyPer)
                socket.emit('chart', { sellPer: sellPer, buyPer: buyPer })
            }
        })
    }, 8000)

    socket.on('page', (page) => {
        Trade.find({}).limit(50).skip((page-1)*50).exec((err, data) => {
            socket.emit('page', data)
        })
    })
    

    // });
});

server.listen(5000);
