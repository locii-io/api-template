import { signToken, verifyPassword } from '../utils/index';
import db from '../models';

export async function login(req, res) {
  // Handle missing parameter: email
  if (!req.body.email) {
    return res.status(400).send({
      message: 'Missing email',
    });
  }

  // Handle missing parameter: password
  if (!req.body.password) {
    return res.status(400).send({
      message: 'Missing password',
    });
  }

  const user = await db.User.findOne({ where: { email: req.body.email } });
  // Handle when user doesn't exist
  if (!user) {
    return res.status(404).send({ message: 'User not found' });
  }

  // Verify password
  const is_verified = await verifyPassword(req.body.password, user.password);

  // Handle invalid credentials
  if (!is_verified) {
    return res.status(401).send({
      message: 'Invalid password',
    });
  }

  // Create token
  const token = signToken({ user_id: user.id, email: req.body.email });

  // Save user token
  user.set({ token: token });
  user.save();

  // Return token for valid credentials
  return res.status(200).send({
    token: token,
  });
}
