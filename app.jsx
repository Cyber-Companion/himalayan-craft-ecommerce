import React, { useState, useEffect } from 'react';

// Custom CSS for the tech grid, scanning effects, and animations
const styles = `
  .bg-tech-grid {
    background-color: #f8fafc;
    background-size: 30px 30px;
    background-image: 
      linear-gradient(to right, rgba(6, 182, 212, 0.08) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(6, 182, 212, 0.08) 1px, transparent 1px);
  }
  
  .tech-card {
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(6, 182, 212, 0.2);
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }

  .tech-card:hover {
    border-color: rgba(6, 182, 212, 0.8);
    box-shadow: 0 0 20px rgba(6, 182, 212, 0.15);
  }

  .tech-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 50%;
    height: 2px;
    background: linear-gradient(90deg, transparent, #06b6d4, transparent);
    transition: all 0.5s ease;
  }

  .tech-card:hover::before {
    left: 100%;
    transition: all 0.5s ease;
  }

  .btn-tech {
    position: relative;
    overflow: hidden;
  }
  
  .btn-tech::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: #06b6d4;
    transform: scaleX(0);
    transform-origin: right;
    transition: transform 0.3s ease;
  }

  .btn-tech:hover::after {
    transform: scaleX(1);
    transform-origin: left;
  }

  /* Custom Scrollbar */
  ::-webkit-scrollbar {
    width: 6px;
  }
  ::-webkit-scrollbar-track {
    background: #f1f5f9;
  }
  ::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 3px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #06b6d4;
  }
`;

// Mock Product Data
const PRODUCTS = [
  { id: 'HC-001', name: "Authentic Pashmina Shawl", price: 299, category: "TEXTILES", stock: 12, desc: "Hand-spun cashmere from the Changthangi goat." },
  { id: 'HC-002', name: "Walnut Wood Carved Box", price: 145, category: "WOODWORK", stock: 5, desc: "Intricate floral motifs carved by master artisans." },
  { id: 'HC-003', name: "Premium Saffron (10g)", price: 85, category: "SPICES", stock: 45, desc: "Grade A pure Pampore saffron threads." },
  { id: 'HC-004', name: "Papier-Mâché Vase", price: 65, category: "DECOR", stock: 18, desc: "Hand-painted with pure gold leaf detailing." },
  { id: 'HC-005', name: "Silk Hand-Knotted Rug", price: 899, category: "TEXTILES", stock: 2, desc: "Traditional Tree of Life design, 4x6 ft." },
  { id: 'HC-006', name: "Engraved Copper Samovar", price: 210, category: "METALWORK", stock: 8, desc: "Traditional Kashmiri tea kettle with intricate etching." }
];

// Icons
const CartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="8" cy="21" r="1"></circle><circle cx="19" cy="21" r="1"></circle><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

