const check =
  (...roles) =>
    (req, res, next) => {
      if (!req.user) {
        return res.status(401).send('Unauthorized');
      }

      const hasRole = roles.some(role => req.user.role.includes(role));
      if (!hasRole) {
        return res.status(403).send('You are not allowed to make this request.');
      }

      return next();
    };

export default check;
