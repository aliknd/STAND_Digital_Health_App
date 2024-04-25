import { AWSconfig } from '../../config/AWSconfig';
import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { FlatList } from 'react-native-gesture-handler';
import AWS from 'aws-sdk';
import { Audio } from 'expo-av';
import Queue from '../screens/Queue';
const Stack = require('../screens/Queue');

AWS.config.update({
    accessKeyId: AWSconfig.ACCESS_KEY_ID,
    secretAccessKey: AWSconfig.SECRET_ACCESS_KEY,
    region: AWSconfig.REGION
});

const s3 = new AWS.S3();

const uploadFileToS3 = (bucketName, fileName, filePath, uri) => {
    const params = {
        Bucket: "standhealth",
        Key: fileName,
        Body: filePath,
        ACL: 'public-read',
        ContentType: 'video/mp4',
    }

    return s3.upload(params).promise();
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

const grid = [0, 1, 2, 3, 4, 5, 6, 7, 8];
const patternLengths = [2, 3, 4, 5, 6];
const getRandomNum = (array) => {
    if (!Array.isArray(array) || array.length === 0) {
        throw new Error('Input must be a non-empty array');
    }
    return array[Math.floor(Math.random() * array.length)];
};

function GameScreen2() {
    const cameraRef = useRef(null);
    const [score, setScore] = useState(0);
    const [timer, setTimer] = useState(30);
    const [timerWidth, setTimerWidth] = useState(100);
    const [hasCameraPermission, setHasCameraPermission] = useState();
    const [hasMicrophonePermission, setHasMicrophonePermission] = useState();
    const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState();
    const [hasAudioPermission, setHasAudioPermission] = useState();
    const [preGameCountdown, setPreGameCountdown] = useState(3);
    const [isGameStarted, setIsGameStarted] = useState(false);
    const [isGameOver, setIsGameOver] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [video, setVideo] = useState();
    const [firstStart, setFirstStart] = useState(true);
    const [isAskingToRecord, setIsAskingToRecord] = useState(true);
    const [flashingIndex, setFlashingIndex] = useState(null);
    const [patternQueue, setPatternQueue] = useState(new Queue());
    const [patternArr, setPatternArr] = useState([]);
    const [userSelection, setUserSelection] = useState(new Queue());
    const [isWatchingPattern, setIsWatchingPattern] = useState(false);

    const generateNewPattern = () => {
        console.log("generating new pattern");
        let newPattern = new Queue();
        let newPatternArr = [];
        let patternLen = getRandomNum(patternLengths);
        for (let i = 0; i < patternLen; i++) {
            let val = getRandomNum(grid);
            newPattern.enqueue(val);
            newPatternArr.push(val);
        }
        setPatternQueue(newPattern);
        setPatternArr(newPatternArr);

        // Introduce a delay before setting isWatchingPattern to true
        setTimeout(() => {
            setIsWatchingPattern(true);
        }, 1500); // 2 second delay
    };

    useEffect(() => {
        let currentIndex = 0;
        let timeoutId;

        const flashPattern = () => {
            if (!isGameOver && isGameStarted && isWatchingPattern) {
                setFlashingIndex(patternArr[currentIndex]);
                console.log("flashingIndex:", patternArr[currentIndex]);
                currentIndex = (currentIndex + 1) % patternArr.length;

                // Clear the flashing after a short delay
                setTimeout(() => {
                    setFlashingIndex(null);
                }, 500);

                if (currentIndex === 0) {
                    console.log("here");
                    setIsWatchingPattern(false);
                } else {
                    setTimeout(flashPattern, 1000); // Wait before starting the next flash
                }
            }
        };
        if (isWatchingPattern) {
            flashPattern();
        }
        return () => {
            clearTimeout(timeoutId);
        };
    }, [isWatchingPattern, isGameStarted, isGameOver]);

    // controls game start and end (timer)
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
            generateNewPattern();
        } else if (isGameStarted && firstStart && !isRecording && !isAskingToRecord) {
            setFirstStart(false);
        }

        let countdown = null;
        if (isGameStarted && !isGameOver) {
            countdown = setInterval(() => {
                setTimer(prevTimer => {
                    if (prevTimer <= 1) {
                        clearInterval(countdown);
                        setIsGameOver(true);
                        recordingFinishedPopup(); // video is saved here
                        return 0;
                    } else {
                        setTimerWidth((prevTimer - 1) / 30 * 100);
                        return prevTimer - 1;
                    }
                });
            }, 1000);
        }

        return () => {
            if (countdown) clearInterval(countdown);
            if (preGameTimer) clearTimeout(preGameTimer);
        };
    }, [isGameStarted, isGameOver, preGameCountdown, timer, score, isRecording, isAskingToRecord, firstStart, video]);

    if (hasCameraPermission === undefined || hasMicrophonePermission === undefined || hasMediaLibraryPermission === undefined) {
        return <View style={styles.centered}><Text>Requesting permissions...</Text></View>;
    } else if (!hasCameraPermission || !hasMicrophonePermission || !hasMediaLibraryPermission) {
        return <View style={styles.centered}><Text>Permission not granted.</Text></View>;
    }

    let setVideoState = (videoData, callback) => {
        setVideo(videoData);
        if (typeof callback === 'function') {
            callback();
        }
        return Promise.resolve();
    };

    let recordVideo = () => {
        console.log("started recording video");
        setIsRecording(true);
        let options = {
            quality: "1080p",
            maxDuration: 60,
            mute: true,
            videoCodec: "avc1",
        };

        console.log("cameraref 1: " + cameraRef.current);
        cameraRef.current.recordAsync(options).then((recordedVideo) => {
            console.log("cameraref 3: " + cameraRef.current);
            console.log("in the record async function");
            console.log("recorded video" + recordedVideo);

            setVideoState(recordedVideo, () => {
                console.log("video: "+ recordedVideo);
                console.log("video uri: "+ recordedVideo.uri);
                setVideo(recordedVideo);
                console.log("saving video");
                saveVideo(recordedVideo);
            });
        });
    };

    let stopRecord = () => {
        console.log("cameraref 2: " + cameraRef.current);
        console.log("in stopRecording");
        setIsRecording(false);
        cameraRef.current.stopRecording();
        console.log("cameraref 2.5: " + cameraRef.current);
    };

    let saveVideo = (afterRecordingVideo) => {
        console.log("cameraref 4: " + cameraRef.current);
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

    const renderButton = ({ item, index }) => (
        <TouchableOpacity
            style={[styles.buttonBase, index === flashingIndex && styles.buttonFlash]}
            onPress={() => handlePress(item)}>
            {/* <Text style={styles.buttonText}>{item}</Text> */}
        </TouchableOpacity>
    );

    const handlePress = (boxNum) => {
        console.log("pressed: " + boxNum);
        if (!isWatchingPattern) {
            if (patternQueue.dequeue() != boxNum) {
                console.log("go back into watch pattern and -1");
                setScore(score - 1);
                setIsWatchingPattern(false);
                generateNewPattern();
            } else {
                if (patternQueue.size() == 0) {
                    console.log("yay, score +1");
                    setScore(score + 1);
                    setIsWatchingPattern(false);
                    generateNewPattern();
                }
            }
        }
    };

    const launchGame = () => {
        recordVideo();
        setIsAskingToRecord(false);
    }

    const handleCameraReady = () => {
        console.log('Camera is ready');
        if (isRecording) {
            console.log('Recording started');
            // Call startRecording function when the camera is ready if recording is enabled
            startRecording();
        }
    };

    const restartGame = () => {
        setIsGameOver(false);
        setIsGameStarted(false);
        setPreGameCountdown(3);
        setScore(0);
        setTimer(30);
        setTimerWidth(100);
        setIsAskingToRecord(true);
        setIsRecording(false);
        setVideo(undefined);
        setPattern([]); // Reset the pattern
        setUserSelection([]); // Reset user's selection
        setCurrentLevel(1); // Reset current level
    };

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
                        </View>
                        {!isWatchingPattern && (
                            <Text style={styles.watchPatternText}>Watch the pattern</Text>
                        )}

                        <View style={styles.gameBoard}>
                            <View style={styles.optionsContainer}>
                                <FlatList
                                    data={grid}
                                    numColumns={3} // Set the number of columns
                                    keyExtractor={(item) => item}
                                    renderItem={({ item, index }) => renderButton({ item, index, disabled: isWatchingPattern })}
                                />
                            </View>
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
    gameBoard: {
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
        paddingTop: 150,
        marginBottom: 80,
    },
    buttonBase: {
        flex: 1,
        flexDirection: 'row',
        height: 95,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 5,
        backgroundColor: 'black',
        borderColor: 'black',
        borderWidth: 2,
        borderRadius: 10,
        elevation: 5,
    },
    buttonFlash: {
        flex: 1,
        flexDirection: 'row',
        height: 95,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 5,
        backgroundColor: 'white',
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
export default GameScreen2;