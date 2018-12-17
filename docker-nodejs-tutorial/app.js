const express = require('express');
const app = express();
app.get('/login', (req, resp) => {
    resp.send({
        hello: "how are you doing ?"
    });
})
app.listen(3000, () => console.log('server running on port 3000'));