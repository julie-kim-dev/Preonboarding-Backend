import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';

const router = express.Router();
const users = [];

router.post('/login', async (req, res) => {
    const {username, password} = req.body;
    const user = users.find(user => user.username === username);

    if (!username || !password) {
        return res.status(400).json({message:'아이디 혹은 비밀번호를 입력해주세요.'})
    }
    
    if (!user) {
        return res.status(401).json({message:'아이디 혹은 비밀번호가 일치하지 않습니다.'})
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(!isPasswordValid) {
        return res.status(401).json({message:'아이디 혹은 비밀번호가 일치하지 않습니다.'})
    }

    const accessToken = jwt.sign({username}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15m'});
    const refreshToken = jwt.sign({username}, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

    res.status(200).json({message:'로그인 성공', accessToken, refreshToken});
});

router.post('/signup', async (req, res) => {
    const {username, password, nickname} = req.body;

    if (!username || !password) {
        return res.status(400).json({message:'아이디 혹은 비밀번호를 입력해주세요.'})
    }

    const userExist = users.some(user => user.username === username);
    if (userExist) {
        return res.status(400).json({message:'이미 등록된 아이디입니다.'})
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {username, password: hashedPassword, nickname: nickname || null, authorities: [{ authorityName: 'ROLE_USER' }] };

    users.push(newUser);

    res.status(201).json({
        message:'회원가입이 완료되었습니다.',
        username: newUser.username,
        nickname: newUser.nickname,
        authorities: newUser.authorities})
})

export default router;