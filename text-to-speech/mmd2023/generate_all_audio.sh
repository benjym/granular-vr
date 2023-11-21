# ./make_audio.sh index.json index.mp3
# ./make_audio.sh hyperspheres.json hyperspheres.mp3
# ./make_audio.sh 2d-rain.json 2d-rain.mp3
# ./make_audio.sh slice-3d.json slice-3d.mp3
# ./make_audio.sh slice-4d.json slice-4d.mp3
# ./make_audio.sh rotation-3d.json rotation-3d.mp3
# ./make_audio.sh rotation-4d.json rotation-4d.mp3
# ./make_audio.sh pyramid.json pyramid.mp3
# ./make_audio.sh 4d-pool.json 4d-pool.mp3

for file in *.json; do
    if [[ -f "$file" ]]; then
        filename=$(basename "$file" .json)
        ./make_audio.sh ${filename}.json ${filename}.mp3
    fi
done