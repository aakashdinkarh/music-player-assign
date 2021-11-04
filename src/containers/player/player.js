import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faPause,
  faBackward,
  faFastBackward,
  faForward,
  faFastForward,
  faVolumeUp,
} from "@fortawesome/free-solid-svg-icons";
// import store from "../store";
import "./player.css";
import ReactWaves from "@dschoon/react-waves";

export default function Player() {
  const url = JSON.parse(localStorage.getItem("AudioFile")); //get audio from localStorage
  const songName = JSON.parse(localStorage.getItem("songName")); //get audio name from localStorage
  const audioPlayer = useRef(null);
  const volEl = useRef(null);
  const seekBar = useRef(null);
  const [wavPos, setWavPos] = useState(0);

  const [isPlaying, setIsPlaying] = useState(false); //define play state of audio
  const [dur, setDur] = useState(0);
  const [curr, setCurr] = useState(0);
  const [btn, setBtn] = useState(faPlay);
  const [wavInst, setwavInst] = useState(null);

  useEffect(() => {
    audioPlayer.current.addEventListener("ended", () => {
      playPause();
      setIsPlaying(false);
    });
  }, [isPlaying]);

  useEffect(() => {
    audioPlayer.current.addEventListener("loadeddata", () => {
      setDur(audioPlayer.current.duration);
    });
    audioPlayer.current.ontimeupdate = () => {
      setCurr(audioPlayer.current.currentTime);
      seekBar.current.value = audioPlayer.current.currentTime;
      let x = seekBar.current.value;
      setWavPos(audioPlayer.current.currentTime);
      wavInst &&
        wavInst.seekTo &&
        wavInst.seekTo(
          (1 / wavInst.getDuration()) * audioPlayer.current.currentTime
        );
      let color = `linear-gradient(90deg, #dfd01f ${
        (x / dur) * 100
      }%, rgb(148, 148, 148) ${(x / dur) * 100}%`;
      seekBar.current.style.background = color;
    };
  });
  useEffect(() => {
    volEl.current.addEventListener("input", () => {
      audioPlayer.current.volume = volEl.current.value;
      let x = volEl.current.value;
      let color = `linear-gradient(90deg, #dfd01f ${
        x * 100
      }%, rgb(148, 148, 148) ${x * 100}%`;
      volEl.current.style.background = color;
    });
    seekBar.current.addEventListener("input", () => {
      audioPlayer.current.currentTime = seekBar.current.value;
      let x = seekBar.current.value;
      let color = `linear-gradient(90deg, #dfd01f ${
        (x / dur) * 100
      }%, rgb(148, 148, 148) ${(x / dur) * 100}%`;
      seekBar.current.style.background = color;
    });
  });

  var playPause = () => {
    if (isPlaying) {
      audioPlayer.current.pause();
      setBtn(faPlay);
    } else {
      audioPlayer.current.play();
      setBtn(faPause);
    }
    setIsPlaying(!isPlaying);
  };

  var changeStep = (flag) => {
    //flag === true => forward else backward
    let x = audioPlayer.current.currentTime;
    if (flag) {
      if (x + 5 > dur) audioPlayer.current.currentTime = dur;
      else audioPlayer.current.currentTime = x + 5;
    } else {
      if (x - 5 < 0) audioPlayer.current.currentTime = 0;
      else audioPlayer.current.currentTime = x - 5;
    }
  };
  var changeFull = (flag) => {
    //flag === true => apporach end, else approach start
    if (flag) {
      audioPlayer.current.currentTime = dur;
    } else {
      audioPlayer.current.currentTime = 0;
    }
  };

  return (
    <>
      <audio hidden ref={audioPlayer} src={url} controls></audio>
      <div className="playBack"></div>
      <div className="playBox">
        <ReactWaves
          // key={wavPos}
          audioFile={url}
          className={"react-waves"}
          options={{
            barHeight: 2,
            cursorWidth: 0,
            height: 100,
            hideScrollbar: true,
            progressColor: "#ffea00",
            responsive: true,
            waveColor: "#D1D6DA",
          }}
          pos={wavPos}
          onPosChange={(pos, inst) => setwavInst(inst)}
          duration={dur}
          volume={0}
          zoom={0}
          playing={isPlaying}
        />
        <div className="timeDetail">
          <div className="currTime">
            <span title="Current Time" id="current">
              {`${Math.floor(curr / 60)}:${("0" + Math.floor(curr % 60)).slice(
                -2
              )}`}
            </span>
          </div>
          <div className="seekContainer">
            <input
              title="Seekbar"
              ref={seekBar}
              type="range"
              max={dur}
              min="0"
              step="0.1"
            />
          </div>
          <div title="Song Duration" className="duration">
            <span>
              {" "}
              {`${Math.floor(dur / 60)}:${("0" + Math.floor(dur % 60)).slice(
                -2
              )}`}{" "}
            </span>
          </div>
        </div>
        <div className="downControls">
          <div className="btnBox">
            <button
              title="prev song"
              onClick={() => {
                changeFull(false);
              }}
            >
              <FontAwesomeIcon icon={faFastBackward} />
            </button>
            <button
              title="5 seconds Backward"
              onClick={() => {
                changeStep(false);
              }}
            >
              <FontAwesomeIcon icon={faBackward} />
            </button>
            <button title="Play/Pause" className="ppbtn" onClick={playPause}>
              <FontAwesomeIcon icon={btn} />
            </button>
            <button
              title="5 seconds Forward"
              onClick={() => {
                changeStep(true);
              }}
            >
              <FontAwesomeIcon icon={faForward} />
            </button>
            <button
              title="next song"
              onClick={() => {
                changeFull(true);
              }}
            >
              <FontAwesomeIcon icon={faFastForward} />
            </button>
          </div>
          <div className="volBox">
            <FontAwesomeIcon id="volIcon" icon={faVolumeUp} />
            <input
              title="Volume"
              ref={volEl}
              className="vol"
              type="range"
              max="1"
              min="0"
              step="0.01"
            />
          </div>
        </div>
        <div className="sname">
          <b>Now Playing:</b> {songName}
        </div>
      </div>
    </>
  );
}
