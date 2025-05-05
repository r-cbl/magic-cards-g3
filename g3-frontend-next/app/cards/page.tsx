"use client"

import { use, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { useState } from "react"
import { fetchCards } from "@/lib/cardsSlice"
import { fetchGames } from "@/lib/gameSlice"
import { fetchCardBases } from "@/lib/cardBaseSlice"


export default function CardsPage() {
  const dispatch = useAppDispatch(); 
  const router = useRouter()
  const {games} = useAppSelector((state) => state.game)
  const { cards, isLoading, pagination } = useAppSelector((state) => state.cards)
  const { currentUser } = useAppSelector((state) => state.user)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedGame, setSelectedGame] = useState<string>("")
  const [offset, setOffset] = useState(0);
  const limit  = 12; 

  useEffect(() => {
    if (!currentUser) {
      router.push("/login")
      return
    }
    dispatch(fetchGames());
    dispatch(fetchCardBases());
  }, [dispatch]);

  useEffect(() => {
    if (cards.length === 0) {
      dispatch(fetchCards({ data: {}, offset: 0, limit }, false));
      setOffset(limit); // Avanza el offset para la próxima carga
    }
  }, [dispatch, cards.length]);

  const filteredCards = cards.filter((card: any) => {
    let matchesSearch = true
    let matchesGame = true

    if (searchTerm) {
      matchesSearch = card.cardBase.Name.toLowerCase().includes(searchTerm.toLowerCase())
    }

    if (selectedGame && selectedGame !== "all") {
      matchesGame = card.game.Id === selectedGame
    }

    return matchesSearch && matchesGame
  })

  const handleLoadMore = () => {
    dispatch(fetchCards({ data: {}, offset, limit }, true));
    setOffset(offset + limit);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold">Cards</h1>
        {currentUser && (
          <Button onClick={() => router.push("/cards/create")} className="bg-yellow-500 hover:bg-yellow-600 text-black">
            <Plus className="mr-2 h-4 w-4" />
            Add Card
          </Button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search cards..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={selectedGame} onValueChange={setSelectedGame}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="All Games" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Games</SelectItem>
            {games.map((game) => (
              <SelectItem key={game.id} value={game.id}>
                {game.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p>Loading cards...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredCards.map((card) => (
              <Card key={card.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-[2/3] relative">
                  <img
                    src={card.urlImage || "/placeholder.svg"}
                    alt={card.cardBase.Name}
                    className="object-cover w-full h-full"
                  />
                </div>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-lg">{card.cardBase.Name}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0 pb-2">
                  <p className="text-sm text-muted-foreground">{card.game.Name}</p>
                  <p className="text-xs text-muted-foreground mt-1">Owner: {card.owner.ownerId}</p>
                </CardContent>
                <CardFooter className="p-4 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => router.push(`/cards/${card.id}`)}
                  >
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {filteredCards.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No cards found. Try adjusting your filters.</p>
            </div>
          )}
        </>
      )}
      {pagination?.hasMore && (
        <div className="flex justify-center mt-6">
          <Button onClick={handleLoadMore} disabled={isLoading}>
            {isLoading ? "Loading..." : "Cargar más"}
          </Button>
        </div>
      )}

    </div>
  )
}
