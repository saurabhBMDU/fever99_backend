import User from '../Model/UserModel.js'
export const getReferalUser = async (req, res) => {
    try {
        const userId = req.user
        const user = await User.findById(userId)

        const users = await User.find({ usedRefrel: user.refrelCode })

        res.json({ data: users, status: true, message: 'user List' })
    } catch (error) {
        console.log(error)
    }
}