// import Aainhaja from '../HomePage/assets/aainhaja.svg'
import avatar1 from '../assets/hacker1.png'
import avatar2 from '../assets/fire1.png'
import avatar3 from '../assets/8pool1.png'
import avatar4 from '../assets/poker.png'
import avatar5 from '../assets/keyb.png'
import empty from '../assets/empty.svg'


function Achievement({ avatar }: { avatar: { avat: string } }) {
  return (
    <div className="scale-100 snap-center flex flex-shrink-0 justify-center w-[11.979vw] h-[11.979vw]">
      <img src={avatar.avat} alt="/" />
    </div>
  )
}

interface AchievementStateProps {
  win: number;
  lose: number;
  matchPlayed: number;
}

const AchievementState: React.FC<AchievementStateProps> = (props) => {

  let avatarsToRender = [avatar1];

  // Add avatars based on the conditions
  
  if (props.win > 0) {
    avatarsToRender.push(avatar2);
  }
  if (props.lose > 0) {
    avatarsToRender.push(avatar3);
  }
  if (props.win >= 5) {
    avatarsToRender.push(avatar4);
  }
  if (props.lose >= 5) {
    avatarsToRender.push(avatar5);
  }

  return (
    <div className="flex flex-col items-center justify-around w-[20.677vw] h-[18.5vw] rounded-[2.292vw] bg-[rgba(157,_178,_191,_0.35)] [box-shadow:0px_-1px_26px_-2px_rgba(82,_109,_130,_0.80)]">
      <div className="mt-4">
        <p className="text-[#DDDDDD] text-[1.5vw] text-center font-['Poppins'] font-medium capitalize">Achievements</p>
      </div>
      <div className="w-[15.5vw] h-[0.104vw] mb-2 bg-[#DDDDDD]"></div>
      <div className="flex mb-8">
        <div className="flex w-[20.573vw] h-[11.979vw] snap-center snap-x snap-mandatory overflow-scroll">
          <Achievement key="start" avatar={{ avat: empty }} />
          {avatarsToRender.map((avatar, index) => (
            <Achievement key={index} avatar={{ avat: avatar }} />
          ))}
          {/* Adding empty avatars at the start and end for aesthetic spacing */}
          <Achievement key="end" avatar={{ avat: empty }} />
        </div>
        <div className="h-[10.979vw] w-[4.167vw] absolute backdrop-blur-sm"></div>
        <div className="h-[11.979vw] w-[4.167vw] ml-[16.407vw] absolute backdrop-blur-sm"></div>
      </div>
    </div>
  );
}

export default AchievementState;
