type Particle = {
  x: number;
  y: number;
  z: number;
  radius: number;
  cream: boolean;
};

export function createOrbParticles(): Particle[] {
  let seed = 47;
  const random = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  return Array.from({ length: 3200 }, (_, i) => {
    const polar = 0.06 + random() * (Math.PI - 0.12);
    const strand = i % 12;
    const angle =
      (strand * Math.PI) / 6 + polar * 1.35 + (random() - 0.5) * 0.13;
    const spread = 1 + (random() - 0.5) * 0.075 + (i % 23 === 0 ? 0.1 : 0);
    return {
      x: Math.sin(polar) * Math.cos(angle) * spread,
      y: Math.cos(polar) * spread,
      z: Math.sin(polar) * Math.sin(angle) * spread,
      radius: 0.7 + random() * 1.5,
      cream: random() < 0.28,
    };
  });
}

export function projectOrbParticles(
  particles: Particle[],
  time: number,
  activity: number,
) {
  const rotation = time * 0.13;
  return particles
    .map((p) => {
      const twist =
        rotation + Math.sin(p.y * 3 + time * 1.5) * (0.04 + activity * 0.09);
      const swell = 1 + Math.sin(time * 2.4 + p.y * 4) * activity * 0.035;
      const x = (p.x * Math.cos(twist) + p.z * Math.sin(twist)) * swell;
      const depth = (p.z * Math.cos(twist) - p.x * Math.sin(twist)) * swell;
      const y = p.y * swell;
      const perspective = 3.8 / (3.8 - depth);
      return {
        x: (x * Math.cos(-0.14) - y * Math.sin(-0.14)) * perspective,
        y: (x * Math.sin(-0.14) + y * Math.cos(-0.14)) * perspective * 1.08,
        depth,
        radius: p.radius * perspective,
        cream: p.cream,
      };
    })
    .sort((a, b) => a.depth - b.depth);
}
