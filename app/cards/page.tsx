'use client';

import { useState, useCallback, useEffect } from 'react';

// Card types and their quantities
const CARD_TYPES = {
  'Synergy': 15,
  'Get Out': 25,
  '2x Move Multiplier': 15,
  '3x Move Multiplier': 10,
  'Snipe a Player': 5,
  'Break a Stack': 10,
} as const;

type CardType = keyof typeof CARD_TYPES;

interface Card {
  type: CardType;
  id: string;
  sessionId: string;
}

interface Player {
  id: string;
  name: string;
  stack: Card[];
}

interface SharedSession {
  id: string;
  roomCode: string;
  deck: Card[];
  players: Record<string, Player>;
  lastUpdated: number;
}

// Generate a unique session ID
const generateSessionId = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

// Generate a shareable room code
const generateRoomCode = (): string => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

// Create initial deck
const createDeck = (sessionId: string): Card[] => {
  const deck: Card[] = [];
  Object.entries(CARD_TYPES).forEach(([type, count]) => {
    for (let i = 0; i < count; i++) {
      deck.push({
        type: type as CardType,
        id: `${type}-${i + 1}`,
        sessionId,
      });
    }
  });
  return shuffleDeck(deck);
};

// Storage helpers
const saveSharedSession = (session: SharedSession): void => {
  session.lastUpdated = Date.now();
  localStorage.setItem(`room_${session.roomCode}`, JSON.stringify(session));
};

