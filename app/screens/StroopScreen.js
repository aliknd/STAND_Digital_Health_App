import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Alert } from "react-native";
import { Camera, CameraType } from 'expo-camera';

const colors = ["red", "blue", "green", "yellow"];

const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];
const getShuffledColorsWithAnswer = (answer) => {
  const otherColors = colors.filter(c => c !== answer);
  const allColors = [answer, ...otherColors];
  return allColors.sort(() => 0.5 - Math.random()).slice(0, 4);
};

function GameScreen1() {
  const [textColor, setTextColor] = useState(getRandomColor());
  const [displayColor, setDisplayColor] = useState(getRandomColor());
  const [options, setOptions] = useState(getShuffledColorsWithAnswer(displayColor));
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(30);
  const [timerWidth, setTimerWidth] = useState(100);
  const [decisionTime, setDecisionTime] = useState(5);
  const [hasPermission, setHasPermission] = useState(null);

  useEffect(() => {
    // Camera permission
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
    const maxTime = 30;

    const countdown = setInterval(() => {
      setTimer(prevTimer => {
        if (prevTimer <= 1) {
          clearInterval(countdown);
          Alert.alert("Time's up!", `Your score is: ${score}`);
          clearInterval(decisionCountdown); // stop the decision countdown
          return 0;
        } else {
          setTimerWidth((prevTimer - 1) / maxTime * 100);
        }
        return prevTimer - 1;
      });
    }, 1000);

    const decisionCountdown = setInterval(() => {
      setDecisionTime(prevDecisionTime => {
        if (prevDecisionTime <= 1) {
          clearInterval(decisionCountdown);
          handlePress('');
          return 5;
        }
        return prevDecisionTime - 1;
      });
    }, 1000);

    return () => {
      clearInterval(countdown);
      clearInterval(decisionCountdown);
    };
  }, [score]);

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

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <Camera
        style={styles.preview}
        type={Camera.Constants.Type.front}
        ratio={"16:9"}
      >
        <View style={styles.overlay}>
          {/* ...Your game UI here... */}
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
  );
}

const styles = StyleSheet.create({
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
  text: {
    fontSize: 40,
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
    borderRadius: 0,
    margin: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
});

export default GameScreen1;