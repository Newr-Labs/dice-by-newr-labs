
import { GoogleGenAI, Modality } from "@google/genai";
import { Language } from '../types';

class AudioService {
  private ctx: AudioContext | null = null;
  private enabled: boolean = false;
  private voiceEnabled: boolean = true;
  private voiceName: string = 'Kore';
  private hapticsEnabled: boolean = true;
  private language: Language = 'en';

  private init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  public setVoiceEnabled(enabled: boolean) {
    this.voiceEnabled = enabled;
  }

  public setVoiceName(name: string) {
    this.voiceName = name;
  }

  public setHapticsEnabled(enabled: boolean) {
    this.hapticsEnabled = enabled;
  }

  public setLanguage(lang: Language) {
    this.language = lang;
  }

  public haptic(pattern: number | number[] = 15, force: boolean = false) {
    if ((this.hapticsEnabled || force) && typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(pattern);
      } catch (e) {}
    }
  }

  private createGain(val: number = 0.4) {
    if (!this.ctx) return null;
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(val, this.ctx.currentTime);
    gain.connect(this.ctx.destination);
    return gain;
  }

  private decodeBase64(base64: string) {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }

  private async decodeAudioData(
    data: Uint8Array,
    ctx: AudioContext,
    sampleRate: number,
    numChannels: number,
  ): Promise<AudioBuffer> {
    const dataInt16 = new Int16Array(
      data.buffer,
      data.byteOffset,
      data.byteLength / 2
    );
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  }

  private nativeSpeak(text: string) {
    if (!this.voiceEnabled) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = this.language;
      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find(v => v.lang.startsWith(this.language) && (v.name.includes('Natural') || v.name.includes('Google'))) || voices.find(v => v.lang.startsWith(this.language)) || voices[0];
      if (preferred) utterance.voice = preferred;
      window.speechSynthesis.speak(utterance);
    } catch (e) {}
  }

  // Fixed: Instantiating GoogleGenAI inside prefetchSpeech to ensure it uses the most up-to-date API key
  public async prefetchSpeech(text: string): Promise<AudioBuffer | null> {
    if (!this.enabled || !this.voiceEnabled) return null;
    this.init();
    if (!this.ctx || !process.env.API_KEY) return null;

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `Speak in ${this.language}: ${text}` }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: this.voiceName },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        const audioBytes = this.decodeBase64(base64Audio);
        return await this.decodeAudioData(audioBytes, this.ctx, 24000, 1);
      }
    } catch (error: any) {
      console.warn("Gemini TTS Error, falling back to native TTS.");
    }
    return null;
  }

  public playSpeechBuffer(buffer: AudioBuffer | null) {
    if (!buffer || !this.ctx) return;
    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    // Boost speech gain node
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.8, this.ctx.currentTime); 
    source.connect(gain);
    gain.connect(this.ctx.destination);
    source.start();
  }

  public async speak(text: string) {
    const buffer = await this.prefetchSpeech(text);
    if (buffer) {
      this.playSpeechBuffer(buffer);
    } else {
      this.nativeSpeak(text);
    }
  }

  public playDice() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const count = 5 + Math.floor(Math.random() * 3);
    for (let i = 0; i < count; i++) {
      const t = now + i * (0.08 + Math.random() * 0.05);
      const oscLow = this.ctx.createOscillator();
      // Increased from 0.04 to 0.4
      const gainLow = this.createGain(0.4);
      if (!gainLow) continue;
      oscLow.type = 'triangle';
      oscLow.frequency.setValueAtTime(120 + Math.random() * 40, t);
      oscLow.connect(gainLow);
      gainLow.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
      oscLow.start(t);
      oscLow.stop(t + 0.1);
    }
  }

  public playCoinToss() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    // Increased from 0.03 to 0.4
    const gain = this.createGain(0.4);
    if (!gain) return;
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.5);
    osc.connect(gain);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.8);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.8);
  }

  public playOracleSwell() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    // Increased from 0.02/0.05 to 0.6
    const gain = this.createGain(0.1); // Base level
    if (!gain) return;
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(60, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(120, this.ctx.currentTime + 1.2);
    osc.connect(gain);
    gain.gain.linearRampToValueAtTime(0.6, this.ctx.currentTime + 0.6);
    gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 1.2);
    osc.start();
    osc.stop(this.ctx.currentTime + 1.2);
  }

  public playBlip(freq: number = 880, vol: number = 0.4) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    // Default vol increased from 0.05 to 0.4
    const gain = this.createGain(vol);
    if (!gain) return;
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    osc.connect(gain);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.1);
  }

  public playClick(vol: number = 0.2) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    // Default vol increased from 0.02 to 0.2
    const gain = this.createGain(vol);
    if (!gain) return;
    osc.type = 'square';
    osc.frequency.setValueAtTime(1000, this.ctx.currentTime);
    osc.connect(gain);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.02);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.02);
  }
}

export const audio = new AudioService();
