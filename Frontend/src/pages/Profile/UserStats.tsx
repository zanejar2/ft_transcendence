import { matchHistoryProps } from '../../interfaces/matchHistoryProps';
import { userProps } from '../../interfaces/userProps';

interface UserStatsProps {
    data: userProps;
    UserHistory: matchHistoryProps[];
}

const UserStats: React.FC<UserStatsProps> = ({ data, UserHistory }) => {
    return (
        <div className="w-[31.250vw] h-[17.5vw] flex justify-around items-end ">
            <div
                className="w-[1.042vw] bg-[#c9604dc7]"
                style={{ height: UserHistory.length * 9 }}
            ></div>
            <div
                className="w-[1.042vw] bg-[#41a253de]"
                style={{ height: data.Wins * 15 }}
            ></div>
            <div
                className="w-[1.042vw] bg-[#620d0dc5]"
                style={{ height: data.Lost * 15 }}
            ></div>
        </div>
    );
};
export default UserStats;
