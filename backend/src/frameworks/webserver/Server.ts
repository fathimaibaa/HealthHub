import {Server} from 'http';
import configKeys from '../../Config';

const serverConfig=(server:Server)=>{
    const startServer=()=>{
        server.listen(configKeys.PORT,()=>{
            console.log(`Server listening on Port  http://localhost:${configKeys.PORT}`);
            
        })
    }
    return {
        startServer
    }
}
export default serverConfig
