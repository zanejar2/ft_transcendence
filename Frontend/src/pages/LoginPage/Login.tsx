import SkyNight from './assets/SkyNight.svg';
import table1 from './assets/table1.svg';
import bord from './assets/bord.svg';
// import nion from './assets/nion.gif'
// import border from './assets/border.gif'
import logo from '../../assets/logo.svg';
import './assets/Fly.css';
import logo42 from './assets/42.svg';
import google from './assets/google.svg';
import Particlebackground from '../../Particlebackground';

export const Login = () => {
    return (
        <div className="h-full flex items-center justify-center">
            <Particlebackground />
            <div className="w-[79.167vw] h-[41.094vw] flex justify-between rounded-[2.292vw] bg-[linear-gradient(109deg,_rgba(236,_219,_186,_0.66)_-46.82%,_rgba(45,_66,_99,_0.53)_32.05%,_rgba(45,_66,_99,_0.66)_50.26%)] [box-shadow:-0.052vw_-0.885vw_4.583vw_-0.625vw_rgba(82,_109,_130,_0.61)]">
                <div className="w-[39.583vw] h-[41.094vw] relative flex flex-col items-center">
                    <div className="w-[39.583vw] py-11 px-16 ">
                        <img
                            className="w-[6.942vw] h-[2.669vw]"
                            src={logo}
                            alt="/"
                        />
                    </div>
                    <div className="flex w-[36.875vw] h-[13.563vw] flex-col justify-center ">
                        <p className="text-[#9DB2BF] text-center font-['Poppins'] text-[3.229vw] not-italic font-black leading-[142.164%] capitalize tracking-[0.210vw]">
                            welcome
                        </p>
                        <p className="text-[#9DB2BF] text-center font-['Poppins'] text-[3.229vw] not-italic font-black leading-[142.164%] ">
                            To transcendence
                        </p>
                    </div>
                    <div className="w-[12.760vw] h-[8.281vw] relative ">
                        <div className="h-full flex justify-between">
                            <div className="w-[13.021vw] h-[3.125vw] flex items-center justify-between">
                                <a href ={`http://${import.meta.env.VITE_API_URI}/auth/42`}>
                                    <button className="flex items-center justify-center w-[18.760vw] h-[3.125vw] left-[-3vw] top-[0.981vw] absolute text-[#9DB2BF] hover:bg-[#ffffff54] hover:text-[#09090bba] text-right text-sm font-semibold font-['Poppins'] bg-zinc-950 bg-opacity-50 rounded-[2.292vw] shadow border-2 border-slate-400 hover:border-[#09090bba]">
                                        <img
                                            className="w-[1.75vw] ml-4 z-10"
                                            src={logo42}
                                            alt="/"
                                        />
                                        <p className="w-[8vw] text-[0.7vw] mr-4">
                                            Continue with INTRA
                                        </p>
                                    </button>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="mt-14 text-[#9DB2BF] text-[0.9vw] md:text-[0.9vw] font-['Mandali'] font-bold">
                        <h1> Winning Starts Here </h1>
                    </div>
                </div>
                <div className="relative">
                    <img
                        className="rounded-tr-[2.292vw] rounded-br-[2.292vw] [box-shadow:-2.292vw_-0.313vw_7.969vw_0.729vw_rgba(82,_109,_130,_0.74)] w-[39.583vw] h-[41.094vw] object-cover"
                        src={SkyNight}
                        alt="/"
                    />
                    <img
                        className="absolute left-[6.250vw] top-[7.031vw] w-[26.042vw] h-[26.042vw] object-cover flying-table"
                        src={table1}
                        alt="/"
                    />
                    <img
                        className="absolute left-[22.396vw] top-[8.594vw] w-[4.688vw] h-[5.469vw] object-cover flying-bord"
                        src={bord}
                        alt="/"
                    />
                    {/* <img className='absolute left-[6.250vw] top-[7.031vw] w-[26.042vw] h-[26.042vw] object-cover ' src={border} alt='/'/> */}
                </div>
            </div>
        </div>
    );
};
