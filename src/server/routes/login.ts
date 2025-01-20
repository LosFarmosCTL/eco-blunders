import { Request, Response } from 'express'
import { getUser } from '../mongoCRUDs'

export async function loginPOST(req: Request, res: Response) {
  if (!validateLoginRequest(req.body)) {
    return res.status(400).send('Invalid login request')
  }

  const user = await getUser(req.body.username, req.body.password)

  if (user) {
    delete user.password
    res.status(200).json(user)
  } else {
    res.status(401).send(`Username/Password combination invalid!`)
  }
}

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
