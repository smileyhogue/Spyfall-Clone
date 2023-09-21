import GameSetup from "./ui/gameSetup";
export default function Home() {

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-darkblue-900 text-lightblue-100">
      <div className="max-w-5xl w-full items-center justify-center font-mono text-xl text-center mb-12">
        <h1 className="text-5xl font-bold mb-8">Spyfall Clone</h1>
        <p className="text-2xl">
          Dive into the world of secrets, spies, and intrigue!
        </p>
      </div>
      <GameSetup />
    </main>
  );
}