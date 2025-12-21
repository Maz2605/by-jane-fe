let audioCtx: AudioContext | null = null;
let clickBuffer: AudioBuffer | null = null;

export const playSuccessSound = async () => {
  try {
    // 1. Khởi tạo Context nếu chưa có
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    // 2. Resume nếu bị browser chặn auto-play
    if (audioCtx.state === 'suspended') {
      await audioCtx.resume();
    }

    // 3. Load file mp3 và cache vào biến clickBuffer (chỉ fetch 1 lần)
    if (!clickBuffer) {
      const response = await fetch('/sounds/click.mp3');
      const arrayBuffer = await response.arrayBuffer();
      clickBuffer = await audioCtx.decodeAudioData(arrayBuffer);
    }

    // 4. Phát âm thanh
    const source = audioCtx.createBufferSource();
    source.buffer = clickBuffer;
    
    const gainNode = audioCtx.createGain();
    gainNode.gain.value = 1; // Volume
    
    source.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    source.start(0);

  } catch (error) {
    // Silent fail: Lỗi âm thanh không được làm crash app
    console.error("Audio play failed", error);
  }
};