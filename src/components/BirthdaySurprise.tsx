import React, { useState, useEffect, useRef } from 'react';
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components';
// If you see TypeScript errors for image imports, add a file named 'images.d.ts' in 'src' with:
// declare module '*.png';
// declare module '*.jpg';

// Direct MP3 URL from Cloudinary
const BIRTHDAY_MUSIC_URL = 'https://res.cloudinary.com/dssk0lrai/video/upload/v1748346500/HAPPY_BIRTHDAY_TO_YOU_PIANO_INSTRUMENTAL_BEST_HAPPY_BITHDAY_MUSIC_2021_ys06rg.mp3';

const GlobalStyle = createGlobalStyle<{ isDark: boolean }>`
  body {
    margin: 0;
    padding: 0;
    min-height: 100vh;
    background-color: ${props => props.isDark ? '#1a1a1a' : '#fff8f8'};
    transition: background-color 1s ease;
    font-family: 'Comic Sans MS', cursive;
  }
`;

interface ThemeProps {
  isDark: boolean;
}

const Container = styled.div<{ theme: ThemeProps }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  color: ${props => props.theme.isDark ? '#fff' : '#333'};
  position: relative;
  z-index: 2;
`;

const Button = styled.button<{ primary?: boolean }>`
  padding: 15px 30px;
  font-size: 1.2rem;
  margin: 10px;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  background: ${props => props.primary ? '#ff69b4' : '#4a90e2'};
  color: white;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
  align-items: center;
  margin: 20px;
`;

const NoButton = styled(Button)`
  position: relative;
  transition: all 0.2s ease;
  &:hover {
    transform: translate(${props => Math.random() * 200 - 100}px, ${props => Math.random() * 200 - 100}px) !important;
  }
`;

const Banner = styled.div`
  font-size: 3rem;
  color: #ff69b4;
  text-align: center;
  animation: dropDown 1s ease-out;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);

  @keyframes dropDown {
    from {
      transform: translateY(-100vh);
    }
    to {
      transform: translateY(0);
    }
  }
`;

const Decorations = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 1;
`;

const PartyImage = styled.div<{ index: number }>`
  position: absolute;
  font-size: 2rem;
  opacity: 0;
  animation: fallDown 2s ease-out forwards;
  animation-delay: ${props => props.index * 0.2}s;
  left: ${props => Math.random() * 100}vw;
  top: ${props => Math.random() * 100}vh;
  transform: rotate(${props => Math.random() * 360}deg);
  z-index: 1;

  @keyframes fallDown {
    0% {
      transform: translateY(-100vh) rotate(0deg);
      opacity: 0;
    }
    50% {
      opacity: 0.6;
    }
    100% {
      transform: translateY(0) rotate(${props => Math.random() * 360}deg);
      opacity: 0.4;
    }
  }
`;

const Balloon = styled.div<{ color: string; delay: number; left: number }>`
  width: 50px;
  height: 60px;
  background-color: ${props => props.color};
  border-radius: 50%;
  position: fixed;
  bottom: -100px;
  animation: float 4s ease-in infinite;
  animation-delay: ${props => props.delay}s;
  left: ${props => props.left}vw;

  &:before {
    content: '';
    width: 2px;
    height: 40px;
    background: #999;
    position: absolute;
    bottom: -30px;
    left: 25px;
  }

  @keyframes float {
    0% {
      transform: translateY(0);
    }
    100% {
      transform: translateY(-120vh);
    }
  }
`;

const CakeContainer = styled.div`
  position: relative;
  width: 390px;
  height: 390px;
  margin: 20px auto;
  z-index: 2;
`;

const CakeImage = styled.img<{ isSliced: boolean }>`
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: opacity 0.5s ease;
  transform-origin: center;
  scale: 1.3;
`;

const CakeSliceImage = styled.img<{ isVisible: boolean }>`
  position: absolute;
  width: 150px;
  height: 150px;
  right: -100px;
  top: 50%;
  transform: translateY(-50%) rotate(25deg);
  opacity: 0;
  transition: all 1s ease;
  object-fit: contain;
  
  ${props => props.isVisible && `
    opacity: 1;
    transform: translate(-50px, -50%) rotate(25deg);
  `}
`;

const Message = styled.div`
  font-size: 1.8rem;
  color: #ff69b4;
  text-align: center;
  line-height: 1.5;
  padding: 20px;
  min-height: 150px;
  width: 100%;
  max-width: 900px;
  margin: 30px auto;
  position: relative;
`;

const MessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-top: 30px;
`;

const MessageLine = styled.div<{ isVisible: boolean }>`
  opacity: ${props => props.isVisible ? 1 : 0};
  transform: translateY(${props => props.isVisible ? 0 : '20px'});
  transition: opacity 1s ease, transform 1s ease;
  position: absolute;
  width: 100%;
  text-align: center;
  padding: 0 20px;
  left: 0;
  top: 50%;
  transform: ${props => props.isVisible ? 'translateY(-50%)' : 'translateY(-30%)'};
`;

const Fireworks = styled.div<{ isVisible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 1;
  opacity: ${props => props.isVisible ? 1 : 0};
  transition: opacity 0.3s ease;
`;

const FireworkSparkle = styled.div<{ delay: number; top: number; left: number }>`
  position: absolute;
  top: ${props => props.top}%;
  left: ${props => props.left}%;
  font-size: 2rem;
  animation: explode 1s ease-out forwards;
  animation-delay: ${props => props.delay}s;

  @keyframes explode {
    0% {
      transform: scale(0);
      opacity: 0;
    }
    50% {
      transform: scale(1.2);
      opacity: 1;
    }
    100% {
      transform: scale(1);
      opacity: 0;
    }
  }
`;

const FloatingImage = styled.img<{ delay: number; left: number }>`
  max-width: 180px;
  max-height: 180px;
  position: fixed;
  bottom: -100px;
  animation: float 4s ease-in infinite;
  animation-delay: ${props => props.delay}s;
  left: ${props => props.left}vw;
  z-index: 2;
  box-shadow: 0 8px 32px rgba(0,0,0,0.18);
  border-radius: 18px;
  background: #fff8;

  @keyframes float {
    0% {
      transform: translateY(0);
      opacity: 1;
    }
    100% {
      transform: translateY(-120vh);
      opacity: 0.7;
    }
  }
`;

