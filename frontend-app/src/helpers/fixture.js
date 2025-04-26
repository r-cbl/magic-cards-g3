export const mockedPublications = [
    {
      id: "pub-001",
      name: "Pikachu's Thunderbolt",
      cardId: "card-001",
      valueMoney: 100,
      cardExchangeIds: ["card-101", "card-102"],
      cardBase: {
        Id: "base-001",
        Name: "Pikachu"
      },
      game: {
        Id: "game-001",
        Name: "Pokémon TCG"
      },
      owner: {
        ownerId: "user-001",
        ownerName: "Ash"
      },
      offers: [
        {
          offerId: "offer-001",
          moneyOffer: 120,
          statusOffer: "pending",
          cardExchangeIds: ["card-110"]
        },
        {
          offerId: "offer-002",
          statusOffer: "rejected",
          cardExchangeIds: []
        }
      ],
      createdAt: new Date("2025-04-01T10:00:00Z"),
      cardImageUrl: "https://images.pokemontcg.io/base1/58.png"
    },
    {
      id: "pub-002",
      name: "Charizard's Blaze",
      cardId: "card-002",
      valueMoney: 250,
      cardExchangeIds: [],
      cardBase: {
        Id: "base-002",
        Name: "Charizard"
      },
      game: {
        Id: "game-002",
        Name: "Pokémon TCG"
      },
      owner: {
        ownerId: "user-002",
        ownerName: "Brock"
      },
      offers: [],
      createdAt: new Date("2025-04-10T14:30:00Z"),
      cardImageUrl: "https://images.pokemontcg.io/base1/4.png"
    },
    {
      id: "pub-003",
      name: "Bulbasaur's Vine",
      cardId: "card-003",
      valueMoney: 180,
      cardExchangeIds: ["card-120"],
      cardBase: {
        Id: "base-003",
        Name: "Bulbasaur"
      },
      game: {
        Id: "game-003",
        Name: "Pokémon TCG"
      },
      owner: {
        ownerId: "user-003",
        ownerName: "Misty"
      },
      offers: [
        {
          offerId: "offer-003",
          statusOffer: "accepted",
          cardExchangeIds: ["card-130", "card-131"]
        }
      ],
      createdAt: new Date("2025-03-25T08:45:00Z"),
      cardImageUrl: "https://images.pokemontcg.io/base1/44.png"
    }
  ];
  