export default function App() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...product, qty: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQty = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(0, item.qty + delta);
        return { ...item, qty: newQty };
      }
      return item;
    }).filter(item => item.qty > 0));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const cartItemsCount = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <>
      <style>{styles}</style>
      <div className={`min-h-screen bg-tech-grid font-sans text-slate-800 transition-opacity duration-1000 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
        
        {/* Top HUD / Navbar */}
        <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-cyan-100 z-40">
          <div className="w-full h-8 border-b border-cyan-50 bg-slate-50/50 flex justify-between items-center px-4 md:px-8 font-mono text-[10px] text-cyan-600 uppercase tracking-widest">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></div>
              <span>SYS.NODE: HMLYN_CRAFT_COMMERCE</span>
            </div>
            <div>STATUS: ONLINE</div>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-cyan-50 border border-cyan-200 flex items-center justify-center font-mono font-bold text-cyan-600 text-lg">
                H
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-900">
                Himalayan<span className="font-light text-slate-500">Craft</span>
              </span>
            </div>

            <button 
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded hover:border-cyan-300 hover:text-cyan-600 transition-colors btn-tech"
            >
              <CartIcon />
              <span className="font-mono text-sm font-semibold">
                CART [{cartItemsCount}]
              </span>
            </button>
          </div>
        </nav>

        {/* Main Content */}
        <main className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Hero Section */}
          <div className="mb-16 relative">
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400"></div>
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-400"></div>
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-400"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-400"></div>
            
            <div className="bg-white/40 p-8 md:p-12 backdrop-blur-sm border border-cyan-100/50">
              <div className="inline-block px-2 py-1 bg-cyan-50 border border-cyan-100 text-cyan-700 font-mono text-xs tracking-widest mb-4">
                INIT // E-COMMERCE_MODULE
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
                Authentic Kashmiri Craftsmanship.
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">
                  Digitally Mastered.
                </span>
              </h1>
              <p className="text-lg text-slate-600 max-w-2xl">
                Bridging traditional heritage with modern commerce. Browse our curated selection of hand-crafted premium goods direct from the artisans of the valley.
              </p>
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-2xl font-bold">Product Database</h2>
            <div className="flex-grow h-px bg-slate-200"></div>
            <span className="font-mono text-xs text-slate-400 uppercase tracking-widest">Showing {PRODUCTS.length} Items</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {PRODUCTS.map(product => (
              <div key={product.id} className="tech-card group flex flex-col h-full rounded-sm">
                {/* Image Placeholder */}
                <div className="aspect-w-4 aspect-h-3 bg-slate-100 w-full h-64 flex items-center justify-center relative overflow-hidden">
                  {/* Grid background for image placeholder */}
                  <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#06b6d4 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>
                  <div className="text-slate-400 font-mono text-sm z-10 bg-white/80 px-3 py-1 border border-slate-200">
                    IMG_SRC_MISSING
                  </div>
                  
                  {/* Category Tag */}
                  <div className="absolute top-4 left-4 px-2 py-1 bg-white/90 backdrop-blur text-[10px] font-mono font-bold text-cyan-700 border border-cyan-100 shadow-sm z-10">
                    {product.category}
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-mono text-xs text-slate-400">{product.id}</span>
                    <span className="font-mono text-lg font-bold text-slate-900">${product.price}</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-800 mb-2 leading-tight">
                    {product.name}
                  </h3>
                  
                  <p className="text-slate-500 text-sm mb-6 flex-grow">
                    {product.desc}
                  </p>

                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                    <span className="font-mono text-xs text-green-600 flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                      IN STOCK ({product.stock})
                    </span>
                    <button 
                      onClick={() => addToCart(product)}
                      className="px-4 py-2 bg-slate-900 text-white text-sm font-semibold hover:bg-cyan-600 transition-colors btn-tech shadow-md shadow-slate-200"
                    >
                      ADD TO CART +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </main>

        {/* Cart Sidebar Overlay */}
        {isCartOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm" onClick={() => setIsCartOpen(false)}></div>
            
            <div className="w-full max-w-md bg-white h-full shadow-2xl relative flex flex-col border-l border-cyan-200 transform transition-transform animate-in slide-in-from-right">
              
              <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100 bg-slate-50">
                <div className="flex items-center gap-2">
                  <CartIcon />
                  <h2 className="font-bold text-lg font-mono">SECURE_CART</h2>
                </div>
                <button onClick={() => setIsCartOpen(false)} className="p-2 text-slate-400 hover:text-cyan-600 transition-colors">
                  <CloseIcon />
                </button>
              </div>

              <div className="flex-grow overflow-y-auto p-6 space-y-6">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 font-mono text-sm">
                    <div className="w-16 h-16 border-2 border-dashed border-slate-200 rounded-full flex items-center justify-center mb-4">
                      <CartIcon />
                    </div>
                    CART_IS_EMPTY
                  </div>
                ) : (
                  cart.map(item => (
                    <div key={item.id} className="flex gap-4 p-4 border border-slate-100 bg-slate-50/50 group hover:border-cyan-200 transition-colors">
                      <div className="w-20 h-20 bg-slate-200 flex-shrink-0 flex items-center justify-center border border-slate-200 relative">
                        {/* Tiny image grid */}
                        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#06b6d4 1px, transparent 1px)', backgroundSize: '4px 4px' }}></div>
                      </div>
                      
                      <div className="flex-grow flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between text-sm">
                            <h4 className="font-bold text-slate-800 line-clamp-1">{item.name}</h4>
                            <button onClick={() => updateQty(item.id, -item.qty)} className="text-slate-400 hover:text-red-500">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                            </button>
                          </div>
                          <span className="font-mono text-xs text-slate-500">{item.id}</span>
                        </div>
                        
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border border-slate-200 bg-white">
                            <button onClick={() => updateQty(item.id, -1)} className="px-2 py-1 text-slate-500 hover:bg-slate-100">-</button>
                            <span className="px-3 py-1 font-mono text-sm border-x border-slate-200">{item.qty}</span>
                            <button onClick={() => updateQty(item.id, 1)} className="px-2 py-1 text-slate-500 hover:bg-slate-100">+</button>
                          </div>
                          <span className="font-mono font-bold">${item.price * item.qty}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-6 border-t border-slate-100 bg-slate-50">
                  <div className="flex justify-between items-center mb-4 text-sm text-slate-500">
                    <span>Subtotal</span>
                    <span className="font-mono">${cartTotal}</span>
                  </div>
                  <div className="flex justify-between items-center mb-6 text-sm text-slate-500">
                    <span>Shipping</span>
                    <span className="font-mono text-cyan-600">CALCULATED AT CHECKOUT</span>
                  </div>
                  <div className="flex justify-between items-center mb-6 text-lg font-bold">
                    <span>Total</span>
                    <span className="font-mono">${cartTotal}</span>
                  </div>
                  
                  <button className="w-full py-4 bg-slate-900 text-white font-bold tracking-widest uppercase hover:bg-cyan-600 transition-colors relative overflow-hidden group">
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      INITIATE CHECKOUT 
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                    </span>
                    <div className="absolute inset-0 h-full w-0 bg-cyan-500 transition-all duration-300 ease-out group-hover:w-full z-0"></div>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </>
  );
}
