export default class MOSState {
  statsLog: OT.SubscriberStats[];
  audioScoresLog: number[];
  videoScoresLog: number[];
  stats: HasAudioVideo<AverageStats> = { audio: {}, video: {} };
  bandwidth: Bandwidth = { audio: 0, video: 0 };
  intervalId?: number;

  constructor() {
    this.statsLog = [];
    this.audioScoresLog = [];
    this.videoScoresLog = [];
  }

  static readonly maxLogLength: number = 1000;
  static readonly scoreInterval: number = 1000;

  readonly hasAudioTrack = (): boolean => this.statsLog[0] && !!this.statsLog[0].audio;
  readonly hasVideoTrack = (): boolean => this.statsLog[0] && !!this.statsLog[0].video;

  private audioScore(): number {
    return this.audioScoresLog.reduce((acc, score) => acc + score, 0) / this.audioScoresLog.length;
  }

  private videoScore(): number {
    return this.videoScoresLog.reduce((acc, score) => acc + score, 0) / this.videoScoresLog.length;
  }

  clearInterval() {
    if (this.intervalId) {
      window.clearInterval(this.intervalId);
    }
    this.intervalId = undefined;
  }

  private pruneAudioScores() {
    const { audioScoresLog } = this;
    while (audioScoresLog.length > MOSState.maxLogLength) {
      audioScoresLog.shift();
    }
    this.audioScoresLog = audioScoresLog;
  }

  private pruneVideoScores() {
    const { videoScoresLog } = this;
    while (videoScoresLog.length > MOSState.maxLogLength) {
      videoScoresLog.shift();
    }
    this.videoScoresLog = videoScoresLog;
  }

  pruneScores() {
    this.pruneAudioScores();
    this.pruneVideoScores();
  }

  qualityScore(): number {
    const hasAudioTrack = this.hasAudioTrack();
    const hasVideoTrack = this.hasVideoTrack();
    if (hasAudioTrack && hasVideoTrack) {
      return Math.min(this.audioScore(), this.videoScore());
    } else if (hasAudioTrack && !hasVideoTrack) {
      return this.audioScore();
    } else if (!hasAudioTrack && hasVideoTrack) {
      return this.videoScore();
    } else {
      return 0;
    }
  }
}
