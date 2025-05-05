"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, Plus } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import {
  fetchCardsStart,
  fetchCardsSuccess,
  fetchCardsFailure,
} from "@/lib/cardsSlice"
import { fetchGames } from "@/lib/gameSlice"

export default function MyCardsPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { cards, isLoading } = useAppSelector((state) => state.cards)
  const { currentUser } = useAppSelector((state) => state.user)
  const { games } = useAppSelector((state) => state.game)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedGame, setSelectedGame] = useState<string>("")

  useEffect(() => {
    if (!currentUser) {
      router.push("/login")
      return
    }

    dispatch(fetchCardsStart())
    dispatch(fetchGames()) // 👈 Carga los juegos desde el slice

    // Esto parece redundante, podrías eliminar el setTimeout si no tiene sentido real.
    setTimeout(() => {
      try {
        dispatch(fetchCardsStart()) // ¿doble llamada a fetchCardsStart?
      } catch (error) {
        dispatch(fetchCardsFailure("Failed to load your cards"))
      }
    }, 500)
  }, [dispatch, currentUser, router])

  const filteredCards = cards.filter((card) => {
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold">My Cards</h1>
        <Button
          onClick={() => router.push("/cards/create")}
          className="bg-yellow-500 hover:bg-yellow-600 text-black"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Card
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search my cards..."
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
          <p>Loading your cards...</p>
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
                </CardContent>
                <CardFooter className="p-4 pt-2 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => router.push(`/cards/${card.id}`)}
                  >
                    View Details
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black"
                    onClick={() => router.push(`/publications/create?cardId=${card.id}`)}
                  >
                    Publish
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {filteredCards.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">You don't have any cards yet.</p>
              <Button
                onClick={() => router.push("/cards/create")}
                className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-black"
              >
                Add Your First Card
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
