import { Request, Response } from 'express'
import { getUser } from '../mongoCRUDs'

interface reqBody {
  username: string
  password: string
}

export async function loginPOST(req: Request, res: Response) {
  try {
    const userToLogin = req.body as reqBody

    const users = await getUser(userToLogin.username, userToLogin.password)
    if (users) {
      res.status(200).json({
        username: users.login,
        role: users.role,
      })
    } else {
      res.status(401).send(`Users or Password not found!`)
    }
  } catch (err) {
    console.log(err)
    res.status(500).send('Internal Server Error')
  }
}
