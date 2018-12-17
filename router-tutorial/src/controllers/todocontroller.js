const todocontroller = {};

todocontroller.addItem = (req, resp) => {
    resp.send({item:'additem'});
}

todocontroller.deleteItem = (req, resp) => {
    resp.send({item:'deleteitem'});
}

todocontroller.getItems = (req, resp) => {
    resp.send({item:'getitems'});
}

module.exports = todocontroller;