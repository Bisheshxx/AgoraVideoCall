import React, { useEffect, useState } from "react";
import AgoraRTC, { IAgoraRTCRemoteUser } from "agora-rtc-sdk-ng";
import VideoPlayer from "../Videos";
import {
  channelName,
  useClient,
  useMicrophoneAndCameraTracks,
  config,
} from "@/utils/agora-util";
import { Grid } from "@material-ui/core";
import Controls from "../Controls";
import Videos from "../Videos";

const VideoCall = (props: { setInCall: any }) => {
  const { setInCall } = props;
  const [users, setUsers] = useState([]);
  const [start, setStart] = useState(false);
  const client = useClient();
  const { ready, tracks } = useMicrophoneAndCameraTracks();
  const handleUserJoined = async (
    user: IAgoraRTCRemoteUser,
    mediaType: any
  ) => {
    await client.subscribe(user, mediaType);
    if (mediaType === "video") {
      setUsers((previous) => [...previous, user]);
    }
    if (mediaType === "audio") {
      user.audioTrack.play();
    }
  };
  const handleUserUnpublished = async (
    user: IAgoraRTCRemoteUser,
    mediaType: any
  ) => {
    if (mediaType === "audio") {
      if (user.audioTrack) user.audioTrack.stop();
    }
    if (mediaType === "video") {
      setUsers((previousUsers) =>
        previousUsers.filter((User) => User.uid !== user.uid)
      );
    }
  };
  useEffect(() => {
    let init = async (name: any) => {
      client.on("user-published", handleUserJoined);
      client.on("user-unpublished", handleUserUnpublished);
      client.on("user-left", (user) => {
        setUsers((previousUsers) =>
          previousUsers.filter((User) => User.uid !== user.uid)
        );
      });
      try {
        await client.join(config.appId, name, config.token, null);
      } catch (error) {
        console.log(error);
      }
      if (tracks) {
        const [audioTrack, videoTrack] = tracks;
        await client.publish([audioTrack, videoTrack]);
      }
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
            <Controls tracks={tracks} setStart={start} setInCall={setInCall} />
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
