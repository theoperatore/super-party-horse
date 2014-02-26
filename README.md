Super Party Horse -- The Source Code
====================================

**The game engine source that runs SPH will be hosted when most of the components have been built**

PH-Engine uses [browserify](browserify.org) to provide a pseudo-class (similar to `import` in other languages...) coding design approach. I'm sure there is a more efficient approach but by grouping functions together in 'require-able' modules makes for cleaner code that is a little easier to read and understand.

Documentation for ph-engine will be hosted on the [website](http://theoperatore.github.io/super-party-horse).

You can view all current updates and articles related to designing the game and game engine at the [SPH Website](http://theoperatore.github.io/super-party-horse).

Goals
-----

- To learn as much as possible about module coding design and game engines.
- To provide a basis / basic framework for an HTML5/canvas style game engine.
- To provide help to those trying to learn coding practices and game mechanics.


*All version history refers to the ph-engine used to create Super Party Horse*
Current: Version 0.2.3
----------------------
- Improvement on Input handling
- Finished first implementation on game states

Version 0.2
--------------------

- Background and Foreground implemented
- Inputs for states defined
- State switching tested with 'j' key
- Use 'a', 's', 'd', 'w' to set accel.

Version 0.1
-----------

- Implemented Animations for Entities
- Basic Input Manager implementation to test for keys
- Created base Entity, Animation, Emitter, Renderer, and Vector2D modules
- Basic Runge - Kutta and Verlet Integration testing
