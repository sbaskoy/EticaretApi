const Mongoose = require("mongoose");
 // const logger=require("../scripts/logger/Category");
const BasketSchema = new Mongoose.Schema({
    product_id: {
        type: Mongoose.Types.ObjectId,
        ref: "product"
    },
    user_id: {
        type: Mongoose.Types.ObjectId,
        ref: "user"
    },
    quantity:Number,
}, {
    versionKey: false, timestamps: true
});

// CategorySchema.once("save",(doc)=>{
//     logger.log({
//         level:"info",
//         message:doc
//     })
// })
module.exports = Mongoose.model("basket", BasketSchema);