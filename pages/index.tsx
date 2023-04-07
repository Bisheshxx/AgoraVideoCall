import dynamic from "next/dynamic";
import { useState } from "react";
const VideoCall = dynamic(() => import("@/Components/VideoRoom"), {
  ssr: false,
});

export default function Home() {
  const [inCall, setInCall] = useState(false);
  return (
    <div style={{ height: "100%" }}>
      <div>Video Call</div>
      {!inCall && (
        <button onClick={() => setInCall(true)}>Join Call Room</button>
      )}
      {inCall && (
        <>
          {" "}
          {/* <button onClick={() => setJoined(false)}>Leave</button> */}
          <VideoCall setInCall={setInCall} />
        </>
      )}
    </div>
  );
}
