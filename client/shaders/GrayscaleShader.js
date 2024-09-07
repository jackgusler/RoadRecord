import React from "react";
import { Shaders, Node, GLSL } from "gl-react";
import { Surface } from "gl-react-expo";

// Define the GLSL shader code to convert an image to grayscale
const shaders = Shaders.create({
  Grayscale: {
    frag: GLSL`
      precision highp float;
      varying vec2 uv;
      uniform sampler2D t;
      void main() {
        vec4 color = texture2D(t, uv);
        float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
        gl_FragColor = vec4(vec3(gray), color.a);
      }
    `,
  },
});

// Create the Grayscale component
const Grayscale = ({ children }) => (
  <Node shader={shaders.Grayscale} uniforms={{ t: children }} />
);

export default Grayscale;