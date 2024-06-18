const express = require('express');
const { userRouter, postRouter, uploadRouter } = require('./routes/index');
const cors = require('cors')
const PORT = process.env.PORT || 8080;

require('./db/init');

const app = express();
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));


app.use(userRouter);
app.use(postRouter);
app.use(uploadRouter);

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
