// app/(sidebar)/user/ai-toolkit/page.tsx
"use client";
import { useState, useEffect, useRef } from "react";
import ToolGrid from "@/app/(sidebar)/user/ai-toolkit/ToolGrid";
import Header from "@/app/(sidebar)/user/ai-toolkit/Header";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import * as THREE from "three";
import IdeasDrawer from "@/components/IdeasDrawer";
import StacksDrawer from "@/components/StacksDrawer";

interface SavedIdea {
  id: string;
  created_at: string;
  object: {
    title: string;
    description: string;
    estimatedTime: string;
  };
}

interface SavedStack {
  id: string;
  created_at: string;
  object: {
    title: string;
    backend: string;
    database: string;
    frontend: string;
    reasoning: string;
    deployment: string;
    authentication: string;
  };
}

export default function AIToolkitPage() {
  const [gradientPos, setGradientPos] = useState({ x: 50, y: 50 });
  const [savedIdeas, setSavedIdeas] = useState<SavedIdea[]>([]);
  const [savedStacks, setSavedStacks] = useState<SavedStack[]>([]);
  const [loading, setLoading] = useState(true);
  const [showIdeasDrawer, setShowIdeasDrawer] = useState(false);
  const [showStacksDrawer, setShowStacksDrawer] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<any>(null);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      console.log("NO SESSION DETECTED");
      router.push("/");
    }
  }, [session, router]);

  useEffect(() => {
    const fetchSavedData = async () => {
      console.log("SESSION::::::", session?.user?.id);
      console.log("SBATOKEN::::::", session?.supabaseAccessToken);
      if (!session) return;

      try {
        setLoading(true);
        const ideasResponse = await fetch("/api/ai-toolkit/saves/ideas", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "sb-access-token": session.supabaseAccessToken!,
            "user-id": session.user.id!,
          },
        });

        const stacksResponse = await fetch("/api/ai-toolkit/saves/stack", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "user-id": session.user.id!,
            "sb-access-token": session.supabaseAccessToken!,
          },
        });

        console.log("stacksResponse!!!!!!!!:", stacksResponse);

        if (ideasResponse.ok) {
          const ideasData = await ideasResponse.json();
          setSavedIdeas(ideasData);
        }

        if (stacksResponse.ok) {
          const stacksData = await stacksResponse.json();
          setSavedStacks(stacksData);
        }
      } catch (error) {
        console.error("Error fetching saved data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchSavedData();
    }
  }, [session]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      setGradientPos({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
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
      alpha: true, // Enable transparency
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

  if (!session && status !== "loading") {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-900 w-screen text-white">
        <p className="text-lg">Log In or Sign Up to view this page.</p>
        <p className="text-sm text-gray-400">Redirecting...</p>
      </div>
    );
  }

  const recentIdeas = savedIdeas.slice(0, 3);
  const recentStacks = savedStacks.slice(0, 3);

  return (
    <div className="min-h-screen min-w-screen text-gray-100 relative overflow-x-hidden">
      {/* Shader Animation Background - Fixed */}
      <div ref={containerRef} className="fixed inset-0 w-full h-full z-0" />

      {/* Gradient Overlay - Fixed */}
      <div
        className="fixed inset-0 z-10"
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
        `,
        }}
      >
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03] pointer-events-none"></div>
      </div>

      {/* Scrollable Content Container */}
      <div className="relative z-20 overflow-y-auto h-screen">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <Header />

          <main className="space-y-12">
            {/* ToolGrid Section */}
            <section>
              <ToolGrid />
            </section>

            {/* Saved Ideas Section - Full Width */}
            <section className="w-full bg-gradient-to-r from-purple-900/20 via-gray-900 to-indigo-900/20 py-12 px-4 rounded-xl border border-purple-500/20">
              <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-bold text-purple-300">
                    Your Saved Ideas
                  </h2>
                  {savedIdeas.length > 3 && (
                    <button
                      onClick={() => setShowIdeasDrawer(true)}
                      className="text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1"
                    >
                      View All <span className="text-lg">→</span>
                    </button>
                  )}
                </div>
                {savedIdeas.length === 0 ? (
                  <div className="text-center py-8 bg-gray-800/30 rounded-lg border border-gray-700/50">
                    <p className="text-gray-400 text-lg">No saved ideas yet.</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Start using the AI tools above to generate and save ideas!
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recentIdeas.map((idea) => (
                      <div
                        key={idea.id}
                        className="bg-gradient-to-br from-[#0f0524] via-[#0f0d29] to-[#13082d] p-6 rounded-lg border border-purple-500/20 shadow-lg hover:border-purple-500/50 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="font-bold text-purple-200 text-lg">
                            {idea.object.title}
                          </h3>
                          <span className="text-xs text-gray-400 bg-gray-900 px-2 py-1 rounded">
                            {new Date(idea.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="text-sm space-y-3">
                          <div>
                            <p className="text-gray-400 mt-1">
                              {idea.object.description}
                            </p>
                          </div>
                          <div>
                            <span className="text-purple-400 font-medium">
                              ETC:
                            </span>
                            <p className="text-white mt-1">
                              {idea.object.estimatedTime}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* Saved Stacks Section - Full Width */}
            <section className="w-full bg-gradient-to-r from-indigo-900/20 via-gray-900 to-purple-900/20 py-12 px-4 rounded-xl border border-indigo-500/20">
              <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-bold text-indigo-300">
                    Your Saved Tech Stacks
                  </h2>
                  {savedStacks.length > 3 && (
                    <button
                      onClick={() => setShowStacksDrawer(true)}
                      className="text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1"
                    >
                      View All <span className="text-lg">→</span>
                    </button>
                  )}
                </div>
                {savedStacks.length === 0 ? (
                  <div className="text-center py-8 bg-gray-800/30 rounded-lg border border-gray-700/50">
                    <p className="text-gray-400 text-lg">
                      No saved stacks yet.
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Use the Stack Generator tool to create and save tech
                      stacks!
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recentStacks.map((stack) => (
                      <div
                        key={stack.id}
                        className="bg-gradient-to-br from-[#0f0524] via-[#0f0d29] to-[#13082d] p-6 rounded-lg border border-purple-500/20 shadow-lg hover:border-purple-500/50 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="font-bold text-purple-200 text-lg">
                            {stack.object.title || "Tech Stack"}{" "}
                            {/* Use title if available */}
                          </h3>
                          <span className="text-xs text-gray-400 bg-gray-900 px-2 py-1 rounded">
                            {new Date(stack.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="text-sm space-y-3">
                          <div>
                            <span className="text-purple-400 font-medium">
                              Frontend:
                            </span>
                            <p className="text-gray-400 mt-1">
                              {stack.object.frontend}
                            </p>
                          </div>
                          <div>
                            <span className="text-purple-400 font-medium">
                              Backend:
                            </span>
                            <p className="text-gray-400 mt-1">
                              {stack.object.backend}
                            </p>
                          </div>
                          <div>
                            <span className="text-purple-400 font-medium">
                              Database:
                            </span>
                            <p className="text-gray-400 mt-1">
                              {stack.object.database}
                            </p>
                          </div>
                          {stack.object.authentication && (
                            <div>
                              <span className="text-purple-400 font-medium">
                                Authentication:
                              </span>
                              <p className="text-gray-400 mt-1">
                                {stack.object.authentication}
                              </p>
                            </div>
                          )}
                          {stack.object.deployment && (
                            <div>
                              <span className="text-purple-400 font-medium">
                                Deployment:
                              </span>
                              <p className="text-gray-400 mt-1">
                                {stack.object.deployment}
                              </p>
                            </div>
                          )}
                          {stack.object.reasoning && (
                            <div>
                              <span className="text-purple-400 font-medium">
                                Reasoning:
                              </span>
                              <p
                                className="text-gray-400 mt-1 truncate"
                                title={stack.object.reasoning}
                              >
                                {stack.object.reasoning.length > 100
                                  ? `${stack.object.reasoning.substring(
                                      0,
                                      100
                                    )}...`
                                  : stack.object.reasoning}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </main>
        </div>
      </div>

      {/* Drawers */}
      <IdeasDrawer
        open={showIdeasDrawer}
        onOpenChange={setShowIdeasDrawer}
        ideas={savedIdeas}
      />

      <StacksDrawer
        open={showStacksDrawer}
        onOpenChange={setShowStacksDrawer}
        stacks={savedStacks}
      />

      <style jsx global>{`
        @keyframes shine {
          0% {
            transform: translateX(-100%) skewX(-15deg);
          }
          100% {
            transform: translateX(100%) skewX(-15deg);
          }
        }
      `}</style>
    </div>
  );
}
