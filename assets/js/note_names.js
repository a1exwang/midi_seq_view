function getNoteName(midiVal) {
    var octave = Math.round(midiVal / 12);
    var name = midiVal % 12;
    return ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"][name] + octave;
}