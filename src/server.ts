import app from "./app";
import config from "./config/varibales";
import { dbConnection } from "./config/dbconnection";


const PORT = config.PORT || 3030


app.listen(PORT, async() => {
    await dbConnection();
    console.log(`Server is running on port http://localhost:${PORT}`)
})