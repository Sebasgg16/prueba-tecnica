const User = require('./../models/User')
const { generateToken } = require('./../middlewares/jwtGenerate')

const createUser = async(req, res) => {
    const { email, password } = req.body
    try {
        const user = await User.findOne({ email: email })
        if(user) return res.status(400).json({
            ok: false,
            msg: `${email} is already exist in database`
        })
        const dbUser = new User({
            email: email,
            password: password
        })
        await dbUser.save()

        return res.status(201).json({
            ok: true,
            msg: `${email} created successfuly`
        })
    } catch(error) {
        console.log(error.message)
        return res.status(500).json({
            ok: false,
            msg: error.message
        })
    } 
}

const loginUser  = async(req, res) => {
    const { email, password } = req.body
    try {
        const dbUser =  await User.findOne({ email })
        if(!dbUser) return res.status(400).json({
            ok: false,
            msg: 'User doesnt exist!!'
        })
        const validatePassword = password == dbUser.password
        if(!validatePassword) return res.status(400).json({
            ok: false,
            msg: 'Incorrect password!!'
        })
        const token = generateToken(dbUser._id, dbUser.email)

        return res.status(200).json({
            ok: true,
            msg: `${dbUser.email} Bienvenido a CSV Parser!!`,
            token: token
        })

    } catch(error) {
        console.log(error.message)
        return res.status(500).json({
            ok: false,
            msg: error.message
        })
    }
}

const deleteUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({
                ok: false,
                msg: `User with ID ${id} not found`
            });
        }
        return res.status(200).json({
            ok: true,
            msg: `User with ID ${id} deleted successfully`
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            ok: false,
            msg: error.message
        });
    }
};

const updateUser = async (req, res) => {
    const { id, email, password } = req.body;

    try {
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ 
                ok: false,
                msg: 'User not found'
            });
        }

        user.email = email || user.email;
        user.password = password || user.password;
        await user.save();

        return res.status(200).json({ 
            ok: true, 
            msg: `User with ID ${id} updated successfully`, 
            user 
        });
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({
            ok: false, 
            msg: error.message
        });
    }
};

const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ 
                ok: false, 
                msg: 'User not found' 
            });
        }
        return res.status(200).json({ 
            ok: true, 
            user 
        });
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ 
            ok: false, 
            msg: error.message
        });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        return res.status(200).json({
            ok: true,
            users 
        });
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ 
            ok: false,
            msg: error.message
        });
    }
};

module.exports = {
    createUser,
    loginUser,
    deleteUserById,
    updateUser,
    getUserById,
    getAllUsers
}