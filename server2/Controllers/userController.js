const userModel = require("../Models/userModel")
const bcrypt = require("bcrypt");
const validator = require("validator")
const jwt = require("jsonwebtoken")

const createToken = (_id) => {
    const jwtkey = process.env.JWT_SECRET_KEY

    return jwt.sign({ _id }, jwtkey, { expiresIn: "3d" });
}

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // tìm email
        let user = await userModel.findOne({ email });

        // nếu email ok là đã đăng ký rồi thì hiện lỗi ko cho đăng ký
        if (user) return res.status(400).json("Email này đã được đăng ký rồi...");

        // nếu dữ liệu ko nhập vào thì thông báo
        if (!name || !email || !password) return res.status(400).json("Các trường chưa được nhập...");

        if (!validator.isEmail(email))
            return res.status(400).json("Email must be a valid email...");

        if (!validator.isStrongPassword(password))
            return res.status(400).json("Password must be a strong password...");

        // nếu thỏa mãn
        user = new userModel({ name, email, password })

        // đoạn này mã hóa password
        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(user.password, salt)

        await user.save();
        const token = createToken(user._id)
        res.status(200).json({ _id: user.id, name, email, token });

    } catch (error) {
        console.log(error);
        res.status(500).json(error);

    }

};


const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // tìm email
        let user = await userModel.findOne({ email });

        // nếu email mà user login không có trong csdl thì hiện lỗi
        if (!user) return res.status(400).json("Sai email hoặc mật khẩu...")

        // đoạn này nó sẽ giải mã password trong csdl và password người dùng login
        const isValidPassword = await bcrypt.compare(password, user.password);

        // nếu mà password ko khớp thì thông báo lỗi
        if (!isValidPassword)
            return res.status(400).json("Sai email hoặc mật khẩu...")

        const token = createToken(user._id)
        res.status(200).json({ _id: user.id, name: user.name, email, token });

    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

// tìm user dựa vào id
const findUser = async (req, res) => {
   const userId = req.params.userId;
   try {
     const user = await userModel.findById(userId)
       res.status(200).json(user)
   } catch (error) {
       console.log(error);
       res.status(500).json(error);
   }
}

// tìm All user
const getUsers = async (req, res) => {
    try {
        const users = await userModel.find()
        res.status(200).json(users)
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

// xuất ra để file routes sử dụng
module.exports = { registerUser, loginUser, findUser, getUsers }