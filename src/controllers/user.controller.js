import { Router } from 'express';
import bcrypt from 'bcrypt';
import responses from '../helpers/responses.js';
import conn from '../main.js';
import userSchema from '../schemas/user.schema.js';
const userRouter = Router();

userRouter.get('/', (req, res) => {
    const sql = 'SELECT * FROM users';
    conn.query(sql, (err, result) => {
        if (err) throw err;

        responses.success(res, 'GET all users', result);
    });
}); // TODO get all users

userRouter.post('/', async (req, res) => {
    const { error, value } = userSchema.validate(req.body);
    if (error) responses.badRequest(res, error.details[0].message);

    const { name, email, password } = value;

    const hashedPassword = bcrypt.hashSync(password, 10);

    const sql = 'INSERT INTO users(name , email , password)  VALUES(?,?,?) ';

    conn.query(sql, [name, email, hashedPassword], (err, result) => {
        if (err) throw err;
        else console.log('Inserted 1 row');
    });

    responses.success(res, 'User Created Succesfully', value);
}); // TODO create a new user

userRouter.put('/:id', (req, res) => {
    const { id } = req.params;
    let getUser = `SELECT * FROM users WHERE id='${id}'`;

    conn.query(getUser, async (err, result) => {
        if (err) throw err;

        const { name, email, password } = req.body;
        const sql =
            'UPDATE users SET name=? , email=? , password=? WHERE id =?';

        // console.log(result);
        const match = await bcrypt.compare(password, result[0].password);

        if (match) {
            const hashedPassword = await bcrypt.hash(password, 10);
            conn.query(
                sql,
                [name, email, hashedPassword, id],
                (err, result) => {
                    if (err) throw err;

                    responses.success(
                        res,
                        'User updated successfully',
                        result.message
                    );
                }
            );
        } else responses.badRequest(res, 'wrong Password ');
    });
}); // TODO update a user
userRouter.delete('/', (req, res) => {}); // TODO delete a user
userRouter.post('/login', (req, res) => {}); // TODO login user

export default userRouter;
