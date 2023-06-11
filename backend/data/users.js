import bcrypt from 'bcryptjs';

const users = [
  {
    name: 'MargamFarms Admin User',
    email: 'margamfarms@gmail.com',
    password: bcrypt.hashSync('margamoils', 10),
    isAdmin: true,
  },
  {
    name: 'Jayanth Kumar',
    email: 'jayanthkumar597@gmail.com',
    password: bcrypt.hashSync('jayanth', 10),
    isAdmin: false,
  },
  {
    name: 'Navin',
    email: 'navin@gmail.com',
    password: bcrypt.hashSync('navin', 10),
    isAdmin: false,
  },

];

export default users;