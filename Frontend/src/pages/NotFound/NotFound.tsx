import {useNavigate} from "react-router-dom"
import Particlebackground from "../../Particlebackground";

function NotFound() {

  const navigate = useNavigate();
  
  const  handleClick = () => {
    navigate('/home');
  };
  
  return (
    <div className='h-full flex flex-col items-center'>
      {/* < Particlebackground /> */}
      <h1 className="text-[#9DB2BF] text-center font-['poppins'] text-[13.229vw] not-italic font-black leading-[142.164%]">404</h1>
      <h2 className="text-[#9DB2BF] text-center font-['poppins'] font-bold text-[5.229vw] not-italic">Page Not Found</h2>
      <div onClick={handleClick}>
          <button className="flex items-center justify-center mt-20 w-[15.760vw] h-[3.125vw] text-[#9DB2BF] hover:bg-[#ffffff54] hover:text-[#09090bba] text-right  md:text-[0.9vw] sm:text-[0.8vw]  font-['Poppins'] font-medium bg-zinc-950 bg-opacity-50 rounded-[2.292vw] shadow border-2 border-slate-400 hover:border-[#09090bba]" >
            <h1>Go Back Home</h1>
          </button>
      </div>
    </div>

  )
}

export default NotFound