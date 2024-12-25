const localVideo = document.getElementById("localVideo");
const remoteVideo = document.getElementById("remoteVideo");

// Connect to the signaling server
const socket = io("http://localhost:3000");

const peerConnection = new RTCPeerConnection({
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }], // Free STUN server
});

let localStream;

// Capture media and add to PeerConnection
navigator.mediaDevices
  .getUserMedia({ video: true, audio: true })
  .then((stream) => {
    localStream = stream;
    localVideo.srcObject = stream;

    // Add local tracks to PeerConnection
    stream
      .getTracks()
      .forEach((track) => peerConnection.addTrack(track, stream));
  })
  .catch((error) => console.error("Error accessing media devices:", error));

// Handle incoming tracks
peerConnection.ontrack = (event) => {
  remoteVideo.srcObject = event.streams[0];
};

// ICE Candidate Event
peerConnection.onicecandidate = (event) => {
  if (event.candidate) {
    socket.emit("ice-candidate", event.candidate);
  }
};

// Listen for signaling events
socket.on("offer", async (offer) => {
  console.log("Received offer:", offer);
  await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

  const answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answer);

  socket.emit("answer", answer);
});

socket.on("answer", async (answer) => {
  console.log("Received answer:", answer);
  await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
});

socket.on("ice-candidate", async (candidate) => {
  console.log("Received ICE candidate:", candidate);
  await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
});

// Create and send offer when ready
peerConnection.onnegotiationneeded = async () => {
  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);

  socket.emit("offer", offer);
};
