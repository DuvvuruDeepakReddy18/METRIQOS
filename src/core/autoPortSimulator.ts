export interface SerialPacket {
  rawFrame: string;
  weight: number;
  unit: string;
  isStable: boolean;
  isGross: boolean;
  timestamp: string;
  baudRate: number;
  port: string;
}

export type AutoPortConnectionState = 'DISCONNECTED' | 'CONNECTING' | 'CONNECTED' | 'STREAMING' | 'ERROR';

export class AutoPortSimulator {
  private state: AutoPortConnectionState = 'DISCONNECTED';
  private port: string = 'COM3 (RS-232 FTDI)';
  private baudRate: number = 9600;
  private intervalId: any = null;
  private listeners: ((packet: SerialPacket) => void)[] = [];
  private stateListeners: ((state: AutoPortConnectionState) => void)[] = [];
  private currentNominalLoad: number = 100.0;
  private noiseAmplitude: number = 0.002;
  private isDeliberateDeviation: boolean = false;

  constructor(port = 'COM3 (RS-232 FTDI)', baudRate = 9600) {
    this.port = port;
    this.baudRate = baudRate;
  }

  public getState(): AutoPortConnectionState {
    return this.state;
  }

  public setNominalLoad(loadKg: number, deliberateDeviation: boolean = false) {
    this.currentNominalLoad = loadKg;
    this.isDeliberateDeviation = deliberateDeviation;
  }

  public onPacket(cb: (packet: SerialPacket) => void) {
    this.listeners.push(cb);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== cb);
    };
  }

  public onStateChange(cb: (state: AutoPortConnectionState) => void) {
    this.stateListeners.push(cb);
    return () => {
      this.stateListeners = this.stateListeners.filter((l) => l !== cb);
    };
  }

  private emitState(newState: AutoPortConnectionState) {
    this.state = newState;
    this.stateListeners.forEach((l) => l(newState));
  }

  public connect(): Promise<boolean> {
    this.emitState('CONNECTING');
    return new Promise((resolve) => {
      setTimeout(() => {
        this.emitState('CONNECTED');
        this.startStreaming();
        resolve(true);
      }, 700);
    });
  }

  public disconnect() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.emitState('DISCONNECTED');
  }

  public startStreaming() {
    if (this.intervalId) clearInterval(this.intervalId);
    this.emitState('STREAMING');

    this.intervalId = setInterval(() => {
      // Generate realistic physical load cell micro-fluctuation
      const randomNoise = (Math.random() - 0.48) * this.noiseAmplitude;
      const deviationOffset = this.isDeliberateDeviation ? 0.085 : 0.008; // Deliberate out-of-tolerance
      const val = parseFloat((this.currentNominalLoad + deviationOffset + randomNoise).toFixed(3));

      const isStable = Math.random() > 0.15; // 85% stable flag
      const sign = val >= 0 ? '+' : '-';
      const paddedNum = Math.abs(val).toFixed(3).padStart(9, '0');
      // Standard Toledo/Sartorius continuous print frame: ST,GS,+000100.012,kg\r\n
      const rawFrame = `ST,GS,${sign}${paddedNum},kg\r\n`;

      const packet: SerialPacket = {
        rawFrame,
        weight: val,
        unit: 'kg',
        isStable,
        isGross: true,
        timestamp: new Date().toISOString(),
        baudRate: this.baudRate,
        port: this.port,
      };

      this.listeners.forEach((cb) => cb(packet));
    }, 280);
  }
}
