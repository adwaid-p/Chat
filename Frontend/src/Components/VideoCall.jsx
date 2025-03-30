import React, { useContext, useEffect, useRef, useState } from 'react';
import { CallDataContext } from '../context/CallContext';
import Peer from 'peerjs';
import { MessageDataContext } from '../context/MessageContext';

const VideoCall = () => {
    const { callState, setCallState } = useContext(CallDataContext);
    const [stream, setStream] = useState(null);
    const [peerId, setPeerId] = useState(null);

    const receiveVideoRef = useRef(null);
    const localVideoRef = useRef(null);
    const peerRef = useRef(null)

    const userId = JSON.parse(localStorage.getItem('user_id'))
    // console.log('current user id for video call',userId)

    const { receiver } = useContext(MessageDataContext)
    // console.log('the receiver for peer is',receiver)

    useEffect(() => {
        const peer = new Peer(userId)
        peerRef.current = peer
        peer.on('open', id => {
            console.log('Peer ID:', id);
            setPeerId(id)
        })

        peer.on('call', call => {
            if (stream) {
                call.answer(stream)
                call.on('stream', remoteVideo => {
                    if (receiveVideoRef.current) {
                        receiveVideoRef.current.srcObject = remoteVideo
                    }
                })
            }
        })
        return () => {
            peer.destroy()
        }
    }, [stream])

    useEffect(() => {
        const startVideo = async () => {
            try {
                const localVideo = await navigator.mediaDevices.getUserMedia({ audio: true, video: true })
                setStream(localVideo)
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = localVideo
                }
            } catch (error) {
                console.log('Error accessing camera: ', error)
            }
        }
        startVideo()
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop())
            }
        }
    }, [])

    const startCall = () => {
        if (!stream || !receiver?._id || !peerRef.current) {
            console.log('Cannot start call: Missing stream, receiver, or peer');
            return
        }
        
        const call = peerRef.current.call(receiver._id, stream)
        call.on('stream', remoteVideo => {
            if (receiveVideoRef.current) {
                receiveVideoRef.current.srcObject = remoteVideo
            }
        })
    }

    const stopVideo = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop())
            setStream(null)
        }
        if (localVideoRef.current) {
            localVideoRef.current.srcObject = null
        }
        setCallState(false)
    }

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
                <button onClick={startCall} className='bg-green-600 px-12 py-2 rounded'>Call</button>
                <button onClick={stopVideo} className='bg-red-600 px-12 py-2 rounded'>End</button>
            </div>
        </div>
    );
};

export default VideoCall;
