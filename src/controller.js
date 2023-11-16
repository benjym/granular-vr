import JSON5 from "json5";
import { io } from "socket.io-client";

let server = 'https://snowy-surf-elk.glitch.me/'
let apps;
let socket = io(server);

socket.on("connect", () => {
    console.log('Connected to socket.io server')
});

function init() {
    fetch('master/' + master + '.json')
        .then( response => response.text() )
        .then(text => {
            apps = JSON5.parse(text);
            let links = [];
            apps.list.forEach( (val, index) => {
                if ( val.url !== 'menu' ) {
                    // BUTTONS.add_scene_change_button(val.url, String(index) + '. ' + val.name, controls, scene, [0, height - 0.2*index, 0], 0.3, [0, 0, 0]);
                    links.push({
                        href: val.url,
                        text: String(index) + '. ' + val.name })
                }
            });

            // Create full-screen div
            const fullScreenDiv = document.createElement('div');
            fullScreenDiv.style.position = 'fixed';
            fullScreenDiv.style.top = '0';
            fullScreenDiv.style.left = '0';
            fullScreenDiv.style.width = '100%';
            fullScreenDiv.style.height = '100%';
            fullScreenDiv.style.backgroundColor = 'black';
            // fullScreenDiv.style.zIndex = '1000'; // High z-index to overlay content
            fullScreenDiv.style.display = 'flex';
            fullScreenDiv.style.justifyContent = 'center';
            fullScreenDiv.style.alignItems = 'center';

            // Create and populate the list
            const list = document.createElement('ul');
            list.style.listStyle = 'none';
            list.style.color = 'white'; // Example styling
            
                links.forEach(link => {
                    const listItem = document.createElement('li');
                    const anchor = document.createElement('a');
                    anchor.addEventListener('click', (e) => {
                        e.preventDefault(); // Prevent default link behavior
                        socket.emit('send_move', link.href);
                        console.log('emitted send_move ' + link.href )
                    });
                    anchor.href = '#';
                    anchor.textContent = link.text;
                    anchor.style.color = 'white'; // Example styling

                    listItem.appendChild(anchor);
                    list.appendChild(listItem);
                });

                // Append the list to the full-screen div
                fullScreenDiv.appendChild(list);

                // Append the full-screen div to the body
                document.body.appendChild(fullScreenDiv);
                console.log('HI!')
            // });
        });
    }

let urlParams = new URLSearchParams(window.location.search);
let master;
if ( urlParams.has('master') ) { master = urlParams.get('master') }
else { master = "grain-days-2023"; }

init();