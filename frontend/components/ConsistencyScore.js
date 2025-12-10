'use client';

export default function ConsistencyScore({ consistency, streak, bestStreak }) {
  const getConsistencyColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getConsistencyBadge = (score) => {
    if (score >= 90) return '🏆 Excelente';
    if (score >= 80) return '🥇 Ótimo';
    if (score >= 70) return '🥈 Bom';
    if (score >= 60) return '🥉 Regular';
    return '📊 Melhorar';
  };

  const getStreakBadge = (currentStreak) => {
    if (currentStreak >= 30) return '🔥 Lendário';
    if (currentStreak >= 21) return '⭐ Incrível';
    if (currentStreak >= 14) return '💪 Forte';
    if (currentStreak >= 7) return '👍 Bom';
    if (currentStreak >= 3) return '🌱 Começando';
    return '🎯 Iniciando';
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
      <h3 className="text-xl font-bold mb-4">Pontuação de Consistência</h3>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Taxa de Consistência</span>
            <span className={`font-bold text-lg ${getConsistencyColor(consistency)}`}>
              {consistency.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all ${
                consistency >= 80 ? 'bg-green-500' :
                consistency >= 60 ? 'bg-yellow-500' :
                consistency >= 40 ? 'bg-orange-500' : 'bg-red-500'
              }`}
              style={{ width: `${Math.min(consistency, 100)}%` }}
            />
          </div>
          <p className="text-sm text-gray-500 mt-1">{getConsistencyBadge(consistency)}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div>
            <div className="text-sm text-gray-600 mb-1">Streak Atual</div>
            <div className="text-2xl font-bold text-primary">{streak}</div>
            <div className="text-xs text-gray-500 mt-1">{getStreakBadge(streak)}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-1">Melhor Streak</div>
            <div className="text-2xl font-bold text-secondary">{bestStreak}</div>
            <div className="text-xs text-gray-500 mt-1">Recorde pessoal</div>
          </div>
        </div>
      </div>
    </div>
  );
}

