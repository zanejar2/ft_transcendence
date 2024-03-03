import avatar1 from '../assets/hacker1.png';
import avatar2 from '../assets/fire1.png';
import avatar3 from '../assets/8pool1.png';
import avatar4 from '../assets/poker.png';
import avatar5 from '../assets/keyb.png';
import LockClose from '../assets/lockClose.svg';
import LockOpen from '../assets/lockOpen.svg';

function AchievementsDescriptionComponent({
    data
}: {
    data: {
        achievement: string;
        lock: string;
        title: string;
        description: string;
    };
}) {
    return (
        <div className="w-[36.458vw] h-[3.646vw] flex items-center rounded-[1vw] hover:bg-slate-700 hover:scale-105 transition duration-100 hover:[box-shadow:0px_-1px_26px_-2px_rgba(82,_109,_130,_0.80)]">
            <div className="w-[33.854vw] h-[3.646vw] flex justify-around items-center ">
                <div className="w-[3.646vw] h-[3.646vw] ml-2">
                    <img
                        className="w-[3.646vw] h-[3.646vw] object-contain"
                        src={data.achievement}
                        alt="/"
                    />
                </div>
                <div className="w-[29.167vw] h-[3.646vw] flex flex-col items-start justify-center">
                    <h1 className="text-start text-[0.729vw] font-['Poppins'] capitalize font-bold bg-clip-text text-transparent bg-[linear-gradient(144deg,_rgba(221,_221,_221,_0.98)_-16.98%,_rgba(221,_221,_221,_0.98)_21.3%,_rgba(200,_75,_49,_0.98)_149.96%)]">
                        {data.title}
                    </h1>
                    <h2 className="text-[#DDDDDD] text-start text-[0.677vw] font-['Poppins'] font-medium capitalize">
                        {data.description}
                    </h2>
                </div>
            </div>
            <div className="w-[2.604vw] h-[3.646vw] mr-3 flex justify-center items-center">
                <img
                    className="w-[1.563vw] h-[1.563vw]"
                    src={data.lock}
                    alt="/"
                />
            </div>
        </div>
    );
}

interface AchievementStateProps {
    win: number;
    lose: number;
}

const AchievementDescription: React.FC<AchievementStateProps> = (props) => {
    let avatarsToRender = [avatar1];

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
        <>
            <AchievementsDescriptionComponent
                data={{
                    achievement: avatar1,
                    lock: avatarsToRender.includes(avatar1)
                        ? LockOpen
                        : LockClose,
                    title: 'Inaugural Entrant:',
                    description:
                        'Unlock the Inaugural Entrant achievement by logging in for the first time, marking the beginning of your journey.'
                }}
            />
            <AchievementsDescriptionComponent
                data={{
                    achievement: avatar2,
                    lock: avatarsToRender.includes(avatar2)
                        ? LockOpen
                        : LockClose,
                    title: 'Victory Initiate:',
                    description:
                        'Earn the Victory Initiate achievement with your first win, demonstrating your budding prowess.'
                }}
            />
            <AchievementsDescriptionComponent
                data={{
                    achievement: avatar3,
                    lock: avatarsToRender.includes(avatar3)
                        ? LockOpen
                        : LockClose,
                    title: 'Battle-Scarred Learner:',
                    description:
                        'Gain the Battle-Scarred Learner title through your first defeat, a stepping stone to resilience and strategy refinement.'
                }}
            />
            <AchievementsDescriptionComponent
                data={{
                    achievement: avatar4,
                    lock: avatarsToRender.includes(avatar4)
                        ? LockOpen
                        : LockClose,
                    title: 'Quintessential Victor:',
                    description:
                        'Claim the Quintessential Victor achievement after securing 5 wins, showcasing your competitive edge.'
                }}
            />
            <AchievementsDescriptionComponent
                data={{
                    achievement: avatar5,
                    lock: avatarsToRender.includes(avatar5)
                        ? LockOpen
                        : LockClose,
                    title: 'Resilient Challenger:',
                    description:
                        'Achieve the Resilient Challenger status upon your 5th loss, proof of your unwavering spirit and determination to improve.'
                }}
            />
        </>
    );
};

export default AchievementDescription;
