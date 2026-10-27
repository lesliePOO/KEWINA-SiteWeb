import * as THREE from 'three';

/**
 * Scène 3D « Lumière sur l'étoffe » : un tissu wax qui ondule sous une lumière dorée rasante.
 * Vraie géométrie 3D (plan subdivisé déformé dans le vertex shader), éclairage calculé par pixel.
 * Chargée à la demande (import dynamique) pour ne jamais ralentir l'affichage de la page.
 */

const VERTEX = /* glsl */ `
  uniform float uTemps;
  uniform vec2 uSouris;
  uniform float uForce;
  varying vec2 vUv;
  varying vec3 vPos;
  varying float vPli;

  float hauteur(vec2 p) {
    float h = sin(p.x * 1.15 + uTemps * 0.55) * 0.22;
    h += sin(p.y * 1.55 + uTemps * 0.42) * 0.16;
    h += sin((p.x + p.y) * 0.75 + uTemps * 0.33) * 0.2;
    // Plis verticaux du drapé, qui serpentent lentement
    h += sin(p.x * 2.6 + sin(p.y * 0.9 + uTemps * 0.3) * 1.6) * 0.14;
    // Onde créée par le curseur
    float d = distance(p, uSouris);
    h += exp(-d * d * 0.9) * uForce * 0.42 * sin(uTemps * 2.4 - d * 3.2);
    return h;
  }

  void main() {
    vUv = uv;
    vec3 p = position;
    float h = hauteur(p.xy);
    p.z += h;
    vPli = h;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vPos = mv.xyz;
    gl_Position = projectionMatrix * mv;
  }
`;

const FRAGMENT = /* glsl */ `
  uniform sampler2D uMotif;
  uniform vec3 uLumiere;
  varying vec2 vUv;
  varying vec3 vPos;
  varying float vPli;

  void main() {
    vec3 n = normalize(cross(dFdx(vPos), dFdy(vPos)));
    vec3 l = normalize(uLumiere);
    vec3 v = normalize(-vPos);
    float diffus = max(dot(n, l), 0.0);
    vec3 h = normalize(l + v);
    float brillance = pow(max(dot(n, h), 0.0), 38.0);
    float rasante = pow(1.0 - max(dot(n, v), 0.0), 2.5);

    vec3 base = texture2D(uMotif, vUv * vec2(3.2, 2.2)).rgb;
    vec3 or_ = vec3(0.902, 0.702, 0.416);
    vec3 couleur = base * (0.18 + 1.05 * diffus) + or_ * brillance * 0.55 + or_ * rasante * 0.12;
    couleur *= 0.85 + vPli * 0.35;

    // Vignette pour fondre l'étoffe dans le noir
    float bord = smoothstep(0.0, 0.22, vUv.x) * smoothstep(1.0, 0.78, vUv.x) * smoothstep(0.0, 0.25, vUv.y) * smoothstep(1.0, 0.75, vUv.y);
    gl_FragColor = vec4(couleur * bord, 1.0);
  }
`;

