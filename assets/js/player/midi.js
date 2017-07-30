$(document).ready(() => {
    let midi = null;  // global MIDIAccess object
    let outputId = null;

    function onMIDISuccess( midiAccess ) {
        console.log( "MIDI ready!" );
        midi = midiAccess;  // store in the global (in real usage, would probably keep in an object instance)
        listInputsAndOutputs(midi);
    }

    function onMIDIFailure(msg) {
        console.log( "Failed to get MIDI access - " + msg );
    }
    function listInputsAndOutputs(midiAccess) {
        const selectOutput = $("#select-output");
        selectOutput.empty();
        let firstId  = null;
        for (let [_entryId, entry] of midiAccess.outputs) {
            selectOutput.append(`<option value="${entry.id}"">${entry.name}</option>`);
            if (firstId === null && entry.name === "TiMidity port 0")
                firstId = entry.id;
        }
        outputId = firstId;
        selectOutput.change(() => {
            outputId = selectOutput.val();
        });
        selectOutput.val(outputId);
    }
    $("#btn-play").click(() => {
        sendMiddleC(midi, outputId);

    });
    function sendMiddleC(midiAccess, portID) {
        var noteOnMessage = [0x90, 60, 0x7f];    // note on, middle C, full velocity
        var output = midiAccess.outputs.get(portID);
        output.send( noteOnMessage );  //omitting the timestamp means send immediately.
        output.send( [0x80, 60, 0x40], window.performance.now() + 1000.0 ); // Inlined array creation- note off, middle C,
                                                                            // release velocity = 64, timestamp = now + 1000ms.
    }

    navigator.requestMIDIAccess().then( onMIDISuccess, onMIDIFailure );
});