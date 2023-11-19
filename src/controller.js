import css from "../css/controller.css"
import JSON5 from "json5";
import { io } from "socket.io-client";

let server = 'https://granular-vr.glitch.me/'
let apps;
let socket = io(server);

socket.on("connect", () => {
    console.log('Connected to socket.io server')
    socket.on('receive_count', (count) => {
        // console.log('received move to ' + dest);
        // move_to(dest)
        if ( count === 1) {
            document.getElementById('count').innerHTML = String(count) + ' User';
        } else {
            document.getElementById('count').innerHTML = String(count) + ' Users';
        }
    });
    // Client receives the room list
    socket.on('roomList', (roomList) => {
        let ul = document.getElementById('list');
        const links = ul.querySelectorAll('a');
        // console.log(roomList)
        // Loop through each link
        let keys = Object.keys(roomList);
        let values = Object.values(roomList);

        links.forEach((link, index) => {
            let val = apps.list[index];

            link.textContent = String(index) + '. ' + val.name + ' (' + String(roomList[keys[index]]) + ')';
        });

    });
});

let urlParams = new URLSearchParams(window.location.search);
let master;
if ( urlParams.has('master') ) { master = urlParams.get('master') }
else { master = "grain-days-2023"; }

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

            const countDiv = document.createElement('div');
            countDiv.id = 'count';
            countDiv.innerHTML = '0 Users';
            document.body.appendChild(countDiv);

            // Create and populate the list
            const list = document.createElement('ul');
            list.id = 'list';
            
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

                    listItem.appendChild(anchor);
                    list.appendChild(listItem);
                });

                // Append the list to the full-screen div
                fullScreenDiv.appendChild(list);

                // Append the full-screen div to the body
                document.body.appendChild(fullScreenDiv);
                // console.log('HI!')

            // });
        });

    const interval = setInterval(function() {
        socket.emit('request_count');
        socket.emit('requestRoomList');
    }, 1000);
        
    // clearInterval(interval);
    

    }

init();