import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Alert } from "react-native";
import { Camera, CameraType } from 'expo-camera';

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
  const [textColor, setTextColor] = useState(getRandomColor());
  const [displayColor, setDisplayColor] = useState(getRandomColor());
  const [options, setOptions] = useState(getShuffledColorsWithAnswer(displayColor));
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(30);
  const [timerWidth, setTimerWidth] = useState(100);
  const [decisionTime, setDecisionTime] = useState(5);
  const [hasPermission, setHasPermission] = useState(null);
  const [preGameCountdown, setPreGameCountdown] = useState(3);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();

    let preGameTimer = null;
    if (!isGameStarted && preGameCountdown > 0) {
      preGameTimer = setTimeout(() => {
        setPreGameCountdown(preGameCountdown - 1);
      }, 1000);
    } else if (!isGameStarted) {
      setIsGameStarted(true);
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
            return 0;
          } else {
            setTimerWidth((prevTimer - 1) / 30 * 100);
          }
          return prevTimer - 1;
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
  }, [score, preGameCountdown, isGameStarted, isGameOver]);

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

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

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
      <View style={styles.container}>
        <Camera
            style={styles.preview}
            type={CameraType.front}
            ratio={"16:9"}
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