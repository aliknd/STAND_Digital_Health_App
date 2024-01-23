import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
//import { Video } from 'expo-av';
//import { shareAsync } from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';

const colors = ["red", "blue", "green", "yellow", "purple", "orange", "pink"];

const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];
const getShuffledColorsWithAnswer = (answer) => {
  const otherColors = colors.filter(c => c !== answer);
  const shuffledOtherColors = otherColors.sort(() => 0.5 - Math.random());
  const selectedColors = shuffledOtherColors.slice(0, 3);
  const allOptions = [answer, ...selectedColors].sort(() => 0.5 - Math.random());
  return allOptions;
};

function GameScreen1() {
  let cameraRef = useRef(null);
  const [textColor, setTextColor] = useState(getRandomColor());
  const [displayColor, setDisplayColor] = useState(getRandomColor());
  const [options, setOptions] = useState(getShuffledColorsWithAnswer(displayColor));
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(30);
  const [timerWidth, setTimerWidth] = useState(100);
  const [decisionTime, setDecisionTime] = useState(5);
  const [hasCameraPermission, setHasCameraPermission] = useState();
  const [hasMicrophonePermission, setHasMicrophonePermission] = useState();
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState();
  const [preGameCountdown, setPreGameCountdown] = useState(3);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [videoUri, setVideoUri] = useState(null);

  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      const microphonePermission = await Camera.requestMicrophonePermissionsAsync();
      const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();

      setHasCameraPermission(cameraPermission.status === "granted");
      setHasMicrophonePermission(microphonePermission.status === "granted");
      setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted");
    })();

    let preGameTimer = null;
    if (!isGameStarted && preGameCountdown > 0) {
      preGameTimer = setTimeout(() => {
        setPreGameCountdown(preGameCountdown - 1);
      }, 1000);
    } else if (!isGameStarted) {
      setIsGameStarted(true);
      //recordVideo();
    }

    let countdown = null;
    let decisionCountdown = null;
    if (isGameStarted && !isGameOver) {
      countdown = setInterval(() => {
        setTimer(prevTimer => {
          if (prevTimer <= 1) {
            clearInterval(countdown);
            clearInterval(decisionCountdown);
            setIsGameOver(true);
            //stopRecording();
            //askToSaveVideo(); // Ask to save video when the game is over
            return 0;
          } else {
            setTimerWidth((prevTimer - 1) / 30 * 100);
            return prevTimer - 1;
          }
        });
      }, 1000);

      decisionCountdown = setInterval(() => {
        setDecisionTime(prevDecisionTime => {
          if (prevDecisionTime <= 1) {
            clearInterval(decisionCountdown);
            handlePress('');
            return 5;
          }
          return prevDecisionTime - 1;
        });
      }, 1000);
    }

    return () => {
      if (countdown) clearInterval(countdown);
      if (decisionCountdown) clearInterval(decisionCountdown);
      if (preGameTimer) clearTimeout(preGameTimer);
    };
  }, [isGameStarted, isGameOver, preGameCountdown, timer, score]);

  if (hasCameraPermission === undefined || hasMicrophonePermission === undefined || hasMediaLibraryPermission === undefined) {
    return <View style={styles.centered}><Text>Requesting permissions...</Text></View>;
  } else if (!hasCameraPermission || !hasMicrophonePermission || !hasMediaLibraryPermission) {
    return <View style={styles.centered}><Text>Permission not granted.</Text></View>;
  }

  /*const recordVideo = async () => {
    console.log("Trying to start recording...");
    if (cameraRef.current) {
      console.log("Camera reference is set");
      setIsRecording(true);
      let options = {
        quality: "1080p",
        maxDuration: 60,
        mute: false
      };

      try {
        const video = await cameraRef.current.recordAsync(options);
        console.log("Recording completed. Video URI: ", video.uri);
        setVideoUri(video.uri);
        setIsRecording(false);
      } catch (error) {
        console.error("Error during recording: ", error);
        setIsRecording(false);
      }
    } else {
      console.log("Camera reference is not set");
    }
  };

  const stopRecording = async () => {
    console.log("Trying to stop recording...");
    if (cameraRef.current && isRecording) {
      cameraRef.current.stopRecording();
      console.log("Stopped recording.");
      setIsRecording(false);
      saveVideo(); // Automatically save the video
    } else {
      console.log("Recording was not in progress or camera reference is not set.");
    }
  };

  const saveVideo = async () => {
    if (videoUri) {
      await MediaLibrary.saveToLibraryAsync(videoUri)
          .then(() => {
            console.log("Video saved successfully!");
          })
          .catch(error => {
            console.error("Error saving video:", error);
          });
    }
  };

  const askToSaveVideo = () => {
    const buttons = [
      {
        text: "Cancel",
        onPress: () => console.log("User canceled saving video"),
        style: "cancel"
      }
    ];

    if (hasMediaLibraryPermission) {
      buttons.push({ text: "Save", onPress: () => saveVideo() });
    }

    Alert.alert(
        "Save Recording",
        "Do you want to save the game recording?",
        buttons,
        { cancelable: false }
    );
  };*/

  const handlePress = (selectedColor) => {
    if (selectedColor === displayColor) {
      setScore(score + 1);
    } else {
      setScore(score - 1);
    }
    setDecisionTime(5);
    const newTextColor = getRandomColor();
    const newDisplayColor = getRandomColor();
    setTextColor(newTextColor);
    setDisplayColor(newDisplayColor);
    setOptions(getShuffledColorsWithAnswer(newDisplayColor));
  };

  const restartGame = () => {
    setIsGameOver(false);
    setIsGameStarted(false);
    setPreGameCountdown(3);
    setScore(0);
    setTimer(30);
    setTimerWidth(100);
    setDecisionTime(5);
  };
  if (!isGameStarted) {
    return (
        <View style={styles.centered}>
          <Text style={styles.countdownText}>Game starts in: {preGameCountdown}</Text>
        </View>
    );
  }

  if (isGameOver) {
    return (
        <View style={styles.centered}>
          <Text style={styles.finalScoreText}>Final Score: {score}</Text>
          <TouchableOpacity style={styles.restartButton} onPress={restartGame}>
            <Text style={styles.restartButtonText}>Restart Game</Text>
          </TouchableOpacity>
        </View>
    );
  }

  return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Camera
              style={styles.preview}
              type={CameraType.front}
              ratio={"16:9"}
              ref={cameraRef}
          >
            <View style={styles.overlay}>
              <View style={styles.timerBarContainer}>
                <View style={[styles.timerBar, { width: `${timerWidth}%` }]}></View>
              </View>
              <View style={styles.scoreContainer}>
                <Text style={styles.scoreText}>Score: {score}</Text>
                <Text style={styles.timerText}>Time: {timer}s</Text>
                <Text style={styles.decisionTimerText}>Answer in: {decisionTime}s</Text>
              </View>
              <View style={styles.centered}>
                <Text style={[styles.text, { color: displayColor }]}>{textColor}</Text>
              </View>
              <View style={styles.optionsContainer}>
                {options.map((color) => (
                    <TouchableOpacity key={color} style={[styles.button]} onPress={() => handlePress(color)}>
                      <Text style={styles.buttonText}>{color}</Text>
                    </TouchableOpacity>
                ))}
              </View>
            </View>
          </Camera>
        </View>
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'black',
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  preview: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countdownText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  finalScoreText: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  restartButton: {
    backgroundColor: 'blue',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  restartButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  scoreText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  timerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  decisionTimerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'red',
  },
  timerBarContainer: {
    height: 20,
    backgroundColor: '#eee',
  },
  timerBar: {
    height: '100%',
    backgroundColor: 'blue',
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    padding: 20,
  },
  button: {
    width: '47%',
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    backgroundColor: 'transparent',
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 10,
    elevation: 5,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
});
export default GameScreen1;