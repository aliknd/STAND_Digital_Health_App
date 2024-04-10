//<script src="config/AWSconfig.js"></script>
import { AWSconfig } from '../../config/AWSconfig';
import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
// import { Video } from 'expo-av';
// import { shareAsync } from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import { FlatList } from 'react-native-gesture-handler';
import AWS from 'aws-sdk';
import { Audio } from 'expo-av';
import endpointURL from "../api/serverPoint";
import useAuth from "../auth/useAuth";
import useApi from "../hooks/useApi";
import usersApi from "../api/users";

AWS.config.update({
  accessKeyId: AWSconfig.ACCESS_KEY_ID,
  secretAccessKey: AWSconfig.SECRET_ACCESS_KEY,
  region: AWSconfig.REGION
});

const s3 = new AWS.S3();

const uploadFileToS3 = (bucketName, fileName, filePath, uri) => {
  const params = {
    // Bucket: bucketName,
    Bucket: "standhealth",
    Key: fileName,
    Body: filePath,
    //Body: uri,
    ACL: 'public-read',
    ContentType: 'video/mp4',
    // ContentType: 'video/quicktime',
  }

  return s3.upload(params).promise();
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
  // let cameraRef = useRef();
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
  const [video, setVideo] = useState();
  const [videoUri, setVideoUri] = useState(null);
  const [firstStart, setFirstStart] = useState(true);
  const [cameraRef, setCameraRef] = useState(null);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const { user } = useAuth();
  const scoreApi = useApi(usersApi.updateScore);
  const starsApi = useApi(usersApi.updateStars);

  const updateScore = async (id, scoreToAdd) => {
    await scoreApi.request(id, scoreToAdd);
    return;
  }

  const updateStars = async (id, stars) => {
    await starsApi.request(id, stars);
    return;
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
    if (!isGameStarted && preGameCountdown > 0) {
      preGameTimer = setTimeout(() => {
        setPreGameCountdown(preGameCountdown - 1);
      }, 1000);
    } else if (!isGameStarted) {
      setIsGameStarted(true);
      //recordVideo();
    } else if (isGameStarted && firstStart && !isRecording) {
      setFirstStart(false);
      //recordVideo();
      askToStartRecording();
    } else if (isGameOver && timer == 0) {
      updateScore(user.userId, score);
      updateStars(user.userId, 1)
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
            askToUploadVideo(); // Ask to save video when the game is over
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

  const recordVideo = async () => {
    if (cameraRef) {
      setIsRecording(true);
      let options = {
        quality: "1080p",
        maxDuration: 60,
        mute: false,
        videoCodec: Camera.Constants.VideoCodec.H264,
      };
      try {
        let video = await cameraRef.recordAsync(options);
      } catch (error) {
        console.log("error", error);
      }
      console.log('video', video);
      setVideo(video);
      setVideoUri(video.uri);
    }
  }

  const stopRecord = () => {
    console.log("stopping recording1");
    if (cameraRef) {
      console.log("camera ref" + cameraRef);
      console.log("Trying to stop recording...");
      //let endVideo = await cameraRef.current.stopRecording();
      try {
        cameraRef.stopRecording();
      } catch (error) {
        console.log('error', error);
      }
      console.log("after stop recording");
      //console.log('Stopped recording', endVideo);
      setIsRecording(false);
    }
  }

  let uploadVideo = async () => {
    console.log("in upload video function");
    console.log("videoUri " + videoUri);
    if (videoUri) {
      console.log("video uri: " + videoUri);
      const filePath = videoUri.replace('file://', '');
      const bucketName = "standhealth";
      const fileName = "ki";

      try {
        console.log("bucketName:" + bucketName);
        console.log("filename:" + fileName);
        console.log("filePath:" + filePath);

        // await uploadFileToS3(bucketName, fileName, fileData);
        await uploadFileToS3(bucketName, fileName, filePath, videoUri);
        console.log("File uploaded", fileName);
      } catch (error) {
        console.log("Error uploading file: ", error);
      }
    }
  };

  const askToStartRecording = () => {
    const buttons = [
      {
        text: "Record",
        onPress: () => recordVideo()
      }
    ];

    Alert.alert(
        "Start Recording",
        "Do you want to start recording?",
        buttons,
        {cancelable: false}
    );
  }


  const askToUploadVideo = () => {
    stopRecord();
    const buttons = [
      {
        text: "Cancel",
        onPress: () => console.log("User canceled uploading video"),
        style: "cancel"
      }
    ];

    if (hasMediaLibraryPermission) {
      buttons.push({text: "Upload", onPress: () => uploadVideo()});
    }

    Alert.alert(
        "Upload Recording",
        "Do you want to upload the game recording?",
        buttons,
        {cancelable: false}
    );
  };

  const renderButton = ({item}) => (
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
    // current = fetchCurrentScore()
    // if (current < score) {
    //   sendScore();
    // }
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
              // ratio={"16:9"} only on android
              ref={(ref) => setCameraRef(ref)}
          >
          </Camera>
          <View style={styles.overlay}>
            <View style={styles.timerBarContainer}>
              <View style={[styles.timerBar, {width: `${timerWidth}%`}]}></View>
            </View>
            <View style={styles.scoreContainer}>
              <Text style={styles.scoreText}>Score: {score}</Text>
              <Text style={styles.timerText}>Time: {timer}s</Text>
              <Text style={styles.decisionTimerText}>Answer in: {decisionTime}s</Text>
            </View>
            <View style={styles.centered}>
              <Text style={[styles.text, {color: displayColor}]}>{textColor}</Text>
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
    width: "25%",
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