import React, { useEffect, useState, useRef } from "react";
import { Grid, GridSize } from "@material-ui/core";
import { AgoraVideoPlayer } from "agora-rtc-react";

const Video = ({ tracks, users, setInCall }) => {
  console.log(users, "users");
  const [videoTrack, audioTrack] = tracks;
  const [gridSpacing, setGridSpacing] = useState<any>(12);
  useEffect(() => {
    // setGridSpacing(Math.max(Math.floor(12 / users.length + 1), 4));
  }, [users, tracks]);

  return (
    <Grid container style={{ height: "100%" }}>
      <Grid item xs={gridSpacing}>
        <AgoraVideoPlayer
          videoTrack={tracks[1]}
          style={{ height: "400px", width: "400px" }}
        />
      </Grid>
      {users.length > 0 &&
        users.map((user) => {
          if (user.videoTrack) {
            return (
              <Grid item xs={gridSpacing}>
                {user.uid}
                <AgoraVideoPlayer
                  videoTrack={user.videoTrack}
                  key={user.uid}
                  style={{ height: "400px", width: "400px" }}
                />
              </Grid>
            );
          } else return null;
        })}
    </Grid>
  );
};

export default Video;
