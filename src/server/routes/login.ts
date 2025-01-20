import { Router } from 'express'
import { getUser } from '../mongoCRUDs'

const router = Router()

router.post('/', async (req, res) => {
  if (!validateLoginRequest(req.body)) {
    res.status(400).send('Invalid login request')
    return
  }

  const user = await getUser(req.body.username, req.body.password)

  if (user) {
    delete user.password
    res.status(200).json(user)
  } else {
    res.status(401).send(`Username/Password combination invalid!`)
  }
})

export default router

function validateLoginRequest(
  reqBody: unknown,
): reqBody is { username: string; password: string } {
  return (
    typeof reqBody === 'object' &&
    reqBody !== null &&
    'username' in reqBody &&
    'password' in reqBody &&
    typeof (reqBody as { username: string }).username === 'string' &&
    typeof (reqBody as { password: string }).password === 'string'
  )
}
