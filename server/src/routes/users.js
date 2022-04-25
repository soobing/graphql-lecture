import { readDB } from '../dbController.js'

const getUsers = () => readDB('users');

const usersRoute = [
  {
    method: 'get',
    route: '/users',
    handler: (req, res) => {
      res.send(getUsers())
    }
  },
  {
    method: 'get',
    route: '/users/:id',
    handler: ({ params: { id } }, res) => {
      try {
        const users = getUsers();
        const user = users[id];
        if (!user) throw Error('not found');
        res.send(user);
      } catch (err) {
        res.status(404).send({ error: err })
      }
    }
  },
]

export default usersRoute;