import React, { useEffect, useRef, useState } from "react";
import { db } from "./firebase";
import { ref, onValue, set, remove, push } from "firebase/database";
import { useSearchParams } from "react-router-dom";

export default function CallPage() {
    const [params] = useSearchParams();
    const me = params.get("me");
    const other = params.get("to");

    const videoMine = useRef(null);
    const videoOther = useRef(null);
    const pc = useRef(null);
    const [video, setVideo] = useState(true);

    useEffect(() => {
        const servers = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };
        pc.current = new RTCPeerConnection(servers);

        pc.current.ontrack = (e) => {
            videoOther.current.srcObject = e.streams[0];
        };

        navigator.mediaDevices.getUserMedia({ video, audio: true }).then((stream) => {
            stream.getTracks().forEach((t) => pc.current.addTrack(t, stream));
            videoMine.current.srcObject = stream;

            listenForOffer();
            listenForAnswer();
            listenForCandidates();
        });
    }, [video]);

    function listenForOffer() {
        onValue(ref(db, `calls/${other}/offer`), async (snap) => {
            if (!snap.exists()) return;
            const offer = snap.val();
            await pc.current.setRemoteDescription(offer);
            const ans = await pc.current.createAnswer();
            await pc.current.setLocalDescription(ans);
            set(ref(db, `calls/${me}/answer`), ans);
        });
    }

    function listenForAnswer() {
        onValue(ref(db, `calls/${me}/answer`), async (snap) => {
            if (!snap.exists()) return;
            const ans = snap.val();
            await pc.current.setRemoteDescription(ans);
        });
    }

    function listenForCandidates() {
        pc.current.onicecandidate = (e) => {
            if (e.candidate) {
                push(ref(db, `calls/${other}/candidates`), e.candidate);
            }
        };
        onValue(ref(db, `calls/${me}/candidates`), (snap) => {
            snap.forEach((child) => {
                pc.current.addIceCandidate(new RTCIceCandidate(child.val()));
            });
        });
    }

    return (
        <div className="call-screen">
            <video ref={videoOther} autoPlay playsInline className="video-remote" />
            <video ref={videoMine} autoPlay muted playsInline className="video-self" />

            <div className="call-controls">
                <button onClick={() => setVideo((v) => !v)}>
                    {video ? "Turn Camera Off" : "Turn Camera On"}
                </button>
                <button
                    onClick={() => {
                        remove(ref(db, `calls/${me}`));
                        remove(ref(db, `calls/${other}`));
                        window.close();
                    }}
                    style={{ background: "#d40000", color: "white" }}
                >
                    End Call
                </button>
            </div>
        </div>
    );
}
