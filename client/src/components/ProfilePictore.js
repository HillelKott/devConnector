import React, { useState, useEffect, useCallback } from "react";

import "./Selfie.css";

const Selfie = ({ setProfileImage }) => {
  const [imageURL, setImageUrl] = useState("");

  const videoEle = React.createRef();
  const canvasEle = React.createRef();
  const imageEle = React.createRef();

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true
      });

      videoEle.current.srcObject = stream;
    } catch (err) {
      console.log(err);
    }
  }, [videoEle]);

  useEffect(() => {
    startCamera();
  }, [startCamera]);

  const takeSelfie = async () => {
    // Get the exact size of the video element.
    const width = videoEle.current.videoWidth;
    const height = videoEle.current.videoHeight;

    // get the context object of hidden canvas
    const ctx = canvasEle.current.getContext("2d");

    // Set the canvas to the same dimensions as the video.
    canvasEle.current.width = width;
    canvasEle.current.height = height;

    // Draw the current frame from the video on the canvas.
    ctx.drawImage(videoEle.current, 0, 0, width, height);

    // Get an image dataURL from the canvas.
    const imageDataURL = canvasEle.current.toDataURL("image/png");
    stopCam();
    setImageUrl(imageDataURL);
    setProfileImage(imageDataURL);
  };

  const stopCam = () => {
    const stream = videoEle.current.srcObject;
    const tracks = stream.getTracks();

    tracks.forEach((track) => {
      track.stop();
    });
  };

  const backToCam = () => {
    setImageUrl("");
    startCamera();
  };

  return (
    <div className="selfie">
      {imageURL === "" && (
        <div className="cam">
          <video
            width="100%"
            height="100%"
            className="video-player"
            autoPlay
            ref={videoEle}
          ></video>
          <button className="btn capture-btn" onClick={takeSelfie}>
            <i className="fa fa-camera" aria-hidden="true"></i>
          </button>
        </div>
      )}

      <canvas ref={canvasEle} style={{ display: "none" }}></canvas>
      {imageURL !== "" && (
        <div className="preview">
          <img className="preview-img" src={imageURL} ref={imageEle} alt="e" />

          <div className="btn-container">
            <button className="btn back-btn" onClick={backToCam}>
              <i className="fa fa-chevron-left" aria-hidden="true"></i>
            </button>
            <span className="great-btn" onClick={() => setProfileImage(imageURL)}>
              <i className="fa fa-thumbs-up" aria-hidden="true"></i> <br></br>
              It's great use it{'  '}
            </span>
          </div>
        </div>
      )
      }
    </div >
  );
};

export default Selfie;
