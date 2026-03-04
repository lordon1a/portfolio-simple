import { NextResponse } from "next/server";

export const revalidate = 60; // Revalidate every minute

export async function GET() {
  try {
    const response = await fetch(
      `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=yeterli&api_key=${process.env.LASTFM_API_KEY}&format=json&limit=5`
    );

    if (!response.ok) {
      throw new Error(`Last.fm API responded with status: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching Last.fm data:", error);
    return NextResponse.json(
      { error: "Failed to fetch Last.fm data" },
      { status: 500 }
    );
  }
}
