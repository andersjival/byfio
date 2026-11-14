import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Mic, Sparkles, MessageCircle, ArrowLeft } from 'lucide-react';
import { aiAgentService } from '../../services/aiAgentService';
import { useVoiceRecorder } from '../../hooks/useVoiceRecorder';
import { StarAgentAudioBar } from './StarAgentAudioBar';
import { playBubblePopSound, playWaterDropSound } from '../../utils/soundEffects';
import { getWhatsAppLink } from '../../utils/formatters';
import { StarAgentRegisterCard } from './StarAgentRegisterCard';
import { StarAgentProductCard } from './StarAgentProductCard';
import { StarAgentCheckoutView } from './StarAgentCheckoutView';
import { getCachedAiConfig } from '../../services/aiConfigService';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  hasAudio?: boolean;
  timestamp: number;
  product?: Product;
  productAction?: 'pay_or_more' | 'add_second';
  suggestedProducts?: Product[];
}

interface StarAgentChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  userRole?: 'customer' | 'staff' | 'admin';
  userName?: string;
}

const normalizeText = (str: string) =>
  (str || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

const findMatchingProduct = (text: string, catalog: Product[]): Product | null => {
  if (!catalog || catalog.length === 0) return null;
  const clean = normalizeText(text);

  if (clean.includes('taza') || clean.includes('mug')) {
    const match = catalog.find((p) => normalizeText(p.name).includes('taza'));
    if (match) return match;
  }
  if (clean.includes('agenda')) {
    const match = catalog.find((p) => normalizeText(p.name).includes('agenda'));
    if (match) return match;
  }
  if (clean.includes('sticker') || clean.includes('calcoman')) {
    const match = catalog.find((p) => normalizeText(p.name).includes('sticker'));
    if (match) return match;
  }
  if (clean.includes('vacuna') || clean.includes('pediatrico') || clean.includes('pediatrica')) {
    const match = catalog.find((p) => normalizeText(p.name).includes('vacuna'));
    if (match) return match;
  }
  if (clean.includes('tote') || clean.includes('bolso') || clean.includes('bolsa')) {
    const match = catalog.find((p) => normalizeText(p.name).includes('tote'));
    if (match) return match;
  }
  if (clean.includes('encuadernacion') || clean.includes('kit')) {
    const match = catalog.find((p) => normalizeText(p.name).includes('encuadernaci'));
    if (match) return match;
  }
  if (clean.includes('memo') || clean.includes('pad') || clean.includes('block') || clean.includes('iman')) {
    const match = catalog.find((p) => normalizeText(p.name).includes('memo'));
    if (match) return match;
  }

  for (const p of catalog) {
    const pNorm = normalizeText(p.name);
    if (clean.includes(pNorm)) return p;
    const words = pNorm.split(/\s+/).filter((w) => w.length > 3 && !['para', 'con', 'las', 'los', 'del'].includes(w));
    const hits = words.filter((w) => clean.includes(w)).length;
    if (hits >= 2) return p;
  }

  return null;
};

const getChatConversationId = (uName?: string) => {
  const normName = (uName || '').trim().toLowerCase();
  if (normName && normName !== 'anon' && normName !== 'cliente web') {
    const safeKey = normName.replace(/[^a-z0-9_-]/g, '_');
    return `conv_user_${safeKey}`;
  }
  const key = 'byfio_guest_chat_session_id';
  let stored = '';
  try {
    stored = localStorage.getItem(key) || '';
  } catch {}
  if (!stored) {
    stored = `conv_guest_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    try {
      localStorage.setItem(key, stored);
    } catch {}
  }
  return stored;
};

export const StarAgentChatModal: React.FC<StarAgentChatModalProps> = ({
  isOpen,
  onClose,
  userRole = 'customer',
  userName,
}) => {
  const { products, addToCart } = useApp();

  const [conversationId, setConversationId] = useState(() => getChatConversationId(userName));

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const cid = getChatConversationId(userName);
    try {
      const saved = localStorage.getItem(`byfio_chat_msgs_${cid}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return [
      {
        id: 'init',
        role: 'assistant',
        content:
          userRole === 'staff' || userRole === 'admin'
            ? `¡Hola ${userName ? userName.split(' ')[0] : 'compañera'}! ✨ Soy tu asistente de inventario y pedidos. Puedes preguntarme el stock de cualquier producto o cupos de talleres por texto o con un audio.`
            : (getCachedAiConfig().welcomeMessage || `¡Hola ${userName ? userName.split(' ')[0] : ''}! ✨🌸 Soy la Estrellita de by.fio. Estoy aquí para contarte si tenemos productos en stock, fechas de talleres o ayudarte con lo que necesites.`),
        timestamp: Date.now(),
      },
    ];
  });
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [typingStatus, setTypingStatus] = useState<'thinking' | 'typing' | null>(null);

  // Estados de Checkout y Carrito Oculto
  const [viewMode, setViewMode] = useState<'chat' | 'checkout'>('chat');
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [registerCardMode, setRegisterCardMode] = useState<'register' | 'cart'>('register');
  const [cartProducts, setCartProducts] = useState<Array<{ product: Product; quantity: number }>>([]);
  const [checkoutItems, setCheckoutItems] = useState<Array<{ product: Product; quantity: number }>>([]);
  const [isWaitingForSecondProduct, setIsWaitingForSecondProduct] = useState(false);
  const [addedSecondProductIds, setAddedSecondProductIds] = useState<Set<string>>(new Set());

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasTrackedOpenRef = useRef(false);

  const {
    isRecording,
    isPaused,
    formattedTime,
    audioLevel,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    cancelRecording,
  } = useVoiceRecorder();

  const handleRegisterSuccess = ({ name, email }: { name: string; email: string }) => {
    playWaterDropSound();
    setMessages((prev) => [
      ...prev,
      {
        id: `a_${Date.now()}`,
        role: 'assistant',
        content: `¡Muchas felicidades, ${name.split(' ')[0]}! 🎉🌸✨ Tu cuenta ha quedado registrada con éxito.\n\nCon los accesos que acabas de ingresar (${email} y tu contraseña), podrás ingresar a la web de by.fio cuando quieras para disfrutar de beneficios exclusivos y ver tus compras. ¡Bienvenida a nuestra familia! 💕`,
        timestamp: Date.now(),
      },
    ]);
  };

  useEffect(() => {
    const nextId = getChatConversationId(userName);
    if (nextId !== conversationId) {
      setConversationId(nextId);
    }
  }, [userName, conversationId]);

  useEffect(() => {
    if (messages.length > 1) {
      try {
        localStorage.setItem(`byfio_chat_msgs_${conversationId}`, JSON.stringify(messages.slice(-30)));
      } catch {}
    }
  }, [messages, conversationId]);

  useEffect(() => {
    if (isOpen) {
      if (!hasTrackedOpenRef.current) {
        hasTrackedOpenRef.current = true;
        aiAgentService.trackChatOpened(userRole, userName);
      }
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else {
      hasTrackedOpenRef.current = false;
    }
  }, [isOpen, userRole, userName]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  // 1. Pagar directamente un producto -> Convierte la ventana de chat en Checkout
  const handlePayProduct = (product: Product) => {
    playBubblePopSound(0.4);
    let currentCart = [...cartProducts];
    const exists = currentCart.some((p) => p.product.id === product.id);
    if (!exists) {
      currentCart.push({ product, quantity: 1 });
      setCartProducts(currentCart);
      addToCart({
        type: 'product',
        id: product.id,
        sku: product.sku,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.image,
        images: product.images,
        shelfLocation: product.shelfLocation,
      });
    }
    setCheckoutItems(currentCart);
    setViewMode('checkout');
  };

  // 2. El usuario da clic en "Agregar" -> Agrega al carrito, confirma en chat y pregunta cuál otro comprar (loop continuo)
  const handleWantAnother = (product: Product) => {
    playWaterDropSound();
    setAddedSecondProductIds((prev) => new Set(prev).add(product.id));

    setCartProducts((prev) => {
      const exists = prev.find((p) => p.product.id === product.id);
      if (exists) {
        return prev.map((p) => (p.product.id === product.id ? { ...p, quantity: p.quantity + 1 } : p));
      }
      return [...prev, { product, quantity: 1 }];
    });

    addToCart({
      type: 'product',
      id: product.id,
      sku: product.sku,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
      images: product.images,
      shelfLocation: product.shelfLocation,
    });

    setIsWaitingForSecondProduct(true);
    const otherProducts = products.filter((p) => p.id !== product.id).slice(0, 4);

    setMessages((prev) => [
      ...prev,
      {
        id: `u_${Date.now()}`,
        role: 'user',
        content: `Agregar ${product.name} ✨`,
        timestamp: Date.now(),
      },
      {
        id: `a_${Date.now() + 1}`,
        role: 'assistant',
        content: `¡Listo! Agregué ${product.name} a tu carrito 🌸🛍️\n\n¿Cuál otro producto te gustaría comprar? 💕 Puedes elegir uno de los favoritos de abajo o escribirme su nombre. (O si ya estás lista, dime "Quiero pagar" o "Ya no quiero nada más" ✨)`,
        timestamp: Date.now() + 1,
        suggestedProducts: otherProducts,
      },
    ]);
  };

  // 3. Selección de otro producto -> La Estrellita muestra el producto con Pagar ahora y Agregar
  const handleSelectSecondProduct = (p2: Product) => {
    playBubblePopSound(0.3);

    setMessages((prev) => [
      ...prev,
      {
        id: `u_${Date.now()}`,
        role: 'user',
        content: `Quiero ver: ${p2.name} 💕`,
        timestamp: Date.now(),
      },
      {
        id: `a_${Date.now() + 1}`,
        role: 'assistant',
        content: `¡Excelente elección! 🌸 Aquí tienes ${p2.name}. ¿Deseas pagarlo ahora o darle a "Agregar" para seguir sumando productos? ✨`,
        timestamp: Date.now() + 1,
        product: p2,
        productAction: 'pay_or_more',
      },
    ]);
  };

  // 4. Clic en "Agregar" desde cualquier tarjeta de producto
  const handleAddSecondProduct = (p2: Product) => {
    handleWantAnother(p2);
  };

  // 5. Clic en "Pagar los Productos" desde la ventana oculta del carrito
  const handleProceedFromCartCard = () => {
    playBubblePopSound(0.4);
    setCheckoutItems(cartProducts);
    setViewMode('checkout');
  };

  // 6. Pedido confirmado con éxito desde el Checkout del chat
  const handleOrderSuccess = ({
    orderNumber,
    customerName,
    total,
  }: {
    orderNumber: string;
    customerName: string;
    total: number;
  }) => {
    playBubblePopSound(0.5);
    setViewMode('chat');
    setIsRegisterOpen(false);
    setCartProducts([]);

    setMessages((prev) => [
      ...prev,
      {
        id: `a_${Date.now()}`,
        role: 'assistant',
        content: `¡Muchísimas felicidades, ${customerName.split(' ')[0]}! 🎉🌸✨ Tu pedido ${orderNumber} ha sido confirmado con éxito por un total de ₡${total.toLocaleString('es-CR')}.\n\n📦 Hemos recibido tu solicitud y en by.fio lo estamos preparando con muchísimo amor. Si tienes cualquier consulta adicional, escríbeme por aquí cuando quieras 💕`,
        timestamp: Date.now(),
      },
    ]);
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    setCartProducts((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
    setCheckoutItems((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const handleRemoveCartProduct = (productId: string) => {
    setCartProducts((prev) => prev.filter((item) => item.product.id !== productId));
    setCheckoutItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleSendText = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isLoading) return;

    // A. Detectar intención de registro de usuario
    const isRegisterIntent = /(registrar|registro|crear cuenta|inscribirme|crear mi cuenta|quiero una cuenta|abrir cuenta)/i.test(text);
    if (isRegisterIntent) {
      playBubblePopSound(0.3);
      setMessages((prev) => [
        ...prev,
        {
          id: `u_${Date.now()}`,
          role: 'user',
          content: text,
          timestamp: Date.now(),
        },
        {
          id: `a_${Date.now() + 1}`,
          role: 'assistant',
          content: '¡Qué emoción! 🌸 Vamos a crear tu cuenta. Acabo de abrirte la tarjeta de registro a la par para que ingreses tus datos paso a paso ✨',
          timestamp: Date.now() + 1,
        },
      ]);
      setInputValue('');
      setRegisterCardMode('register');
      setIsRegisterOpen(true);
      return;
    }

    // B. Si la Estrellita estaba esperando la respuesta del siguiente producto
    if (isWaitingForSecondProduct) {
      const secondMatch = findMatchingProduct(text, products);
      if (secondMatch) {
        setInputValue('');
        handleSelectSecondProduct(secondMatch);
        return;
      }
    }

    // C. Detectar si el usuario pide pagar
    const isPayIntent = /(quiero pagar|pagar ahora|proceder al pago|hacer el pago|como pago|pagar|cobrar|listo para pagar|terminar y pagar)/i.test(text);
    if (isPayIntent && cartProducts.length > 0) {
      setInputValue('');
      setCheckoutItems(cartProducts);
      setViewMode('checkout');
      return;
    }

    // D. Detectar si el usuario ya no quiere comprar más
    const isStopShoppingIntent = /(ya no quiero|no quiero mas|no quiero nada mas|nada mas|eso es todo|es todo|eso seria todo|ya no|listo ya|no mas|ya seria todo|terminar|solo eso|no gracias)/i.test(text);
    if (isStopShoppingIntent && cartProducts.length > 0) {
      setInputValue('');
      const totalItems = cartProducts.reduce((sum, item) => sum + item.quantity, 0);
      const totalAmount = cartProducts.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

      playWaterDropSound();
      setMessages((prev) => [
        ...prev,
        {
          id: `u_${Date.now()}`,
          role: 'user',
          content: text,
          timestamp: Date.now(),
        },
        {
          id: `a_${Date.now() + 1}`,
          role: 'assistant',
          content: `¡Perfecto! 🌸 Tienes ${totalItems} producto(s) en tu carrito por un total de ₡${totalAmount.toLocaleString('es-CR')} ✨🛍️\n\n¿Procedemos al pago ahora mismo? Puedes decirme "Quiero pagar" o darle clic a "Pagar ahora" 💕`,
          timestamp: Date.now() + 1,
        },
      ]);
      return;
    }

    // E. Detectar si el usuario pide agregar o comprar otro producto
    const isBuyAnotherIntent = /(comprar otro|otro producto|agregar otro|quiero otro|comprar mas|algo mas|ver otro|otro mas|agregar)/i.test(text);
    if (isBuyAnotherIntent) {
      setInputValue('');
      const baseProduct = cartProducts[cartProducts.length - 1]?.product || products[0];
      if (baseProduct) {
        handleWantAnother(baseProduct);
        return;
      }
    }

    // E. Conversación normal con detección de productos
    playBubblePopSound(0.3);
    const matchedProduct = findMatchingProduct(text, products);

    const userMsg: ChatMessage = {
      id: `u_${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);
    setTypingStatus('thinking');

    const historyPayload = messages.slice(-25).map((m) => ({ role: m.role, content: m.content }));
    const result = await aiAgentService.sendMessage({
      message: text,
      role: userRole,
      history: historyPayload,
      userName,
      conversationId,
    });

    if (result.conversationId && result.conversationId !== conversationId) {
      setConversationId(result.conversationId);
    }

    await deliverAssistantChunks(result, matchedProduct);
  };

  const deliverAssistantChunks = async (
    result: {
      response: string;
      messages?: string[];
      chunks?: Array<{ index: number; text: string; typingMs: number }>;
      humanSimulation?: { initialDelayMs: number };
    },
    attachedProduct: Product | null = null
  ) => {
    const config = getCachedAiConfig();
    const chunks =
      result.chunks && result.chunks.length > 0
        ? result.chunks
        : result.messages && result.messages.length > 0
        ? result.messages.map((m, i) => ({ index: i, text: m, typingMs: 1200 }))
        : [{ index: 0, text: result.response, typingMs: 1200 }];

    if (config.enableHumanSimulation !== false) {
      setTypingStatus('thinking');
      const initialDelay = result.humanSimulation?.initialDelayMs || 2200;
      await new Promise((resolve) => setTimeout(resolve, Math.min(initialDelay, 3200)));

      for (let i = 0; i < chunks.length; i++) {
        setTypingStatus('typing');
        const chunk = chunks[i];
        const typingTime = Math.min(chunk.typingMs || 1400, 3200);
        await new Promise((resolve) => setTimeout(resolve, typingTime));

        const isLastChunk = i === chunks.length - 1;
        playWaterDropSound();
        setMessages((prev) => [
          ...prev,
          {
            id: `a_${Date.now()}_${i}`,
            role: 'assistant',
            content: chunk.text,
            timestamp: Date.now(),
            product: isLastChunk && attachedProduct ? attachedProduct : undefined,
            productAction: isLastChunk && attachedProduct ? 'pay_or_more' : undefined,
          },
        ]);
      }
    } else {
      playWaterDropSound();
      setMessages((prev) => [
        ...prev,
        {
          id: `a_${Date.now()}`,
          role: 'assistant',
          content: result.response,
          timestamp: Date.now(),
          product: attachedProduct || undefined,
          productAction: attachedProduct ? 'pay_or_more' : undefined,
        },
      ]);
    }
    setIsLoading(false);
    setTypingStatus(null);
  };

  const handleSendVoice = async () => {
    if (!isRecording) return;
    const audioBlob = await stopRecording();
    if (!audioBlob) return;

    playBubblePopSound(0.3);
    setIsLoading(true);
    setTypingStatus('thinking');

    const historyPayload = messages.slice(-25).map((m) => ({ role: m.role, content: m.content }));
    const result = await aiAgentService.sendVoiceNote({
      audioBlob,
      role: userRole,
      history: historyPayload,
      userName,
      conversationId,
    });

    if (result.conversationId && result.conversationId !== conversationId) {
      setConversationId(result.conversationId);
    }

    if (result.transcription) {
      const matched = findMatchingProduct(result.transcription, products);
      setMessages((prev) => [
        ...prev,
        {
          id: `u_${Date.now()}`,
          role: 'user',
          content: `🎤 "${result.transcription}"`,
          hasAudio: true,
          timestamp: Date.now(),
        },
      ]);
      await deliverAssistantChunks(result, matched);
    } else {
      await deliverAssistantChunks(result);
    }
  };

  const quickChips =
    cartProducts.length > 0
      ? ['💳 Quiero pagar', '🌸 Agregar otro producto', 'Listo, ya no quiero más']
      : userRole === 'staff' || userRole === 'admin'
      ? ['¿Cuánto stock queda de tazas?', '¿Qué talleres tienen cupos?', '¿Cuáles productos están agotados?']
      : ['🌸 Taza con Flores', '✨ Pack Stickers Kawaii', '📖 Agenda 2027', '¿Hacen envíos a todo Costa Rica?'];

  const waUrl = getWhatsAppLink('64004640', '¡Hola! Estaba conversando con la Estrellita y quisiera hacer una consulta.');

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[130] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/55 backdrop-blur-xs animate-in fade-in duration-200 overflow-x-hidden"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex flex-col sm:flex-row items-end justify-center max-w-full"
      >
        {/* Ventana de Chat de la Estrellita (z-20) */}
        <div
          className="relative z-20 w-full sm:w-[420px] h-[88vh] sm:h-[620px] max-h-[92vh] bg-white dark:bg-[#1a142a] rounded-t-3xl sm:rounded-3xl shadow-[16px_0_35px_-5px_rgba(0,0,0,0.5),0_25px_60px_-15px_rgba(0,0,0,0.45)] border-2 border-fio-200/90 dark:border-purple-500/40 flex flex-col overflow-hidden animate-in slide-in-from-bottom-6 duration-200 transition-all duration-[1600ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
        >
          {viewMode === 'checkout' ? (
            <div className="flex-1 flex flex-col h-full overflow-hidden">
              <div className="relative px-4 py-3 bg-gradient-to-r from-fio-100 via-pink-50 to-purple-100 dark:from-purple-950 dark:via-[#221838] dark:to-purple-900 border-b border-fio-200/80 dark:border-purple-800/40 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-fio-pink to-purple-600 text-white flex items-center justify-center shadow-xs">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bubble font-black text-sm text-fio-900 dark:text-purple-100 leading-tight">
                      Checkout con Estrellita
                    </h3>
                    <p className="text-[10px] text-fio-pink font-semibold">Pago fácil y seguro ✨</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-full hover:bg-white/60 dark:hover:bg-purple-800/40 transition-colors"
                  aria-label="Cerrar modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <StarAgentCheckoutView
                items={checkoutItems.length > 0 ? checkoutItems : cartProducts}
                onUpdateQuantity={handleUpdateCartQuantity}
                onRemoveItem={handleRemoveCartProduct}
                onOrderPlaced={handleOrderSuccess}
                onBack={() => setViewMode('chat')}
              />
            </div>
          ) : (
            <>
              {/* Header con Mascota Estrellita */}
              <div className="relative px-4 py-3 bg-gradient-to-r from-fio-100 via-pink-50 to-purple-100 dark:from-purple-950 dark:via-[#221838] dark:to-purple-900 border-b border-fio-200/80 dark:border-purple-800/40 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-white dark:border-purple-400 shadow-md bg-amber-100 flex-shrink-0">
                    <video
                      src="/assets/vid-estrellita.mp4"
                      preload="metadata"
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover scale-110 pointer-events-none"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-bubble font-black text-base text-fio-900 dark:text-purple-100 leading-tight">
                        Estrellita by.fio
                      </h3>
                      <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                    </div>
                    <p className="text-[11px] font-semibold text-fio-pink dark:text-pink-300">
                      {userRole === 'staff' || userRole === 'admin'
                        ? 'Asistente de Equipo & Inventario'
                        : 'Servicio & Consultas en Vivo'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-full hover:bg-white/60 dark:hover:bg-purple-800/40 transition-colors"
                  aria-label="Cerrar chat"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mensajes */}
              <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-3 bg-slate-50/60 dark:bg-[#130f20]/60">
                {messages.map((m) => (
                  <div key={m.id} className="space-y-1.5 animate-in fade-in duration-150">
                    <div
                      className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm font-medium leading-relaxed shadow-xs ${
                          m.role === 'user'
                            ? 'bg-gradient-to-r from-purple-700 to-fio-pink text-white rounded-br-xs'
                            : 'bg-white dark:bg-[#251d3d] text-slate-800 dark:text-purple-100 border border-fio-100 dark:border-purple-800/40 rounded-bl-xs'
                        }`}
                      >
                        {m.hasAudio ? (
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2 pb-1 border-b border-white/20">
                              <div className="w-6 h-6 rounded-full bg-white/25 flex items-center justify-center flex-shrink-0">
                                <Mic className="w-3.5 h-3.5 text-white" />
                              </div>
                              <div className="flex items-center gap-0.5 flex-1">
                                {[35, 65, 30, 85, 55, 95, 45, 75, 40, 60, 80, 25, 90, 50, 70, 40].map((h, idx) => (
                                  <div
                                    key={idx}
                                    style={{ height: `${h}%` }}
                                    className="w-0.5 max-h-3.5 rounded-full bg-white/80"
                                  />
                                ))}
                              </div>
                              <span className="text-[10px] font-mono opacity-85">Nota de voz</span>
                            </div>
                            <p className="whitespace-pre-wrap text-white/95">{m.content.replace(/^🎤\s*"?/, '"')}</p>
                          </div>
                        ) : (
                          <p className="whitespace-pre-wrap">{m.content}</p>
                        )}
                      </div>
                    </div>

                    {/* Tarjeta de Producto interactiva si el mensaje la contiene */}
                    {m.product && (
                      <div className="w-full sm:max-w-[88%]">
                        <StarAgentProductCard
                          product={m.product}
                          actionType={m.productAction || 'pay_or_more'}
                          onPay={handlePayProduct}
                          onWantAnother={handleWantAnother}
                          onAddSecond={handleAddSecondProduct}
                          isAdded={addedSecondProductIds.has(m.product.id)}
                        />
                      </div>
                    )}

                    {/* Sugerencias de productos si el mensaje las contiene */}
                    {m.suggestedProducts && m.suggestedProducts.length > 0 && (
                      <div className="pt-1 flex flex-wrap gap-1.5 w-full sm:max-w-[88%] animate-in fade-in">
                        {m.suggestedProducts.map((p) => (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => handleSelectSecondProduct(p)}
                            className="text-[11px] font-bold px-2.5 py-1 rounded-xl bg-white dark:bg-purple-900/60 border border-fio-200 dark:border-purple-700 text-fio-900 dark:text-purple-100 shadow-xs hover:border-fio-pink hover:bg-pink-50 dark:hover:bg-purple-800 transition-all flex items-center gap-1 active:scale-95 cursor-pointer"
                          >
                            <span>🌸</span>
                            <span className="truncate max-w-[130px]">{p.name}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white dark:bg-[#251d3d] border border-fio-100 dark:border-purple-800/40 rounded-2xl rounded-bl-xs px-4 py-2.5 shadow-xs flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-fio-pink animate-bounce" />
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce [animation-delay:0.15s]" />
                      <span className="w-2 h-2 rounded-full bg-purple-500 animate-bounce [animation-delay:0.3s]" />
                      <span className="text-[11px] text-fio-pink dark:text-purple-300 font-semibold ml-1">
                        {typingStatus === 'typing' ? 'Estrellita está escribiendo...' : 'Consultando...'}
                      </span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Sugerencias Rápidas */}
              <div className="px-3 pt-2 pb-1.5 flex gap-1.5 overflow-x-auto no-scrollbar border-t border-fio-100/60 dark:border-purple-900/30 bg-white/70 dark:bg-[#1a142a]/70">
                {quickChips.map((chip, i) => (
                  <button
                    key={i}
                    type="button"
                    disabled={isLoading || isRecording}
                    onClick={() => handleSendText(chip)}
                    className="text-[11px] font-semibold whitespace-nowrap px-2.5 py-1 rounded-full bg-fio-50 hover:bg-fio-100 dark:bg-purple-950/70 dark:hover:bg-purple-900 text-fio-800 dark:text-purple-200 border border-fio-200/60 dark:border-purple-800/40 transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {chip}
                  </button>
                ))}
              </div>

              {/* Barra de Entrada (Texto y Audio) */}
              <div className="p-3 bg-white dark:bg-[#1a142a] border-t border-fio-100 dark:border-purple-900/40">
                {isRecording ? (
                  <StarAgentAudioBar
                    formattedTime={formattedTime}
                    isPaused={isPaused}
                    audioLevel={audioLevel}
                    onPause={pauseRecording}
                    onResume={resumeRecording}
                    onCancel={cancelRecording}
                    onSend={handleSendVoice}
                  />
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendText();
                    }}
                    className="flex items-center gap-2"
                  >
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder={userRole === 'staff' ? 'Consultar stock, cupo o producto...' : 'Pregúntale a la Estrellita...'}
                      disabled={isLoading}
                      className="flex-1 px-3.5 py-2.5 rounded-2xl bg-slate-100 dark:bg-[#251d3d] border border-slate-200 dark:border-purple-800/40 text-xs sm:text-sm text-slate-800 dark:text-purple-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-fio-pink/50"
                    />

                    <button
                      type="button"
                      onClick={() => startRecording()}
                      disabled={isLoading}
                      title="Grabar nota de voz"
                      aria-label="Grabar audio"
                      className="w-10 h-10 rounded-full flex items-center justify-center bg-fio-100 hover:bg-fio-200 dark:bg-purple-900/60 dark:hover:bg-purple-800 text-fio-800 dark:text-purple-200 transition-all active:scale-95 cursor-pointer disabled:opacity-50 flex-shrink-0 shadow-xs"
                    >
                      <Mic className="w-4 h-4" />
                    </button>

                    <button
                      type="submit"
                      disabled={!inputValue.trim() || isLoading}
                      aria-label="Enviar mensaje"
                      className="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-r from-purple-700 to-fio-pink hover:opacity-95 text-white shadow-clayBtn transition-all active:scale-95 cursor-pointer disabled:opacity-50 flex-shrink-0"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                )}

                {userRole === 'customer' && (
                  <div className="mt-2 text-center">
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                    >
                      <MessageCircle className="w-3 h-3" />
                      <span>¿Prefieres hablar por WhatsApp? Clic aquí</span>
                    </a>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Tarjeta Oculta Lateral (Registro o Carrito según modo) */}
        <StarAgentRegisterCard
          isOpen={isRegisterOpen}
          onClose={() => setIsRegisterOpen(false)}
          onSuccess={handleRegisterSuccess}
          mode={registerCardMode}
          onSwitchMode={setRegisterCardMode}
          cartProducts={cartProducts}
          onUpdateCartQuantity={handleUpdateCartQuantity}
          onRemoveCartProduct={handleRemoveCartProduct}
          onProceedToCheckout={handleProceedFromCartCard}
        />
      </div>
    </div>
  );
};
