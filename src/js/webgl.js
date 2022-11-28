"use strict";

const vertexShader = `#version 300 es
in vec4 a_position;
in vec3 a_normal;
//lightworld duplicado
uniform vec3 u_lightWorldPosition;

uniform vec3 u_lightWorldPosition2;

uniform vec3 u_lightWorldPosition3;

uniform vec3 u_lightWorldPosition4;

uniform vec3 u_viewWorldPosition;
uniform mat4 u_matrix;
uniform mat4 u_world;
uniform mat4 u_worldInverseTranspose;
out vec3 v_normal;

//duplicados surface to light e view
out vec3 v_surfaceToLight;
out vec3 v_surfaceToView;

out vec3 v_surfaceToLight2;
out vec3 v_surfaceToView2;

out vec3 v_surfaceToLight3;
out vec3 v_surfaceToView3;

out vec3 v_surfaceToLight4;
out vec3 v_surfaceToView4;

void main() {
  // Multiply the position by the matrix.
  gl_Position = u_matrix * a_position;
  // Pass the color to the fragment shader.
  v_normal = mat3(u_worldInverseTranspose) * a_normal;
  vec3 surfaceWorldPosition = (u_world * a_position).xyz;

  v_surfaceToLight = u_lightWorldPosition - surfaceWorldPosition;
  v_surfaceToView = u_viewWorldPosition - surfaceWorldPosition;

  v_surfaceToLight2 = u_lightWorldPosition2 - surfaceWorldPosition;
  v_surfaceToView2 = u_viewWorldPosition - surfaceWorldPosition;

  v_surfaceToLight3 = u_lightWorldPosition3 - surfaceWorldPosition;
  v_surfaceToView3 = u_viewWorldPosition - surfaceWorldPosition;

  v_surfaceToLight4= u_lightWorldPosition4 - surfaceWorldPosition;
  v_surfaceToView4 = u_viewWorldPosition - surfaceWorldPosition;
}
`;

const fragmentShader =   `#version 300 es
precision highp float;
// Passed in from the vertex shader.
in vec3 v_normal;

//duplicados
in vec3 v_surfaceToLight;
in vec3 v_surfaceToView;

in vec3 v_surfaceToLight2;
in vec3 v_surfaceToView2;

in vec3 v_surfaceToLight3;
in vec3 v_surfaceToView3;

in vec3 v_surfaceToLight4;
in vec3 v_surfaceToView4;

uniform vec4 u_color;
uniform float u_shininess;

//duplicados
uniform vec3 u_lightColor;
uniform vec3 u_specularColor;

uniform vec3 u_lightColor2;
uniform vec3 u_specularColor2;

uniform vec3 u_lightColor3;
uniform vec3 u_specularColor3;

uniform vec3 u_lightColor4;
uniform vec3 u_specularColor4;

out vec4 outColor;
void main() {
  vec3 normal = normalize(v_normal);

  vec3 surfaceToLightDirection = normalize(v_surfaceToLight);
  vec3 surfaceToViewDirection = normalize(v_surfaceToView);

  vec3 surfaceToLightDirection2 = normalize(v_surfaceToLight2);
  vec3 surfaceToViewDirection2 = normalize(v_surfaceToView2);

  vec3 surfaceToLightDirection3 = normalize(v_surfaceToLight3);
  vec3 surfaceToViewDirection3 = normalize(v_surfaceToView3);

  vec3 surfaceToLightDirection4 = normalize(v_surfaceToLight4);
  vec3 surfaceToViewDirection4 = normalize(v_surfaceToView4);


  vec3 halfVector = normalize(surfaceToLightDirection + surfaceToViewDirection);

  vec3 halfVector2 = normalize(surfaceToLightDirection2 + surfaceToViewDirection2);

  vec3 halfVector3 = normalize(surfaceToLightDirection3 + surfaceToViewDirection3);

  vec3 halfVector4 = normalize(surfaceToLightDirection4 + surfaceToViewDirection4);

  float light = dot(normal, surfaceToLightDirection);

  float light2 = dot(normal, surfaceToLightDirection2);

  float light3 = dot(normal, surfaceToLightDirection3);

  float light4 = dot(normal, surfaceToLightDirection4);

  float specular = 0.0;

  float specular2 = 0.0;

  float specular3 = 0.0;

  float specular4 = 0.0;

  vec3 color;

  vec3 color2;

  vec3 color3;

  vec3 color4;

  vec3 spec;

  vec3 spec2;

  vec3 spec3;

  vec3 spec4;

  specular = pow(dot(normal, halfVector), u_shininess);

  specular2 = pow(dot(normal, halfVector2), u_shininess);

  specular3 = pow(dot(normal, halfVector3), u_shininess);

  specular4 = pow(dot(normal, halfVector3), u_shininess);

  if (light > 0.0) {
    color = light * u_lightColor;
    spec = specular * u_specularColor;
  }

  if (light2 > 0.0) {
    color2 = light2 * u_lightColor2;
    spec2 = specular2 * u_specularColor2;
  }

  if (light3 > 0.0) {
    color3 = light3 * u_lightColor3;
    spec3 = specular3 * u_specularColor3;
  }

  if (light4 > 0.0) {
    color4 = light4 * u_lightColor4;
    spec4 = specular4 * u_specularColor3;
  }
  
  outColor = u_color;
  outColor.rgb *= (color + color2 + color3 + color4);
  outColor.rgb += (spec + spec2 + spec3 + spec4);
}
`;



const initializeWebgl = () => {
    const canvas = document.querySelector("#canvas")

    const gl = canvas.getContext("webgl2")

    if (!gl) return

    const  programInfo = twgl.createProgramInfo(gl, [vertexShader, fragmentShader])
   
    twgl.setAttributePrefix("a_")

    return { gl, programInfo };
  }
