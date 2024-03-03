import Particles from "react-tsparticles"; 
import {loadFull} from 'tsparticles'
import { Engine } from 'tsparticles-engine';

export default function Particlebackground() {
  async function loadparticles(main: Engine) {
      await loadFull(main);
  }

  return (
        <Particles
          id="tsparticles"
          init={loadparticles}
          options={{
            fullScreen: {
              enable: true,
              zIndex: -1
            },
            particles: {
              number: {
                value: 200,
                density: {
                  enable: true,
                  value_area: 552.4120678362015
                }
              },
              color: {
                value: "#ffffff"
              },
              shape: {
                type: "circle",
                stroke: {
                  width: 0,
                  color: "#000000"
                },
                polygon: {
                  nb_sides: 6
                },
                image: {
                  src: "img/github.svg",
                  width: 100,
                  height: 100
                }
              },
              opacity: {
                value: 0.5,
                random: false,
                anim: {
                  enable: true,
                  speed: 1,
                  opacity_min: 0,
                  sync: false
                }
              },
              size: {
                value: 3,
                random: true,
                anim: {
                  enable: false,
                  speed: 16.78214379899786,
                  size_min: 10.388946161284391,
                  sync: false
                }
              },
              line_linked: {
                enable: false,
                distance: 150,
                color: "#ffffff",
                opacity: 0.4,
                width: 1
              },
              move: {
                enable: true,
                speed: 0.6783201938177185,
                direction: "none",
                random: true,
                straight: false,
                out_mode: "out",
                bounce: false,
                attract: {
                  enable: false,
                  rotateX: 157.83201938177186,
                  rotateY: 236.74802907265777
                }
              }
            },
            interactivity: {
              detect_on: "canvas",
              events: {
                onhover: {
                  enable: true,
                  mode: "bubble"
                },
                onclick: {
                  enable: false,
                  mode: "bubble"
                },
                resize: true
              },
              modes: {
                grab: {
                  distance: 431.54084054565925,
                  line_linked: {
                    opacity: 0.8984216916228251
                  }
                },
                bubble: {
                  distance: 335.6428759799572,
                  size: 0,
                  duration: 1.9978742617854597,
                  opacity: 0,
                  speed: 3
                },
                repulse: {
                  distance: 183.8044320842623,
                  duration: 0.4
                },
                push: {
                  particles_nb: 4
                },
                remove: {
                  particles_nb: 2
                }
              }
            },
            retina_detect: true
          }}
          />
          )
}