/** Motif wax dessiné dans un canvas : losanges bronze, cœurs carmin, coins terracotta. */
function texturerWax(): THREE.CanvasTexture {
  const t = 256;
  const c = document.createElement('canvas');
  c.width = c.height = t;
  const g = c.getContext('2d')!;
  g.fillStyle = '#2a120c';
  g.fillRect(0, 0, t, t);
  const m = t / 2;
  g.strokeStyle = '#c9943a';
  g.lineWidth = 7;
  g.beginPath();
  g.moveTo(m, 18); g.lineTo(t - 18, m); g.lineTo(m, t - 18); g.lineTo(18, m); g.closePath();
  g.stroke();
  g.fillStyle = '#8a2a1f';
  g.beginPath();
  g.moveTo(m, 74); g.lineTo(t - 74, m); g.lineTo(m, t - 74); g.lineTo(74, m); g.closePath();
  g.fill();
  g.fillStyle = '#b66a3c';
  for (const [x, y, dx, dy] of [[0, 0, 1, 1], [t, 0, -1, 1], [0, t, 1, -1], [t, t, -1, -1]]) {
    g.beginPath();
    g.moveTo(x, y); g.lineTo(x + dx * 46, y); g.lineTo(x, y + dy * 46); g.closePath();
    g.fill();
  }
  g.fillStyle = '#e6b36a';
  g.beginPath();
  g.arc(m, m, 10, 0, Math.PI * 2);
  g.fill();
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

export interface SceneDrape {
  arreter: () => void;
}

/** Monte la scène dans le conteneur. Lance une erreur si WebGL est indisponible. */
export function monterDrape(conteneur: HTMLElement, options: { anime: boolean }): SceneDrape {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.setClearColor(0x0b0b0b, 1);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  conteneur.appendChild(renderer.domElement);
  renderer.domElement.style.display = 'block';
  renderer.domElement.style.width = '100%';
  renderer.domElement.style.height = '100%';

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 50);
  camera.position.set(0, 0, 7.5);

  const geometrie = new THREE.PlaneGeometry(9, 6, 160, 110);
  const motif = texturerWax();
  const materiau = new THREE.ShaderMaterial({
    vertexShader: VERTEX,
    fragmentShader: FRAGMENT,
    uniforms: {
      uTemps: { value: 0 },
      uSouris: { value: new THREE.Vector2(10, 10) },
      uForce: { value: 0 },
      uMotif: { value: motif },
      uLumiere: { value: new THREE.Vector3(0.55, 0.65, 0.9) },
    },
  });
  const etoffe = new THREE.Mesh(geometrie, materiau);
  etoffe.rotation.x = -0.32;
  etoffe.rotation.z = 0.08;
  scene.add(etoffe);

  const cible = new THREE.Vector2(10, 10);
  let forceCible = 0;
  const surMouvement = (e: PointerEvent) => {
    const r = conteneur.getBoundingClientRect();
    cible.set(((e.clientX - r.left) / r.width - 0.5) * 9, -((e.clientY - r.top) / r.height - 0.5) * 6);
    forceCible = 1;
  };
  const surSortie = () => {
    forceCible = 0;
  };
  conteneur.addEventListener('pointermove', surMouvement);
  conteneur.addEventListener('pointerleave', surSortie);

  const redimensionner = () => {
    const { clientWidth: w, clientHeight: h } = conteneur;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // Sur écran étroit, on recule la caméra pour garder l'étoffe entière
    camera.position.z = w / h < 1 ? 10.5 : 7.5;
    camera.updateProjectionMatrix();
  };
  const observateurTaille = new ResizeObserver(redimensionner);
  observateurTaille.observe(conteneur);
  redimensionner();

  let visible = true;
  const observateurVue = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
  });
  observateurVue.observe(conteneur);

  const horloge = new THREE.Clock();
  let raf = 0;
  const boucle = () => {
    raf = requestAnimationFrame(boucle);
    if (!visible) return;
    const u = materiau.uniforms;
    u.uTemps.value = horloge.getElapsedTime();
    (u.uSouris.value as THREE.Vector2).lerp(cible, 0.06);
    u.uForce.value += (forceCible - u.uForce.value) * 0.04;
    etoffe.rotation.y = Math.sin(u.uTemps.value * 0.12) * 0.06;
    renderer.render(scene, camera);
  };

  if (options.anime) {
    boucle();
  } else {
    materiau.uniforms.uTemps.value = 2.2;
    renderer.render(scene, camera);
  }

  return {
    arreter: () => {
      cancelAnimationFrame(raf);
      observateurTaille.disconnect();
      observateurVue.disconnect();
      conteneur.removeEventListener('pointermove', surMouvement);
      conteneur.removeEventListener('pointerleave', surSortie);
      geometrie.dispose();
      materiau.dispose();
      motif.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