const BirthdaySurprise = () => {
  const [showInitial, setShowInitial] = useState(true);
  const [isDark, setIsDark] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [noButtonPosition, setNoButtonPosition] = useState({ x: 0, y: 0 });
  const [showBanner, setShowBanner] = useState(false);
  const [showBalloons, setShowBalloons] = useState(false);
  const [showCake, setShowCake] = useState(false);
  const [isCakeSliced, setIsCakeSliced] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const cheeringAudioRef = useRef<HTMLAudioElement | null>(null);
  const clappingAudioRef = useRef<HTMLAudioElement | null>(null);
  const [decorations] = useState(['🎈', '🎊', '✨', '💝', '🎀', '🌟']);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [noButtonClicks, setNoButtonClicks] = useState(0);
  const [noButtonText, setNoButtonText] = useState('No 😢');
  const [showFinalGif, setShowFinalGif] = useState(false);

  // Updated cake image URLs
  const cakeImageUrl = "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExcXlkMjhvdXpqbGEzMnFnYWgycWJqMGg1c3Zsd2tjNXZldDVhbW9nYSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/TgJ7RVHbCybpdNqp1t/giphy.gif";
  const cakeSliceUrl = "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExYnc2dnV5cWp4YXpuZ25pM2VyZHRiODNuYXplcm44bms5bW1oZ3loYSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/FPa3WqwV4WlCu8N7Yf/giphy.gif";

  const finalGifUrl = 'https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExajhiZHljd2RxNDRhYWVvZzFxNTl5M3p3YTl5Y2xueDNlcnQ0eWk4cyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Q0QSGW9vAs4l6S3CPd/giphy.gif';

  const messageLines = [
    "This is to celebrate the day a kind soul came into this world, brightened many lives, healed many hearts — including mine — and I'm so grateful to have such a cutie pie doll in my life. ❤️",
    "You are the most beautiful person I have ever met, inside and out. Your smile, your laughter, your kindness, and your love brings out the best in me.",
    "I hope this year brings you as much happiness and joy as you have given to everyone around you.",
    "May all your dreams come true, and I'll watch over you as you continue to inspire and uplift those around you.",
    "Thank you for being you, and for being such a wonderful part of my life. I cherish every moment we spend together. 😉",
    "Here's to many more birthdays, adventures, and memories together!",
    "Happy Birthday, my love! ❤️ 🎉",
    "Yours truly - Dinesh"
  ];

  useEffect(() => {
    // Pre-load the audio
    const audio = new Audio();
    audio.preload = 'auto';
    audio.src = BIRTHDAY_MUSIC_URL;
    
    audio.addEventListener('error', (e) => {
      console.error('Audio error:', e);
      setAudioError('Failed to load music. Please try again.');
    });

    audio.addEventListener('canplaythrough', () => {
      console.log('Audio loaded successfully');
      setIsAudioLoading(false);
    });

    audioRef.current = audio;
    audio.loop = true;

    // Initialize sound effects
    cheeringAudioRef.current = new Audio('https://res.cloudinary.com/dssk0lrai/video/upload/v1748351353/CROWD_CHEER_SOUND_EFFECT_pmdhnf.mp3');
    clappingAudioRef.current = new Audio('https://res.cloudinary.com/dssk0lrai/video/upload/v1748351353/Applause_Sound_Effect_akad6r.mp3');

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    if (currentStep === 8 && currentMessageIndex < messageLines.length - 1) {
      timeout = setTimeout(() => {
        setCurrentMessageIndex(prev => prev + 1);
      }, 8000);
    } else if (currentStep === 8 && currentMessageIndex === messageLines.length - 1) {
      // Show GIF after last message line
      timeout = setTimeout(() => {
        setShowFinalGif(true);
      }, 8000);
    }
    return () => clearTimeout(timeout);
  }, [currentStep, currentMessageIndex, messageLines.length]);

  const handleYesClick = () => {
    setShowInitial(false);
    setCurrentStep(1);
  };

  const handleNoButtonClick = () => {
    setNoButtonClicks(prev => prev + 1);
    const responses = [
      'Nice catch! Still No 😝',
      'Wow you got me! But still No 😈',
      'You\'re quick! But No 🏃‍♂️',
      'Impressive! But No 🎭',
      'Almost had me! No 🎪'
    ];
    setNoButtonText(responses[noButtonClicks % responses.length]);
    handleNoButtonHover(); // Make it move again after being caught
  };

  const handleNoButtonHover = () => {
    const moveDistance = 150; // Increased movement distance
    const randomAngle = Math.random() * 2 * Math.PI;
    const x = Math.cos(randomAngle) * moveDistance;
    const y = Math.sin(randomAngle) * moveDistance;
    
    // Ensure button stays within viewport
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const buttonWidth = 100; // Approximate button width
    const buttonHeight = 50; // Approximate button height
    
    const finalX = Math.min(Math.max(x, -viewportWidth/2 + buttonWidth), viewportWidth/2 - buttonWidth);
    const finalY = Math.min(Math.max(y, -viewportHeight/2 + buttonHeight), viewportHeight/2 - buttonHeight);
    
    setNoButtonPosition({ x: finalX, y: finalY });
  };

  const handleLightsOn = () => {
    setIsDark(false);
    setCurrentStep(2);
  };

  const handlePlayMusic = async () => {
    setIsAudioLoading(true);
    setAudioError(null);
    
    try {
      if (audioRef.current) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          await playPromise;
          console.log('Music started playing');
          setCurrentStep(3);
        }
      }
    } catch (error) {
      console.error('Playback error:', error);
      setAudioError('Failed to play music. Please try again.');
    } finally {
      setIsAudioLoading(false);
    }
  };

  const handleDecorate = () => {
    setShowBanner(true);
    setCurrentStep(4);
  };

  const handleBalloons = () => {
    setShowBalloons(true);
    setCurrentStep(5);
  };

  const handleCake = () => {
    setShowCake(true);
    setCurrentStep(6);
  };

  const handleSliceCake = () => {
    setIsCakeSliced(true);
    setShowFireworks(true);
    setCurrentStep(7);
    
    // Play sound effects
    if (cheeringAudioRef.current) {
      cheeringAudioRef.current.currentTime = 0;
      cheeringAudioRef.current.play();
    }
    if (clappingAudioRef.current) {
      clappingAudioRef.current.currentTime = 0;
      clappingAudioRef.current.play();
    }

    // Hide fireworks after animation
    setTimeout(() => {
      setShowFireworks(false);
    }, 3000);
  };

  const handleShowMessage = () => {
    setCurrentStep(8);
  };

  const balloonColors = ['#ff69b4', '#4a90e2', '#50c878', '#ffd700', '#ff4500'];
  const fireworkEmojis = ['✨', '🎆', '💫', '🎇'];

  return (
    <ThemeProvider theme={{ isDark }}>
      <GlobalStyle isDark={isDark} />
      <Fireworks isVisible={showFireworks}>
        {Array.from({ length: 20 }).map((_, index) => (
          <FireworkSparkle
            key={index}
            delay={Math.random() * 0.5}
            top={Math.random() * 100}
            left={Math.random() * 100}
          >
            {fireworkEmojis[Math.floor(Math.random() * fireworkEmojis.length)]}
          </FireworkSparkle>
        ))}
      </Fireworks>
      <Container>
        {showFinalGif ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            width: '100vw',
            background: '#fff',
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: 9999
          }}>
            <img src={finalGifUrl} alt="Celebration GIF" style={{ maxWidth: '90vw', maxHeight: '70vh', borderRadius: '18px', boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }} />
            <div style={{ marginTop: '32px', fontSize: '2rem', color: '#888', letterSpacing: '0.2em', fontWeight: 600 }}>
              -END-
            </div>
          </div>
        ) : (
          <>
            {showInitial && (
              <>
                <h1>Do you want to see what I made for you? 🎁</h1>
                <ButtonContainer>
                  <Button primary onClick={handleYesClick}>Yes! 💖</Button>
                  <NoButton
                    onMouseEnter={handleNoButtonHover}
                    onClick={handleNoButtonClick}
                    style={{
                      transform: `translate(${noButtonPosition.x}px, ${noButtonPosition.y}px)`,
                    }}
                  >
                    {noButtonText}
                  </NoButton>
                </ButtonContainer>
              </>
            )}

            {!showInitial && currentStep === 1 && (
              <Button onClick={handleLightsOn}>Turn the lights on 💡</Button>
            )}

            {currentStep === 2 && (
              <>
                <Button 
                  onClick={handlePlayMusic}
                  disabled={isAudioLoading}
                >
                  {isAudioLoading ? 'Loading Music...' : 'Play the Music 🎵'}
                </Button>
                {audioError && (
                  <div style={{ color: 'red', marginTop: '10px' }}>
                    {audioError}
                  </div>
                )}
              </>
            )}

            {currentStep === 3 && (
              <Button onClick={handleDecorate}>Decorate 🎊</Button>
            )}

            {showBanner && (
              <Banner>Happy 22nd Birthday Madamji! 🎉</Banner>
            )}

            {currentStep === 4 && (
              <Button onClick={handleBalloons}>Fly the balloons 🎈</Button>
            )}

            {showBalloons && currentStep !== 8 && (
              <>
                {balloonColors.map((color, index) => (
                  <Balloon key={index} color={color} delay={index * 0.5} left={Math.random() * 100} />
                ))}
                {/* Floating images with the balloons */}
                {[
                  'https://res.cloudinary.com/dssk0lrai/image/upload/v1750358030/image-1_tnksla.png',
                  'https://res.cloudinary.com/dssk0lrai/image/upload/v1750358033/image-5_w5rhys.jpg',
                  'https://res.cloudinary.com/dssk0lrai/image/upload/v1750358030/image-3_bqt2d0.jpg',
                  'https://res.cloudinary.com/dssk0lrai/image/upload/v1750358529/image-2_hzndh1.jpg',
                  'https://res.cloudinary.com/dssk0lrai/image/upload/v1750358530/image-4_xsanqz.jpg',
                  'https://res.cloudinary.com/dssk0lrai/image/upload/v1750358030/image-1_tnksla.png',
                  'https://res.cloudinary.com/dssk0lrai/image/upload/v1750358033/image-5_w5rhys.jpg',
                  'https://res.cloudinary.com/dssk0lrai/image/upload/v1750358030/image-3_bqt2d0.jpg',
                  'https://res.cloudinary.com/dssk0lrai/image/upload/v1750358529/image-2_hzndh1.jpg',
                  'https://res.cloudinary.com/dssk0lrai/image/upload/v1750358530/image-4_xsanqz.jpg'
                ].map((img, idx) => (
                  <FloatingImage key={idx} src={img} delay={idx * 0.7} left={Math.random() * 100} alt={`Floating ${idx}`} />
                ))}
              </>
            )}

            {currentStep === 5 && (
              <Button onClick={handleCake}>Let's get the cake 🎂</Button>
            )}

            {showCake && (
              <CakeContainer>
                <CakeImage 
                  src={cakeImageUrl} 
                  alt="Birthday Cake"
                  isSliced={isCakeSliced}
                  style={{ display: isCakeSliced ? 'none' : 'block' }}
                />
                <CakeImage 
                  src={cakeSliceUrl}
                  alt="Sliced Cake"
                  isSliced={isCakeSliced}
                  style={{ display: isCakeSliced ? 'block' : 'none' }}
                />
              </CakeContainer>
            )}

            {currentStep === 6 && !isCakeSliced && (
              <Button onClick={handleSliceCake}>Let's cut the cake! 🔪</Button>
            )}

            {currentStep === 7 && (
              <Button onClick={handleShowMessage}>I have a message for you ❤️</Button>
            )}

            {currentStep === 8 && !showFinalGif && (
              <MessageContainer>
                <Message>
                  {messageLines.map((line, index) => (
                    <MessageLine 
                      key={index} 
                      isVisible={index === currentMessageIndex}
                    >
                      {line}
                    </MessageLine>
                  ))}
                </Message>
              </MessageContainer>
            )}
          </>
        )}
      </Container>
    </ThemeProvider>
  );
};

export default BirthdaySurprise; 