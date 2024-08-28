import moongoose from "mongoose";
import configKeys from "../../Config";

const connectDB = async () =>{
    try{
        await moongoose.connect(configKeys.MONGO_DB_URL);
    }catch(error){
        process.exit(1);
    }
};

export default connectDB;