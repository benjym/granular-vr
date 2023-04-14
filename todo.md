## 4D in VR
- [x] Main menu?!? Or just next/previous buttons in each room? Why not both? A landing page and then arrows in all rooms
- [x] What is a circle/sphere/hypersphere?
- [x] 2D slice of 3D sphere
- [x] 3D slice of 4D sphere
- [x] Texturing
- [ ] Simple game
	- [ ] Putt putt?
	- [x] Stack of balls?
- [ ] 4D pool. To do:
	- [ ] Game mechanics
	- [x] Snap cue to hand
	- [ ] Instruction labels on controllers
	- [ ] Win flag


# To do
- [x] next/prev arrows in all scenes
- [x] d4 movement in all relevant scenes
- [x] check that buttons work on both bg and text
- [x] more headsets!!!
- [x] link scenes together without page refresh
- [x] change enter vr button to fill screen
- [ ] move wasm files to GitHub release artifacts 
- [x] flesh out voiceovers!
- [ ] button to start/restart/resume voiceovers?
- [x] Balls as hands in pyramid game
- [x] pool cue + hand snap
- [x] forces to pyramid
- [x] scenes to add:
  - [x] Two particles colliding with forces
  - [x] isotropic
  - [x] 2D slice a 3D space with min/max cutoff in camera?

## Issues found in first day of use
- [ ] Lots of lag sometimes
- [ ] General crashing and hanging
- [x] make Enter vr button into a splash screen or at least embiggen and centre
- [ ] explain what 2D/3D/4D space is
- [ ] pause on headset removal
- [ ] dont crash on headset removal (see [here](https://forum.babylonjs.com/t/webxr-headset-sleep-and-wake-up-events/14073/6))
- [ ] controllers getting stuck?
- [ ] people getting outside of box and stuck there
- [ ] haptics for balls on hands and pool cue
- [ ] to deal with lag, pull NDDEM off main thread onto web worker https://pspdfkit.com/blog/2020/webassembly-in-a-web-worker/
- [x] Remove menu links to encourage people to do everything
- [ ] Only show progress button after some time
- [ ] showstopping crashes on:
- [ ] controller disconnection (when put down)
- [ ] headset removal 
- [ ] add "Next: " and "Back: to buttons"
- [ ] remove main menu, make button gracefully quit vr and say congrats ?
- [ ] hunt for any redirects that might be causing the issues with the new tabs
- [ ] tennis: button to fire balls. Also add damping
