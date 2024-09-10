

db.createUser({
    user: process.env.USERNAME_DB,
    pwd: process.env.PASSWORD_DB,
    roles: [
      {
        role: "readWrite",
        db: process.env.DATABASE
      }
    ]
  });
  