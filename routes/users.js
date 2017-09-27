import createUser from '../controllers/users/create_user';
import { userLogin, userLogout } from '../controllers/users/user_logInOut';

const userRoutes = (app) => {
  /* User Register */
  app.post('/API/user/register', (req, res, next) => {
    createUser(req.body, (err, result) => {
      if (err) {
        return next(err);
      }

      return res.status(result.status).send(result);
    });
  });

  /* User Login */
  app.post('/API/user/login', (req, res) => {
    userLogin(req, res);
  });

  /* User Logout */
  app.post('/API/user/logout', (req, res) => {
    userLogout(req, res);
  });
};

export default userRoutes;
