import { Link } from 'react-router-dom'
import Logo from '../../assets/logo.svg'
import Noti from './assets/Notification.svg'


function GameNavBar() {

  return (
    <div className="w-full h-[4.688vw] flex items-center justify-between">
      <div className='px-8'>
        <Link to="/home" >
          <img className='w-[7vw]' src={Logo} alt='/' />
        </Link>
      </div>
      <div className='w-[5.625vw] flex items-center justify-between'>
        <button className='w-[3.385vw] h-[2.344vw] rounded-[2.292vw] bg-[rgba(157,_178,_191,_0.35)] [box-shadow:0px_-1px_26px_-2px_rgba(82,_109,_130,_0.80)]'>
          <img className='ml-[1.094vw] h-[1.302vw] hover:scale-105 transition-all' src={Noti} alt="/" />
        </button>
      </div>
    </div>
  )
}

export default GameNavBar
