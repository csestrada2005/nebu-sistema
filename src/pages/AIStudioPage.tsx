import { useState } from "react";
import { Bot, Send, Image, Code, MessageSquare, Plus, Settings, Sparkles, Download, Copy, Wand2, Monitor, Tablet, Smartphone, Globe, ChevronDown, History, Trash2, PanelLeftClose, Key } from "lucide-react";

type Tab = "chat" | "images" | "builder";

const AIStudioPage = () => {
    const [activeTab, setActiveTab] = useState<Tab>("chat");
    const [chatInput, setChatInput] = useState("");
    const [imagePrompt, setImagePrompt] = useState("");
    const [builderPrompt, setBuilderPrompt] = useState("");
    const [showConfig, setShowConfig] = useState(false);

    const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
      { id: "chat", label: "Chat", icon: <MessageSquare size={16} /> },
      { id: "images", label: "Image Studio", icon: <Image size={16} /> },
      { id: "builder", label: "Web Builder", icon: <Code size={16} /> },
        ];

    return (
          <div className="space-y-4 h-[calc(100vh-140px)]">
            {/* Header */}
                <div className="flex items-center justify-between">
                        <div>
                                  <h1 className="text-2xl font-bold text-white">AI Studio</h1>h1>
                                  <p className="text-sm text-zinc-400 mt-1">Chat, genera imágenes y construye sitios web con IA</p>p>
                        </div>div>
                </div>div>
          
            {/* Tabs */}
                <div className="flex gap-1 bg-zinc-900/50 p-1 rounded-lg border border-zinc-800 w-fit">
                  {tabs.map((tab) => (
                      <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                                    activeTab === tab.id ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-zinc-300"
                                    }`}
                                  >
                        {tab.icon}
                        {tab.label}
                      </button>button>
                    ))}
                </div>div>
          
            {/* CHAT TAB */}
            {activeTab === "chat" && (
                    <div className="flex gap-4 h-[calc(100%-80px)]">
                      {/* Conversations sidebar */}
                              <div className="hidden lg:flex flex-col w-64 shrink-0 bg-zinc-900/50 border border-zinc-800 rounded-xl">
                                          <div className="p-3 border-b border-zinc-800">
                                                        <button className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
                                                                        <Plus size={16} />
                                                                        Nueva conversación
                                                        </button>button>
                                          </div>div>
                                          <div className="flex-1 p-3 space-y-1 overflow-y-auto">
                                                        <p className="text-xs text-zinc-600 text-center py-8">Sin conversaciones previas</p>p>
                                          </div>div>
                                          <div className="p-3 border-t border-zinc-800">
                                                        <button onClick={() => setShowConfig(!showConfig)} className="w-full flex items-center gap-2 text-zinc-400 hover:text-zinc-300 text-sm px-3 py-2 rounded-lg hover:bg-zinc-800 transition-colors">
                                                                        <Settings size={14} />
                                                                        Configurar asistente
                                                        </button>button>
                                          </div>div>
                              </div>div>
                    
                      {/* Main chat area */}
                              <div className="flex-1 flex flex-col bg-zinc-900/30 border border-zinc-800 rounded-xl overflow-hidden">
                                {/* Config panel */}
                                {showConfig && (
                                    <div className="p-4 border-b border-zinc-800 bg-zinc-900/50 space-y-3">
                                                    <div className="flex items-center justify-between">
                                                                      <h3 className="text-sm font-semibold text-white">Personaliza tu asistente</h3>h3>
                                                                      <button onClick={() => setShowConfig(false)} className="text-zinc-500 hover:text-zinc-300">
                                                                                          <PanelLeftClose size={16} />
                                                                      </button>button>
                                                    </div>div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                                      <div>
                                                                                          <label className="text-xs text-zinc-400 block mb-1">Nombre del asistente</label>label>
                                                                                          <input className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600" placeholder="NOVY" />
                                                                      </div>div>
                                                                      <div>
                                                                                          <label className="text-xs text-zinc-400 block mb-1">Modelo de IA</label>label>
                                                                                          <select className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-zinc-600">
                                                                                                                <option>GPT-4o</option>option>
                                                                                                                <option>Claude 3.5 Sonnet</option>option>
                                                                                                                <option>Gemini Pro</option>option>
                                                                                            </select>select>
                                                                      </div>div>
                                                                      <div className="md:col-span-2">
                                                                                          <label className="text-xs text-zinc-400 block mb-1">Personalidad / Instrucciones</label>label>
                                                                                          <textarea className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600 resize-none h-16" placeholder="Eres un asistente especializado en..." />
                                                                      </div>div>
                                                                      <div>
                                                                                          <label className="text-xs text-zinc-400 block mb-1">API Key</label>label>
                                                                                          <input type="password" className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600" placeholder="sk-..." />
                                                                      </div>div>
                                                                      <div className="flex items-end">
                                                                                          <button className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded-lg transition-colors">Guardar</button>button>
                                                                      </div>div>
                                                    </div>div>
                                    </div>div>
                                          )}
                              
                                {/* Empty chat state */}
                                          <div className="flex-1 flex flex-col items-center justify-center p-8">
                                                        <div className="w-20 h-20 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-3xl flex items-center justify-center mb-6 border border-red-500/20">
                                                                        <Bot size={36} className="text-red-400" />
                                                        </div>div>
                                                        <h3 className="text-xl font-semibold text-white mb-2">Tu asistente IA</h3>h3>
                                                        <p className="text-sm text-zinc-400 max-w-md text-center mb-8">
                                                                        Configura tu asistente con tu propia API key. Pregunta sobre tus proyectos, genera cotizaciones, analiza métricas y más.
                                                        </p>p>
                                                        <div className="flex flex-wrap gap-2 justify-center max-w-lg">
                                                          {["Resumen del día", "Nueva cotización", "Analizar sitio web", "Ideas de contenido", "Redactar email"].map((action) => (
                                        <button key={action} className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-3 py-1.5 rounded-full border border-zinc-700 transition-colors">
                                          {action}
                                        </button>button>
                                      ))}
                                                        </div>div>
                                          </div>div>
                              
                                {/* Input */}
                                          <div className="p-4 border-t border-zinc-800">
                                                        <div className="flex gap-2">
                                                                        <input
                                                                                            value={chatInput}
                                                                                            onChange={(e) => setChatInput(e.target.value)}
                                                                                            className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
                                                                                            placeholder="Pregunta lo que necesites..."
                                                                                          />
                                                                        <button className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-xl transition-colors">
                                                                                          <Send size={18} />
                                                                        </button>button>
                                                        </div>div>
                                          </div>div>
                              </div>div>
                    </div>div>
                )}
          
            {/* IMAGE STUDIO TAB */}
            {activeTab === "images" && (
                    <div className="flex gap-4 h-[calc(100%-80px)]">
                      {/* Controls */}
                              <div className="w-80 shrink-0 bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 space-y-4 overflow-y-auto">
                                          <div>
                                                        <label className="text-xs text-zinc-400 block mb-2">Describe la imagen</label>label>
                                                        <textarea
                                                                          value={imagePrompt}
                                                                          onChange={(e) => setImagePrompt(e.target.value)}
                                                                          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600 resize-none h-24"
                                                                          placeholder="Un banner minimalista para tienda de café con tonos cálidos..."
                                                                        />
                                          </div>div>
                                          <div>
                                                        <label className="text-xs text-zinc-400 block mb-2">Estilo</label>label>
                                                        <div className="grid grid-cols-2 gap-2">
                                                          {["Realista", "Ilustración", "3D", "Minimalista", "Ad Creative", "Social Post"].map((style) => (
                                        <button key={style} className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-3 py-2 rounded-lg border border-zinc-700 transition-colors">
                                          {style}
                                        </button>button>
                                      ))}
                                                        </div>div>
                                          </div>div>
                                          <div>
                                                        <label className="text-xs text-zinc-400 block mb-2">Formato</label>label>
                                                        <select className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-zinc-600">
                                                                        <option>1:1 Instagram</option>option>
                                                                        <option>16:9 Banner</option>option>
                                                                        <option>9:16 Story</option>option>
                                                                        <option>4:5 Feed</option>option>
                                                                        <option>Custom</option>option>
                                                        </select>select>
                                          </div>div>
                                          <div>
                                                        <label className="text-xs text-zinc-400 block mb-2">Proyecto</label>label>
                                                        <select className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-zinc-600">
                                                                        <option>Sin proyecto</option>option>
                                                        </select>select>
                                          </div>div>
                                          <div className="flex items-center justify-between">
                                                        <span className="text-xs text-zinc-400">Aplicar brand colors</span>span>
                                                        <div className="w-9 h-5 bg-zinc-700 rounded-full relative cursor-pointer">
                                                                        <div className="w-4 h-4 bg-zinc-500 rounded-full absolute top-0.5 left-0.5"></div>div>
                                                        </div>div>
                                          </div>div>
                                          <button className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-medium py-3 rounded-xl transition-colors">
                                                        <Wand2 size={18} />
                                                        Generar imagen
                                          </button>button>
                                          <p className="text-xs text-zinc-500 text-center">Créditos restantes: 50/100</p>p>
                                          
                                          <div className="border-t border-zinc-800 pt-4">
                                                        <label className="text-xs text-zinc-400 block mb-2">API Key (Stability AI / DALL-E)</label>label>
                                                        <input type="password" className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600" placeholder="sk-..." />
                                          </div>div>
                              </div>div>
                    
                      {/* Results */}
                              <div className="flex-1 bg-zinc-900/30 border border-zinc-800 rounded-xl flex flex-col items-center justify-center p-8">
                                          <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-3xl flex items-center justify-center mb-6 border border-purple-500/20">
                                                        <Image size={36} className="text-purple-400" />
                                          </div>div>
                                          <h3 className="text-xl font-semibold text-white mb-2">Genera contenido visual con IA</h3>h3>
                                          <p className="text-sm text-zinc-400 max-w-md text-center mb-6">
                                                        Crea ads, social posts, banners y más para tus clientes. Describe lo que necesitas y la IA lo generará al instante.
                                          </p>p>
                                          <div className="grid grid-cols-2 gap-3 max-w-sm">
                                            {["Banner para café", "Post Instagram", "Ad para e-commerce", "Logo minimalista"].map((ex) => (
                                      <button key={ex} className="text-xs bg-zinc-800/50 hover:bg-zinc-800 text-zinc-400 px-4 py-3 rounded-xl border border-zinc-700/50 transition-colors">
                                        {ex}
                                      </button>button>
                                    ))}
                                          </div>div>
                              </div>div>
                    </div>div>
                )}
          
            {/* WEB BUILDER TAB */}
            {activeTab === "builder" && (
                    <div className="flex gap-4 h-[calc(100%-80px)]">
                      {/* Chat panel */}
                              <div className="w-96 shrink-0 flex flex-col bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden">
                                          <div className="p-3 border-b border-zinc-800">
                                                        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                                                                        <Code size={16} className="text-green-400" />
                                                                        Describe tu sitio web
                                                        </h3>h3>
                                          </div>div>
                                          <div className="flex-1 flex flex-col items-center justify-center p-6">
                                                        <div className="w-14 h-14 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl flex items-center justify-center mb-4 border border-green-500/20">
                                                                        <Code size={24} className="text-green-400" />
                                                        </div>div>
                                                        <p className="text-sm text-zinc-400 text-center mb-6">
                                                                        Describe la idea de tu sitio web y la IA lo construirá por ti.
                                                        </p>p>
                                                        <div className="space-y-2 w-full">
                                                          {["Landing page para restaurante", "Portfolio de fotógrafo", "Tienda de ropa online"].map((ex) => (
                                        <button key={ex} className="w-full text-left text-xs bg-zinc-800/50 hover:bg-zinc-800 text-zinc-400 px-4 py-3 rounded-xl border border-zinc-700/50 transition-colors">
                                          {ex}
                                        </button>button>
                                      ))}
                                                        </div>div>
                                          </div>div>
                                          <div className="p-3 border-t border-zinc-800">
                                                        <div className="flex gap-2">
                                                                        <input
                                                                                            value={builderPrompt}
                                                                                            onChange={(e) => setBuilderPrompt(e.target.value)}
                                                                                            className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
                                                                                            placeholder="Describe tu sitio web..."
                                                                                          />
                                                                        <button className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg transition-colors">
                                                                                          <Send size={16} />
                                                                        </button>button>
                                                        </div>div>
                                          </div>div>
                              </div>div>
                    
                      {/* Preview */}
                              <div className="flex-1 flex flex-col bg-zinc-900/30 border border-zinc-800 rounded-xl overflow-hidden">
                                          <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800 bg-zinc-900/50">
                                                        <div className="flex items-center gap-2">
                                                                        <div className="flex gap-1.5">
                                                                                          <div className="w-3 h-3 rounded-full bg-red-500/50"></div>div>
                                                                                          <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>div>
                                                                                          <div className="w-3 h-3 rounded-full bg-green-500/50"></div>div>
                                                                        </div>div>
                                                                        <div className="bg-zinc-800 rounded-md px-3 py-1 text-xs text-zinc-500 ml-2">
                                                                                          preview.nebu.app
                                                                        </div>div>
                                                        </div>div>
                                                        <div className="flex items-center gap-2">
                                                                        <button className="text-zinc-500 hover:text-zinc-300 p-1"><Monitor size={14} /></button>button>
                                                                        <button className="text-zinc-500 hover:text-zinc-300 p-1"><Tablet size={14} /></button>button>
                                                                        <button className="text-zinc-500 hover:text-zinc-300 p-1"><Smartphone size={14} /></button>button>
                                                                        <button className="text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md transition-colors ml-2">
                                                                                          Publicar
                                                                        </button>button>
                                                        </div>div>
                                          </div>div>
                                          <div className="flex-1 flex items-center justify-center">
                                                        <div className="text-center">
                                                                        <Globe size={48} className="text-zinc-700 mx-auto mb-4" />
                                                                        <p className="text-sm text-zinc-500">El preview de tu sitio web aparecerá aquí</p>p>
                                                        </div>div>
                                          </div>div>
                              </div>div>
                    </div>div>
                )}
          </div>div>
        );
};

export default AIStudioPage;</div>
