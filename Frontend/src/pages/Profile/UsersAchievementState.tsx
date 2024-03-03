import avatar1 from '../assets/hacker.png'
import avatar2 from '../assets/8pool1.png'
import avatar3 from '../assets/illuminate2.png'
import avatar4 from '../assets/chess.png'
import avatar5 from '../assets/poker3.png'
import empty from '../assets/empty.svg'
import { Key } from 'react'
import { userProps } from '../../interfaces/userProps'


function Achievement({ avatar }: { avatar: { avat: string } }) {
  return (
    <div className="scale-100 snap-center flex flex-shrink-0 justify-center w-[11.979vw] h-[11.979vw]">
      <img src={avatar.avat} alt="/" />
    </div>
  )
}


function UsersAchievementState({ data: { user } }: { data: { user: userProps } }) {
  return (
    <div className="flex flex-col items-center justify-around w-[20.677vw] h-[18.5vw] rounded-[2.292vw] bg-[rgba(157,_178,_191,_0.35)] [box-shadow:0px_-1px_26px_-2px_rgba(82,_109,_130,_0.80)]">
      <div className="mt-4">
        <p className="text-[#DDDDDD] text-[1.5vw] text-center font-['Poppins'] font-medium capitalize">Achievements</p>
      </div>
      <div className="w-[15.5vw] h-[0.104vw] mb-2 bg-[#DDDDDD]"></div>
      <div className="flex mb-8">
        <div className="flex w-[20.573vw] h-[11.979vw] snap-center snap-x snap-mandatory overflow-scroll">
          {user.achievements.length === 0 ? (
            <p className="text-[#DDDDDD] w-[5vw] text-[1.3vw] ml-20 mt-8 text-end font-['Poppins'] font-medium capitalize">
              No achievement yet</p>
          ) : (
            <>
              <Achievement avatar={{ avat: empty }} />
              {user.achievements.map((avatar: any, index: Key | null | undefined) => (
                <Achievement key={index} avatar={{ avat: avatar }} />
              ))}
              <Achievement avatar={{ avat: empty }} />
            </>
          )}
        </div>
        <div className="h-[10.979vw] w-[4.167vw] absolute backdrop-blur-sm"></div>
        <div className="h-[11.979vw] w-[4.167vw] ml-[16.407vw] absolute backdrop-blur-sm"></div>
      </div>
    </div>
  );
}

export default UsersAchievementState;
