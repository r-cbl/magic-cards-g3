export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] px-4 text-center">
      <div className="mb-8">
        <img
          src="http://cdn.hobbyconsolas.com/sites/navi.axelspringer.es/public/media/image/2023/02/pokemon-mundo-megamisterioso-2958262.jpg?tf=3840x"
          alt="Pokemon Trading Cards Banner"
          className="rounded-lg shadow-lg max-w-full h-auto md:max-w-2xl lg:max-w-4xl"
        />
      </div>

      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl mb-4 bg-gradient-to-r from-yellow-400 via-red-500 to-blue-500 text-transparent bg-clip-text">
        Welcome to DeckTrade
      </h1>
      <p className="max-w-xl text-lg text-muted-foreground mb-8">
        The ultimate platform for card collectors. Discover rare cards, connect with fellow trainers, and trade your way to the top!
      </p>
    </div>
  )
}
