interface GameHistoryProps {
  gameHistory: string[];
}

export const GameHistory = ({ gameHistory }: GameHistoryProps) => {
  return (
    <div className="flex gap-1 overflow-x-auto p-2 bg-black/10 rounded-lg">
      {gameHistory.map((result, i) => (
        <div
          key={i}
          className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm shrink-0
            ${result === 'green' ? 'bg-green-600' : 
              result === 'red' ? 'bg-red-600' : 'bg-black'}`}
        >
          {result === 'green' ? '14x' : '2x'}
        </div>
      ))}
    </div>
  );
};