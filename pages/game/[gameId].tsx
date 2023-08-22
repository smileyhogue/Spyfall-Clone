import { useRouter } from 'next/router';
import Layout from '../../app/layout';
import GameSession from '../../app/components/GameSession';
import { useGame } from '../../contexts/GameContext';

export default function Game() {
  const { gameSession } = useGame();
  const router = useRouter();
  const { gameId } = router.query; // Use `query` to get the gameId

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
        {/* Use optional chaining and nullish coalescing */}
        <h1 className="text-4xl mb-8">Game ID: {gameSession?.host?.id ?? 'Loading...'}</h1>
        // print game session data
        {gameSession && <GameSession session={gameSession} />}
      </div>
    </Layout>
  );
}
