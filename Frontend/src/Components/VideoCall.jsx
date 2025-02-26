import React, { useContext, useEffect, useRef, useState } from 'react';
import { CallDataContext } from '../context/CallContext';
import Peer from 'peerjs';
import { MessageDataContext } from '../context/MessageContext';

const VideoCall = () => {
    const { callState, setCallState } = useContext(CallDataContext);
    const [stream, setStream] = useState(null);
    const receiveVideoRef = useRef(null);
    const localVideoRef = useRef(null);

    const userId = JSON.parse(localStorage.getItem('user_id'))
    // console.log('current user id for video call',userId)

    const { receiver } = useContext(MessageDataContext)
    // console.log('the receiver for peer is',receiver)

    const peer = new Peer(userId)

    useEffect(() => {
        const startVideo = async () => {
            try {
                const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                setStream(localStream);
                if (localVideoRef.current) {
                    // receiveVideoRef.current.srcObject = localStream;
                    localVideoRef.current.srcObject = localStream;
                }
            } catch (error) {
                console.log('Error while accessing the camera', error);
            }
        };
        startVideo();
    }, []);

    useEffect(() => {
        // navigator.mediaDevices.getUserMedia({video:true, audio: true}).then(stream)
        peer.on('open', id => {
            console.log('the peer id is', id)
        })
        const call = peer.call(receiver._id, stream)

        call.on('stream', receivedVideo =>{
            receiveVideoRef.current.srcObject = receivedVideo
        })

        peer.on('call', call=>{
            call.answer(stream)
            call.on('stream', receivedVideo=>{
                receiveVideoRef.current.srcObject = receivedVideo
            })
        })
    }, [stream])

    // Function to stop the video stream
    const stopVideo = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop()); // Stop all media tracks
            setStream(null); // Clear the state
        }
        if (localVideoRef.current) {
            localVideoRef.current.srcObject = null; // Remove video source
        }
        setCallState(false);
    };

    return (
        <div className='h-[83vh] w-full p-5 relative'>
            <video
                ref={receiveVideoRef}
                autoPlay
                playsInline
                className='h-full w-full border-2 border-gray-600 rounded-xl bg-[#172032] object-cover scale-x-[-1]'
            ></video>
            <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                className='aspect-[9/16] w-[100px] border-2 border-gray-600 rounded-xl bg-[#172032] object-cover scale-x-[-1] absolute bottom-10 right-10'
            ></video>
            <div className='flex justify-center items-center gap-5 mt-5 text-lg absolute bottom-10 w-full'>
                <button className='bg-green-600 px-12 py-2 rounded'>Call</button>
                <button onClick={stopVideo} className='bg-red-600 px-12 py-2 rounded'>End</button>
            </div>
        </div>
    );
};

export default VideoCall;
