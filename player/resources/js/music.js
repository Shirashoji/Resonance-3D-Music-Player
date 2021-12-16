let audioContext;
let canvasControl;
let scene;
let audioElement;
let soundSource;
let sourceId = 'sourceButton';
let dimensions = {
    small: {
        width: 1.5, height: 2.4, depth: 1.3,
    },
    medium: {
        width: 4, height: 3.2, depth: 3.9,
    },
    large: {
        width: 8, height: 3.4, depth: 9,
    },
    huge: {
        width: 20, height: 10, depth: 20,
    },
};
let materials = {
    brick: {
        left: 'brick-bare', right: 'brick-bare',
        up: 'brick-bare', down: 'wood-panel',
        front: 'brick-bare', back: 'brick-bare',
    },
    curtains: {
        left: 'curtain-heavy', right: 'curtain-heavy',
        up: 'wood-panel', down: 'wood-panel',
        front: 'curtain-heavy', back: 'curtain-heavy',
    },
    marble: {
        left: 'marble', right: 'marble',
        up: 'marble', down: 'marble',
        front: 'marble', back: 'marble',
    },
    outside: {
        left: 'transparent', right: 'transparent',
        up: 'transparent', down: 'grass',
        front: 'transparent', back: 'transparent',
    },
    acoustic: {
        left: 'acoustic-ceiling-tiles', right: 'acoustic-ceiling-tiles',
        up: 'acoustic-ceiling-tiles', down: 'wood-panel',
        front: 'acoustic-ceiling-tiles', back: 'acoustic-ceiling-tiles',
    },
};
let dimensionSelection = 'small';
let materialSelection = 'brick';
let audioReady = false;

/**
 * @private
 */
function selectRoomProperties() {
    if (!audioReady)
        return;

    dimensionSelection =
        document.getElementById('roomDimensionsSelect').value;
    materialSelection =
        document.getElementById('roomMaterialsSelect').value;
    scene.setRoomProperties(dimensions[dimensionSelection],
        materials[materialSelection]);
    canvasControl.invokeCallback();
}

/**
 * @param {Object} elements
 * @private
 */
function updatePositions(elements) {
    if (!audioReady)
        return;

    for (let i = 0; i < elements.length; i++) {
        let x = (elements[i].x - 0.5) * dimensions[dimensionSelection].width / 2;
        let y = 0;
        let z = (elements[i].y - 0.5) * dimensions[dimensionSelection].depth / 2;
        if (i == 0) {
            soundSource.setPosition(x, y, z);
        } else {
            scene.setListenerPosition(x, y, z);
        }
    }
}

/**
 * @private
 */
function initAudio() {
    audioContext = new (window.AudioContext || window.webkitAudioContext);
    let audioSource = 'resources/music.wav';
    let audioElementSource;
    audioElement = document.createElement('audio');
    audioElement.src = audioSource;
    audioElement.crossOrigin = 'anonymous';
    audioElement.load();
    audioElement.loop = true;
    audioElementSource = audioContext.createMediaElementSource(audioElement);


    // Initialize scene and create Source(s).
    scene = new ResonanceAudio(audioContext, {
        ambisonicOrder: 1,
    });

    soundSource = scene.createSource();
    audioElementSource.connect(soundSource.input);

    scene.output.connect(audioContext.destination);

    audioReady = true;
}

let onLoad = function () {
    // Initialize play button functionality.
    let sourcePlayback = document.getElementById(sourceId);
    sourcePlayback.onclick = function (event) {
        switch (event.target.textContent) {
            case 'Play': {
                if (!audioReady) {
                    initAudio();
                }
                event.target.textContent = 'Pause';
                audioElement.play();
            }
                break;
            case 'Pause': {
                event.target.textContent = 'Play';
                audioElement.pause();
            }
                break;
        }
    };

    document.getElementById('roomDimensionsSelect').addEventListener(
        'change', function (event) {
            selectRoomProperties();
        });

    document.getElementById('roomMaterialsSelect').addEventListener(
        'change', function (event) {
            selectRoomProperties();
        });

    let canvas = document.getElementById('canvas');
    let elements = [
        {
            icon: 'sourceIcon',
            x: 0.5,
            y: 0.25,
            radius: 0.04,
            alpha: 0.75,
            clickable: true,
        },
        {
            icon: 'listenerIcon',
            x: 0.5,
            y: 0.5,
            radius: 0.04,
            alpha: 0.75,
            clickable: true,
        },
    ];
    canvasControl = new CanvasControl(canvas, elements, updatePositions);

    selectRoomProperties();
};
window.addEventListener('load', onLoad);
initAudio()