const RoleBasedUser = require('../models/roleBasedUser.model')
const AdminUser = require('../models/adminUser.model')
const { createLog } = require("./log.controller");

const createNewRoleBasedUser = async (req, res, next) => {
    try {
        // console.log(req.body)

        const alreadyRoleBasedUser = await RoleBasedUser.find({
            name: req.body.name
        })

        console.log("Already Role Based User: " + alreadyRoleBasedUser)

        if (alreadyRoleBasedUser.length > 0) {
            return res.status(400).json({ message: "Role Based User with this name already exists" });
        }

        const roleBasedUser = new RoleBasedUser({
            name: req.body.name,
            routes: req.body.permissions,
            whiteArea: req.body.whiteArea
        });

        await roleBasedUser.save();

        res.status(200).send({
            message: "Role Based User created successfully"
        });

        createLog("New Role Based Name as " + req.body.name + " User created successfully by " + req.user.name);

    }
    catch (error) {
        console.error(error);
        next(error)
    }
}

const getAllRolesBasedUsers = async (req, res, next) => {
    try {
        let roleBasedUsers = await RoleBasedUser.find();

        // if only want to return just names of roles and _id
        roleBasedUsers = roleBasedUsers.map(roleBasedUser => {
            return {
                name: roleBasedUser.name,
                _id: roleBasedUser._id
            }
        })

        res.status(200).json({ data: roleBasedUsers });
    }
    catch (error) {
        console.error(error);
        next(error)
    }
}

const deleteUserRole = async (req, res, next) => {

    console.log("ID: ", req.params.id)

    try {

        // first check this role is assign to any adminUser if it it assigned then it will not deleted if not then it 
        // will be deleted

        const findUserWhichHaveThisRole = await AdminUser.find({
            role: req.params.id
        })

        if (findUserWhichHaveThisRole.length > 0) {
            return res.status(400).json({ message: "This Role is assigned to some Admin User, can't delete it." });
        }


        const roleDetail = await RoleBasedUser.findByIdAndDelete({
            _id: req.params.id
        });

        createLog("Deleted Role named as " + roleDetail.name + " successfully by " + req.user.name);

        res.status(200).json({ message: "Role Based User deleted successfully" });



    }
    catch (error) {
        console.error(error);
        next(error)
    }
}

const getRoleDetail = async (req, res, next) => {
    try {
        const roleDetail = await RoleBasedUser.findById({
            _id: req.params.id
        })

        res.status(200).json({ data: roleDetail });
    }
    catch (error) {
        console.error(error);
        next(error);
    }
}

const updateRoleDetails = async (req, res, next) => {
    try {
        const roleDetail = await RoleBasedUser.findOneAndUpdate(
            { _id: req.params.id },
            {
                name: req.body.name,
                routes: req.body.permissions,
                whiteArea: req.body.whiteArea
            },
            { new: true }
        )
        createLog("Updated Role Information named as " + roleDetail.name + " successfully by " + req.user.name);
        res.status(200).json({ message: "Role updated successfully" });
    }
    catch (error) {
        console.error(error);
        next(error)
    }

}

module.exports = {
    createNewRoleBasedUser,
    getAllRolesBasedUsers,
    deleteUserRole,
    getRoleDetail,
    updateRoleDetails
}