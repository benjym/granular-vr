// import DEMCGND from "https://franzzzzzzzz.github.io/NDDEM/deploy/DEMCGND.js";
import * as DEMCGND from "../resources/DEMCGND";
let loaded_library
// async () => { loaded_library = await DEMCGND(); }
// loaded_library = DEMCGND();

async function load(dimension, N) {
    if (dimension === 2) {
        return new loaded_library.DEMCG2D(N);
    } else if (dimension === 3) {
        return new loaded_library.DEMCG3D(N);
    } else if (dimension === 4) {
        return new loaded_library.DEMCG4D(N);
    } else if (dimension === 5) {
        return new loaded_library.DEMCG5D(N);
    } else { console.error('Incorrect number of dimensions') }
}

class MyClass {
    constructor() {
        this.tt = 1;
    }
    async init(dimension, N) {
        console.log('initialising')
        if (loaded_library === undefined) {
            loaded_library = await DEMCGND();
            console.log('loaded WASM file')
            this.S = await load(dimension, N);
            console.log('generated new DEMCGND instance')
        } else {
            this.S = await load(dimension, N);
            console.log('WASM file already loaded. Just generated new DEMCGND instance')
        }
    };
}

Comlink.expose(MyClass);