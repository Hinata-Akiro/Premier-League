import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { createToken, hashPassword } from '../../utils/helper';
import { createUserService,loginUserService } from '../service';

const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const hashedPassword = await hashPassword(req.body.password);
    req.body.password = hashedPassword;

    const response = await createUserService(req.body);
    return res.status(response.code).send(response);
  } catch (error:any) {
    return res.status(400).json({ msg: error.errors });
  }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const { code, msg, user } = await loginUserService(req.body);

    if(code === 200 && user) {
      const token = await createToken(user._id);
      return res.status(code).send({ msg, name:user.name , token});
    }else if (code === 400){
      return res.status(code).send({ msg });
    }
  } catch (error) {
    return next({ code: 500, msg: "Internal Server Error", error });
  }
}



export  {register, login};
