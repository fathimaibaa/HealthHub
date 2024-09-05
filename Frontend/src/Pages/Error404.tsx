
import { useNavigate } from "react-router-dom";


function NotFoundPage() {
  const navigate = useNavigate();

    return (
        <div className="flex items-center justify-center min-h-screen bg-purple-600 bg-fixed bg-cover bg-bottom error-bg">
            <div className="container">
                <div className="row pb-1">
                    <div className="col-sm-8 offset-sm-2 text-gray-50 text-center -mt-52">
                        <div className="relative">
                            <h1 className="relative text-9xl tracking-tighter-less text-shadow font-sans font-bold">
                                <span>4</span><span>0</span><span>4</span>
                            </h1>
                            <span className="absolute top-0 -ml-12 text-white font-semibold">Oops!</span>
                        </div>
                        <h5 className="text-white font-semibold -mr-10 -mt-3">Page not found</h5>
                        <p className="text-white mt-2 mb-6">We are sorry, but the page you requested was not found</p>
                        
                    </div>
                </div>
                
                <center className="mt-6">
        <a
          href="#"
          className="text-gray-700 font-mono text-xl bg-gray-200 p-3 rounded-md hover:shadow-md"
          onClick={() => navigate(-1)}
        >
          Go back
        </a>
      </center>
            </div>
        </div>
    );
}

export default NotFoundPage;