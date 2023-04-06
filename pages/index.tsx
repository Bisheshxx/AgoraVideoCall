import dynamic from "next/dynamic";
import { useState } from "react";
const VideoCall = dynamic(() => import("@/Components/VideoCall"), {
  ssr: false,
});

export default function Home() {
  const [joined, setJoined] = useState(false);
  return (
    <>
      <div>Video Call</div>
      {!joined && (
        <button onClick={() => setJoined(true)}>Join Call Room</button>
      )}
      {joined && (
        <>
          {" "}
          <button onClick={() => setJoined(false)}>Leave</button>
          {/* <VideoCall /> */}
        </>
      )}
    </>
  );
}
