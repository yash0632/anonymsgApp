import mongoose from "mongoose"


type connectionObject={
    isConnected? : number
}

const connection:connectionObject={};

async function dbConnect():Promise<void>{
    if(connection.isConnected){
        return
    }

    try{
        const db = await mongoose.connect(process.env.MONGODB_URL||"",{})
        connection.isConnected = db.connections[0].readyState;

        console.log("DB connected Successfully");
    }
    catch(err){
        console.log("Database connection failed",err);
        process.exit(1);
    }
}

