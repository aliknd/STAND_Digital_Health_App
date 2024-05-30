import { AWSconfig } from '../../config/AWSconfig';
import 'react-native-url-polyfill/auto';
import 'react-native-get-random-values';
import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { Camera, CameraType } from 'expo-camera/legacy';
import * as MediaLibrary from 'expo-media-library';
import { FlatList } from 'react-native-gesture-handler';
import AWS from 'aws-sdk';
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Audio } from 'expo-av';
import useAuth from "../auth/useAuth";
import useApi from "../hooks/useApi";
import usersApi from "../api/users";
import starsApi from "../api/stars";
import navigation from "../navigation/rootNavigation";

AWS.config.update({
  accessKeyId: AWSconfig.ACCESS_KEY_ID,
  secretAccessKey: AWSconfig.SECRET_ACCESS_KEY,
  region: AWSconfig.REGION
});

const client = new S3Client({
  region: AWSconfig.REGION,
  credentials: {
    accessKeyId: AWSconfig.ACCESS_KEY_ID,
    secretAccessKey: AWSconfig.SECRET_ACCESS_KEY
  }
});

const uploadVideoToS3 = async (userEmail, bucketName, videoExtension, recordedVideoURI) => {
  const currentDate = new Date();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;
  const day = currentDate.getDate();
  const hours = currentDate.getHours();
  const minutes = currentDate.getMinutes();
  const seconds = currentDate.getSeconds();

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: userEmail + "/" + year + "-" + month + "-" + day + "-" + hours + "-" + minutes + "-" + seconds + videoExtension,
    Body: recordedVideoURI,
  });

  try {
    const response = await client.send(command);
    console.log(response);
  } catch (err) {
    console.error(err);
  }
};

const CameraComponent = ({ cameraRef, onCameraReady }) => {
  const handleCameraReady = () => {
    if (onCameraReady) {
      onCameraReady();
    }
  };

  return (
      <Camera
          style={styles.preview}
          type={Camera.Constants.Type.front}
          onCameraReady={handleCameraReady}
          ref={cameraRef}
      />
  );
};

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
  const cameraRef = useRef(null);
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
  const [hasAudioPermission, setHasAudioPermission] = useState();
  const [preGameCountdown, setPreGameCountdown] = useState(3);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [firstStart, setFirstStart] = useState(true);
  // const [cameraRef, setCameraRef] = useState(null);
  const [isAskingToRecord, setIsAskingToRecord] = useState(true);
  const { user } = useAuth();
  const scoreApi = useApi(usersApi.updateScore);
  const updateTimesPlayedApi = useApi(starsApi.updateTimesPlayed);

  const updateScore = async (id, scoreToAdd) => {
    await scoreApi.request(id, scoreToAdd);
  }

  const updateTimesPlayed = async (id) => {
    await updateTimesPlayedApi.request(id);
  }

  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      const microphonePermission = await Camera.requestMicrophonePermissionsAsync();
      const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
      const audioPermission = await Audio.requestPermissionsAsync();

      setHasCameraPermission(cameraPermission.status === "granted");
      setHasMicrophonePermission(microphonePermission.status === "granted");
      setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted");
      setHasAudioPermission(audioPermission.status === "granted");
    })();

    let preGameTimer = null;
    if (isRecording && !isGameStarted && preGameCountdown > 0) {
      preGameTimer = setTimeout(() => {
        setPreGameCountdown(preGameCountdown - 1);
      }, 1000);
    } else if (!isGameStarted && !isAskingToRecord) {
      setIsGameStarted(true);
    } else if (isGameStarted && firstStart && !isRecording && !isAskingToRecord) {
      setFirstStart(false);
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
            recordingFinishedPopup(); // video is saved here
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

    if (isGameOver && timer == 0) {
      updateScore(user.userId, score);
      // if user played 4 times today, grant a star
      updateTimesPlayed(user.userId);
    }

    return () => {
      if (countdown) clearInterval(countdown);
      if (decisionCountdown) clearInterval(decisionCountdown);
      if (preGameTimer) clearTimeout(preGameTimer);
    };
  }, [isGameStarted, isGameOver, preGameCountdown, timer, score, isRecording, isAskingToRecord, firstStart]);

  if (hasCameraPermission === undefined || hasMicrophonePermission === undefined || hasMediaLibraryPermission === undefined) {
    return <View style={styles.centered}><Text>Requesting permissions...</Text></View>;
  } else if (!hasCameraPermission || !hasMicrophonePermission || !hasMediaLibraryPermission) {
    return <View style={styles.centered}><Text>Permission not granted.</Text></View>;
  }

  let recordVideo = () => {
    setIsRecording(true);
    let options = {
      quality: "1080p",
      maxDuration: 60,
      mute: true,
      videoCodec: "avc1",
    };

    cameraRef.current.recordAsync(options).then((recordedVideo) => {
      saveVideo(recordedVideo, user.email);
    });
  };

  let stopRecord = () => {
    setIsRecording(false);
  };

  let saveVideo = async (afterRecordingVideo, email) => {
    const filePath = afterRecordingVideo.uri.replace('file://', '');
    const extension = afterRecordingVideo.uri.substring(afterRecordingVideo.uri.lastIndexOf('.'));

    const fileData = await fetch(filePath).then(response =>
        response.blob()
    );

    await uploadVideoToS3(email, "standhealth", extension, fileData);
  };

  const recordingFinishedPopup = () => {
    stopRecord();
    const buttons = [
      {
        text: "Ok",
        onPress: () => console.log("User closed popup"),
        style: "cancel"
      }
    ];

    Alert.alert(
        "Recording finished",
        "Your video will be uploaded",
        buttons,
        { cancelable: false }
    );
  };

  const renderButton = ({ item }) => (
      <TouchableOpacity style={styles.button} onPress={() => handlePress(item)}>
        <Text style={styles.buttonText}>{item}</Text>
      </TouchableOpacity>
  );

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

  const launchGame = () => {
    recordVideo();
    setIsAskingToRecord(false);
  }

  const restartGame = () => {
    setIsGameOver(false);
    setIsGameStarted(false);
    setPreGameCountdown(3);
    setScore(0);
    setTimer(30);
    setTimerWidth(100);
    setDecisionTime(5);
    setIsAskingToRecord(true);
    setIsRecording(false);
  };

  if (isGameOver) {
    return (
        <View style={styles.centered}>
          <Text style={styles.finalScoreText}>Final Score: {score}</Text>
          <TouchableOpacity style={styles.restartButton} onPress={() => navigation.navigate("Questionnaire", { screen: 'QuestionnaireScreen'})}>
            <Text style={styles.restartButtonText}>Answer Questionnaire</Text>
          </TouchableOpacity>
        </View>
    );
  }

  return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <CameraComponent cameraRef={cameraRef} onCameraReady={() => console.log('Camera ready!')} />

          {!isGameStarted ? (
              <View style={styles.centered}>
                <Text style={styles.countdownText}>Game starts in: {preGameCountdown}</Text>
                <TouchableOpacity style={styles.restartButton} onPress={launchGame}>
                  <Text style={styles.restartButtonText}>Start Recording</Text>
                </TouchableOpacity>
              </View>
          ) : (
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
                  <FlatList
                      data={options}
                      numColumns={2} // Set the number of columns
                      keyExtractor={(item) => item}
                      renderItem={renderButton}
                  />
                </View>
              </View>
          )}

        </View>
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'gray',
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
  },
  preview: {
    position: 'absolute',
    top: 60,
    left: 20,
    bottom: 0,
    right: 0,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: "28%",
    height: "25%",
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    padding: 20,
    marginBottom: 70,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
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