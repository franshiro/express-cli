import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt'

import UserService from '../services/masterdata/UserService'

const opts = {}

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
opts.secretOrKey = process.env.JWT_SECRET

export default new JwtStrategy(opts, async (payload, next) => {
	const userService = new UserService()
	const user = await userService.findUser({ id: payload.id })
	if (user) {
		return next(null, user)
	}

	return next(null, false)
})
