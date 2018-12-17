const usercontroller = require('./controllers/usercontroller');
const todocontroller = require('./controllers/todocontroller');

module.exports = (app) => {

	app.get('/api/v1/todo/:id', usercontroller.auth, todocontroller.getItems);
	app.post('/api/v1/todo/add/:id', usercontroller.auth, todocontroller.addItem);
	app.post('/api/v1/todo/delete/:id', usercontroller.auth, todocontroller.deleteItem);

	app.post('/api/v1/user/login', usercontroller.login);
	app.post('/api/v1/user/register', usercontroller.auth, usercontroller.register);
	app.post('/api/v1/user/logout', usercontroller.auth, usercontroller.logout);

};