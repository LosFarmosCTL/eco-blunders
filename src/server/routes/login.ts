import { Request, Response } from 'express'
import { findOneUser } from '../mongoCRUDs'

export async function loginPOST(req: Request, res: Response) {
  try {
    //let userDoc = await mongo_cruds.findOneUser("admina", "pass1234");
    console.log(req.body)
    const userToLogin = req.body

    const users = await findOneUser(userToLogin.username, userToLogin.password)
    if (users) {
      console.log('result found, sending username')
      res.status(200).json({
        username: users.username,
        role: users.role,
      })
    } else {
      res.status(404).send(`Users not found!`)
    }
  } catch (err) {
    console.log(err)
    res.status(400).send('Something is not right!!')
  }
}
