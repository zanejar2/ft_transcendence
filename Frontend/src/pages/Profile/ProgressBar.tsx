import { useEffect, useState } from 'react';

type ProgressBarProps = {
    value: number;
    max?: number;
};

const ProgressBar = ({ value, max = 100 }: ProgressBarProps) => {
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const finalWidth = Math.min(((value * 5) / max) * 100, 100) + '%';

        const styleSheet = document.createElement('style');
        styleSheet.innerText = `
            @keyframes expandBar {
                from { width: 0%; }
                to { width: ${finalWidth}; }
            }
        `;
        document.head.appendChild(styleSheet);

        setLoaded(true);

        return () => {
            document.head.removeChild(styleSheet);
        };
    }, [value, max]);

    const barStyle = {
        backgroundColor: 'rgba(32,85,119,0.66)',
        backgroundSize: '40px 40px',
        backgroundImage: `linear-gradient(
            45deg,
            rgba(11,30,41,0.85) 25%,
            transparent 25%,
            transparent 50%,
            rgba(11,30,41,0.85) 40%,
            rgba(11,30,41,0.85) 75%,
            transparent 75%,
            transparent
        )`,
        animation: loaded ? 'expandBar 2s ease-in-out forwards' : ''
    };

    return (
        <div className="w-[23vw] border rounded-full border-stone-300 mx-auto text-center relative">
            <div className="rounded-full bg-white">
                <div className="h-5 rounded-full" style={barStyle} />
            </div>
        </div>
    );
};

export default ProgressBar;
