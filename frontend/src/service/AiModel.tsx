import React, { useState } from "react";
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

interface UserInput {
  location: string;
  duration: string;
  budget: string;
  travelerType: string;
  interests: string;
}

interface Response {
  error?: string;
  [key: string]: any;
}

const AiModel: React.FC = () => {
  // States for input and output
  const [userInput, setUserInput] = useState<UserInput>({
    location: "",
    duration: "",
    budget: "",
    travelerType: "",
    interests: "",
  });
  const [response, setResponse] = useState<Response | null>(null);
  const [loading, setLoading] = useState(false);

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);

  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-exp",
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setResponse(null);

    try {
      const chatSession = model.startChat({
        generationConfig: {
          temperature: 1,
          topP: 0.95,
          topK: 40,
          maxOutputTokens: 8192,
          responseMimeType: "application/json",
        },
        history: [
          {
            role: "user",
            parts: [
              {
                text: `Act as a travel itinerary planner for a smart travel assistant app. The user is planning a trip and provides the following preferences:
                Location: ${userInput.location}
                Duration: ${userInput.duration}
                Budget: ${userInput.budget}
                Type of traveler: ${userInput.travelerType}
                Interests and preferred activities: ${userInput.interests}
                Based on these inputs, generate a detailed JSON format response that includes:

                Hotel Options:
                HotelName
                HotelAddress
                Price per night
                HotelImageURL (actual URLs from online repositories or booking sites)
                GeoCoordinates (latitude, longitude)
                Rating (out of 5)
                Description of the hotel and key amenities

                Itinerary Plan:
                Day-by-day plan for the specified duration (e.g., 3 days)
                Plan the day with suggested timing and duration
                Best time to visit each location

                For each place:

                PlaceName
                Place URL (Official URL of the attraction or tourism board)
                Rating (out of 5) from google places
                PlaceDetails (description of the attraction)
                PlaceImageURL (actual URLs from tourism boards or verified sources)
                GeoCoordinates (latitude, longitude)
                TicketPricing (if applicable)
                TicketURL(if applicable)
                Estimated travel time to reach the next location (both public and private transport options)
                Atleast 3 recommended food options nearby and its details including the following:
                    Meal Recommendations:
                    Nearby dining options, with:
                    Name of restaurant
                    Cuisine type
                    Price range
                    Specialty dishes
                    Address
                    ImageURL (actual images of the restaurant or food)
                    EstablishmentURL (Google Maps or official websites)`,
              },
            ],
          },
        ],
      });

      const result = await chatSession.sendMessage(
        "Generate a travel itinerary based on the provided preferences.",
      );
      console.log(result.response.text());
      setResponse(result);
    } catch (error) {
      setResponse({ error: (error as Error).message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {/* Form fields for user input */}
        <input
          type="text"
          value={userInput.location}
          onChange={(e) =>
            setUserInput({ ...userInput, location: e.target.value })
          }
          placeholder="Location"
        />
        <input
          type="text"
          value={userInput.duration}
          onChange={(e) =>
            setUserInput({ ...userInput, duration: e.target.value })
          }
          placeholder="Duration"
        />
        <input
          type="text"
          value={userInput.budget}
          onChange={(e) =>
            setUserInput({ ...userInput, budget: e.target.value })
          }
          placeholder="Budget"
        />
        <input
          type="text"
          value={userInput.travelerType}
          onChange={(e) =>
            setUserInput({ ...userInput, travelerType: e.target.value })
          }
          placeholder="Traveler Type"
        />
        <input
          type="text"
          value={userInput.interests}
          onChange={(e) =>
            setUserInput({ ...userInput, interests: e.target.value })
          }
          placeholder="Interests"
        />
        <button
          type="submit"
          className="w-full rounded-md bg-blue-500 px-4 py-2 text-white"
        >
          {loading ? "Generating..." : "Generate Itinerary"}
        </button>
      </form>
      {response && (
        <div className="mt-4 rounded-md border bg-gray-50 p-4">
          <h3 className="text-lg font-semibold">Generated Itinerary</h3>
          <pre className="overflow-auto whitespace-pre-wrap rounded bg-gray-100 p-2 text-sm">
            {response.error
              ? response.error
              : JSON.stringify(response, null, 2)}
            <>{console.log(response)}</>
          </pre>
        </div>
      )}
    </div>
  );
};

export default AiModel;
