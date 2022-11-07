// So how does audio work?
// 1. When particles collide (i.e. they weren't touching before and now they're touching), they ring like bells, with a wavelength related to the elastic wave speed and their size? --- sine wave?
// 2. When particles rub past each other ( i.e. they are in contact and they roll/translate ), they emit a scratching noise whose magnitude is proportional to the normal force being applied? --- sawtooth wave at low frequency?

export let listener;
export let fixed_sound_source = new THREE.Group();
let normal_oscillator, tangential_oscillator;

export function make_listener(target) {
    // create an AudioListener and add it to the camera
    listener = new THREE.AudioListener();
    target.add(listener);

    normal_oscillator = listener.context.createOscillator();
    normal_oscillator.type = 'sine';
    normal_oscillator.frequency.setValueAtTime(500, listener.context.currentTime);
    normal_oscillator.start();

    tangential_oscillator = listener.context.createOscillator();
    tangential_oscillator.type = 'sawtooth';
    tangential_oscillator.frequency.setValueAtTime(200, listener.context.currentTime);
    tangential_oscillator.start();
    // console.log('made an object the audio listener')
}

export function add_normal_sound(target) {
    // if ( listener !== undefined ) {
    let sound = new THREE.PositionalAudio(listener);
    sound.setNodeSource(normal_oscillator);
    // console.log(sound)
    // const gain = listener.context.createGain();
    // gain.gain.value = 0;
    // sound.setRefDistance( 20 );
    // sound.setVolume( 0.0 );
    // sound.connect(gain);//.connect( listener );
    target.add(sound);
    // console.log('SOUND')
    // }
}

export function add_tangential_sound(target) {
    let sound = new THREE.PositionalAudio(listener);
    sound.setNodeSource(tangential_oscillator);
    sound.setRefDistance(20);
    sound.setVolume(0.0);

    target.add(sound)
}

// export function add_impact_sound ( target ) {
//     // create the PositionalAudio object (passing in the listener)
//     const sound = new PositionalAudio( listener );


//     // load a sound and set it as the PositionalAudio object's buffer
//     const audioLoader = new AudioLoader();
//     audioLoader.load( './resources/ping_pong.mp3', function( buffer ) {
//     	sound.setBuffer( buffer );
//     });

//     // finally add the sound to the target
//     target.add( sound );

//     return target;
// }

export function add_fixed_sound_source( loc ) {
    let sound = new THREE.PositionalAudio( listener );
    let oscillator = listener.context.createOscillator();
	oscillator.type = 'square';

    oscillator.frequency.setValueAtTime( 700 , listener.context.currentTime);
	oscillator.start( );

    // sound.setNodeSource( normal_oscillator );
    sound.setNodeSource( oscillator );

    sound.gain.gain.value = 0;
    // sound.setRefDistance( 20 );

    fixed_sound_source.add( sound )
    fixed_sound_source.position.set( ...loc );
}

export function play_track( filename , target, delay) {
    const listener = new THREE.AudioListener();
    target.add( listener );

    // create a global audio source
    const sound = new THREE.Audio( listener );

    // load a sound and set it as the Audio object's buffer
    const audioLoader = new THREE.AudioLoader();
    audioLoader.load( filename, function( buffer ) {
        sound.setBuffer( buffer );
        sound.setLoop( false );
        sound.setVolume( 0.5 );
        setTimeout(() => {
            sound.play()
        }, delay);
        
    });
}