const loadSharedSession = (roomCode: string): SharedSession | null => {
  try {
    const stored = localStorage.getItem(`room_${roomCode}`);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const savePlayerName = (playerId: string, name: string): void => {
  localStorage.setItem(`player_${playerId}`, name);
};

const loadPlayerName = (playerId: string): string => {
  return localStorage.getItem(`player_${playerId}`) || `Player_${playerId.slice(0, 4)}`;
};

// Fisher-Yates shuffle
const shuffleDeck = (deck: Card[]): Card[] => {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Card styling based on type
const getCardStyle = (type: CardType, size: 'large' | 'small' = 'large'): string => {
  const baseStyle = size === 'large' 
    ? "p-6 rounded-lg border-2 text-center font-bold text-white shadow-lg min-h-[200px] flex items-center justify-center"
    : "p-3 rounded-lg border-2 text-center font-bold text-white shadow-lg min-h-[120px] flex items-center justify-center text-sm";
  
  switch (type) {
    case 'Synergy':
      return `${baseStyle} bg-purple-600 border-purple-400`;
    case 'Get Out':
      return `${baseStyle} bg-red-600 border-red-400`;
    case '2x Move Multiplier':
      return `${baseStyle} bg-blue-600 border-blue-400`;
    case '3x Move Multiplier':
      return `${baseStyle} bg-indigo-600 border-indigo-400`;
    case 'Snipe a Player':
      return `${baseStyle} bg-orange-600 border-orange-400`;
    case 'Break a Stack':
      return `${baseStyle} bg-green-600 border-green-400`;
    default:
      return `${baseStyle} bg-gray-600 border-gray-400`;
  }
};

export default function CardsPage() {
  const [sharedSession, setSharedSession] = useState<SharedSession | null>(null);
  const [playerId] = useState<string>(() => generateSessionId());
  const [playerName, setPlayerName] = useState<string>('');
  const [roomCode, setRoomCode] = useState<string>('');
  const [joinRoomCode, setJoinRoomCode] = useState<string>('');
  const [drawnCard, setDrawnCard] = useState<Card | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showStack, setShowStack] = useState(false);
  const [hiddenCards, setHiddenCards] = useState<Set<string>>(new Set());
  const [isInRoom, setIsInRoom] = useState(false);

  // Initialize player name and fix scrolling
  useEffect(() => {
    const savedName = loadPlayerName(playerId);
    setPlayerName(savedName);
    
    // Override global CSS to allow scrolling
    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalBodyOverflow = document.body.style.overflow;
    const originalBodyHeight = document.body.style.height;
    
    document.documentElement.style.overflow = 'auto';
    document.body.style.overflow = 'auto';
    document.body.style.height = 'auto';
    
    return () => {
      // Restore original styles when component unmounts
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.body.style.overflow = originalBodyOverflow;
      document.body.style.height = originalBodyHeight;
    };
  }, [playerId]);

  const createRoom = () => {
    const newRoomCode = generateRoomCode();
    const sessionId = generateSessionId();
    const newSession: SharedSession = {
      id: sessionId,
      roomCode: newRoomCode,
      deck: createDeck(sessionId),
      players: {
        [playerId]: {
          id: playerId,
          name: playerName,
          stack: [],
        },
      },
      lastUpdated: Date.now(),
    };
    
    setSharedSession(newSession);
    setRoomCode(newRoomCode);
    setIsInRoom(true);
    saveSharedSession(newSession);
    savePlayerName(playerId, playerName);
  };

  const joinRoom = () => {
    const existingSession = loadSharedSession(joinRoomCode.toUpperCase());
    if (!existingSession) {
      alert('Room not found! Make sure the room code is correct.');
      return;
    }

    // Add current player to the session
    const updatedSession: SharedSession = {
      ...existingSession,
      players: {
        ...existingSession.players,
        [playerId]: {
          id: playerId,
          name: playerName,
          stack: [],
        },
      },
    };

    setSharedSession(updatedSession);
    setRoomCode(joinRoomCode.toUpperCase());
    setIsInRoom(true);
    saveSharedSession(updatedSession);
    savePlayerName(playerId, playerName);
  };

  const refreshSession = () => {
    if (!roomCode) return;
    const latestSession = loadSharedSession(roomCode);
    if (latestSession) {
      setSharedSession(latestSession);
    }
  };

  const drawCard = useCallback(() => {
    if (!sharedSession) return;

    let newDeck = sharedSession.deck;
    let cardToDraw: Card;

    if (newDeck.length === 0) {
      // Reset deck if empty
      newDeck = createDeck(sharedSession.id);
      cardToDraw = newDeck[0];
      newDeck = newDeck.slice(1);
    } else {
      // Draw from current deck
      cardToDraw = newDeck[0];
      newDeck = newDeck.slice(1);
    }

    // Add card to current player's stack
    const currentPlayer = sharedSession.players[playerId];
    const newStack = [...(currentPlayer?.stack || []), cardToDraw];
    
    const updatedSession: SharedSession = {
      ...sharedSession,
      deck: newDeck,
      players: {
        ...sharedSession.players,
        [playerId]: {
          ...currentPlayer,
          stack: newStack,
        },
      },
    };
    
    setSharedSession(updatedSession);
    saveSharedSession(updatedSession);
    setDrawnCard(cardToDraw);
    setIsDrawing(true);
    setTimeout(() => setIsDrawing(false), 500);
  }, [sharedSession, playerId]);

  const playCard = (cardToPlay: Card) => {
    if (!sharedSession) return;

    const player = sharedSession.players[playerId];
    if (!player) return;

    // Remove card from player's stack
    const newStack = player.stack.filter(card => card.id !== cardToPlay.id);
    
    // Add card back to deck and shuffle
    const newDeck = shuffleDeck([...sharedSession.deck, cardToPlay]);
    
    const updatedSession: SharedSession = {
      ...sharedSession,
      deck: newDeck,
      players: {
        ...sharedSession.players,
        [playerId]: {
          ...player,
          stack: newStack,
        },
      },
    };
    
    setSharedSession(updatedSession);
    saveSharedSession(updatedSession);

    // Remove from hidden cards if it was hidden
    setHiddenCards(prev => {
      const newSet = new Set(prev);
      newSet.delete(cardToPlay.id);
      return newSet;
    });
  };

  const toggleCardVisibility = (cardId: string) => {
    setHiddenCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(cardId)) {
        newSet.delete(cardId);
      } else {
        newSet.add(cardId);
      }
      return newSet;
    });
  };

  const toggleAllCardsVisibility = () => {
    if (!sharedSession) return;
    
    const player = sharedSession.players[playerId];
    if (!player) return;
    
    if (hiddenCards.size === player.stack.length) {
      // Show all cards
      setHiddenCards(new Set());
    } else {
      // Hide all cards
      setHiddenCards(new Set(player.stack.map(card => card.id)));
    }
  };

  const resetSession = () => {
    if (!sharedSession) return;
    
    const sessionId = generateSessionId();
    const resetSession: SharedSession = {
      ...sharedSession,
      id: sessionId,
      deck: createDeck(sessionId),
      players: Object.fromEntries(
        Object.entries(sharedSession.players).map(([id, player]) => [
          id,
          { ...player, stack: [] }
        ])
      ),
    };
    
    setSharedSession(resetSession);
    saveSharedSession(resetSession);
    setDrawnCard(null);
    setHiddenCards(new Set());
  };

  const leaveRoom = () => {
    setSharedSession(null);
    setRoomCode('');
    setJoinRoomCode('');
    setIsInRoom(false);
    setShowStack(false);
    setHiddenCards(new Set());
  };

  // Show room selection if not in a room
  if (!isInRoom || !sharedSession) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8">Card Drawer - Multiplayer</h1>
          
          <div className="bg-gray-800 p-6 rounded-lg mb-6">
            <h2 className="text-2xl font-bold mb-4">Player Setup</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Your Name:</label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                placeholder="Enter your name"
                maxLength={20}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4">Create New Room</h3>
              <p className="text-gray-300 mb-4">Start a new game session that others can join.</p>
              <button
                onClick={createRoom}
                disabled={!playerName.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Create Room
              </button>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4">Join Existing Room</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Room Code:</label>
                <input
                  type="text"
                  value={joinRoomCode}
                  onChange={(e) => setJoinRoomCode(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  placeholder="Enter room code"
                  maxLength={6}
                />
              </div>
              <button
                onClick={joinRoom}
                disabled={!playerName.trim() || !joinRoomCode.trim()}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Join Room
              </button>
            </div>
          </div>

          <div className="mt-8 bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4">How Multiplayer Works:</h3>
            <ul className="space-y-2 text-gray-300">
              <li>• One player creates a room and shares the room code</li>
              <li>• Other players join using the room code</li>
              <li>• Everyone draws from the same shared deck</li>
              <li>• Each player has their own card stack</li>
              <li>• Click &quot;Refresh&quot; to see other players&apos; actions</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  const playerList = Object.values(sharedSession.players);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl sm:text-4xl font-bold">Card Drawer</h1>
          <div className="text-center sm:text-right">
            <div className="text-lg font-bold">Room: {roomCode}</div>
            <div className="text-sm text-gray-400">
              Last updated: {new Date(sharedSession.lastUpdated).toLocaleTimeString()}
            </div>
          </div>
        </div>
        
        {/* Session Info */}
        <div className="text-center mb-8">
          <p className="text-lg sm:text-xl mb-2">Cards remaining in deck: {sharedSession.deck.length}/100</p>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4 text-sm">
            {playerList.map(player => (
              <span key={player.id} className={player.id === playerId ? 'text-blue-400 font-bold' : 'text-gray-400'}>
                {player.name}: {player.stack.length} cards
              </span>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-8">
          <button
            onClick={drawCard}
            disabled={isDrawing}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-2 sm:py-3 px-4 sm:px-8 rounded-lg text-lg sm:text-xl transition-colors"
          >
            {isDrawing ? 'Drawing...' : 'Draw Card'}
          </button>
          
          <button
            onClick={() => setShowStack(!showStack)}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 sm:py-3 px-4 sm:px-8 rounded-lg text-lg sm:text-xl transition-colors"
          >
            {showStack ? 'Hide Stack' : 'Show Stack'}
          </button>
          
          <button
            onClick={refreshSession}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 sm:py-3 px-4 sm:px-8 rounded-lg text-lg sm:text-xl transition-colors"
          >
            🔄 Refresh
          </button>
          
          <button
            onClick={resetSession}
            className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 sm:py-3 px-4 sm:px-8 rounded-lg text-lg sm:text-xl transition-colors"
          >
            Reset Deck
          </button>
          
          <button
            onClick={leaveRoom}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 sm:py-3 px-4 sm:px-8 rounded-lg text-lg sm:text-xl transition-colors"
          >
            Leave Room
          </button>
        </div>

        {/* Drawn Card */}
        {drawnCard && !showStack && (
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-4">You drew:</h2>
            <div className={`max-w-sm mx-auto transform transition-transform duration-500 ${
              isDrawing ? 'scale-110 rotate-1' : 'scale-100'
            }`}>
              <div className={getCardStyle(drawnCard.type)}>
                <div>
                  <div className="text-2xl font-bold mb-2">{drawnCard.type}</div>
                  <div className="text-sm opacity-75">{drawnCard.id}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Your Stack */}
        {showStack && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Your Stack ({sharedSession.players[playerId]?.stack.length || 0} cards)</h2>
              <button
                onClick={toggleAllCardsVisibility}
                className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition-colors"
              >
                {hiddenCards.size === (sharedSession.players[playerId]?.stack.length || 0) ? 'Show All' : 'Hide All'}
              </button>
            </div>
            
            {!sharedSession.players[playerId] || sharedSession.players[playerId].stack.length === 0 ? (
              <p className="text-center text-gray-400 text-lg">You have no cards yet. Draw some cards!</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {sharedSession.players[playerId].stack.map((card) => (
                  <div key={card.id} className="relative">
                    {hiddenCards.has(card.id) ? (
                      <div className="bg-gray-700 border-2 border-gray-500 rounded-lg p-3 min-h-[120px] flex items-center justify-center text-center">
                        <div className="text-gray-400">Hidden Card</div>
                      </div>
                    ) : (
                      <div className={getCardStyle(card.type, 'small')}>
                        <div>
                          <div className="font-bold mb-1">{card.type}</div>
                          <div className="text-xs opacity-75">{card.id}</div>
                        </div>
                      </div>
                    )}
                    
                    <div className="absolute top-2 right-2 flex gap-1">
                      <button
                        onClick={() => toggleCardVisibility(card.id)}
                        className="bg-black bg-opacity-50 hover:bg-opacity-70 text-white text-xs px-2 py-1 rounded transition-colors"
                        title={hiddenCards.has(card.id) ? 'Show' : 'Hide'}
                      >
                        {hiddenCards.has(card.id) ? '👁️' : '🙈'}
                      </button>
                      <button
                        onClick={() => playCard(card)}
                        className="bg-red-600 hover:bg-red-700 text-white text-xs px-2 py-1 rounded transition-colors"
                        title="Play card (return to deck)"
                      >
                        ▶️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Instructions */}
        <div className="mt-12 bg-gray-800 p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-4">Multiplayer Instructions:</h3>
          <ul className="space-y-2 text-gray-300">
            <li>• <strong>Drawing:</strong> Click &quot;Draw Card&quot; to add a card to your personal stack</li>
            <li>• <strong>Viewing:</strong> Use &quot;Show Stack&quot; to view your own cards</li>
            <li>• <strong>Playing:</strong> Click ▶️ on any card to play it (returns to shared deck)</li>
            <li>• <strong>Hiding:</strong> Use 🙈/👁️ to hide/show cards from other players</li>
            <li>• <strong>Syncing:</strong> Click 🔄 Refresh to see other players&apos; latest actions</li>
            <li>• <strong>Sharing:</strong> Share room code <strong>{roomCode}</strong> with other players</li>
          </ul>
          
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <div>
              <h4 className="text-lg font-bold mb-2">Card Types:</h4>
              <ul className="space-y-1 text-sm">
                <li><span className="font-semibold text-purple-400">Synergy</span> • <span className="font-semibold text-red-400">Get Out</span></li>
                <li><span className="font-semibold text-blue-400">2x Move Multiplier</span> • <span className="font-semibold text-indigo-400">3x Move Multiplier</span></li>
                <li><span className="font-semibold text-orange-400">Snipe a Player</span> • <span className="font-semibold text-green-400">Break a Stack</span></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-2">Room Code:</h4>
              <div className="bg-gray-700 p-3 rounded-lg text-center">
                <div className="text-2xl font-mono font-bold text-blue-400">{roomCode}</div>
                <div className="text-xs text-gray-400 mt-1">Share this with other players</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}