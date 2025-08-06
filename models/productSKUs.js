const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const skuSchema = new mongoose.Schema(
    {
        sizeId: {
            type: String,
            required: true
        },
        size: {
            type: String,
            required: true
        },
        value: {
            type: String,
            required: true
        }
    },
    { _id: false }
);

const ProductSkuSchema = new Schema({
    product: {
        type: String,
        ref: "Product",
        required: true,
    },
    skus: [skuSchema]
});

module.exports = mongoose.model("ProductSku", ProductSkuSchema);
