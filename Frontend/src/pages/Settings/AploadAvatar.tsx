import { userStore } from '../../store';
import axios from 'axios';
import toast from 'react-hot-toast';

function AploadAvatar() {
    const { user, setUser } = userStore();

    async function uploadAvatar(e: any) {
        const formData = new FormData();
        formData.append('image', e.target.files[0]);

        if (
            e.target.files &&
            e.target.files.length === 1 &&
            user &&
            user.picture
        ) {

            try {
                const res = await axios.post(
                    `http://${import.meta.env.VITE_API_URI}/Users/avatars`,
                    formData,
                    {
                        withCredentials: true
                    }
                );
                setUser({ ...user!, picture: res.data });

                toast.success('Avatar uploaded successfully');
            } catch (err) {
                console.log(err);
            }
        }
    }

    return (
        <div className="w-[7.813vw] h-[7.813vw]">
            <label htmlFor="uploadAvatar">
                <img
                    className="w-[7.813vw] h-[7.813vw] rounded-full absolute hover:opacity-25 hover:cursor-pointer hover:shadow-2xl transition duration-500 ease-in-out"
                    src={user?.picture}
                    width={150}
                    height={150}
                    alt=""
                />
            </label>
            <input
                id="uploadAvatar"
                type="file"
                onChange={uploadAvatar}
                accept="image/png, image/jpeg, image/jpg, image/svg"
                className="hidden"
            />
        </div>
    );
}

export default AploadAvatar;
