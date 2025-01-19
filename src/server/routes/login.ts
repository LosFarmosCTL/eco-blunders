import { Request, Response } from 'express'
import { findOneUser } from '../mongoCRUDs'

interface reqBody {
  username: string
  password: string
}

export async function loginPOST(req: Request, res: Response) {
  try {
    //let userDoc = await mongo_cruds.findOneUser("admina", "pass1234");
    console.log(req.body)
    const userToLogin = req.body as reqBody

    const users = await findOneUser(userToLogin.username, userToLogin.password)
    if (users) {
      console.log('result found, sending username')
      res.status(200).json({
        username: users.username as string,
        role: users.role as string,
      })
    } else {
      res.status(401).send(`Users or Password not found!`)
    }
  } catch (err) {
    console.log(err)
    res.status(500).send('Internal Server Error')
  }
}
