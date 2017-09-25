var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/trades');

var Trade = mongoose.model('Trade', { trade_id: String, rate: String, amount: String, trade_date:String, order_id:String, trade_type:String, reference_id:String,seconds:Number });

//  var trade = new Trade({ trade_id:"1665327",rate:"139700.00000000",amount:"0.28561203",trade_date:"2017-09-10 02:03:38",order_id:"5444035",trade_type:"buy",reference_id:"0",seconds:1783});
//  trade.save(function (err) {
// //   if (err) {
// //     console.log(err);
// //   } else {
// //     console.log('meow');
// //   }
// });