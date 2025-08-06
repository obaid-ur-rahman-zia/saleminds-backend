const ProductWeightCategory = require("../models/productWeightCategory")
const Product = require("../models/product.model")
const { createLog } = require("./log.controller");

const createWeightCategories = async (req, res, next) => {
    try {

        const alreadyPresent = await ProductWeightCategory.find({ name: req.body.name })

        if (alreadyPresent.length > 0) {
            return res.status(400).json({ message: "Product Weight Category with this name already exists." })
        }

        const newWeightCategory = new ProductWeightCategory(req.body)
        await newWeightCategory.save()
        res.status(200).json({ message: "New Product Weight Category Added Successfully." })
        createLog("New product weight category has been created " + " by " + req.user.name)

    }
    catch (error) {
        console.error(error);
        next(error)
    }
}

const getAllWeightCategories = async (req, res, next) => {
    try {
        const weightCategories = await ProductWeightCategory.find()
        res.status(200).json({ data: weightCategories })
    }
    catch (error) {
        console.error(error);
        next(error)
    }
}

const deleteWeightCategories = async (req, res, next) => {
    try {


        // check if its is assign to any product 

        const assignsToAnyProduct = await Product.find({ productWeightCategory: req.params.id })

        if (assignsToAnyProduct.length > 0) {
            return res.status(400).json({ message: "This Product Weight Category is assigned to some products, can't delete it." })
        }

        const obj = await ProductWeightCategory.findByIdAndDelete(req.params.id)
        res.status(200).json({ message: "Product Weight Category Deleted Successfully." })
        createLog("Delete product weight category name as " + obj.name + " by " + req.user.name)
    }
    catch (error) {
        console.error(error);
        next(error)
    }
}

const updateWeightCategories = async (req, res, next) => {
    try {
        const obj = await ProductWeightCategory.findByIdAndUpdate(req.params.id, req.body, { new: true })
        res.status(200).json({ message: "Product Weight Category Updated Successfully." })
        createLog("Update product weight category name as " + obj.name + " by " + req.user.name)
    }
    catch (error) {
        console.error(error);
        next(error)
    }
}

module.exports = {
    createWeightCategories,
    getAllWeightCategories,
    deleteWeightCategories,
    updateWeightCategories,
}