import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { signalPoint } from "@/lib/clarity-flow.mjs";

/** Genuine scene geometry. No photograph, image plate or image texture is rendered. */
export function createLensRenderer(canvas: HTMLCanvasElement) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: "low-power",
  });
  const resources: { dispose(): void }[] = [];
  const own = <T extends { dispose(): void }>(resource: T) => {
    resources.push(resource);
    return resource;
  };
  const releaseNow = (resource: { dispose(): void }) => {
    resource.dispose();
    resources.splice(resources.indexOf(resource), 1);
  };
  let released = false;
  const cleanup = () => {
    if (released) return;
    released = true;
    resources.reverse().forEach((resource) => resource.dispose());
    renderer.dispose();
  };
  try {
    renderer.setClearColor(0xf7f4ee, 1);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.setPixelRatio(1);
    renderer.transmissionResolutionScale = 0.5;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf7f4ee);
    const camera = new THREE.PerspectiveCamera(27, 1, 0.1, 100);
    const pmrem = own(new THREE.PMREMGenerator(renderer));
    const room = own(new RoomEnvironment());
    // Tall studio cards create legible, curved reflections in clear optical glass.
    const card = (
      width: number,
      height: number,
      color: THREE.Color,
      x: number,
      y: number,
      z: number,
    ) => {
      const panel = new THREE.Mesh(
        new THREE.PlaneGeometry(width, height),
        new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide }),
      );
      panel.position.set(x, y, z);
      panel.lookAt(0, 1, 0);
      room.add(panel);
    };
    card(1.4, 9, new THREE.Color().setRGB(5, 4.5, 3.8), -7, 5, 4);
    card(2.2, 9, new THREE.Color().setRGB(0.025, 0.022, 0.018), -7, 4, -3);
    card(2, 8, new THREE.Color().setRGB(4, 4, 4), 5, 5, -5);
    const environment = own(pmrem.fromScene(room, 0.035));
    scene.environment = environment.texture;
    scene.environmentIntensity = 0.85;
    releaseNow(room);
    releaseNow(pmrem);
    const geometry = <T extends THREE.BufferGeometry>(g: T) => own(g);
    const material = <T extends THREE.Material>(m: T) => own(m);
    const key = new THREE.DirectionalLight(0xffead3, 3.0);
    key.position.set(-4, 7, 4);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xffffff, 2.0);
    fill.position.set(5, 4, -3);
    scene.add(fill);
    scene.add(new THREE.HemisphereLight(0xffffff, 0xc7b79f, 1.4));
    // Match the paper's color pipeline: applying ACES only to transmitted paper
    // makes clear glass look like an opaque grey disk.
    const glass = material(
      new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0,
        roughness: 0,
        transmission: 1,
        thickness: 0.12,
        ior: 1.46,
        envMapIntensity: 0.55,
        attenuationColor: new THREE.Color(0xfff4df),
        attenuationDistance: 12,
        toneMapped: false,
      }),
    );
    // Approximate the multiple internal edge reflections missing from a single
    // screen-space transmission pass. They follow the actual curved normals,
    // so the polished bevel responds to camera and lens movement.
    glass.onBeforeCompile = (shader) => {
      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <opaque_fragment>",
        `
      float facing=abs(dot(normal,normalize(vViewPosition)));
      float edge=pow(1.-facing,2.3);
      float angle=atan(normal.y,normal.x);
      float broad=.5-.5*sin(angle*3.+.8);
      float ribbon=pow(.5+.5*sin(facing*44.+angle*2.),8.);
      vec3 edgeReflection=mix(vec3(.006,.012,.016),vec3(.42,.29,.17),broad);
      edgeReflection=mix(edgeReflection,vec3(1.2,1.10,.91),ribbon*.85);
      outgoingLight*=1.-.13*pow(1.-facing,1.1);
      outgoingLight=mix(outgoingLight,edgeReflection,edge*.96);
      #include <opaque_fragment>
    `,
      );
    };
    glass.customProgramCacheKey = () => "optical-bevel-v1";
    const bevel = material(glass.clone());
    bevel.roughness = 0;
    bevel.thickness = 0.18;
    bevel.onBeforeCompile = (shader) => {
      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <opaque_fragment>",
        `
      float angle=atan(normal.y,normal.x);
      float ribbon=pow(.5+.5*sin(angle*9.+normal.z*15.),12.);
      float warm=.5+.5*sin(angle*3.+normal.z*4.);
      vec3 reflection=mix(vec3(.003,.009,.014),vec3(.38,.23,.12),pow(warm,2.));
      reflection=mix(reflection,vec3(1.4,1.23,.95),ribbon);
      float copper=pow(.5+.5*sin(angle*6.-normal.z*19.),20.);
      reflection=mix(reflection,vec3(.88,.24,.065),copper*.65);
      outgoingLight=mix(outgoingLight,reflection,.95);
      #include <opaque_fragment>
    `,
      );
    };
    bevel.customProgramCacheKey = () => "optical-polished-edge-v1";
    // A continuous optical solid: curved faces, rounded shoulders and a thick
    // polished edge. Dimensions are baked in, so refraction is not distorted by
    // a nonuniform mesh scale. There are no metal rings around the glass.
    const profile: THREE.Vector2[] = [];
    for (let j = 0; j <= 24; j++) {
      const r = (j / 24) * 0.94;
      profile.push(new THREE.Vector2(r, -0.25 + 0.13 * r * r));
    }
    profile.push(
      new THREE.Vector2(0.97, -0.12),
      new THREE.Vector2(0.993, -0.07),
      new THREE.Vector2(1, -0.025),
      new THREE.Vector2(1, 0.025),
      new THREE.Vector2(0.993, 0.07),
      new THREE.Vector2(0.97, 0.12),
    );
    for (let j = 24; j >= 0; j--) {
      const r = (j / 24) * 0.94;
      profile.push(new THREE.Vector2(r, 0.25 - 0.13 * r * r));
    }
    const lenses: THREE.Group[] = [];
    for (let i = 0; i < 5; i++) {
      const radius = 1.4 - i * 0.1;
      const lens = new THREE.Group();
      const solid = geometry(
        new THREE.LatheGeometry(
          profile.map((p) => new THREE.Vector2(p.x * radius, p.y * radius)),
          96,
        ),
      );
      // Two contiguous draw groups keep the optically dense shoulder distinct
      // without adding stacked shells, outlines, or hundreds of draw calls.
      const faces: number[] = [],
        edges: number[] = [],
        indices = solid.index!.array;
      for (let s = 0; s < 96; s++)
        for (let j = 0; j < profile.length - 1; j++) {
          const list = j >= 24 && j <= 30 ? edges : faces,
            offset = (s * (profile.length - 1) + j) * 6;
          for (let k = 0; k < 6; k++) list.push(indices[offset + k]);
        }
      solid.setIndex([...faces, ...edges]);
      solid.clearGroups();
      solid.addGroup(0, faces.length, 0);
      solid.addGroup(faces.length, edges.length, 1);
      solid.rotateZ(-Math.PI / 2);
      const body = new THREE.Mesh(solid, [glass, bevel]);
      lens.add(body);
      lens.position.set(-4.4 + i * 2.2, radius, 0);
      lens.rotation.z = -0.035;
      scene.add(lens);
      lenses.push(lens);
    }
    // Contact shadows and moving, warm floor light are generated in world space.
    const floorMat = material(
      new THREE.ShaderMaterial({
        uniforms: {
          paper: { value: new THREE.Color(0xf7f4ee) },
          time: { value: 0 },
          pointer: { value: new THREE.Vector2() },
        },
        vertexShader: `varying vec3 world;void main(){vec4 p=modelMatrix*vec4(position,1.);world=p.xyz;gl_Position=projectionMatrix*viewMatrix*p;}`,
        fragmentShader: `uniform vec3 paper;uniform float time;uniform vec2 pointer;varying vec3 world;
    float sq(float x){return x*x;}
    void main(){float shadow=0.;vec3 light=vec3(0.);for(int i=0;i<5;i++){
    float x=-4.4+float(i)*2.2;vec2 p=world.xz-vec2(x,0.);
    // Positive z travels toward the camera: this axis projects down and right.
    vec2 axis=normalize(vec2(.28,1.));
    float along=dot(p,axis),across=dot(p,vec2(axis.y,-axis.x));
    float radius=1.4-float(i)*.10;
    float ring=length(vec2(across/(radius*.39),(along-radius*.72)/(radius*1.48)));
    shadow+=.34*exp(-sq((ring-1.)/.17));
    shadow+=.13*exp(-sq(across/(radius*.60))-sq((along-.55)/2.2));
    shadow+=.50*exp(-sq(p.x/.18)-sq(p.y/.29));
    float drift=sin(time*.36+float(i)*.6)*.012+pointer.x*.014;
    float forward=smoothstep(-.10,.24,along);
    float reach=exp(-sq(along/(3.9-float(i)*.23)))*forward;
    for(int j=0;j<7;j++){
      float spread=(float(j)-3.)*.12+drift;
      float ridge=across-spread*along;
      float width=.022+max(0.,along)*.018;
      float beam=exp(-sq(ridge/width))*reach;
      float shade=exp(-sq((ridge-width*2.3)/(width*1.7)))*reach;
      light+=vec3(.29,.205,.095)*beam;
      shadow+=.065*shade;
    }
    }vec3 c=paper*(1.-min(shadow,.68))+light;gl_FragColor=vec4(c,1.);
    #include <colorspace_fragment>
    }`,
        toneMapped: false,
      }),
    );
    const floor = new THREE.Mesh(
      geometry(new THREE.PlaneGeometry(100, 100)),
      floorMat,
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.025;
    scene.add(floor);
    const STRANDS = 56,
      SEGMENTS = 128;
    const vertices = new Float32Array(STRANDS * SEGMENTS * 2 * 3),
      colors = new Float32Array(vertices.length);
    const lineGeometry = geometry(new THREE.BufferGeometry());
    const positions = new THREE.BufferAttribute(vertices, 3).setUsage(
      THREE.DynamicDrawUsage,
    );
    lineGeometry.setAttribute("position", positions);
    const copper = new THREE.Color(0xa92d13),
      grey = new THREE.Color(0x484844);
    for (let i = 0; i < STRANDS; i++) {
      const color = (i % 4 === 0 ? grey : copper)
        .clone()
        .lerp(new THREE.Color(0xf7f4ee), 0.02 + (i % 4) * 0.035);
      for (let j = 0; j < SEGMENTS * 2; j++)
        color.toArray(colors, (i * SEGMENTS * 2 + j) * 3);
    }
    lineGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const lines = new THREE.LineSegments(
      lineGeometry,
      material(
        new THREE.LineBasicMaterial({ vertexColors: true, toneMapped: false }),
      ),
    );
    lines.frustumCulled = false;
    scene.add(lines);
    const PARTICLES = 144;
    const particles = own(
      new THREE.InstancedMesh(
        geometry(new THREE.SphereGeometry(1, 8, 6)),
        material(
          new THREE.MeshStandardMaterial({
            color: 0xb83718,
            roughness: 0.32,
            metalness: 0.18,
          }),
        ),
        PARTICLES,
      ),
    );
    particles.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    particles.frustumCulled = false;
    scene.add(particles);
    const object = new THREE.Object3D(),
      point = [0, 0, 0],
      previous = [0, 0, 0];
    const pointer = new THREE.Vector2(),
      target = new THREE.Vector2();
    let lastTime = 0,
      seconds = 0,
      aspect = 1,
      disposed = false;
    const baseCamera = new THREE.Vector3(-12, 4.2, 15);
    function frameCamera() {
      // Keep all five lenses in view. Narrow screens retain the existing hero height.
      camera.position.copy(baseCamera);
      camera.position.x += pointer.x * 0.2;
      camera.position.y += pointer.y * 0.12;
      camera.fov = THREE.MathUtils.radToDeg(
        2 * Math.atan(7.75 / (19.5 * aspect)),
      );
      camera.lookAt(0, 1.2, 0);
      camera.updateProjectionMatrix();
    }
    const draw = (t: number) => {
      if (disposed) return;
      const dt = Math.max(0, Math.min(0.05, t - lastTime));
      lastTime = t;
      seconds = t;
      pointer.lerp(target, 1 - Math.exp(-dt / 0.18));
      frameCamera();
      key.position.set(-4 + pointer.x * 2, 7 + pointer.y, 4);
      lenses.forEach((lens, i) => {
        lens.rotation.y =
          Math.sin(t * 0.42 + i * 0.45) * 0.018 + pointer.x * 0.025;
        lens.rotation.z = -0.035 + pointer.y * 0.012;
      });
      let offset = 0;
      for (let i = 0; i < STRANDS; i++) {
        signalPoint(-9, i, t, pointer.x, pointer.y, previous);
        for (let j = 1; j <= SEGMENTS; j++) {
          signalPoint(
            -9 + (21 * j) / SEGMENTS,
            i,
            t,
            pointer.x,
            pointer.y,
            point,
          );
          vertices[offset++] = previous[0];
          vertices[offset++] = previous[1];
          vertices[offset++] = previous[2];
          vertices[offset++] = point[0];
          vertices[offset++] = point[1];
          vertices[offset++] = point[2];
          previous[0] = point[0];
          previous[1] = point[1];
          previous[2] = point[2];
        }
      }
      positions.needsUpdate = true;
      for (let i = 0; i < PARTICLES; i++) {
        const x = -9 + (((t * 21) / 12 + i * 0.713) % 21);
        signalPoint(x, i % STRANDS, t, pointer.x, pointer.y, point);
        object.position.set(point[0], point[1], point[2]);
        object.scale.setScalar(0.014 + (i % 5) * 0.004);
        object.updateMatrix();
        particles.setMatrixAt(i, object.matrix);
      }
      particles.instanceMatrix.needsUpdate = true;
      floorMat.uniforms.time.value = t;
      floorMat.uniforms.pointer.value.copy(pointer);
      renderer.render(scene, camera);
    };
    const resize = (width: number, height: number) => {
      aspect = width / Math.max(1, height);
      camera.aspect = aspect;
      // Supersample fine strands; refraction must never sample a blurred half-size
      // buffer. Mobile retains a bounded pixel budget without soft transmission.
      renderer.setPixelRatio(
        width > 700 ? 1.5 : Math.min(window.devicePixelRatio || 1, 1.5),
      );
      renderer.transmissionResolutionScale = 1;
      renderer.setSize(width, height, false);
      draw(seconds);
    };
    const setPointer = (x: number, y: number, active: boolean) =>
      target.set(
        active ? Math.max(-1, Math.min(1, x)) : 0,
        active ? Math.max(-1, Math.min(1, y)) : 0,
      );
    const dispose = () => {
      if (disposed) return;
      disposed = true;
      cleanup();
    };
    return { draw, resize, setPointer, dispose };
  } catch (error) {
    cleanup();
    throw error;
  }
}
