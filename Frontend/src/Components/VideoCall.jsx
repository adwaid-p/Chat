import React, { useContext, useEffect, useRef, useState } from 'react';
import { CallDataContext } from '../context/CallContext';

const VideoCall = () => {
    const { callState, setCallState } = useContext(CallDataContext);
    const [stream, setStream] = useState(null);
    const videoRef = useRef(null);

    useEffect(() => {
        const startVideo = async () => {
            try {
                const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                setStream(localStream);
                if (videoRef.current) {
                    videoRef.current.srcObject = localStream;
                }
            } catch (error) {
                console.log('Error while accessing the camera', error);
            }
        };
        startVideo();
    }, []);

    // Function to stop the video stream
    const stopVideo = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop()); // Stop all media tracks
            setStream(null); // Clear the state
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null; // Remove video source
        }
        setCallState(false);
    };

    return (
        <div className='h-[83vh] w-full p-5 relative'>
            <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                className='h-full w-full border-2 border-gray-600 rounded-xl bg-[#172032] object-cover scale-x-[-1]'
            ></video>
            <div className='flex justify-center items-center gap-5 mt-5 text-lg absolute bottom-10 w-full'>
                <button className='bg-green-600 px-12 py-2 rounded'>Call</button>
                <button onClick={stopVideo} className='bg-red-600 px-12 py-2 rounded'>End</button>
            </div>
        </div>
    );
};

export default VideoCall;
