import React, { useEffect, useState } from "react";
import AgoraRTC, { IAgoraRTCRemoteUser } from "agora-rtc-sdk-ng";
import VideoPlayer from "../Video";
import {
  channelName,
  useClient,
  useMicrophoneAndCameraTracks,
  config,
} from "@/utils/agora-util";
import { Grid } from "@material-ui/core";
import Controls from "../Controls";
import Videos from "../Video";

const VideoCall = (props: { setInCall: any }) => {
  const { setInCall } = props;
  const [users, setUsers] = useState<any>([]);
  const [start, setStart] = useState(false);
  const client = useClient();
  const { ready, tracks } = useMicrophoneAndCameraTracks();

  useEffect(() => {
    let init = async (name) => {
      client.on("user-published", async (user: any, mediaType) => {
        await client.subscribe(user, mediaType);
        if (mediaType === "video") {
          setUsers((prevUsers) => {
            // return [
            //   ...prevUsers,
            //   { uid: user.uid, videoTrack: user.videoTrack },
            // ];
            return prevUsers.concat({
              uid: user.uid,
              videoTrack: user.videoTrack,
            });
          });
        }
        if (mediaType === "audio") {
          user.audioTrack.play();
        }
      });

      client.on("user-unpublished", (user: any, mediaType) => {
        if (mediaType === "audio") {
          if (user.audioTrack) user.audioTrack.stop();
        }
        if (mediaType === "video") {
          setUsers((prevUsers) => {
            return prevUsers.filter((User) => User.uid !== user.uid);
          });
        }
      });

      client.on("user-left", (user) => {
        setUsers((prevUsers) => {
          return prevUsers.filter((User) => User.uid !== user.uid);
        });
      });

      try {
        await client.join(config.appId, name, config.token, null);
      } catch (error) {
        console.log("error");
      }

      if (tracks) await client.publish([tracks[0], tracks[1]]);
      setStart(true);
    };

    if (ready && tracks) {
      try {
        init(channelName);
      } catch (error) {
        console.log(error);
      }
    }
  }, [channelName, client, ready, tracks]);

  return (
    <>
      <Grid container direction="column" style={{ height: "100%" }}>
        <Grid item style={{ height: "5%" }}>
          {ready && tracks && (
            <Controls
              tracks={tracks}
              setStart={setStart}
              setInCall={setInCall}
            />
          )}
        </Grid>
        <Grid item style={{ height: "95%" }}>
          {start && tracks && (
            <Videos tracks={tracks} users={users} setInCall={setInCall} />
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default VideoCall;
