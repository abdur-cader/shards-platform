// app/(sidebar)/user/ai-toolkit/page.tsx
"use client";
import { useState, useEffect, useRef } from "react";
import ToolGrid from "@/app/(sidebar)/user/ai-toolkit/ToolGrid";
import Header from "@/app/(sidebar)/user/ai-toolkit/Header";
import { useSession } from "next-auth/react";
import { useRouter  } from "next/navigation";
import * as THREE from "three";

export default function AIToolkitPage() {
  const [gradientPos, setGradientPos] = useState({ x: 50, y: 50 });
  const { data: session } = useSession();
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<any>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      setGradientPos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    // Vertex shader
    const vertexShader = `
      void main() {
        gl_Position = vec4( position, 1.0 );
      }
    `;

    // Fragment shader
    const fragmentShader = `
        #define TWO_PI 6.2831853072
        #define PI 3.14159265359

        precision highp float;
        uniform vec2 resolution;
        uniform float time;

        void main(void) {
        vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
        float t = time*0.05;
        float lineWidth = 0.002;

        float intensity = 0.0;
        for(int j = 0; j < 3; j++){
            for(int i=0; i < 5; i++){
            intensity += lineWidth*float(i*i) / abs(fract(t - 0.01*float(j)+float(i)*0.01)*5.0 - length(uv) + mod(uv.x+uv.y, 0.2));
            }
        }

        // Purple color scheme
        vec3 purple = vec3(0.5, 0.2, 0.7);

        // Scale purple by intensity with reduced brightness
        vec3 color = purple * intensity * 0.8;

        // Add a subtle dark gray ambient background
        vec3 ambient = vec3(0.03);
        gl_FragColor = vec4(color + ambient, 1.0);
        }

    `;

    // Initialize Three.js scene
    const camera = new THREE.Camera();
    camera.position.z = 1;

    const scene = new THREE.Scene();
    const geometry = new THREE.PlaneGeometry(2, 2);

    const uniforms = {
      time: { type: "f", value: 1.0 },
      resolution: { type: "v2", value: new THREE.Vector2() },
    };

    const material = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true // Enable transparency
    });
    renderer.setPixelRatio(window.devicePixelRatio);

    // Set background to transparent
    renderer.setClearColor(0x000000, 0);

    container.appendChild(renderer.domElement);

    // Handle window resize
    const onWindowResize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      renderer.setSize(width, height);
      uniforms.resolution.value.x = renderer.domElement.width;
      uniforms.resolution.value.y = renderer.domElement.height;
    };

    // Initial resize
    onWindowResize();
    window.addEventListener("resize", onWindowResize, false);

    // Animation loop
    const animate = () => {
      const animationId = requestAnimationFrame(animate);
      uniforms.time.value += 0.05;
      renderer.render(scene, camera);

      if (sceneRef.current) {
        sceneRef.current.animationId = animationId;
      }
    };

    // Store scene references for cleanup
    sceneRef.current = {
      camera,
      scene,
      renderer,
      uniforms,
      animationId: 0,
    };

    // Start animation
    animate();

    // Cleanup function
    return () => {
      window.removeEventListener("resize", onWindowResize);

      if (sceneRef.current) {
        cancelAnimationFrame(sceneRef.current.animationId);

        if (container && sceneRef.current.renderer.domElement) {
          container.removeChild(sceneRef.current.renderer.domElement);
        }

        sceneRef.current.renderer.dispose();
        geometry.dispose();
        material.dispose();
      }
    };
  }, []);

  return (
    <div className="min-h-screen min-w-screen text-gray-100 relative overflow-hidden">
      {/* Shader Animation Background */}
      <div 
        ref={containerRef}
        className="absolute inset-0 w-full h-full z-0"
      />
      
      {/* Content Overlay */}
      <div 
        className="absolute inset-0 z-10"
        style={{
          background: `
            radial-gradient(
              circle at ${gradientPos.x}% ${gradientPos.y}%, 
              rgba(139, 92, 246, 0.15) 0%, 
              rgba(16, 22, 37, 0.85) 30%,
              rgba(18, 11, 34, 0.95) 80%
            ),
            linear-gradient(
              to bottom right,
              rgba(15, 23, 42, 0.58) 0%,
              rgba(30, 27, 75, 0.7) 50%,
              rgba(15, 23, 42, 0.9) 100%
            )
          `
        }}
      >
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03] pointer-events-none"></div>
        
        <div className="container mx-auto px-4 py-8 max-w-7xl relative z-20">
          <Header />
          
          <main className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <section className="lg:col-span-3">
              <ToolGrid />
            </section>
          </main>
        </div>
      </div>

      <style jsx global>{`
        @keyframes shine {
          0% { transform: translateX(-100%) skewX(-15deg); }
          100% { transform: translateX(100%) skewX(-15deg); }
        }
      `}</style>
    </div>
  );
}