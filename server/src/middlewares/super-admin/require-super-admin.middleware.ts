import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../../utils/response';
import { ROLES } from '../../constants/roles';

export const requireSuperAdmin = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    throw new HttpError('Unauthorized', 401);
  }

  if (req.user.role !== ROLES.SUPER_ADMIN) {
    throw new HttpError('Super admin access required', 403);
  }

  next();
};
